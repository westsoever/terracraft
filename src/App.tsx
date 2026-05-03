import { Sidebar } from '@/components/layout/Sidebar';
import { MainPanel } from '@/components/layout/MainPanel';

export function App() {
  return (
    <div className="app-root">
      <Sidebar />
      <MainPanel />
    </div>
  );
}
