import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cacheDir = join(__dirname, 'cache');
const dataDir = join(__dirname, '..', 'src', 'data');

// Ensure output directory exists
mkdirSync(dataDir, { recursive: true });

// Load raw data
const itemsRaw = JSON.parse(readFileSync(join(cacheDir, 'items-raw.json'), 'utf8'));
const recipesRaw = JSON.parse(readFileSync(join(cacheDir, 'recipes-raw.json'), 'utf8'));

// ID generation
function toId(name) {
  return name.toLowerCase()
    .replace(/'/g, '')        // remove apostrophes
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// Parse ings field
function parseIngs(ings) {
  if (!ings) return [];
  // Split by ^, each segment is ¦Name¦qty
  return ings.split('^').filter(Boolean).map(seg => {
    // seg looks like: ¦Gold Watch¦1
    const match = seg.match(/¦([^¦]+)¦(\d*)/);
    if (!match) return null;
    const name = match[1].trim();
    const quantity = parseInt(match[2]) || 1;
    return { itemId: toId(name), quantity };
  }).filter(Boolean);
}

// Normalize items
const itemsMap = new Map(); // id -> Item (for deduplication, keep first)
for (const raw of itemsRaw) {
  // Skip items with empty itemid
  if (!raw.itemid) continue;

  const id = toId(raw.name);
  if (itemsMap.has(id)) continue; // dedup: keep first occurrence

  const tags = (raw.type || '').split('^').filter(Boolean);
  if (raw.hardmode === '1') tags.push('hardmode');

  itemsMap.set(id, {
    id,
    name: raw.name,
    sprite: '',
    tags,
  });
}

const items = Array.from(itemsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
const itemIds = new Set(itemsMap.keys());

// Normalize stations
const stationsMap = new Map(); // id -> Station
// Always include by_hand
stationsMap.set('by_hand', { id: 'by_hand', name: 'By Hand', sprite: '' });

for (const raw of recipesRaw) {
  if (!raw.station) continue;
  const id = toId(raw.station);
  if (!stationsMap.has(id)) {
    stationsMap.set(id, { id, name: raw.station, sprite: '' });
  }
}

const stations = Array.from(stationsMap.values()).sort((a, b) => a.name.localeCompare(b.name));

// Normalize recipes
const recipes = [];
let recipeIndex = 0;
let skippedEmpty = 0;
let skippedUnknownResult = 0;

for (const raw of recipesRaw) {
  // Skip recipes with empty result or empty ings
  if (!raw.result || !raw.ings) {
    skippedEmpty++;
    continue;
  }

  const resultItemId = toId(raw.result);

  // Skip recipes where resultItemId is not in the items set
  if (!itemIds.has(resultItemId)) {
    skippedUnknownResult++;
    continue;
  }

  const ingredients = parseIngs(raw.ings);

  recipes.push({
    id: `recipe_${recipeIndex}`,
    resultItemId,
    resultQuantity: parseInt(raw.amount) || 1,
    ingredients,
    stationId: toId(raw.station || 'by_hand'),
  });

  recipeIndex++;
}

// Write output files
writeFileSync(join(dataDir, 'items.json'), JSON.stringify(items, null, 2));
writeFileSync(join(dataDir, 'recipes.json'), JSON.stringify(recipes, null, 2));
writeFileSync(join(dataDir, 'stations.json'), JSON.stringify(stations, null, 2));

console.log(`Normalized data written to ${dataDir}`);
console.log(`  items:    ${items.length}`);
console.log(`  recipes:  ${recipes.length} (skipped ${skippedEmpty} empty, ${skippedUnknownResult} unknown result)`);
console.log(`  stations: ${stations.length}`);
