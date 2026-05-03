# Plan: Graph-Centric Rework

**Date:** 2026-05-03
**Repo:** /Users/lyo/aiw/terracraft
**Stack:** React 18 + TypeScript + Vite, `@xyflow/react` v12.3.6, `@dagrejs/dagre` v1.1.4, Zustand v5, Fuse.js v7.

## Goal

Collapse the three-tab UI (Tree / Graph / Shopping) into a single Graph view with an integrated shopping panel and inventory checkboxes. Sidebar search excludes raw (uncraftable) items. Flow direction switches to left → right with the target item anchored at the right edge. Background dot grid removed; edges terminate cleanly at node borders.

---

## Phase 0 — Documentation Discovery

**Read before touching code.** Confirm exact API surface for the libraries below; do not invent fields/methods.

### 0.1 React Flow (`@xyflow/react` v12)
Required references:
- `ReactFlow` props: confirm `proOptions`, `fitView`, `nodesDraggable`, `nodesConnectable`, `elementsSelectable`, the absence/removal of `<Background>` is supported (it is optional — simply do not render it).
- `Handle` component: `position` enum (`Position.Left`, `Position.Right`, `Position.Top`, `Position.Bottom`), `type: 'source' | 'target'`. Verify default arrow rendering attaches at handle location → moving handles to Left/Right is sufficient to make arrows hit the node border horizontally.
- Edge `markerEnd: { type: MarkerType.ArrowClosed }` already used — keep.
- Node data is typed via the `Node<TData>` generic; current code uses `Node<ItemNodeData>` and `NodeProps<ItemNodeType>` — preserve that pattern.

Anti-patterns:
- Do **not** call `setEdges`/`setNodes` from a hook the Graph file does not currently import.
- Do **not** use `defaultEdgeOptions.type='smoothstep'` unless we actually want curved routing — current code uses the default straight edges, keep that.
- Do not add `<Background>`.

Source: existing `src/components/graph/RecipeGraph.tsx`, `src/components/graph/ItemNode.tsx`, `src/lib/graphLayout.ts`.

### 0.2 Dagre (`@dagrejs/dagre` v1)
Required references:
- `g.setGraph({ rankdir, nodesep, ranksep, marginx, marginy })`. To get left-to-right flow with the *root on the right*, set `rankdir: 'RL'` (Right-to-Left): dagre then places ranks with rank 0 (root) on the right and deeper ranks on the left, while edges still point root → child (which visually flows right → left). To make arrows visually flow ingredients → product (left → right), reverse edge direction in `g.setEdge(child, parent)` AND reverse the React Flow edge `source`/`target`.
- Alternative: `rankdir: 'LR'` and invert tree-traversal so leaves rank on the left. Easier: keep `rankdir: 'LR'` but call `g.setEdge(childId, parentId)` so dagre treats children as predecessors of the parent → leaves end up on the left, root on the right. Verify by reading dagre docs / a small node graph test.

Pick **one** approach in Phase 3 and commit to it; do not ship both.

Source: `node_modules/@dagrejs/dagre/README.md` and `src/lib/graphLayout.ts`.

### 0.3 Project state shape (Zustand)
Current store: `src/store/useAppStore.ts`. Confirm before editing:
- `activeTab: 'tree' | 'graph' | 'shopping'` exists today.
- `recipeSelections: Map`, `collapsedNodes: Set` exist; `collapsedNodes` is tree-only.
- No `haveItems` / inventory field exists yet — to be added.

### 0.4 Data
- `src/data/items.json`, `recipes.json`, `stations.json`. `recipesByResultId` map already built in `src/lib/recipeIndex.ts`. A "craftable" item is any item that appears as a key in `recipesByResultId`.

### Allowed-API summary (cite when implementing)
| API | Source | Use |
|---|---|---|
| `Position.Left`, `Position.Right` | `@xyflow/react` exports already used in `ItemNode.tsx` | swap handle sides |
| `MarkerType.ArrowClosed` | already used in `graphLayout.ts:48` | unchanged |
| `g.setGraph({ rankdir: 'LR' })` | dagre README | layout direction |
| `recipesByResultId.has(itemId)` | `src/lib/recipeIndex.ts:13` | filter craftable items |
| Zustand `set((state) => ...)` | already used in `useAppStore.ts` | new `haveItems` actions |

