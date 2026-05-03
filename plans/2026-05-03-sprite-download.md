# Plan: Download Terraria Item Sprites

**Date:** 2026-05-03
**Repo:** /Users/lyo/aiw/terracraft
**Scope:** All 99 items in `src/data/items.json` have `"sprite": ""`. This plan downloads 16×16 WebP sprites from the Terraria Archive fandom wiki into `public/sprites/` and updates each item's `sprite` field to the local path.

---

## Phase 0 — Documentation Discovery (COMPLETE)

### Findings (subagent confirmed, sources fetched 2026-05-03)

**API:** `https://terraria-archive.fandom.com/api.php` — MediaWiki API, publicly accessible, no auth.

**Batch image URL resolution (up to 50 titles per call):**
```
GET https://terraria-archive.fandom.com/api.php
  ?action=query
  &titles=File:Wood.png|File:Iron_Ore.png|...
  &prop=imageinfo
  &iiprop=url|size
  &format=json
```
Response: `query.pages[*].imageinfo[0].url` = full CDN URL. Pages with `"missing":""` have no URL.

**CDN URL pattern:**
```
https://static.wikia.nocookie.net/terraria/images/[a]/[ab]/[Filename].png/revision/latest?cb=[timestamp]
```
- `[a]` = first hex char of MD5 hash of filename
- `[ab]` = first two hex chars
- The `cb=` query param is a cache-buster; can be omitted in practice

**Critical:** CDN serves **WebP** bytes regardless of `.png` extension. Save files as `.webp`.

**Sprite resolution:** all confirmed **16×16 pixels**.

**Filename convention:** `Title_Case_With_Underscores.png` matching the Terraria wiki article title. Spaces → underscores. Example: `Iron Ore` → `Iron_Ore.png`.

**4 items with non-standard filenames (confirmed via API):**
| Item | Problem | Resolution |
|------|---------|-----------|
| Stone Block | No `Stone_Block.png` found | Try `terraria.wiki.gg` API (see Phase 1.3) |
| Glass | No `Glass.png`; `Glass1.png` exists | Use `File:Glass1.png` |
| Iron Bar | No `Iron_Bar.png`; only `Iron_Bar_x2.png`, `Iron_Bar_crafting.png` | Try `terraria.wiki.gg` API |
| Silk | No `Silk.png`; `Silk1.png` exists | Use `File:Silk1.png` |

**Fallback wiki:** `terraria.wiki.gg` — modern Terraria wiki with complete coverage, same MediaWiki API format:
```
GET https://terraria.wiki.gg/w/api.php
  ?action=query&titles=File:Stone_Block_(item).png&prop=imageinfo&iiprop=url&format=json
```

### Allowed-API summary
| API | Source | Use |
|-----|--------|-----|
| `api.php?action=query&prop=imageinfo` | terraria-archive.fandom.com/api.php (confirmed working) | Resolve filenames → CDN URLs |
| `api.php?action=query&list=allimages&aiprefix=X` | same | Discover alternate filenames |
| `static.wikia.nocookie.net` CDN | confirmed accessible | Download sprites |
| `terraria.wiki.gg/w/api.php` | fallback for missing items | Resolve filenames → CDN URLs |
| Node.js `fetch` (built-in, Node 18+) | stdlib | HTTP requests in script |
| Node.js `fs/promises.writeFile` | stdlib | Write downloaded bytes |

---

## Phase 1 — Write the download script

**File to create:** `scripts/download-sprites.mjs`

### 1.1 Item-to-filename mapping

Hardcode the 99 item names from `src/data/items.json`. The default transform is `name.replace(/ /g, '_') + '.png'`. Override the 4 exceptions:

```js
const FILENAME_OVERRIDES = {
  glass:  'Glass1.png',
  silk:   'Silk1.png',
};
const FALLBACK_WIKI_ITEMS = new Set(['stone_block', 'iron_bar']);
```

### 1.2 Batch-resolve CDN URLs from terraria-archive

Split all non-fallback items into batches of 50. For each batch:
```js
const titles = batch.map(item => 'File:' + toFilename(item)).join('|');
const url = `https://terraria-archive.fandom.com/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|size&format=json`;
const data = await fetch(url).then(r => r.json());
// extract: data.query.pages[*].imageinfo?.[0]?.url
```

### 1.3 Fallback: terraria.wiki.gg for missing items

For `stone_block` try `File:Stone_Block_(item).png` then `File:Stone_Block.png`.
For `iron_bar` try `File:Iron_Bar_(item).png` then `File:Iron_Bar.png`.

Same API shape as 1.2 but against `https://terraria.wiki.gg/w/api.php`.

