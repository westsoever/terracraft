# Plan: Pre-Hardmode Item Expansion

**Date:** 2026-05-03  
**Repo:** /Users/lyo/aiw/terracraft  
**Scope:** Add all pre-hardmode craftable items to the three data files only. No code changes required.

---

## Phase 0 — Documentation Discovery (Done)

**Findings from audit:**

| File | Path | Current count |
|------|------|--------------|
| Items | `src/data/items.json` | 98 items |
| Recipes | `src/data/recipes.json` | 62 recipes |
| Stations | `src/data/stations.json` | 11 stations |

**Data shape to copy:**
```json
// Item (items.json)
{ "id": "iron_bar", "name": "Iron Bar", "sprite": "", "tags": ["material", "metal"] }

// Recipe (recipes.json)
{ "id": "iron_bar_from_ore", "resultItemId": "iron_bar", "resultQuantity": 1, "ingredients": [{ "itemId": "iron_ore", "quantity": 3 }], "stationId": "furnace" }

// Station (stations.json)
{ "id": "furnace", "name": "Furnace", "sprite": "" }
```

**Authoritative source for all quantities:** https://wiki.terraria.org/wiki/[ItemName] — verify every quantity before writing. Do not guess from memory.

**Existing stations available:** `by_hand`, `work_bench`, `furnace`, `iron_anvil`, `alchemy_table`, `loom`, `sawmill`, `keg`, `cooking_pot`, `tinkerers_workshop`, `mythril_anvil`

**Note on existing data:** `cobalt_ore`, `cobalt_bar`, `mythril_ore`, `mythril_bar` and related items are technically hardmode content. They are already in the data and should stay — do not remove them.

**Anti-patterns:**
- Never invent quantities — always look up on wiki
- `sprite` is always `""` (no sprites yet)
- Recipe IDs follow pattern: `{result_id}_recipe` or `{result_id}_from_{main_ingredient}`
- Tags must be lowercase strings from this set: `raw`, `material`, `metal`, `ore`, `herb`, `weapon`, `melee`, `ranged`, `magic`, `armor`, `head`, `body`, `legs`, `accessory`, `potion`, `consumable`, `furniture`, `block`, `station`, `light`, `ammo`, `currency`, `info`, `summon`

---

## Phase 1 — Raw Materials & New Stations

**Goal:** Add raw drop items and new crafting stations that phases 2–9 depend on.

### 1.1 New stations — add to `stations.json`

```json
{ "id": "hellforge", "name": "Hellforge", "sprite": "" },
{ "id": "demon_altar", "name": "Demon Altar", "sprite": "" },
{ "id": "heavy_work_bench", "name": "Heavy Work Bench", "sprite": "" },
{ "id": "crystal_ball", "name": "Crystal Ball", "sprite": "" },
{ "id": "glass_kiln", "name": "Glass Kiln", "sprite": "" },
{ "id": "bookcase", "name": "Bookcase", "sprite": "" }
```

### 1.2 New raw items — add to `items.json` (no recipes, just material drops)

**Corrupted/Crimson drops:**
```json
{ "id": "demonite_ore", "name": "Demonite Ore", "sprite": "", "tags": ["raw", "ore"] },
{ "id": "crimtane_ore", "name": "Crimtane Ore", "sprite": "", "tags": ["raw", "ore"] },
{ "id": "shadow_scale", "name": "Shadow Scale", "sprite": "", "tags": ["raw", "material"] },
{ "id": "tissue_sample", "name": "Tissue Sample", "sprite": "", "tags": ["raw", "material"] },
{ "id": "rotten_chunk", "name": "Rotten Chunk", "sprite": "", "tags": ["raw", "material"] },
{ "id": "vertebrae", "name": "Vertebrae", "sprite": "", "tags": ["raw", "material"] },
{ "id": "vile_powder", "name": "Vile Powder", "sprite": "", "tags": ["raw", "material"] },
{ "id": "vicious_powder", "name": "Vicious Powder", "sprite": "", "tags": ["raw", "material"] }
```

**Underground/Hell drops:**
```json
{ "id": "hellstone", "name": "Hellstone", "sprite": "", "tags": ["raw", "ore"] },
{ "id": "obsidian_block", "name": "Obsidian", "sprite": "", "tags": ["raw", "material"] },
{ "id": "meteorite_ore", "name": "Meteorite", "sprite": "", "tags": ["raw", "ore"] },
{ "id": "bone", "name": "Bone", "sprite": "", "tags": ["raw", "material"] }
```

**Jungle drops:**
```json
{ "id": "jungle_spores", "name": "Jungle Spores", "sprite": "", "tags": ["raw", "material"] },
{ "id": "stinger", "name": "Stinger", "sprite": "", "tags": ["raw", "material"] },
{ "id": "vine", "name": "Vine", "sprite": "", "tags": ["raw", "material"] }
```

**Bee drops:**
```json
{ "id": "beeswax", "name": "Beeswax", "sprite": "", "tags": ["raw", "material"] },
{ "id": "bee_wax", "name": "Bee Wax", "sprite": "", "tags": ["raw", "material"] }
```
Note: Terraria uses "Beeswax" — verify exact name on wiki.

**Gem drops (mined from terrain):**
```json
{ "id": "amethyst", "name": "Amethyst", "sprite": "", "tags": ["raw", "material"] },
{ "id": "topaz", "name": "Topaz", "sprite": "", "tags": ["raw", "material"] },
{ "id": "sapphire", "name": "Sapphire", "sprite": "", "tags": ["raw", "material"] },
{ "id": "emerald", "name": "Emerald", "sprite": "", "tags": ["raw", "material"] },
{ "id": "ruby", "name": "Ruby", "sprite": "", "tags": ["raw", "material"] },
{ "id": "diamond", "name": "Diamond", "sprite": "", "tags": ["raw", "material"] },
{ "id": "amber", "name": "Amber", "sprite": "", "tags": ["raw", "material"] }
```

**Other crafting materials:**
```json
{ "id": "lens", "name": "Lens", "sprite": "", "tags": ["raw", "material"] },
{ "id": "black_lens", "name": "Black Lens", "sprite": "", "tags": ["raw", "material"] },
{ "id": "iron_bar_alt", "name": "Lead Bar", "sprite": "", "tags": ["material", "metal"] }
```
Note: `lead_bar` already exists. Skip.

**Currency:**
```json
{ "id": "silver_coin", "name": "Silver Coin", "sprite": "", "tags": ["raw", "currency"] },
{ "id": "platinum_coin", "name": "Platinum Coin", "sprite": "", "tags": ["raw", "currency"] }
```

### 1.3 New craftable materials — items.json + recipes.json