---

## Phase 1 — Remove Tree View and Shopping Tab

**Files to delete:**
- `src/components/tree/RecipeTreeView.tsx`
- `src/components/tree/TreeNode.tsx`
- `src/components/tree/AlternateRecipePicker.tsx`
- `src/components/shopping/ShoppingList.tsx`
- `src/components/shopping/ShoppingRow.tsx`
- `src/components/tree/` and `src/components/shopping/` directories (empty after deletion)

**Files to edit:**
- `src/components/layout/MainPanel.tsx` — remove tab bar, all `activeTab` branching, render `<RecipeGraph />` directly when an item is selected.
- `src/store/useAppStore.ts` — remove `activeTab`, `setActiveTab`, `collapsedNodes`, `toggleNodeCollapsed` from interface, initial state, and actions. Keep `recipeSelections` (graph also uses it for alternate recipes — verify before deleting).
- `src/index.css` — delete the `/* ── Tree view ──────── */` block (lines 313–371) and `/* ── Shopping list ───── */` block (lines 373–397). Leave React Flow / item-node styles intact.

**Keep:**
- `src/lib/shoppingList.ts` — the `computeShoppingList` function is reused in Phase 4 for the inline shopping panel. Do not delete.
- `src/hooks/useRecipeTree.ts` — still produces the tree the graph layout consumes. Keep.

**Verification checklist:**
- `rg "activeTab|RecipeTreeView|ShoppingList|TreeNode|AlternateRecipePicker|collapsedNodes" src/` returns zero hits except in `shoppingList.ts` and the new graph panel.
- `rg "import.*tree/" src/` and `rg "import.*shopping/" src/` return zero hits (the `.ts` lib file is `src/lib/shoppingList.ts`, not under `components/shopping/`).
- `npm run build` passes.

**Anti-pattern guards:**
- Do not leave the `'shopping'` literal in the `activeTab` union and just stop rendering it — fully remove the field.
- Do not delete `src/lib/shoppingList.ts` — re-read this plan if tempted.

---

## Phase 2 — Sidebar: filter to craftable items only

**File:** `src/hooks/useSearch.ts`

**Change:** before any other filter, restrict the base set to items present in `recipesByResultId`. Pull `recipesByResultId` from `src/lib/recipeIndex.ts` (already imported in this file).

```ts
// pseudo-diff
const craftableItems = useMemo(
  () => allItems.filter((i) => recipesByResultId.has(i.id)),
  [],
);
// then use craftableItems in place of allItems for both the empty-query
// path AND the Fuse.search path (build a separate Fuse index over
// craftableItems, OR post-filter the Fuse results with .has()).
```

**Decision point:** rebuild a new Fuse index over craftable items (cleaner), or post-filter the existing index (less code). Prefer **post-filter** — `itemSearchIndex.search(q).filter(r => recipesByResultId.has(r.item.id))` — to avoid duplicating the index build.

**Verification:**
- Open the app, sidebar should no longer list raw materials (e.g., "Wood", "Stone", "Iron Ore" if those have no recipe). Spot-check 3 items that you *expect* to be raw and confirm they vanish.
- `result-count` updates accordingly.
- Items that *are* craftable (e.g., "Wooden Sword") still appear.

**Anti-pattern guards:**
- Don't filter at the `Sidebar.tsx` level — keep the logic in `useSearch.ts` so the count badge stays correct.
- Don't add a new `tags`-based heuristic for "raw"; the data source is `recipesByResultId`.

---

## Phase 3 — Graph layout: left-to-right, root on right, no background dots

### 3.1 Layout direction (`src/lib/graphLayout.ts`)

Change `rankdir: 'TB'` → `rankdir: 'LR'`. Then choose ONE of:

