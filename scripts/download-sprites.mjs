#!/usr/bin/env node
/**
 * Download Terraria item sprites from terraria.fandom.com (main wiki).
 * Usage: node scripts/download-sprites.mjs
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ITEMS_JSON = join(ROOT, 'src', 'data', 'items.json');
const SPRITES_DIR = join(ROOT, 'public', 'sprites');

const PRIMARY_API = 'https://terraria.fandom.com/api.php';
const FALLBACK_API = 'https://terraria.wiki.gg/api.php';
const BATCH_SIZE = 50;
const DOWNLOAD_DELAY_MS = 150;
const RETRY_DELAY_MS = 500;

/** Hardcoded filename overrides for non-default filenames. */
const FILENAME_OVERRIDES = {
  wooden_platform: 'Wood_Platform.png',
  gold_chain: 'Chain.png',
};

/** Items that failed the primary wiki and should try fallback. */
const FALLBACK_WIKI_ITEMS = new Set();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * fetch with one retry on network error.
 */
async function fetchWithRetry(url, options = {}) {
  try {
    return await fetch(url, options);
  } catch (err) {
    console.warn(`  [retry] Network error for ${url}: ${err.message}`);
    await sleep(RETRY_DELAY_MS);
    return fetch(url, options);
  }
}

/**
 * Build the default wiki filename for an item name.
 * e.g. "Iron Ore" → "Iron_Ore.png"
 */
function defaultFilename(name) {
  return name.split(' ').join('_') + '.png';
}

/**
 * Build wiki API query URL for a list of File: titles.
 */
function buildApiUrl(base, titles) {
  const params = new URLSearchParams({
    action: 'query',
    titles: titles.join('|'),
    prop: 'imageinfo',
    iiprop: 'url|size',
    format: 'json',
  });
  return `${base}?${params}`;
}

/**
 * Call the wiki API and return a map of filename → CDN URL.
 * Missing pages (negative IDs or missing: "") are excluded.
 */
async function queryWikiApi(baseUrl, filenames) {
  const titles = filenames.map((f) => `File:${f}`);
  const url = buildApiUrl(baseUrl, titles);

  const res = await fetchWithRetry(url);
  if (!res.ok) {
    throw new Error(`API ${baseUrl} returned ${res.status} for titles: ${filenames.join(', ')}`);
  }

  const data = await res.json();
  const pages = data?.query?.pages ?? {};
  const resolved = new Map(); // filename (without "File:") → CDN URL

  for (const page of Object.values(pages)) {
    // Missing pages have `missing: ""` property or negative numeric IDs
    if ('missing' in page) continue;
    const title = page.title; // e.g. "File:Iron Ore.png" (API normalizes _ → space)
    const filename = title.replace(/^File:/, '').replace(/ /g, '_');
    const imageInfo = page.imageinfo?.[0];
    if (imageInfo?.url) {
      resolved.set(filename, imageInfo.url);
    }
  }

  return resolved;
}

/**
 * Format bytes as human-readable KB string.
 */
