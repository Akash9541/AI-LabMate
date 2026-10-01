import React from 'react';
import { CircuitViewer } from '../components/circuit/CircuitViewer';
import { ComponentList } from '../components/circuit/ComponentList';
import { MeasurementPanel } from '../components/measurements/MeasurementPanel';
import { DiagnosticResultPanel } from '../components/diagnostics/DiagnosticResultPanel';
import { ShieldAlert } from 'lucide-react';

export const LabBenchPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-85px)] gap-3 p-3 overflow-y-auto">
      {/* Upper Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[500px]">
        {/* Left Column (8 cols): Circuit Viewer + Components + Measurements */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3">
          {/* Top: Circuit Viewer */}
          <div className="flex-1 min-h-[340px]">
            <CircuitViewer />
          </div>

          {/* Bottom Grid: Components Detected (Left) & Measurements (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[220px]">
            <ComponentList />
            <MeasurementPanel />
          </div>
        </div>

        {/* Right Column (5 cols): Diagnostic Result Instrument Box */}
        <div className="lg:col-span-5 xl:col-span-4 h-full min-h-[500px]">
          <DiagnosticResultPanel />
        </div>
      </div>

      {/* Safety Disclaimer Footer */}
      <div className="bg-[#0b0f17] border border-[#1d2738] rounded px-3 py-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-amber-400">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>
            <strong>SAFETY DISCLAIMER:</strong> For educational low-voltage electronics only (5V/12V Arduino/ESP32 breadboards). Verify all recommendations with appropriate laboratory instruments.
          </span>
        </div>
        <span className="hidden md:inline text-slate-500">
          SNAPDRAGON AI LAB CHALLENGE 2026
        </span>
      </div>
    </div>
  );
};
