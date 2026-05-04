import dagre from '@dagrejs/dagre';
import { MarkerType, type Edge, type Node } from '@xyflow/react';
import type { ItemNodeData, RecipeTreeNode } from '@/types/terraria';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 90;

export function buildGraphFromTree(treeRoot: RecipeTreeNode): {
  nodes: Node<ItemNodeData>[];
  edges: Edge[];
} {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'RL', nodesep: 40, ranksep: 120, marginx: 20, marginy: 20 });
  g.setDefaultEdgeLabel(() => ({}));

  const nodes: Node<ItemNodeData>[] = [];
  const edges: Edge[] = [];

  function traverse(node: RecipeTreeNode, parentNodeId: string | null) {
    const nodeId = node.nodeKey;
    const stationId = node.recipeUsed?.stationId ?? '';

    g.setNode(nodeId, { width: NODE_WIDTH, height: NODE_HEIGHT });

    nodes.push({
      id: nodeId,
      type: 'itemNode',
      position: { x: 0, y: 0 },
      data: {
        item: node.item,
        quantityNeeded: node.quantityNeeded,
        stationId,
        isRaw: node.recipeUsed === null && !node.isCycleBreaker,
        isCycleBreaker: node.isCycleBreaker,
      },
    });

    if (parentNodeId !== null) {
      const edgeId = `${parentNodeId}->${nodeId}`;
      g.setEdge(parentNodeId, nodeId);
      edges.push({
        id: edgeId,
        source: nodeId,
        target: parentNodeId,
        type: 'stationEdge',
        data: { stationId },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#c8a84b' },
        style: { stroke: '#c8a84b', strokeWidth: 1.5 },
      });
    }

    for (const child of node.children) {
      traverse(child, nodeId);
    }
  }

  traverse(treeRoot, null);
  dagre.layout(g);

  for (const node of nodes) {
    const dagreNode = g.node(node.id);
    node.position = {
      x: dagreNode.x - NODE_WIDTH / 2,
      y: dagreNode.y - NODE_HEIGHT / 2,
    };
  }

  return { nodes, edges };
}
