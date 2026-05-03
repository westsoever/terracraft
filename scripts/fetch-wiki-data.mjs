#!/usr/bin/env node
/**
 * Fetches all items and recipes from terraria.wiki.gg Cargo API.
 * Saves raw API data to scripts/cache/items-raw.json and recipes-raw.json.
 *
 * API: https://terraria.wiki.gg/api.php?action=cargoquery
 * Confirmed field names from cargofields endpoint (May 2026)
 */

import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CACHE_DIR = join(__dirname, 'cache');
const API = 'https://terraria.wiki.gg/api.php';
const LIMIT = 500;
const DELAY_MS = 1000;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchAllPages(table, fields, where = '') {
  const results = [];
  let offset = 0;
  while (true) {
    const params = new URLSearchParams({
      action: 'cargoquery',
      tables: table,
      fields,
      limit: LIMIT,
      offset,
      format: 'json',
      ...(where ? { where } : {}),
    });
    const url = `${API}?${params}`;
    console.log(`  Fetching ${table} offset=${offset}...`);
    let res;
    // Retry on 429 with exponential backoff
    for (let attempt = 0; attempt < 5; attempt++) {
      res = await fetch(url);
      if (res.status !== 429) break;
      const wait = 5000 * Math.pow(2, attempt);
      console.log(`    Rate limited (429), waiting ${wait}ms before retry ${attempt + 1}...`);
      await sleep(wait);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const data = await res.json();
    if (data.error) throw new Error(`API error: ${JSON.stringify(data.error)}`);
    const page = (data.cargoquery ?? []).map(r => r.title);
    results.push(...page);
    console.log(`    Got ${page.length} rows (total so far: ${results.length})`);
    if (page.length < LIMIT) break;
    offset += LIMIT;
    await sleep(DELAY_MS);
  }
  return results;
}

async function main() {
  await mkdir(CACHE_DIR, { recursive: true });

  const itemsPath = join(CACHE_DIR, 'items-raw.json');
  if (existsSync(itemsPath)) {
    console.log('items-raw.json already exists, skipping items fetch.');
  } else {
    // Fetch all items
    console.log('Fetching items...');
    const items = await fetchAllPages(
      'Items',
      'itemid,name,imagefile,hardmode,type'
    );
    await writeFile(itemsPath, JSON.stringify(items, null, 2));
    console.log(`Saved ${items.length} items to scripts/cache/items-raw.json`);
    await sleep(500);
  }

  // Fetch all non-legacy recipes
  // Note: 'ingredients' = names only (¦Name¦^¦Name¦), 'ings' = names+qty (¦Name¦qty^¦Name¦qty)
  console.log('Fetching recipes...');
  const recipes = await fetchAllPages(
    'Recipes',
    'result,resultid,amount,station,ingredients,ings',
    'legacy="0"'
  );
  await writeFile(join(CACHE_DIR, 'recipes-raw.json'), JSON.stringify(recipes, null, 2));
  console.log(`Saved ${recipes.length} recipes to scripts/cache/recipes-raw.json`);
}

main().catch(err => { console.error(err); process.exit(1); });