**Add to items.json:**
```json
{ "id": "demonite_bar", "name": "Demonite Bar", "sprite": "", "tags": ["material", "metal"] },
{ "id": "crimtane_bar", "name": "Crimtane Bar", "sprite": "", "tags": ["material", "metal"] },
{ "id": "hellstone_bar", "name": "Hellstone Bar", "sprite": "", "tags": ["material", "metal"] },
{ "id": "meteorite_bar", "name": "Meteorite Bar", "sprite": "", "tags": ["material", "metal"] }
```

**Add to recipes.json:**
```json
{ "id": "demonite_bar_from_ore", "resultItemId": "demonite_bar", "resultQuantity": 1, "ingredients": [{ "itemId": "demonite_ore", "quantity": 4 }], "stationId": "furnace" },
{ "id": "crimtane_bar_from_ore", "resultItemId": "crimtane_bar", "resultQuantity": 1, "ingredients": [{ "itemId": "crimtane_ore", "quantity": 3 }], "stationId": "furnace" },
{ "id": "hellstone_bar_from_ore", "resultItemId": "hellstone_bar", "resultQuantity": 1, "ingredients": [{ "itemId": "hellstone", "quantity": 3 }, { "itemId": "obsidian_block", "quantity": 1 }], "stationId": "hellforge" },
{ "id": "meteorite_bar_from_ore", "resultItemId": "meteorite_bar", "resultQuantity": 1, "ingredients": [{ "itemId": "meteorite_ore", "quantity": 3 }], "stationId": "furnace" }
```

**Verify all quantities at:** https://wiki.terraria.org/wiki/Demonite_Bar, /Crimtane_Bar, /Hellstone_Bar, /Meteorite_Bar

### Verification checklist (Phase 1)
- `jq 'length' src/data/items.json` increases by ~30
- `jq 'length' src/data/stations.json` = 17
- `npm run build` passes
- App loads; new stations appear in the filter dropdown

---

## Phase 2 — Missing Metal Tier Armor & Weapons

**Goal:** Fill in the 5 missing ore-tier sets: Tin, Lead, Silver, Tungsten, Platinum.

**Pattern to copy:** existing copper/iron/gold armor recipes in `recipes.json` (lines 33–44).

All crafted at `iron_anvil`. Verify exact bar costs at: https://wiki.terraria.org/wiki/Armor

### 2.1 Tin tier (alternate to Copper)

**Items (items.json):**
```json
{ "id": "tin_helmet", "name": "Tin Helmet", "sprite": "", "tags": ["armor", "head"] },
{ "id": "tin_chainmail", "name": "Tin Chainmail", "sprite": "", "tags": ["armor", "body"] },
{ "id": "tin_greaves", "name": "Tin Greaves", "sprite": "", "tags": ["armor", "legs"] },
{ "id": "tin_shortsword", "name": "Tin Shortsword", "sprite": "", "tags": ["weapon", "melee"] },
{ "id": "tin_broadsword", "name": "Tin Broadsword", "sprite": "", "tags": ["weapon", "melee"] },
{ "id": "tin_bow", "name": "Tin Bow", "sprite": "", "tags": ["weapon", "ranged"] }
```

**Recipes (recipes.json) — verify quantities on wiki:**
```json
{ "id": "tin_helmet_recipe", "resultItemId": "tin_helmet", "resultQuantity": 1, "ingredients": [{ "itemId": "tin_bar", "quantity": 20 }], "stationId": "iron_anvil" },
{ "id": "tin_chainmail_recipe", "resultItemId": "tin_chainmail", "resultQuantity": 1, "ingredients": [{ "itemId": "tin_bar", "quantity": 25 }], "stationId": "iron_anvil" },
{ "id": "tin_greaves_recipe", "resultItemId": "tin_greaves", "resultQuantity": 1, "ingredients": [{ "itemId": "tin_bar", "quantity": 20 }], "stationId": "iron_anvil" },
{ "id": "tin_shortsword_recipe", "resultItemId": "tin_shortsword", "resultQuantity": 1, "ingredients": [{ "itemId": "tin_bar", "quantity": 7 }], "stationId": "iron_anvil" },
{ "id": "tin_broadsword_recipe", "resultItemId": "tin_broadsword", "resultQuantity": 1, "ingredients": [{ "itemId": "tin_bar", "quantity": 8 }], "stationId": "iron_anvil" },
{ "id": "tin_bow_recipe", "resultItemId": "tin_bow", "resultQuantity": 1, "ingredients": [{ "itemId": "tin_bar", "quantity": 8 }], "stationId": "iron_anvil" }
```

### 2.2 Lead tier (alternate to Iron)

**Items:**
```json
{ "id": "lead_helmet", "name": "Lead Helmet", "sprite": "", "tags": ["armor", "head"] },
{ "id": "lead_chainmail", "name": "Lead Chainmail", "sprite": "", "tags": ["armor", "body"] },
{ "id": "lead_greaves", "name": "Lead Greaves", "sprite": "", "tags": ["armor", "legs"] },
{ "id": "lead_shortsword", "name": "Lead Shortsword", "sprite": "", "tags": ["weapon", "melee"] },
{ "id": "lead_broadsword", "name": "Lead Broadsword", "sprite": "", "tags": ["weapon", "melee"] },
{ "id": "lead_bow", "name": "Lead Bow", "sprite": "", "tags": ["weapon", "ranged"] }
```

**Recipes — same bar counts as iron tier (verify on wiki):**
```json
{ "id": "lead_helmet_recipe", "resultItemId": "lead_helmet", "resultQuantity": 1, "ingredients": [{ "itemId": "lead_bar", "quantity": 15 }], "stationId": "iron_anvil" },
{ "id": "lead_chainmail_recipe", "resultItemId": "lead_chainmail", "resultQuantity": 1, "ingredients": [{ "itemId": "lead_bar", "quantity": 20 }], "stationId": "iron_anvil" },
{ "id": "lead_greaves_recipe", "resultItemId": "lead_greaves", "resultQuantity": 1, "ingredients": [{ "itemId": "lead_bar", "quantity": 15 }], "stationId": "iron_anvil" },
{ "id": "lead_shortsword_recipe", "resultItemId": "lead_shortsword", "resultQuantity": 1, "ingredients": [{ "itemId": "lead_bar", "quantity": 7 }], "stationId": "iron_anvil" },
{ "id": "lead_broadsword_recipe", "resultItemId": "lead_broadsword", "resultQuantity": 1, "ingredients": [{ "itemId": "lead_bar", "quantity": 8 }], "stationId": "iron_anvil" },
{ "id": "lead_bow_recipe", "resultItemId": "lead_bow", "resultQuantity": 1, "ingredients": [{ "itemId": "lead_bar", "quantity": 8 }], "stationId": "iron_anvil" }
```

### 2.3 Silver tier (alternate to Gold, tier 3)

