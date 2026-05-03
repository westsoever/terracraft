import { useAppStore } from '@/store/useAppStore';
import { allStations } from '@/lib/recipeIndex';

export function FilterBar() {
  const stationFilter = useAppStore((s) => s.stationFilter);
  const setStationFilter = useAppStore((s) => s.setStationFilter);

  return (
    <div className="filter-bar">
      <span className="filter-label">Station:</span>
      <div className="filter-select-wrap">
        <select
          className="t-select"
          value={stationFilter}
          onChange={(e) => setStationFilter(e.target.value)}
        >
          <option value="">All</option>
          {allStations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
