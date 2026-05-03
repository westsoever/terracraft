import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import type { ItemNodeData } from '@/types/terraria';
import { stationById } from '@/lib/recipeIndex';

export type ItemNodeType = Node<ItemNodeData>;

export const ItemNode = memo(function ItemNode({ data }: NodeProps<ItemNodeType>) {
  const stationName = stationById.get(data.stationId)?.name ?? '';

  return (
    <div className={`item-node${data.isRaw ? ' raw' : ''}${data.isCycleBreaker ? ' cycle' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#c8a84b', width: 8, height: 8 }}
      />

      <div className="item-node-top">
        <div className="t-slot" style={{ width: 32, height: 32 }}>
          {data.item.sprite ? (
            <img src={data.item.sprite} alt={data.item.name} />
          ) : (
            <div className="t-slot-placeholder" />
          )}
        </div>
        <div className="item-node-name">{data.item.name}</div>
      </div>

      <div className="item-node-bottom">
        <span className="item-node-qty">×{data.quantityNeeded}</span>
        {stationName && !data.isRaw && <span className="t-badge dim">{stationName}</span>}
        {data.isRaw && <span className="t-badge green">RAW</span>}
        {data.isCycleBreaker && <span className="t-badge red">CYCLE</span>}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#c8a84b', width: 8, height: 8 }}
      />
    </div>
  );
});