**Items:**
```json
{ "id": "silver_helmet", "name": "Silver Helmet", "sprite": "", "tags": ["armor", "head"] },
{ "id": "silver_chainmail", "name": "Silver Chainmail", "sprite": "", "tags": ["armor", "body"] },
{ "id": "silver_greaves", "name": "Silver Greaves", "sprite": "", "tags": ["armor", "legs"] },
{ "id": "silver_shortsword", "name": "Silver Shortsword", "sprite": "", "tags": ["weapon", "melee"] },
{ "id": "silver_broadsword", "name": "Silver Broadsword", "sprite": "", "tags": ["weapon", "melee"] },
{ "id": "silver_bow", "name": "Silver Bow", "sprite": "", "tags": ["weapon", "ranged"] }
```

**Recipes (verify on wiki — silver/tungsten/platinum tier uses more bars):**
```json
{ "id": "silver_helmet_recipe", "resultItemId": "silver_helmet", "resultQuantity": 1, "ingredients": [{ "itemId": "silver_bar", "quantity": 20 }], "stationId": "iron_anvil" },
{ "id": "silver_chainmail_recipe", "resultItemId": "silver_chainmail", "resultQuantity": 1, "ingredients": [{ "itemId": "silver_bar", "quantity": 25 }], "stationId": "iron_anvil" },
{ "id": "silver_greaves_recipe", "resultItemId": "silver_greaves", "resultQuantity": 1, "ingredients": [{ "itemId": "silver_bar", "quantity": 20 }], "stationId": "iron_anvil" },
{ "id": "silver_shortsword_recipe", "resultItemId": "silver_shortsword", "resultQuantity": 1, "ingredients": [{ "itemId": "silver_bar", "quantity": 8 }], "stationId": "iron_anvil" },
{ "id": "silver_broadsword_recipe", "resultItemId": "silver_broadsword", "resultQuantity": 1, "ingredients": [{ "itemId": "silver_bar", "quantity": 9 }], "stationId": "iron_anvil" },
{ "id": "silver_bow_recipe", "resultItemId": "silver_bow", "resultQuantity": 1, "ingredients": [{ "itemId": "silver_bar", "quantity": 9 }], "stationId": "iron_anvil" }
```

### 2.4 Tungsten tier (alternate to Silver)

Same pattern as Silver. Items: `tungsten_helmet`, `tungsten_chainmail`, `tungsten_greaves`, `tungsten_shortsword`, `tungsten_broadsword`, `tungsten_bow`. Use `tungsten_bar`. Verify quantities on wiki.

### 2.5 Platinum tier (alternate to Gold)

Same pattern as Silver/Tungsten. Items: `platinum_helmet`, `platinum_chainmail`, `platinum_greaves`, `platinum_shortsword`, `platinum_broadsword`, `platinum_bow`. Use `platinum_bar`.

### 2.6 Missing bows for existing tiers

Add `copper_bow`, `iron_bow`, `gold_bow` using same pattern as `wooden_bow` but at `iron_anvil`.

```json
{ "id": "copper_bow", "name": "Copper Bow", "sprite": "", "tags": ["weapon", "ranged"] },
{ "id": "iron_bow", "name": "Iron Bow", "sprite": "", "tags": ["weapon", "ranged"] },
{ "id": "gold_bow", "name": "Gold Bow", "sprite": "", "tags": ["weapon", "ranged"] }
```

Recipes at `iron_anvil`. Verify bar costs at wiki.

### Verification checklist (Phase 2)
- Search "Tin Helmet" in app sidebar → appears and shows correct recipe tree
- Recipe tree for "Tin Chainmail" shows `tin_bar → tin_ore` chain correctly
- `jq '[.[] | select(.tags | contains(["armor"]))] | length' src/data/items.json` = previous + 15 new armor pieces
- `npm run build` passes

---

## Phase 3 — Demonite / Crimtane / Shadow / Crimson Tier

**Sources:**  
- https://wiki.terraria.org/wiki/Shadow_armor  
- https://wiki.terraria.org/wiki/Crimson_armor  
- https://wiki.terraria.org/wiki/Demonite_Bar

All crafted at `iron_anvil`. Demonite_bar and shadow_scale added in Phase 1.

### 3.1 Shadow armor + weapons (Corruption world)

**Items (items.json):**
```json
{ "id": "shadow_helmet", "name": "Shadow Helmet", "sprite": "", "tags": ["armor", "head"] },
{ "id": "shadow_scalemail", "name": "Shadow Scalemail", "sprite": "", "tags": ["armor", "body"] },
{ "id": "shadow_greaves", "name": "Shadow Greaves", "sprite": "", "tags": ["armor", "legs"] },
{ "id": "lights_bane", "name": "Light's Bane", "sprite": "", "tags": ["weapon", "melee"] },
{ "id": "war_axe_of_the_night", "name": "War Axe of the Night", "sprite": "", "tags": ["weapon", "melee"] },
{ "id": "ball_o_hurt", "name": "Ball O' Hurt", "sprite": "", "tags": ["weapon", "melee"] }
```

**Recipes — verify exact shadow_scale and demonite_bar quantities on wiki:**
```json
{ "id": "shadow_helmet_recipe", "resultItemId": "shadow_helmet", "resultQuantity": 1, "ingredients": [{ "itemId": "demonite_bar", "quantity": 20 }, { "itemId": "shadow_scale", "quantity": 10 }], "stationId": "iron_anvil" },
{ "id": "shadow_scalemail_recipe", "resultItemId": "shadow_scalemail", "resultQuantity": 1, "ingredients": [{ "itemId": "demonite_bar", "quantity": 25 }, { "itemId": "shadow_scale", "quantity": 25 }], "stationId": "iron_anvil" },
{ "id": "shadow_greaves_recipe", "resultItemId": "shadow_greaves", "resultQuantity": 1, "ingredients": [{ "itemId": "demonite_bar", "quantity": 20 }, { "itemId": "shadow_scale", "quantity": 10 }], "stationId": "iron_anvil" },
{ "id": "lights_bane_recipe", "resultItemId": "lights_bane", "resultQuantity": 1, "ingredients": [{ "itemId": "demonite_bar", "quantity": 10 }], "stationId": "iron_anvil" },
{ "id": "war_axe_recipe", "resultItemId": "war_axe_of_the_night", "resultQuantity": 1, "ingredients": [{ "itemId": "demonite_bar", "quantity": 10 }], "stationId": "iron_anvil" },
{ "id": "ball_o_hurt_recipe", "resultItemId": "ball_o_hurt", "resultQuantity": 1, "ingredients": [{ "itemId": "demonite_bar", "quantity": 10 }, { "itemId": "shadow_scale", "quantity": 5 }], "stationId": "iron_anvil" }
```

