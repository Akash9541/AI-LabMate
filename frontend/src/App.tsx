import React from 'react';
import { useLabStore } from './stores/useLabStore';
import { TopBar } from './components/layout/TopBar';
import { NavigationTabs } from './components/layout/NavigationTabs';
import { LabBenchPage } from './pages/LabBenchPage';
import { SchematicComparisonPanel } from './components/schematic/SchematicComparisonPanel';
import { LabManualViewer } from './components/documents/LabManualViewer';
import { DeviceRuntimePage } from './components/device/DeviceRuntimePage';

export const App: React.FC = () => {
  const { activeTab } = useLabStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#07090c] text-slate-200 scanline select-none font-mono">
      <TopBar />
      <NavigationTabs />

      <main className="flex-1 overflow-hidden p-2">
        {activeTab === 'bench' && <LabBenchPage />}
        {activeTab === 'schematic' && (
          <div className="h-[calc(100vh-90px)] p-2">
            <SchematicComparisonPanel />
          </div>
        )}
        {activeTab === 'documents' && (
          <div className="h-[calc(100vh-90px)] p-2">
            <LabManualViewer />
          </div>
        )}
        {activeTab === 'device' && (
          <div className="h-[calc(100vh-90px)] p-2 overflow-y-auto">
            <DeviceRuntimePage />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