function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // 1. Read items.json
  const itemsRaw = await readFile(ITEMS_JSON, 'utf8');
  const items = JSON.parse(itemsRaw);

  // 2. Build filename map and separate fallback items
  const primaryItems = []; // { item, filename }
  const fallbackItems = []; // { item, candidateFilenames }

  for (const item of items) {
    if (FALLBACK_WIKI_ITEMS.has(item.id)) {
      const baseName = defaultFilename(item.name);
      const itemName = item.name.split(' ').join('_');
      fallbackItems.push({
        item,
        candidateFilenames: [`${itemName}_(item).png`, baseName],
      });
    } else {
      const filename = FILENAME_OVERRIDES[item.id] ?? defaultFilename(item.name);
      primaryItems.push({ item, filename });
    }
  }

  // Map from itemId → CDN URL
  const resolvedUrls = new Map();

  // 3. Query primary wiki in batches of 50
  console.log('Resolving sprites via API...');

  const batches = [];
  for (let i = 0; i < primaryItems.length; i += BATCH_SIZE) {
    batches.push(primaryItems.slice(i, i + BATCH_SIZE));
  }

  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx];
    const filenames = batch.map((e) => e.filename);

    let resolved;
    try {
      resolved = await queryWikiApi(PRIMARY_API, filenames);
    } catch (err) {
      console.error(`  Batch ${batchIdx + 1}/${batches.length}: API error — ${err.message}`);
      resolved = new Map();
    }

    let resolvedCount = 0;
    for (const { item, filename } of batch) {
      if (resolved.has(filename)) {
        resolvedUrls.set(item.id, resolved.get(filename));
        resolvedCount++;
      } else {
        console.warn(`  [missing] ${item.id} (tried File:${filename})`);
      }
    }

    console.log(
      `  Batch ${batchIdx + 1}/${batches.length}: ${batch.length} items → ${resolvedCount} resolved, ${batch.length - resolvedCount} missing`
    );
  }

  // 4. Fallback wiki for special items
  if (fallbackItems.length > 0) {
    const fallbackNames = fallbackItems.map((e) => e.item.id).join(', ');
    console.log(`Trying fallback wiki for: ${fallbackNames}`);

    for (const { item, candidateFilenames } of fallbackItems) {
      let foundUrl = null;
      let foundFilename = null;

      for (const candidate of candidateFilenames) {
        let resolved;
        try {
          resolved = await queryWikiApi(FALLBACK_API, [candidate]);
        } catch (err) {
          console.error(`  [fallback] API error for ${item.id}/${candidate}: ${err.message}`);
          resolved = new Map();
        }

        if (resolved.has(candidate)) {
          foundUrl = resolved.get(candidate);
          foundFilename = candidate;
          break;
        }
      }

      if (foundUrl) {
        resolvedUrls.set(item.id, foundUrl);
        console.log(`  ${item.id} → resolved via ${foundFilename}`);
      } else {
        console.warn(`  ${item.id} → not found on fallback wiki (tried: ${candidateFilenames.join(', ')})`);
      }
    }
  }

  // 5. Create sprites directory
  await mkdir(SPRITES_DIR, { recursive: true });

  // 6. Download sprites
  console.log('Downloading sprites...');

  let downloadedCount = 0;
  const failedItems = [];

  for (const item of items) {
    const url = resolvedUrls.get(item.id);
    if (!url) {
      // Already warned above
      failedItems.push(item.id);
      continue;
    }

    const destPath = join(SPRITES_DIR, `${item.id}.png`);

    try {
      const res = await fetchWithRetry(url);
      if (!res.ok) {
        console.log(`  ✗ ${item.id} — CDN returned ${res.status} (${url})`);
        failedItems.push(item.id);
      } else {
        const buffer = Buffer.from(await res.arrayBuffer());
        await writeFile(destPath, buffer);
        console.log(`  ✓ ${item.id} (${formatSize(buffer.length)})`);
        downloadedCount++;
      }
    } catch (err) {
      console.log(`  ✗ ${item.id} — download error: ${err.message}`);
      failedItems.push(item.id);
    }

    // Rate limiting
    await sleep(DOWNLOAD_DELAY_MS);
  }

  // 7. Update items.json
  for (const item of items) {
    const destPath = `/sprites/${item.id}.png`;
    // Only set sprite if we successfully downloaded it
    if (resolvedUrls.has(item.id) && !failedItems.includes(item.id)) {
      item.sprite = destPath;
    } else {
      item.sprite = '';
    }
  }

  await writeFile(ITEMS_JSON, JSON.stringify(items, null, 2) + '\n');

  // 8. Summary
  const totalItems = items.length;
  console.log('\nSummary:');
  console.log(`  Downloaded: ${downloadedCount}/${totalItems}`);
  if (failedItems.length > 0) {
    console.log(`  Failed/missing: ${failedItems.length}`);
    console.log(`    ${failedItems.join(', ')}`);
  } else {
    console.log('  Failed/missing: 0');
  }
  console.log(`  Updated ${ITEMS_JSON}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