### 3.2 Crimson armor + weapons (Crimson world)

**Items:**
```json
{ "id": "crimson_helmet", "name": "Crimson Helmet", "sprite": "", "tags": ["armor", "head"] },
{ "id": "crimson_scalemail", "name": "Crimson Scalemail", "sprite": "", "tags": ["armor", "body"] },
{ "id": "crimson_greaves", "name": "Crimson Greaves", "sprite": "", "tags": ["armor", "legs"] },
{ "id": "blood_butcherer", "name": "Blood Butcherer", "sprite": "", "tags": ["weapon", "melee"] },
{ "id": "the_meatball", "name": "The Meatball", "sprite": "", "tags": ["weapon", "melee"] }
```

Recipes use `crimtane_bar` + `tissue_sample`. Verify on wiki.

### Verification checklist (Phase 3)
- Search "Shadow Helmet" → recipe tree shows demonite_bar → demonite_ore and shadow_scale (raw)
- `npm run build` passes

---

## Phase 4 — Hellstone / Molten Tier

**Source:** https://wiki.terraria.org/wiki/Molten_armor, /Hellstone_Bar  
Station: `iron_anvil` (molten items) and `hellforge` (hellstone bars, already in Phase 1 recipes)

### 4.1 Items (items.json)

```json
{ "id": "molten_helmet", "name": "Molten Helmet", "sprite": "", "tags": ["armor", "head"] },
{ "id": "molten_breastplate", "name": "Molten Breastplate", "sprite": "", "tags": ["armor", "body"] },
{ "id": "molten_greaves", "name": "Molten Greaves", "sprite": "", "tags": ["armor", "legs"] },
{ "id": "fiery_greatsword", "name": "Fiery Greatsword", "sprite": "", "tags": ["weapon", "melee"] },
{ "id": "molten_fury", "name": "Molten Fury", "sprite": "", "tags": ["weapon", "ranged"] },
{ "id": "sunfury", "name": "Sunfury", "sprite": "", "tags": ["weapon", "melee"] },
{ "id": "phoenix_blaster", "name": "Phoenix Blaster", "sprite": "", "tags": ["weapon", "ranged"] },
{ "id": "handgun", "name": "Handgun", "sprite": "", "tags": ["weapon", "ranged", "raw"] }
```

Note: `handgun` is a chest loot item (raw) — Phoenix Blaster is crafted from it.

### 4.2 Recipes (recipes.json)

Verify exact hellstone_bar counts at wiki before entering:
```json
{ "id": "molten_helmet_recipe", "resultItemId": "molten_helmet", "resultQuantity": 1, "ingredients": [{ "itemId": "hellstone_bar", "quantity": 10 }], "stationId": "iron_anvil" },
{ "id": "molten_breastplate_recipe", "resultItemId": "molten_breastplate", "resultQuantity": 1, "ingredients": [{ "itemId": "hellstone_bar", "quantity": 20 }], "stationId": "iron_anvil" },
{ "id": "molten_greaves_recipe", "resultItemId": "molten_greaves", "resultQuantity": 1, "ingredients": [{ "itemId": "hellstone_bar", "quantity": 15 }], "stationId": "iron_anvil" },
{ "id": "fiery_greatsword_recipe", "resultItemId": "fiery_greatsword", "resultQuantity": 1, "ingredients": [{ "itemId": "hellstone_bar", "quantity": 20 }], "stationId": "iron_anvil" },
{ "id": "molten_fury_recipe", "resultItemId": "molten_fury", "resultQuantity": 1, "ingredients": [{ "itemId": "hellstone_bar", "quantity": 10 }], "stationId": "iron_anvil" },
{ "id": "phoenix_blaster_recipe", "resultItemId": "phoenix_blaster", "resultQuantity": 1, "ingredients": [{ "itemId": "handgun", "quantity": 1 }, { "itemId": "hellstone_bar", "quantity": 10 }], "stationId": "iron_anvil" }
```

### Verification checklist (Phase 4)
- Recipe tree for "Molten Breastplate" traces: molten_breastplate → hellstone_bar → hellstone + obsidian_block
- `npm run build` passes

---

## Phase 5 — Meteorite / Meteor Armor & Magic Items

**Source:** https://wiki.terraria.org/wiki/Meteor_armor, /Space_Gun, /Star_Cannon

Station: `iron_anvil`. Meteorite_bar added in Phase 1.

### 5.1 Items (items.json)

```json
{ "id": "meteor_helmet", "name": "Meteor Helmet", "sprite": "", "tags": ["armor", "head"] },
{ "id": "meteor_suit", "name": "Meteor Suit", "sprite": "", "tags": ["armor", "body"] },
{ "id": "meteor_leggings", "name": "Meteor Leggings", "sprite": "", "tags": ["armor", "legs"] },
{ "id": "space_gun", "name": "Space Gun", "sprite": "", "tags": ["weapon", "magic"] },
{ "id": "star_cannon", "name": "Star Cannon", "sprite": "", "tags": ["weapon", "ranged"] },
{ "id": "meteor_shot", "name": "Meteor Shot", "sprite": "", "tags": ["ammo"] },
{ "id": "fallen_star", "name": "Fallen Star", "sprite": "", "tags": ["raw", "material"] }
```

### 5.2 Recipes (recipes.json)

Verify exact counts on wiki:
```json
{ "id": "meteor_helmet_recipe", "resultItemId": "meteor_helmet", "resultQuantity": 1, "ingredients": [{ "itemId": "meteorite_bar", "quantity": 10 }], "stationId": "iron_anvil" },
{ "id": "meteor_suit_recipe", "resultItemId": "meteor_suit", "resultQuantity": 1, "ingredients": [{ "itemId": "meteorite_bar", "quantity": 15 }], "stationId": "iron_anvil" },
{ "id": "meteor_leggings_recipe", "resultItemId": "meteor_leggings", "resultQuantity": 1, "ingredients": [{ "itemId": "meteorite_bar", "quantity": 10 }], "stationId": "iron_anvil" },
{ "id": "space_gun_recipe", "resultItemId": "space_gun", "resultQuantity": 1, "ingredients": [{ "itemId": "meteorite_bar", "quantity": 20 }], "stationId": "iron_anvil" },
{ "id": "star_cannon_recipe", "resultItemId": "star_cannon", "resultQuantity": 1, "ingredients": [{ "itemId": "meteorite_bar", "quantity": 20 }, { "itemId": "fallen_star", "quantity": 5 }], "stationId": "iron_anvil" },
{ "id": "meteor_shot_recipe", "resultItemId": "meteor_shot", "resultQuantity": 70, "ingredients": [{ "itemId": "meteorite_bar", "quantity": 1 }], "stationId": "iron_anvil" }
```

