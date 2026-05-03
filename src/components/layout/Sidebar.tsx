import { useAppStore } from '@/store/useAppStore';
import { useSearch } from '@/hooks/useSearch';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterBar } from '@/components/search/FilterBar';
import { ItemCard } from '@/components/search/ItemCard';

export function Sidebar() {
  const selectedItemId = useAppStore((s) => s.selectedItemId);
  const setSelectedItemId = useAppStore((s) => s.setSelectedItemId);
  const { results } = useSearch();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">⛏ TERRACRAFT</div>
        <SearchBar />
        <FilterBar />
      </div>
      <div className="sidebar-results">
        <div className="result-count">{results.length} items</div>
        {results.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            isSelected={item.id === selectedItemId}
            onClick={() => setSelectedItemId(item.id)}
          />
        ))}
      </div>
    </aside>
  );
}
