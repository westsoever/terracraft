import { useMemo } from 'react';
import { ReactFlow, Controls, Background, BackgroundVariant } from '@xyflow/react';
import type { NodeTypes } from '@xyflow/react';
import { useRecipeTree } from '@/hooks/useRecipeTree';
import { useAppStore } from '@/store/useAppStore';
import { buildGraphFromTree } from '@/lib/graphLayout';
import { ItemNode } from './ItemNode';

const nodeTypes: NodeTypes = { itemNode: ItemNode as NodeTypes[string] };

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
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        key={`${selectedItemId}-${quantity}`}
        defaultNodes={nodes}
        defaultEdges={edges}
        nodeTypes={nodeTypes}
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
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#2a2a4c"
          style={{ background: 'var(--bg-deep)' }}
        />
      </ReactFlow>
    </div>
  );
}