---

## Phase 6 — Jungle, Bee, Necro Armor Sets

**Sources:**  
- https://wiki.terraria.org/wiki/Jungle_armor  
- https://wiki.terraria.org/wiki/Bee_armor  
- https://wiki.terraria.org/wiki/Necro_armor  

Raw materials added in Phase 1: `jungle_spores`, `stinger`, `vine`, `beeswax`, `bone`.

### 6.1 Items (items.json)

```json
{ "id": "jungle_hat", "name": "Jungle Hat", "sprite": "", "tags": ["armor", "head"] },
{ "id": "jungle_shirt", "name": "Jungle Shirt", "sprite": "", "tags": ["armor", "body"] },
{ "id": "jungle_pants", "name": "Jungle Pants", "sprite": "", "tags": ["armor", "legs"] },
{ "id": "bee_headgear", "name": "Bee Headgear", "sprite": "", "tags": ["armor", "head"] },
{ "id": "bee_breastplate", "name": "Bee Breastplate", "sprite": "", "tags": ["armor", "body"] },
{ "id": "bee_greaves", "name": "Bee Greaves", "sprite": "", "tags": ["armor", "legs"] },
{ "id": "necro_helmet", "name": "Necro Helmet", "sprite": "", "tags": ["armor", "head"] },
{ "id": "necro_breastplate", "name": "Necro Breastplate", "sprite": "", "tags": ["armor", "body"] },
{ "id": "necro_greaves", "name": "Necro Greaves", "sprite": "", "tags": ["armor", "legs"] }
```

### 6.2 Recipes (recipes.json)

**Jungle armor** (at `iron_anvil` — verify on wiki):
```json
{ "id": "jungle_hat_recipe", "resultItemId": "jungle_hat", "resultQuantity": 1, "ingredients": [{ "itemId": "jungle_spores", "quantity": 8 }, { "itemId": "stinger", "quantity": 2 }], "stationId": "iron_anvil" },
{ "id": "jungle_shirt_recipe", "resultItemId": "jungle_shirt", "resultQuantity": 1, "ingredients": [{ "itemId": "jungle_spores", "quantity": 12 }, { "itemId": "stinger", "quantity": 4 }], "stationId": "iron_anvil" },
{ "id": "jungle_pants_recipe", "resultItemId": "jungle_pants", "resultQuantity": 1, "ingredients": [{ "itemId": "jungle_spores", "quantity": 8 }, { "itemId": "stinger", "quantity": 2 }, { "itemId": "vine", "quantity": 2 }], "stationId": "iron_anvil" }
```

**Bee armor** (verify exact beeswax counts on wiki):
```json
{ "id": "bee_headgear_recipe", "resultItemId": "bee_headgear", "resultQuantity": 1, "ingredients": [{ "itemId": "beeswax", "quantity": 8 }], "stationId": "iron_anvil" },
{ "id": "bee_breastplate_recipe", "resultItemId": "bee_breastplate", "resultQuantity": 1, "ingredients": [{ "itemId": "beeswax", "quantity": 12 }], "stationId": "iron_anvil" },
{ "id": "bee_greaves_recipe", "resultItemId": "bee_greaves", "resultQuantity": 1, "ingredients": [{ "itemId": "beeswax", "quantity": 8 }], "stationId": "iron_anvil" }
```

**Necro armor** (verify bone counts on wiki — Necro uses bones + cobweb):
```json
{ "id": "necro_helmet_recipe", "resultItemId": "necro_helmet", "resultQuantity": 1, "ingredients": [{ "itemId": "bone", "quantity": 35 }, { "itemId": "cobweb", "quantity": 5 }], "stationId": "iron_anvil" },
{ "id": "necro_breastplate_recipe", "resultItemId": "necro_breastplate", "resultQuantity": 1, "ingredients": [{ "itemId": "bone", "quantity": 50 }, { "itemId": "cobweb", "quantity": 5 }], "stationId": "iron_anvil" },
{ "id": "necro_greaves_recipe", "resultItemId": "necro_greaves", "resultQuantity": 1, "ingredients": [{ "itemId": "bone", "quantity": 40 }, { "itemId": "cobweb", "quantity": 5 }], "stationId": "iron_anvil" }
```

---

## Phase 7 — Gem Staffs & Other Magic Weapons

**Source:** https://wiki.terraria.org/wiki/Magic_weapons_(pre-hardmode)  
Gems (raw) added in Phase 1.

### 7.1 Items (items.json)

```json
{ "id": "amethyst_staff", "name": "Amethyst Staff", "sprite": "", "tags": ["weapon", "magic"] },
{ "id": "topaz_staff", "name": "Topaz Staff", "sprite": "", "tags": ["weapon", "magic"] },
{ "id": "sapphire_staff", "name": "Sapphire Staff", "sprite": "", "tags": ["weapon", "magic"] },
{ "id": "emerald_staff", "name": "Emerald Staff", "sprite": "", "tags": ["weapon", "magic"] },
{ "id": "ruby_staff", "name": "Ruby Staff", "sprite": "", "tags": ["weapon", "magic"] },
{ "id": "diamond_staff", "name": "Diamond Staff", "sprite": "", "tags": ["weapon", "magic"] },
{ "id": "amber_staff", "name": "Amber Staff", "sprite": "", "tags": ["weapon", "magic"] },
{ "id": "vilethorn", "name": "Vilethorn", "sprite": "", "tags": ["weapon", "magic"] },
{ "id": "crimson_rod", "name": "Crimson Rod", "sprite": "", "tags": ["weapon", "magic"] },
{ "id": "wand_of_sparking", "name": "Wand of Sparking", "sprite": "", "tags": ["weapon", "magic"] }
```

Note: Vilethorn is crafted at `demon_altar`, Crimson Rod at `demon_altar`. Wand of Sparking at `work_bench`.

### 7.2 Recipes (recipes.json)

Gem staffs — verify exact gem + bar counts at https://wiki.terraria.org/wiki/Amethyst_Staff (and other staffs). Station is `work_bench`.

