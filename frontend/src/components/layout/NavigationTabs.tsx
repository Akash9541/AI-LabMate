import React from 'react';
import { useLabStore } from '../../stores/useLabStore';
import { LayoutGrid, GitCompare, FileText, Cpu } from 'lucide-react';

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, deviceTelemetry } = useLabStore();

  const tabs = [
    { id: 'bench', label: 'LAB BENCH 01', icon: LayoutGrid, desc: 'Main Diagnostic Workstation' },
    { id: 'schematic', label: 'SCHEMATIC COMPARE', icon: GitCompare, desc: 'Reference vs Observed Netlist' },
    { id: 'documents', label: 'LAB DOCUMENTS', icon: FileText, desc: 'Local PDF Manuals & RAG' },
    { id: 'device', label: 'DEVICE & HARDWARE', icon: Cpu, desc: 'Snapdragon NPU Telemetry' },
  ] as const;

  return (
    <div className="bg-[#090d14] border-b border-[#1c2637] px-4 pt-1 flex items-center justify-between text-xs font-mono select-none">
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-t-2 transition-all rounded-t ${
                isActive
                  ? 'border-cyan-400 bg-[#0f141d] text-cyan-300 font-bold shadow-[inset_0_1px_0_0_rgba(0,229,255,0.2)]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0c1017]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 py-1">
        <span className={`w-2 h-2 rounded-full ${deviceTelemetry.npu_active ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        <span>SYSTEM STATUS: <strong className={deviceTelemetry.npu_active ? 'text-emerald-300' : 'text-amber-300'}>{deviceTelemetry.npu_active ? 'LOCAL NPU READY' : 'DEMO / FALLBACK MODE'}</strong></span>
      </div>
    </div>
  );
};
