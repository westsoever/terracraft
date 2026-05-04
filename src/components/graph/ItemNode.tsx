import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import type { ItemNodeData } from '@/types/terraria';
import { useAppStore } from '@/store/useAppStore';
import { assetUrl } from '@/lib/assetUrl';

export type ItemNodeType = Node<ItemNodeData>;

export const ItemNode = memo(function ItemNode({ data }: NodeProps<ItemNodeType>) {
  const have = useAppStore((s) => s.haveItems.has(data.item.id));
  const toggleHaveItem = useAppStore((s) => s.toggleHaveItem);

  return (
    <div className={`item-node${data.isRaw ? ' raw' : ''}${data.isCycleBreaker ? ' cycle' : ''}${have ? ' have' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#c8a84b', width: 8, height: 8 }}
      />

      <label className="item-node-check" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={have}
          onChange={() => toggleHaveItem(data.item.id)}
        />
      </label>

      <div className="item-node-top">
        <div className="t-slot" style={{ width: 48, height: 48 }}>
          {data.item.sprite ? (
            <img src={assetUrl(data.item.sprite)} alt={data.item.name} />
          ) : (
            <div className="t-slot-placeholder" />
          )}
        </div>
        <div className="item-node-name">{data.item.name}</div>
      </div>

      <div className="item-node-bottom">
        <span className="item-node-qty">×{data.quantityNeeded}</span>
        {data.isRaw && <span className="t-badge green">RAW</span>}
        {data.isCycleBreaker && <span className="t-badge red">CYCLE</span>}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#c8a84b', width: 8, height: 8 }}
      />
    </div>
  );
});