```json
{ "id": "amethyst_staff_recipe", "resultItemId": "amethyst_staff", "resultQuantity": 1, "ingredients": [{ "itemId": "amethyst", "quantity": 15 }, { "itemId": "wood", "quantity": 1 }], "stationId": "work_bench" },
{ "id": "topaz_staff_recipe", "resultItemId": "topaz_staff", "resultQuantity": 1, "ingredients": [{ "itemId": "topaz", "quantity": 15 }, { "itemId": "wood", "quantity": 1 }], "stationId": "work_bench" },
{ "id": "sapphire_staff_recipe", "resultItemId": "sapphire_staff", "resultQuantity": 1, "ingredients": [{ "itemId": "sapphire", "quantity": 15 }, { "itemId": "wood", "quantity": 1 }], "stationId": "work_bench" },
{ "id": "emerald_staff_recipe", "resultItemId": "emerald_staff", "resultQuantity": 1, "ingredients": [{ "itemId": "emerald", "quantity": 15 }, { "itemId": "wood", "quantity": 1 }], "stationId": "work_bench" },
{ "id": "ruby_staff_recipe", "resultItemId": "ruby_staff", "resultQuantity": 1, "ingredients": [{ "itemId": "ruby", "quantity": 15 }, { "itemId": "wood", "quantity": 1 }], "stationId": "work_bench" },
{ "id": "diamond_staff_recipe", "resultItemId": "diamond_staff", "resultQuantity": 1, "ingredients": [{ "itemId": "diamond", "quantity": 15 }, { "itemId": "wood", "quantity": 1 }], "stationId": "work_bench" },
{ "id": "wand_of_sparking_recipe", "resultItemId": "wand_of_sparking", "resultQuantity": 1, "ingredients": [{ "itemId": "wood", "quantity": 5 }, { "itemId": "amethyst", "quantity": 1 }, { "itemId": "torch", "quantity": 3 }], "stationId": "work_bench" },
{ "id": "vilethorn_recipe", "resultItemId": "vilethorn", "resultQuantity": 1, "ingredients": [{ "itemId": "rotten_chunk", "quantity": 15 }], "stationId": "demon_altar" },
{ "id": "crimson_rod_recipe", "resultItemId": "crimson_rod", "resultQuantity": 1, "ingredients": [{ "itemId": "vertebrae", "quantity": 15 }], "stationId": "demon_altar" }
```

⚠ Verify all quantities — gem staff recipes may use iron/lead bars as well.

---

## Phase 8 — Boss Summons

**Source:**  
- https://wiki.terraria.org/wiki/Suspicious_Looking_Eye  
- https://wiki.terraria.org/wiki/Slime_Crown  
- https://wiki.terraria.org/wiki/Worm_Food  
- https://wiki.terraria.org/wiki/Bloody_Spine

Station: `demon_altar` (added in Phase 1). Raw materials needed: `lens`, `rotten_chunk`, `vertebrae`, `vile_powder`, `vicious_powder` (all added Phase 1).

### 8.1 Items (items.json)

```json
{ "id": "gold_crown", "name": "Gold Crown", "sprite": "", "tags": ["material"] },
{ "id": "suspicious_looking_eye", "name": "Suspicious Looking Eye", "sprite": "", "tags": ["summon", "consumable"] },
{ "id": "slime_crown", "name": "Slime Crown", "sprite": "", "tags": ["summon", "consumable"] },
{ "id": "worm_food", "name": "Worm Food", "sprite": "", "tags": ["summon", "consumable"] },
{ "id": "bloody_spine", "name": "Bloody Spine", "sprite": "", "tags": ["summon", "consumable"] },
{ "id": "abeemination", "name": "Abeemination", "sprite": "", "tags": ["summon", "consumable"] }
```

### 8.2 Recipes (recipes.json)

Verify exact quantities on wiki:
```json
{ "id": "gold_crown_recipe", "resultItemId": "gold_crown", "resultQuantity": 1, "ingredients": [{ "itemId": "gold_bar", "quantity": 15 }], "stationId": "iron_anvil" },
{ "id": "suspicious_looking_eye_recipe", "resultItemId": "suspicious_looking_eye", "resultQuantity": 1, "ingredients": [{ "itemId": "lens", "quantity": 6 }], "stationId": "demon_altar" },
{ "id": "slime_crown_recipe", "resultItemId": "slime_crown", "resultQuantity": 1, "ingredients": [{ "itemId": "gold_crown", "quantity": 1 }, { "itemId": "gel", "quantity": 99 }], "stationId": "demon_altar" },
{ "id": "worm_food_recipe", "resultItemId": "worm_food", "resultQuantity": 1, "ingredients": [{ "itemId": "rotten_chunk", "quantity": 15 }, { "itemId": "vile_powder", "quantity": 30 }], "stationId": "demon_altar" },
{ "id": "bloody_spine_recipe", "resultItemId": "bloody_spine", "resultQuantity": 1, "ingredients": [{ "itemId": "vertebrae", "quantity": 15 }, { "itemId": "vicious_powder", "quantity": 30 }], "stationId": "demon_altar" },
{ "id": "abeemination_recipe", "resultItemId": "abeemination", "resultQuantity": 1, "ingredients": [{ "itemId": "bottled_honey", "quantity": 5 }, { "itemId": "stinger", "quantity": 5 }, { "itemId": "beeswax", "quantity": 5 }, { "itemId": "hive", "quantity": 1 }], "stationId": "by_hand" }
```

Note: `bottled_honey` and `hive` needed for Abeemination — add as raw items if implementing Abeemination.

---

## Phase 9 — Potions Expansion

**Source:** https://wiki.terraria.org/wiki/Potions  
Station: `alchemy_table` for all potions.

### 9.1 Items to add (items.json)

```json
{ "id": "mining_potion", "name": "Mining Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "battle_potion", "name": "Battle Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "thorns_potion", "name": "Thorns Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "water_walking_potion", "name": "Water Walking Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "spelunker_potion", "name": "Spelunker Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "featherfall_potion", "name": "Featherfall Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "archery_potion", "name": "Archery Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "hunter_potion", "name": "Hunter Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "invisibility_potion", "name": "Invisibility Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "summoning_potion", "name": "Summoning Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "mana_regeneration_potion", "name": "Mana Regeneration Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "magic_power_potion", "name": "Magic Power Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "gills_potion", "name": "Gills Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "obsidian_skin_potion", "name": "Obsidian Skin Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "greater_healing_potion", "name": "Greater Healing Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "lesser_mana_potion", "name": "Lesser Mana Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "mana_potion", "name": "Mana Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "greater_mana_potion", "name": "Greater Mana Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "wrath_potion", "name": "Wrath Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "rage_potion", "name": "Rage Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "endurance_potion", "name": "Endurance Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "lifeforce_potion", "name": "Lifeforce Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "inferno_potion", "name": "Inferno Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "recall_potion", "name": "Recall Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "teleportation_potion", "name": "Teleportation Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "love_potion", "name": "Love Potion", "sprite": "", "tags": ["potion", "consumable"] },
{ "id": "stink_potion", "name": "Stink Potion", "sprite": "", "tags": ["potion", "consumable"] }
```

### 9.2 Recipes

Each potion = 1 bottled_water + 1–3 herbs at `alchemy_table`. Verify exact herb combinations at wiki.

