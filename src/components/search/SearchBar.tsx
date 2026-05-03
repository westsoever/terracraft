import { useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function SearchBar() {
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSearchQuery(val), 150);
    },
    [setSearchQuery],
  );

  return (
    <input
      className="t-input"
      type="text"
      placeholder="Search items..."
      onChange={handleChange}
      spellCheck={false}
      autoComplete="off"
    />
  );
}
