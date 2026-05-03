#!/usr/bin/env node
/**
 * Downloads sprites for all Terraria items from terraria.wiki.gg.
 * Uses imagefile field from items-raw.json for exact wiki filenames.
 * Skips sprites already present in public/sprites/.
 *
 * API: https://terraria.wiki.gg/api.php (MediaWiki imageinfo)
 * Rate limit: 350ms between downloads + User-Agent header, 50 items per API batch
 * 429 handling: exponential backoff up to 60s
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ITEMS_JSON = join(ROOT, 'src', 'data', 'items.json');
const ITEMS_RAW = join(__dirname, 'cache', 'items-raw.json');
const SPRITES_DIR = join(ROOT, 'public', 'sprites');
const WIKI_API = 'https://terraria.wiki.gg/api.php';
const BATCH_SIZE = 50;
const DELAY_MS = 350;
const RETRY_DELAY_MS = 2000;
const USER_AGENT = 'TerracraftSpriteDownloader/1.0 (personal project; https://github.com/lyo/terracraft)';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function toId(name) {
  return name.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

async function fetchWithRetry(url, options = {}) {
  try {
    return await fetch(url, options);
  } catch (err) {
    console.warn(`  [retry] ${err.message}`);
    await sleep(RETRY_DELAY_MS);
    return fetch(url, options);
  }
}

async function fetchWithRateLimit(url) {
  const options = { headers: { 'User-Agent': USER_AGENT } };
  let backoff = 5000;
  for (let attempt = 0; attempt < 8; attempt++) {
    let res;
    try {
      res = await fetch(url, options);
    } catch (err) {
      console.warn(`  [net-err] ${err.message}, waiting ${backoff}ms`);
      await sleep(backoff);
      backoff = Math.min(backoff * 2, 60000);
      continue;
    }
    if (res.status === 429) {
      const retryAfter = parseInt(res.headers.get('retry-after') || '0', 10) * 1000 || backoff;
      const wait = Math.max(retryAfter, backoff);
      console.warn(`  [429] rate limited, waiting ${wait}ms`);
      await sleep(wait);
      backoff = Math.min(backoff * 2, 60000);
      continue;
    }
    return res;
  }
  throw new Error(`Too many retries for ${url}`);
}

async function resolveImageUrls(filenames) {
  // filenames = array of plain filenames like "Iron Ore.png"
  const titles = filenames.map(f => `File:${f}`).join('|');
  const params = new URLSearchParams({
    action: 'query', titles, prop: 'imageinfo',
    iiprop: 'url', format: 'json'
  });
  const res = await fetchWithRetry(`${WIKI_API}?${params}`, {
    headers: { 'User-Agent': USER_AGENT }
  });
  const data = await res.json();
  const pages = data?.query?.pages ?? {};
  const result = new Map(); // filename → CDN url
  for (const page of Object.values(pages)) {
    if ('missing' in page) continue;
    const filename = page.title.replace(/^File:/, '');
    const url = page.imageinfo?.[0]?.url;
    if (url) result.set(filename, url);
  }
  return result;
}

async function main() {
  await mkdir(SPRITES_DIR, { recursive: true });

  const rawItems = JSON.parse(await readFile(ITEMS_RAW, 'utf8'));
  const items = JSON.parse(await readFile(ITEMS_JSON, 'utf8'));

  // Build map: normalizedId → imagefile
  const imagefileMap = new Map();
  for (const raw of rawItems) {
    if (!raw.itemid || !raw.imagefile || !raw.name) continue;
    imagefileMap.set(toId(raw.name), raw.imagefile);
  }

  // Determine which items need downloading
  const toDownload = items.filter(item => {
    const destPath = join(SPRITES_DIR, `${item.id}.png`);
    return !existsSync(destPath) && imagefileMap.has(item.id);
  });

  console.log(`Items total: ${items.length}`);
  console.log(`Already have sprites: ${items.length - toDownload.length}`);
  console.log(`To download: ${toDownload.length}`);
  console.log(`Estimated time: ~${Math.ceil(toDownload.length * DELAY_MS / 1000 / 60)} minutes`);

  // Process in batches of BATCH_SIZE
  const downloaded = [];
  const failed = [];
  const batches = [];
  for (let i = 0; i < toDownload.length; i += BATCH_SIZE) {
    batches.push(toDownload.slice(i, i + BATCH_SIZE));
  }

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi];
    const filenames = batch.map(item => imagefileMap.get(item.id)).filter(Boolean);

    let resolved;
    try {
      resolved = await resolveImageUrls(filenames);
    } catch (err) {
      console.error(`  Batch ${bi + 1}/${batches.length}: API error — ${err.message}`);
      resolved = new Map();
    }

    for (const item of batch) {
      const imagefile = imagefileMap.get(item.id);
      const cdnUrl = resolved.get(imagefile);
      if (!cdnUrl) {
        failed.push(item.id);
        continue;
      }
      const destPath = join(SPRITES_DIR, `${item.id}.png`);
      try {
        const res = await fetchWithRateLimit(cdnUrl);
        if (!res.ok) {
          console.warn(`  [fail] ${item.id}: HTTP ${res.status}`);
          failed.push(item.id);
          continue;
        }
        const buf = Buffer.from(await res.arrayBuffer());
        await writeFile(destPath, buf);
        downloaded.push(item.id);
        await sleep(DELAY_MS);
      } catch (err) {
        console.warn(`  [err] ${item.id}: ${err.message}`);
        failed.push(item.id);
      }
    }
    console.log(`Batch ${bi + 1}/${batches.length}: ${downloaded.length} downloaded total, ${failed.length} failed so far`);
  }

  // Update items.json with sprite paths
  for (const item of items) {
    const destPath = join(SPRITES_DIR, `${item.id}.png`);
    item.sprite = existsSync(destPath) ? `/sprites/${item.id}.png` : '';
  }
  await writeFile(ITEMS_JSON, JSON.stringify(items, null, 2) + '\n');

  console.log('\nSummary:');
  console.log(`  Downloaded: ${downloaded.length}`);
  console.log(`  Failed/missing: ${failed.length}`);
  console.log(`  Sprite coverage: ${items.filter(i => i.sprite).length}/${items.length}`);
}

main().catch(err => { console.error(err); process.exit(1); });