Key patterns (from wiki):
- Mining Potion: bottled_water + blinkroot + copper_ore (or tin_ore)
- Spelunker Potion: bottled_water + blinkroot + moonglow + gold_ore (or platinum_ore)
- Featherfall Potion: bottled_water + blinkroot + deathweed + feather (raw item needed)
- Gills Potion: bottled_water + waterleaf + coral (raw item needed)
- Obsidian Skin Potion: bottled_water + waterleaf + fireblossom + obsidian_block

Add `feather` and `coral` to items.json as raw if needed:
```json
{ "id": "feather", "name": "Feather", "sprite": "", "tags": ["raw", "material"] },
{ "id": "coral", "name": "Coral", "sprite": "", "tags": ["raw", "material"] }
```

Example recipes (verify all on wiki before writing):
```json
{ "id": "mining_potion_recipe", "resultItemId": "mining_potion", "resultQuantity": 1, "ingredients": [{ "itemId": "bottled_water", "quantity": 1 }, { "itemId": "blinkroot", "quantity": 1 }, { "itemId": "copper_ore", "quantity": 1 }], "stationId": "alchemy_table" },
{ "id": "spelunker_potion_recipe", "resultItemId": "spelunker_potion", "resultQuantity": 1, "ingredients": [{ "itemId": "bottled_water", "quantity": 1 }, { "itemId": "blinkroot", "quantity": 1 }, { "itemId": "moonglow", "quantity": 1 }, { "itemId": "gold_ore", "quantity": 1 }], "stationId": "alchemy_table" },
{ "id": "battle_potion_recipe", "resultItemId": "battle_potion", "resultQuantity": 1, "ingredients": [{ "itemId": "bottled_water", "quantity": 1 }, { "itemId": "deathweed", "quantity": 1 }, { "itemId": "rotten_chunk", "quantity": 1 }], "stationId": "alchemy_table" },
{ "id": "recall_potion_recipe", "resultItemId": "recall_potion", "resultQuantity": 1, "ingredients": [{ "itemId": "bottled_water", "quantity": 1 }, { "itemId": "daybloom", "quantity": 1 }, { "itemId": "blinkroot", "quantity": 1 }, { "itemId": "moonglow", "quantity": 1 }], "stationId": "alchemy_table" }
```

Write all remaining potion recipes following the same pattern.

---

## Phase 10 — Accessories Expansion & Tinkerer Combos

**Source:** https://wiki.terraria.org/wiki/Accessories

### 10.1 New raw accessory drops (items.json)

```json
{ "id": "cloud_in_a_bottle", "name": "Cloud in a Bottle", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "blizzard_in_a_bottle", "name": "Blizzard in a Bottle", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "sandstorm_in_a_bottle", "name": "Sandstorm in a Bottle", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "tsunami_in_a_bottle", "name": "Tsunami in a Bottle", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "shiny_red_balloon", "name": "Shiny Red Balloon", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "blue_horseshoe_balloon", "name": "Blue Horseshoe Balloon", "sprite": "", "tags": ["accessory"] },
{ "id": "compass", "name": "Compass", "sprite": "", "tags": ["accessory", "info", "raw"] },
{ "id": "depth_meter", "name": "Depth Meter", "sprite": "", "tags": ["accessory", "info", "raw"] },
{ "id": "gps", "name": "GPS", "sprite": "", "tags": ["accessory", "info"] },
{ "id": "band_of_regeneration", "name": "Band of Regeneration", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "band_of_starpower", "name": "Band of Starpower", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "mana_regeneration_band", "name": "Mana Regeneration Band", "sprite": "", "tags": ["accessory"] },
{ "id": "magic_cuffs", "name": "Magic Cuffs", "sprite": "", "tags": ["accessory"] },
{ "id": "shackle", "name": "Shackle", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "feral_claws", "name": "Feral Claws", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "thorn_chakram", "name": "Thorn Chakram", "sprite": "", "tags": ["weapon", "melee"] },
{ "id": "ice_skates", "name": "Ice Skates", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "ice_skates_dunerider", "name": "Dunerider Boots", "sprite": "", "tags": ["accessory"] },
{ "id": "water_walking_boots", "name": "Water Walking Boots", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "lava_waders", "name": "Lava Waders", "sprite": "", "tags": ["accessory"] },
{ "id": "frostspark_boots", "name": "Frostspark Boots", "sprite": "", "tags": ["accessory"] },
{ "id": "lightning_boots", "name": "Lightning Boots", "sprite": "", "tags": ["accessory"] },
{ "id": "ivy_whip", "name": "Ivy Whip", "sprite": "", "tags": ["accessory"] },
{ "id": "counter_scarf", "name": "Counter Scarf", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "flesh_knuckles", "name": "Flesh Knuckles", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "pocket_mirror", "name": "Pocket Mirror", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "titan_glove", "name": "Titan Glove", "sprite": "", "tags": ["accessory", "raw"] },
{ "id": "power_glove", "name": "Power Glove", "sprite": "", "tags": ["accessory"] },
{ "id": "mechanical_glove", "name": "Mechanical Glove", "sprite": "", "tags": ["accessory"] },
{ "id": "fire_gauntlet", "name": "Fire Gauntlet", "sprite": "", "tags": ["accessory"] }
```

### 10.2 Tinkerer's Workshop combos (recipes.json)

```json
{ "id": "blue_horseshoe_balloon_recipe", "resultItemId": "blue_horseshoe_balloon", "resultQuantity": 1, "ingredients": [{ "itemId": "lucky_horseshoe", "quantity": 1 }, { "itemId": "shiny_red_balloon", "quantity": 1 }], "stationId": "tinkerers_workshop" },
{ "id": "mana_regeneration_band_recipe", "resultItemId": "mana_regeneration_band", "resultQuantity": 1, "ingredients": [{ "itemId": "band_of_regeneration", "quantity": 1 }, { "itemId": "band_of_starpower", "quantity": 1 }], "stationId": "tinkerers_workshop" },
{ "id": "gps_recipe", "resultItemId": "gps", "resultQuantity": 1, "ingredients": [{ "itemId": "compass", "quantity": 1 }, { "itemId": "depth_meter", "quantity": 1 }, { "itemId": "watch_gold", "quantity": 1 }], "stationId": "tinkerers_workshop" },
{ "id": "ivy_whip_recipe", "resultItemId": "ivy_whip", "resultQuantity": 1, "ingredients": [{ "itemId": "vine", "quantity": 3 }, { "itemId": "grappling_hook", "quantity": 1 }], "stationId": "iron_anvil" },
{ "id": "power_glove_recipe", "resultItemId": "power_glove", "resultQuantity": 1, "ingredients": [{ "itemId": "feral_claws", "quantity": 1 }, { "itemId": "titan_glove", "quantity": 1 }], "stationId": "tinkerers_workshop" }
```

⚠ Verify all ingredient combinations on wiki before writing. Tinkerer combos are notoriously exact.

---

