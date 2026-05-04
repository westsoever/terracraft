import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react';
import { stationById } from '@/lib/recipeIndex';
import { assetUrl } from '@/lib/assetUrl';

export function StationEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const stationId = data?.stationId as string | undefined;
  const station = stationId ? stationById.get(stationId) : undefined;

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {station && (
        <EdgeLabelRenderer>
          <div
            className="station-edge-label"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
            }}
          >
            {station.sprite && (
              <img
                src={assetUrl(station.sprite)}
                alt={station.name}
                className="station-edge-img"
              />
            )}
            <span>{station.name}</span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