### 1.4 Download each sprite

```js
import { mkdir, writeFile } from 'fs/promises';
await mkdir('public/sprites', { recursive: true });

for (const [itemId, cdnUrl] of resolved) {
  const bytes = await fetch(cdnUrl).then(r => r.arrayBuffer());
  await writeFile(`public/sprites/${itemId}.webp`, Buffer.from(bytes));
  console.log(`✓ ${itemId}`);
}
```

Add a 100ms delay between downloads to avoid rate-limiting.

### 1.5 Output a resolution report

After all downloads, print:
- Count of successful downloads
- List of any items where `imageinfo` was missing (no CDN URL found)
- List of items where download returned non-200

### Verification checklist (Phase 1)
- `node scripts/download-sprites.mjs` runs without crashing
- `public/sprites/` directory created with ≥90 `.webp` files
- File sizes: each `.webp` ≥ 100 bytes (not empty/error pages)
- `file public/sprites/wood.webp` reports `Web/P image data` (macOS) or similar

### Anti-pattern guards
- Do NOT use `axios`, `node-fetch`, or other third-party HTTP libraries — Node 18+ `fetch` is built-in
- Do NOT save files as `.png` — the CDN sends WebP bytes; wrong extension causes browser decode failures
- Do NOT batch more than 50 titles per API call (MediaWiki limit)
- Do NOT skip the delay — fandom wikis rate-limit aggressive scrapers

---

## Phase 2 — Update items.json with local sprite paths

**File to edit:** `src/data/items.json`

Update each item's `sprite` field to `/sprites/{itemId}.webp`. This can be done in the download script (Phase 1 extension) or as a separate script.

**Recommended: extend the download script** — add a final step after all downloads:

```js
import items from '../src/data/items.json' assert { type: 'json' };
import { writeFile } from 'fs/promises';

const updated = items.map(item => ({
  ...item,
  sprite: resolvedIds.has(item.id)
    ? `/sprites/${item.id}.webp`
    : item.sprite, // leave empty if not found, don't silently corrupt
}));
await writeFile('src/data/items.json', JSON.stringify(updated, null, 2) + '\n');
console.log('✓ items.json updated');
```

**For items not resolved** (e.g., if stone_block still fails): leave `sprite: ""` and log a warning — `ItemNode` already handles the empty-sprite case with a `<div class="t-slot-placeholder" />` fallback (see `src/components/graph/ItemNode.tsx:26-30`).

### Verification checklist (Phase 2)
- `grep '"sprite": ""' src/data/items.json` returns only the items whose sprites were not found (should be 0 or ≤2)
- `grep '"sprite": "/sprites/' src/data/items.json | wc -l` matches count of downloaded files
- JSON is valid: `node -e "require('./src/data/items.json')"` exits 0

---

## Phase 3 — Visual verification

1. `npm run dev` — open browser
2. Select any craftable item in the sidebar (e.g., "Wooden Sword")
3. Each node in the graph should show a 16×16 sprite in the `t-slot` div
4. Spot-check: Iron Ore (ore sprite), Wood (wood sprite), Wooden Sword (sword sprite)
5. Confirm `t-slot-placeholder` only appears for any items still missing sprites
6. Check browser Network tab: sprite requests return 200 with `Content-Type: image/webp`
7. `npm run build` passes

### Anti-pattern guards
- Do NOT commit `public/sprites/` if file sizes seem wrong (check a few with `ls -la public/sprites/ | sort -k5 -n | head`)
- Do NOT add `<img onError>` fallback handling until you confirm whether any sprites actually fail to load
- The `ItemNode` already conditionally renders `<img>` vs placeholder — no code changes needed there

---

## Phase 4 — (Optional) stations.json sprites

`src/data/stations.json` also has `"sprite": ""` fields. After items are confirmed working, run the same download process for stations using `name.replace(/ /g, '_') + '.png'` → save to `public/sprites/{stationId}.webp`.

Station sprites are referenced in `src/types/terraria.ts:22` but not currently rendered in the UI (only the station *name* is shown in `ItemNode.tsx:11`). Skip until there's a UI feature that uses them.

---

## Summary

| Phase | File(s) | Action |
|-------|---------|--------|
| 1 | `scripts/download-sprites.mjs` | Create download script |
| 1 | `public/sprites/*.webp` | 99 downloaded sprites |
| 2 | `src/data/items.json` | Update all `sprite` fields |
| 3 | browser + build | Visual + build verification |
| 4 | (optional) stations | Same process for station sprites |

**Expected outcome:** All 99 items display their Terraria sprite in the crafting graph nodes with no code changes to React components.