**Option A (preferred):** swap edge direction in dagre only.
- Replace `g.setEdge(parentNodeId, nodeId)` with `g.setEdge(nodeId, parentNodeId)`.
- Keep React Flow edge `source: parentNodeId, target: nodeId` UNCHANGED — the visual arrow still flows root → ingredient on screen, but with `rankdir: 'LR'` and reversed dagre edges, the root ends up on the right side of the layout. Wait — verify this experimentally; it may instead place root on the left.
- If it yields root on the left, switch to: `rankdir: 'LR'`, dagre edge `parent → child` (original), and reverse React Flow edge to `source: child, target: parent` so the arrow visually points from ingredient (left) into product (right). This is the cleaner mental model: arrows = "flows into".

**Pick Option A's second variant** (rankdir LR, dagre parent→child, RF edge child→parent, marker on the parent end) — it matches the user's description "item flow should be left to right" with the arrow pointing toward the final product on the right.

Concrete edit:
```ts
g.setGraph({ rankdir: 'LR', nodesep: 30, ranksep: 100, marginx: 20, marginy: 20 });
// ...
g.setEdge(parentNodeId, nodeId); // unchanged for dagre
edges.push({
  id: edgeId,
  source: nodeId,            // child (ingredient) on the left
  target: parentNodeId,      // parent (product) on the right
  // markerEnd unchanged
  ...
});
```

Adjust `NODE_WIDTH`/`NODE_HEIGHT` if needed once handles move (Phase 3.3).

### 3.2 Remove background dots (`src/components/graph/RecipeGraph.tsx`)

Delete the `<Background variant={BackgroundVariant.Dots} ... />` element entirely. Drop the `Background, BackgroundVariant` imports. Keep `<Controls />`. Set the parent `<div>` background via inline style to `var(--bg-deep)` so the canvas area is still themed.

### 3.3 Move handles to sides (`src/components/graph/ItemNode.tsx`)

- Top handle (`type="target"`, `Position.Top`) → `Position.Right` (this node is the *target* of incoming edges from its ingredients only when treated as the parent; with the Phase 3.1 edge-flip the parent node is the **target** and ingredients are **source**, so target handle goes on the **left** of the parent — but the same node is *also* a child of its own parent, so it also needs a source handle on the right).

Final mapping (re-derive after Phase 3.1 is implemented and visually confirmed):
- `target` handle (incoming arrow lands here) → `Position.Left`
- `source` handle (outgoing arrow leaves here) → `Position.Right`

Update handle `style` size if needed; arrows will hit the colored node border directly because handles align with the border edges.

### Verification
- Open the app, select a multi-step item (e.g., something requiring Wooden Sword + ingots).
- Visually confirm: target item is on the rightmost rank; ingredients flow leftward from there; arrows run horizontally; no dotted background; arrows terminate at node edges (no visible "dot" stub).
- `npm run build` passes.

### Anti-pattern guards
- Do not keep `BackgroundVariant.Dots` and merely change its `color` to transparent. Remove the component.
- Do not set handle `style={{ opacity: 0 }}` to "hide the dots" — that hides the arrow terminus too. Move the handles to Left/Right; their default 8×8 markers sitting on the gold border are visually clean.
- Do not introduce smoothstep edges to "make it look nicer" without user approval.

---

## Phase 4 — Inventory checkboxes + integrated shopping panel

### 4.1 Store: `haveItems` set
Add to `src/store/useAppStore.ts`:
```ts
haveItems: Set<string>; // set of itemIds the user already has
toggleHaveItem: (itemId: string) => void;
clearHaveItems: () => void; // also call from setSelectedItemId
```
Initialize as empty `Set`. In `setSelectedItemId`, reset `haveItems` to a fresh empty set (same pattern as `recipeSelections` reset).

### 4.2 Node: checkbox on each item

`src/components/graph/ItemNode.tsx` and `src/lib/graphLayout.ts`:
- Pass `haveItems.has(itemId)` and `toggleHaveItem` to each node. Two options:
  - (a) Read the store directly inside `ItemNode` via `useAppStore`. Cleaner — keeps `ItemNodeData` static.
  - (b) Pipe it through `data`. Uglier; rebuilds graph on every toggle.
- Use **(a)**: inside `ItemNode`, `const have = useAppStore(s => s.haveItems.has(data.item.id))` and `const toggle = useAppStore(s => s.toggleHaveItem)`. Render a `<input type="checkbox">` in the node footer.
- Add a `.have` CSS class that reduces opacity / desaturates the node when checked.

