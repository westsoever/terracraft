import { useMemo } from 'react';
import { ReactFlow, Controls } from '@xyflow/react';
import type { NodeTypes, EdgeTypes } from '@xyflow/react';
import { useRecipeTree } from '@/hooks/useRecipeTree';
import { useAppStore } from '@/store/useAppStore';
import { buildGraphFromTree } from '@/lib/graphLayout';
import { ItemNode } from './ItemNode';
import { StationEdge } from './StationEdge';
import { ShoppingPanel } from './ShoppingPanel';

const nodeTypes: NodeTypes = { itemNode: ItemNode as NodeTypes[string] };
const edgeTypes: EdgeTypes = { stationEdge: StationEdge as EdgeTypes[string] };

export function RecipeGraph() {
  const { treeRoot } = useRecipeTree();
  const selectedItemId = useAppStore((s) => s.selectedItemId);
  const quantity = useAppStore((s) => s.quantity);

  const { nodes, edges } = useMemo(() => {
    if (!treeRoot) return { nodes: [], edges: [] };
    return buildGraphFromTree(treeRoot);
  }, [treeRoot]);

  if (!treeRoot) return null;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <ReactFlow
          key={`${selectedItemId}-${quantity}`}
          defaultNodes={nodes}
          defaultEdges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable={false}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
        </ReactFlow>
      </div>
      <ShoppingPanel />
    </div>
  );
}
