import React, { useEffect } from 'react';
import { useLabStore } from '../../stores/useLabStore';
import { Cpu, Activity, ShieldCheck, Zap, HardDrive, Server, Layers, Terminal } from 'lucide-react';

export const DeviceRuntimePage: React.FC = () => {
  const { deviceTelemetry, activityLogs, updateDeviceTelemetry, addLog } = useLabStore();

  useEffect(() => {
    fetch('/api/device')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(String(response.status))))
      .then((telemetry) => updateDeviceTelemetry(telemetry))
      .catch(() => addLog('Device telemetry API unavailable; showing no inferred accelerator state', 'warn'));
  }, [addLog, updateDeviceTelemetry]);

  return (
    <div className="bg-[#0f141d] border border-[#1d2738] rounded-lg p-5 flex flex-col h-full shadow-[0_4px_16px_rgba(0,0,0,0.5)] font-mono space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1d2738]">
        <div className="flex items-center gap-3">
          <Cpu className="w-6 h-6 text-amber-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            DEVICE & LOCAL AI RUNTIME
            </h2>
            <p className="text-[11px] text-slate-400">
              Hardware and runtime capabilities detected on this machine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${deviceTelemetry.npu_active ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <span className={`text-xs font-bold px-3 py-1 rounded border ${deviceTelemetry.npu_active ? 'text-emerald-300 bg-emerald-950/60 border-emerald-800' : 'text-amber-300 bg-amber-950/60 border-amber-800'}`}>
            {deviceTelemetry.npu_active ? 'NPU AVAILABLE' : 'FALLBACK MODE'}
          </span>
        </div>
      </div>

      {/* Main Grid: Device Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Device & Platform Card */}
        <div className="bg-[#070a0f] p-4 rounded border border-[#1d2738] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 border-b border-[#182334] pb-2">
            <Server className="w-4 h-4" />
            <span>HARDWARE ARCHITECTURE</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">DEVICE</span>
              <span className="text-slate-200 font-bold">{deviceTelemetry.device_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">PROCESSOR</span>
              <span className="text-amber-300 font-bold">{deviceTelemetry.processor}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ACCELERATOR BACKEND</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 inline-block mt-0.5">
                {deviceTelemetry.accelerator} // {deviceTelemetry.ai_runtime}
              </span>
            </div>
          </div>
        </div>

        {/* AI Models Loaded */}
        <div className="bg-[#070a0f] p-4 rounded border border-[#1d2738] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 border-b border-[#182334] pb-2">
            <Layers className="w-4 h-4" />
            <span>LOADED LOCAL AI MODELS</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">VISION-LANGUAGE MODEL</span>
              <span className="text-cyan-300 font-bold">{deviceTelemetry.vision_model}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">REASONING MODEL</span>
              <span className="text-cyan-300 font-bold">{deviceTelemetry.reasoning_model}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">SPEECH RECOGNITION</span>
              <span className="text-cyan-300 font-bold">{deviceTelemetry.speech_model}</span>
            </div>
          </div>
        </div>

        {/* Runtime Performance Telemetry */}
        <div className="bg-[#070a0f] p-4 rounded border border-[#1d2738] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 border-b border-[#182334] pb-2">
            <Activity className="w-4 h-4" />
            <span>INFERENCE TELEMETRY</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#0e1420] p-2 rounded border border-[#1b273b]">
              <span className="text-[10px] text-slate-400 block">INFERENCE LATENCY</span>
              <span className="text-amber-400 font-bold text-sm">
                {deviceTelemetry.last_inference_ms ? `${deviceTelemetry.last_inference_ms} ms` : 'UNAVAILABLE'}
              </span>
            </div>
            <div className="bg-[#0e1420] p-2 rounded border border-[#1b273b]">
              <span className="text-[10px] text-slate-400 block">PROCESS MEMORY</span>
              <span className="text-cyan-400 font-bold text-sm">
                {deviceTelemetry.memory_used_mb ? `${deviceTelemetry.memory_used_mb} MB` : 'UNAVAILABLE'}
              </span>
            </div>
            <div className="bg-[#0e1420] p-2 rounded border border-[#1b273b]">
              <span className="text-[10px] text-slate-400 block">CPU UTILIZATION</span>
              <span className="text-emerald-400 font-bold text-sm">
                {deviceTelemetry.cpu_percent !== undefined ? `${deviceTelemetry.cpu_percent}%` : 'UNAVAILABLE'}
              </span>
            </div>
            <div className="bg-[#0e1420] p-2 rounded border border-[#1b273b]">
              <span className="text-[10px] text-slate-400 block">NETWORK STATUS</span>
              <span className="text-emerald-300 font-bold text-xs">
                {deviceTelemetry.network_status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* System Terminal Activity Log */}
      <div className="bg-[#070a0f] p-4 rounded border border-[#1d2738] flex-1 flex flex-col min-h-[200px]">
        <div className="flex items-center justify-between pb-2 border-b border-[#182334] mb-2 text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            REAL-TIME RUNTIME ACTIVITY LOGS
          </span>
          <span className="text-[10px] text-slate-400 font-mono">LIVE CONSOLE</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[11px] bg-[#040609] p-3 rounded border border-[#141c2b] text-slate-300">
          {activityLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2">
              <span className="text-slate-500 text-[10px]">[{log.time}]</span>
              <span className={
                log.type === 'success' ? 'text-emerald-400 font-semibold' :
                log.type === 'warn' ? 'text-amber-400' :
                log.type === 'error' ? 'text-rose-400' : 'text-cyan-300'
              }>
                {log.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