## Phase 11 — Furniture, Tools & Crafting Stations

**Source:** https://wiki.terraria.org/wiki/Furniture, /Tools

### 11.1 New craftable stations (items.json + recipes.json)

```json
{ "id": "alchemy_table_item", "name": "Alchemy Table", "sprite": "", "tags": ["station", "furniture"] },
{ "id": "tinkerers_workshop_item", "name": "Tinkerer's Workshop", "sprite": "", "tags": ["station", "furniture"] },
{ "id": "heavy_work_bench_item", "name": "Heavy Work Bench", "sprite": "", "tags": ["station", "furniture"] },
{ "id": "keg_item", "name": "Keg", "sprite": "", "tags": ["station", "furniture"] },
{ "id": "cooking_pot_item", "name": "Cooking Pot", "sprite": "", "tags": ["station", "furniture"] },
{ "id": "crystal_ball_item", "name": "Crystal Ball", "sprite": "", "tags": ["station", "furniture"] },
{ "id": "bookcase_item", "name": "Bookcase", "sprite": "", "tags": ["station", "furniture"] }
```

Note: use `_item` suffix to avoid ID collision with existing station IDs in `stations.json`.

### 11.2 Crafting tools (pickaxes, axes, hammers)

```json
{ "id": "copper_pickaxe", "name": "Copper Pickaxe", "sprite": "", "tags": ["tool", "melee"] },
{ "id": "tin_pickaxe", "name": "Tin Pickaxe", "sprite": "", "tags": ["tool", "melee"] },
{ "id": "iron_pickaxe", "name": "Iron Pickaxe", "sprite": "", "tags": ["tool", "melee"] },
{ "id": "lead_pickaxe", "name": "Lead Pickaxe", "sprite": "", "tags": ["tool", "melee"] },
{ "id": "silver_pickaxe", "name": "Silver Pickaxe", "sprite": "", "tags": ["tool", "melee"] },
{ "id": "tungsten_pickaxe", "name": "Tungsten Pickaxe", "sprite": "", "tags": ["tool", "melee"] },
{ "id": "gold_pickaxe", "name": "Gold Pickaxe", "sprite": "", "tags": ["tool", "melee"] },
{ "id": "platinum_pickaxe", "name": "Platinum Pickaxe", "sprite": "", "tags": ["tool", "melee"] },
{ "id": "nightmare_pickaxe", "name": "Nightmare Pickaxe", "sprite": "", "tags": ["tool", "melee"] },
{ "id": "deathbringer_pickaxe", "name": "Deathbringer Pickaxe", "sprite": "", "tags": ["tool", "melee"] },
{ "id": "molten_pickaxe", "name": "Molten Pickaxe", "sprite": "", "tags": ["tool", "melee"] }
```

All pickaxes at `iron_anvil`. Nightmare uses `demonite_bar` + `shadow_scale`; Deathbringer uses `crimtane_bar` + `tissue_sample`. Verify bar counts on wiki.

### 11.3 More furniture (items.json)

```json
{ "id": "bookcase", "name": "Bookcase", "sprite": "", "tags": ["furniture"] },
{ "id": "barrel", "name": "Barrel", "sprite": "", "tags": ["furniture", "storage"] },
{ "id": "piggy_bank", "name": "Piggy Bank", "sprite": "", "tags": ["furniture", "storage"] },
{ "id": "safe", "name": "Safe", "sprite": "", "tags": ["furniture", "storage"] },
{ "id": "candelabra", "name": "Candelabra", "sprite": "", "tags": ["furniture", "light"] },
{ "id": "candle", "name": "Candle", "sprite": "", "tags": ["furniture", "light"] },
{ "id": "lamp_post", "name": "Lamp Post", "sprite": "", "tags": ["furniture", "light"] },
{ "id": "lantern", "name": "Hanging Lantern", "sprite": "", "tags": ["furniture", "light"] },
{ "id": "piano", "name": "Piano", "sprite": "", "tags": ["furniture"] },
{ "id": "grandfather_clock", "name": "Grandfather Clock", "sprite": "", "tags": ["furniture", "info"] },
{ "id": "bathtub", "name": "Bathtub", "sprite": "", "tags": ["furniture"] },
{ "id": "toilet", "name": "Toilet", "sprite": "", "tags": ["furniture"] },
{ "id": "sink", "name": "Sink", "sprite": "", "tags": ["furniture"] },
{ "id": "cauldron", "name": "Cauldron", "sprite": "", "tags": ["furniture"] },
{ "id": "wooden_dresser", "name": "Wooden Dresser", "sprite": "", "tags": ["furniture"] }
```

All crafted at `sawmill` or `work_bench`. Verify stations and material counts on wiki.

---

## Phase 12 — Final Verification

### Checklist

1. **Item count**: `jq 'length' src/data/items.json` should be ~250+ (up from 98)
2. **Recipe count**: `jq 'length' src/data/recipes.json` should be ~200+ (up from 62)
3. **Station count**: `jq 'length' src/data/stations.json` should be 17 (up from 11)
4. **Build**: `npm run build` passes with 0 TypeScript errors
5. **JSON validity**: each file parses cleanly — `node -e "require('./src/data/items.json')"` (no errors)

### Spot-checks in the running app (`npm run dev`):

| Search query | Expected recipe chain |
|---|---|
| "Molten Breastplate" | → hellstone_bar → hellstone (raw) + obsidian_block (raw) |
| "Shadow Helmet" | → demonite_bar + shadow_scale (both should show) |
| "Suspicious Looking Eye" | → lens (raw, no further chain) |
| "Necro Helmet" | → bone (raw) + cobweb (raw) |
| "GPS" | → compass (raw) + depth_meter (raw) + gold_watch → gold_bar + gold_chain |
| "Spelunker Potion" | → bottled_water + blinkroot + moonglow + gold_ore (all raw except bottled_water) |

### Anti-pattern guards (final)
- All recipe `stationId` values must exist in `stations.json` — grep check: `jq -r '.[].stationId' src/data/recipes.json | sort -u` then verify each ID exists in `stations.json`
- All recipe `ingredientId` and `resultItemId` values must exist in `items.json`: `jq -r '.[].ingredients[].itemId, .[].resultItemId' src/data/recipes.json | sort -u > /tmp/recipe_ids.txt && jq -r '.[].id' src/data/items.json | sort -u > /tmp/item_ids.txt && comm -23 /tmp/recipe_ids.txt /tmp/item_ids.txt` should return empty output
- No duplicate IDs in items.json: `jq '[.[].id] | group_by(.) | map(select(length > 1))' src/data/items.json` should return `[]`
- No duplicate IDs in recipes.json: same pattern

### Reference check
All quantities verified against https://wiki.terraria.org/wiki/ — note any discrepancies found and correct them.
