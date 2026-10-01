import React, { useState } from 'react';
import { useLabStore } from '../../stores/useLabStore';
import { Gauge, Plus, Trash2, Zap, Sliders } from 'lucide-react';

export const MeasurementPanel: React.FC = () => {
  const { 
    measurements, 
    addMeasurement, 
    updateMeasurement, 
    deleteMeasurement 
  } = useLabStore();

  const [newNodeName, setNewNodeName] = useState('');
  const [newVoltage, setNewVoltage] = useState('5.00 V');
  const [newCurrent, setNewCurrent] = useState('0.00 mA');
  const [newResistance, setNewResistance] = useState('220 Ω');

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    addMeasurement({
      nodeName: newNodeName,
      voltage: newVoltage,
      current: newCurrent,
      resistance: newResistance,
    });

    setNewNodeName('');
  };

  return (
    <div className="bg-[#0f141d] border border-[#1d2738] rounded-lg overflow-hidden flex flex-col h-full shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
      {/* Instrument Display Header */}
      <div className="bg-[#0b0f17] border-b border-[#1d2738] px-3 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-bold text-slate-200">DIGITAL MULTIMETER // MEASUREMENTS</span>
        </div>
        <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
          PROBES ACTIVE
        </span>
      </div>

      {/* Multimeter Digital Readout Header */}
      <div className="bg-[#070a0f] p-3 border-b border-[#1d2738] grid grid-cols-3 gap-2 font-mono">
        <div className="bg-[#0c1017] p-2 rounded border border-[#1a2538]">
          <span className="text-[9px] text-slate-400 block uppercase">NODE 1 VOLTAGE</span>
          <span className="text-base font-bold text-amber-400 font-mono">
            {measurements[0]?.voltage || '0.00 V'}
          </span>
        </div>
        <div className="bg-[#0c1017] p-2 rounded border border-[#1a2538]">
          <span className="text-[9px] text-slate-400 block uppercase">NODE 2 VOLTAGE</span>
          <span className="text-base font-bold text-cyan-400 font-mono">
            {measurements[1]?.voltage || '0.00 V'}
          </span>
        </div>
        <div className="bg-[#0c1017] p-2 rounded border border-[#1a2538]">
          <span className="text-[9px] text-slate-400 block uppercase">SERIES CURRENT</span>
          <span className="text-base font-bold text-emerald-400 font-mono">
            {measurements[0]?.current || '0.00 mA'}
          </span>
        </div>
      </div>

      {/* Measurement List Table */}
      <div className="flex-1 overflow-y-auto max-h-[180px] divide-y divide-[#162030] text-xs font-mono p-2">
        {measurements.map((m) => (
          <div key={m.id} className="py-2 px-1 flex items-center justify-between gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={m.nodeName}
                onChange={(e) => updateMeasurement(m.id, 'nodeName', e.target.value)}
                className="bg-[#121927] border border-[#1d293d] rounded px-2 py-1 text-slate-200 text-xs w-full focus:outline-none focus:border-amber-400 font-semibold"
              />
            </div>
            <div className="w-20">
              <input
                type="text"
                value={m.voltage}
                onChange={(e) => updateMeasurement(m.id, 'voltage', e.target.value)}
                className="bg-[#121927] border border-[#1d293d] rounded px-1.5 py-1 text-amber-400 text-xs text-center w-full focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="w-20">
              <input
                type="text"
                value={m.current}
                onChange={(e) => updateMeasurement(m.id, 'current', e.target.value)}
                className="bg-[#121927] border border-[#1d293d] rounded px-1.5 py-1 text-emerald-400 text-xs text-center w-full focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div className="w-20">
              <input
                type="text"
                value={m.resistance}
                onChange={(e) => updateMeasurement(m.id, 'resistance', e.target.value)}
                className="bg-[#121927] border border-[#1d293d] rounded px-1.5 py-1 text-cyan-400 text-xs text-center w-full focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              onClick={() => deleteMeasurement(m.id)}
              className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
              title="Delete measurement"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Measurement Form */}
      <form onSubmit={handleAddNew} className="bg-[#0b0f17] border-t border-[#1d2738] p-2 flex items-center gap-2">
        <input
          type="text"
          placeholder="New Probe Location (e.g. Diode Node)"
          value={newNodeName}
          onChange={(e) => setNewNodeName(e.target.value)}
          className="bg-[#121824] border border-[#1e2a3e] text-slate-200 text-xs px-2 py-1 rounded flex-1 focus:outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD</span>
        </button>
      </form>
    </div>
  );
};
