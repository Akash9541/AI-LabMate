import React from 'react';
import { useLabStore } from '../../stores/useLabStore';
import { Cpu, WifiOff, RefreshCw, Zap, PlayCircle, AlertTriangle, Activity } from 'lucide-react';
import { DEMO_SCENARIOS } from '../../demo/scenarios';

export const TopBar: React.FC = () => {
  const { 
    deviceTelemetry, 
    activeDemoId, 
    loadDemoScenario, 
    resetToCustom, 
    runDiagnostic, 
    isDiagnosing,
    addLog
  } = useLabStore();

  return (
    <header className="bg-[#090c12] border-b border-[#1d2738] px-4 py-2 text-slate-200 select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0f1522] px-3 py-1.5 rounded border border-[#1d2d47]">
            <div className="relative flex items-center justify-center w-5 h-5">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
            </div>
            <span className="font-bold tracking-wider text-cyan-400 text-sm font-mono">AI LABMATE</span>
            <span className="text-[10px] text-slate-400 bg-[#162032] px-1.5 py-0.5 rounded font-mono border border-[#23334d]">
              LOCAL-FIRST
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#0c1017] px-2.5 py-1 rounded border border-[#182234]">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>DEVICE:</span>
            <span className="text-amber-300 font-semibold">{deviceTelemetry.device_name}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${deviceTelemetry.npu_active ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80' : 'text-amber-300 bg-amber-950/60 border-amber-800/80'}`}>
              ● {deviceTelemetry.npu_active ? 'NPU AVAILABLE' : 'ACCELERATOR UNAVAILABLE'}
            </span>
          </div>
        </div>

        {/* Center Demo Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-mono text-slate-400 hidden xl:inline-block mr-1">
            DEMO PRESETS:
          </span>
          {DEMO_SCENARIOS.map((demo) => {
            const isActive = activeDemoId === demo.id;
            return (
              <button
                key={demo.id}
                onClick={() => loadDemoScenario(demo.id)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-mono transition-all border ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500/80 text-amber-300 shadow-[0_0_10px_rgba(255,176,0,0.2)]'
                    : 'bg-[#0f141d] border-[#1d2738] text-slate-300 hover:bg-[#162030] hover:border-slate-600'
                }`}
              >
                <PlayCircle className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{demo.title.split(':')[0]}</span>
              </button>
            );
          })}
          <button
            onClick={resetToCustom}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded font-mono bg-[#0f141d] border border-[#1d2738] text-slate-400 hover:text-slate-200 hover:bg-[#162030]"
            title="Reset workbench to empty state"
          >
            <RefreshCw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>

        {/* Right Status Indicators */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => runDiagnostic()}
            disabled={isDiagnosing}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded text-xs font-mono shadow-[0_0_12px_rgba(255,176,0,0.3)] transition-all disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin' : ''}`} />
            <span>{isDiagnosing ? 'ANALYZING...' : 'RUN DIAGNOSTIC'}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 px-2.5 py-1 rounded text-xs font-mono">
            <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">OFFLINE READY</span>
          </div>
        </div>
      </div>
    </header>
  );
};