### 4.3 Inline shopping panel (right-side overlay)

New file: `src/components/graph/ShoppingPanel.tsx`. Layout:
- Absolutely positioned panel inside the graph container, right edge, ~260px wide, scrollable. Width reserved by the graph wrapper so React Flow doesn't render under it (use a flex row: graph fills, panel is fixed-width sibling).
- Title: "Materials needed" + count badge.
- Body: list rows similar to old `ShoppingRow`. Each row: sprite, name, "needed × N" and "have × M" where M comes from `haveItems` (treat checkbox as "have full quantity" — see 4.4).
- Items the user *has* (checked) are dimmed and moved to the bottom OR struck through.

### 4.4 What "I have this" means

**Decision needed before implementing — flag for user:** does ticking a node mean "I have *enough* of this for the entire recipe" (binary), or do we need a per-item quantity input? For MVP, implement **binary**: a checked node is treated as fully satisfied; the shopping list excludes it and its sub-tree from the materials roll-up.

### 4.5 Materials roll-up

Reuse `computeShoppingList(treeRoot)` from `src/lib/shoppingList.ts`, then post-filter:
```ts
const visibleMaterials = shoppingList.filter(e => !haveItems.has(e.itemId));
```
Plus: if a non-leaf node is checked, its sub-tree should not contribute. Modify `accumulate` in `shoppingList.ts` to accept `haveItems` and short-circuit a sub-tree when the current node is in `haveItems`:
```ts
function accumulate(node, acc, haveItems) {
  if (haveItems.has(node.itemId)) return; // satisfied — skip whole sub-tree
  if (node.children.length === 0) {
    acc.set(node.itemId, (acc.get(node.itemId) ?? 0) + node.quantityNeeded);
    return;
  }
  for (const child of node.children) accumulate(child, acc, haveItems);
}
```
Pass `haveItems` from `useRecipeTree` (read it from the store, add to `useMemo` deps).

### 4.6 Verification

- Tick a leaf material → it disappears from the right panel.
- Tick a mid-tree node → that node's sub-tree contribution is removed from totals.
- Untick → totals restore.
- Quantity stepper still works and updates totals.
- No console warnings about Map/Set identity (Zustand v5 needs new instances for Set updates — confirm `toggleHaveItem` returns `new Set(state.haveItems)`).

### Anti-pattern guards
- Do not store `haveItems` in component state — must persist across node remounts during dagre relayout.
- Do not mutate the `Set` in place; always `new Set(prev)` for Zustand to detect change.
- Do not hardcode the panel width inside `RecipeGraph.tsx`; use a CSS class so it can be tuned in `index.css`.

---

## Phase 5 — Verification & cleanup

1. `rg "tree|Tree|shopping/Sho" src/components` should match only the new `ShoppingPanel`.
2. `rg "BackgroundVariant|<Background" src/` returns zero matches.
3. `rg "activeTab|collapsedNodes" src/` returns zero matches.
4. `rg "rankdir: 'TB'" src/` returns zero matches; `rg "rankdir: 'LR'" src/` returns one.
5. `npm run build` succeeds (TypeScript strict + Vite).
6. `npm run dev` — manual smoke test:
   - Sidebar: search "wood" — no raw "Wood" item; only craftable wood items appear.
   - Select a craftable item → graph renders left-to-right, target on right, no dotted bg, edges hit borders.
   - Tick a node → right-side material panel updates.
   - Increase quantity → totals scale.
7. Commit. Suggested message: `Collapse to single graph view with inventory tracking`.

---

## Open questions to surface to the user before/after Phase 4

- "I have this" — binary checkbox vs. per-item quantity input? (Plan assumes binary MVP.)
  Answer: Binary checkbox 
- When a parent node is checked, should it visually hide its children in the graph, or just dim them and exclude from totals? (Plan: dim + exclude only.)
  Anser: Only dim them and exclude from totals
- Persist `haveItems` across page reloads (localStorage) or treat as session-only? (Plan: session-only for MVP.)
  Answer: Treat for session-only. I would like to add a "worlds" option where you can track your terraria progress but for now it's not necessary.
