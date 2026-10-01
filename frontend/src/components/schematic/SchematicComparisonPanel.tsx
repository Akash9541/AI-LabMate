import React, { useRef } from 'react';
import { useLabStore } from '../../stores/useLabStore';
import { GitCompare, Upload, AlertTriangle, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

export const SchematicComparisonPanel: React.FC = () => {
  const { 
    schematicComparison, 
    referenceSchematicImage, 
    setReferenceSchematicImage, 
    circuitImage 
  } = useLabStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setReferenceSchematicImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#0f141d] border border-[#1d2738] rounded-lg p-4 flex flex-col h-full shadow-[0_4px_16px_rgba(0,0,0,0.5)] font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1d2738] mb-4">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-200">
            SCHEMATIC COMPARISON ENGINE // REFERENCE VS OBSERVED
          </h2>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 bg-[#162030] hover:bg-[#1f2d44] text-slate-200 px-3 py-1.5 rounded text-xs border border-[#263750] transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>UPLOAD REFERENCE SCHEMATIC</span>
        </button>
      </div>

      {/* Main Dual Visual Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Left: Reference Diagram */}
        <div className="bg-[#070a0f] p-3 rounded border border-[#1d2738] oscilloscope-screen">
          <div className="text-xs font-bold text-cyan-400 mb-2 flex items-center justify-between">
            <span>REFERENCE DIAGRAM</span>
            <span className="text-[10px] text-slate-400">LAB MANUAL SPEC</span>
          </div>
          <div className="h-[220px] flex items-center justify-center border border-[#172338] rounded bg-[#0b0e16] overflow-hidden p-2">
            {referenceSchematicImage ? (
              <img
                src={referenceSchematicImage}
                alt="Reference schematic"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center text-slate-500 text-xs">
                No reference schematic uploaded.
              </div>
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-300 font-mono bg-[#0f1726] p-2 rounded border border-[#1b283d]">
            <strong>REFERENCE:</strong> Connection extraction requires a configured schematic parser or Demo Mode data.
          </div>
        </div>

        {/* Right: Observed Scan */}
        <div className="bg-[#070a0f] p-3 rounded border border-[#1d2738] oscilloscope-screen">
          <div className="text-xs font-bold text-amber-400 mb-2 flex items-center justify-between">
            <span>OBSERVED SCAN</span>
            <span className="text-[10px] text-slate-400 font-bold">IMAGE INPUT</span>
          </div>
          <div className="h-[220px] flex items-center justify-center border border-[#172338] rounded bg-[#0b0e16] overflow-hidden p-2">
            {circuitImage ? (
              <img
                src={circuitImage}
                alt="Observed circuit"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center text-slate-500 text-xs">
                No observed circuit scan.
              </div>
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-300 font-mono bg-[#0f1726] p-2 rounded border border-[#1b283d]">
            <strong>OBSERVED:</strong> Exact circuit connectivity is unavailable until a local vision/netlist model is configured.
          </div>
        </div>
      </div>

      {/* Comparison Analysis Breakdown Panel */}
      {schematicComparison && (
        <div className="bg-[#0b0f17] p-4 rounded border border-[#1d2738] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase">
              NETLIST COMPARISON SUMMARY
            </h3>
            <span className="text-xs text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              MATCH SCORE: {Math.round(schematicComparison.confidence * 100)}%
            </span>
          </div>

          <p className="text-xs text-slate-300 bg-[#101726] p-2.5 rounded border border-[#1c2940]">
            {schematicComparison.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Matching */}
            <div className="bg-emerald-950/30 p-2.5 rounded border border-emerald-800/60">
              <span className="font-bold text-emerald-400 flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                MATCHING ({schematicComparison.matching_components.length})
              </span>
              <ul className="text-slate-300 text-[11px] space-y-0.5">
                {schematicComparison.matching_components.map((item, idx) => (
                  <li key={idx}>✓ {item}</li>
                ))}
              </ul>
            </div>

            {/* Connection Diffs / Incorrect */}
            <div className="bg-rose-950/30 p-2.5 rounded border border-rose-800/60 col-span-2">
              <span className="font-bold text-rose-400 flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                SUSPICIOUS / INCORRECT CONNECTIONS ({schematicComparison.connection_diffs.length})
              </span>
              <div className="space-y-1 text-[11px]">
                {schematicComparison.connection_diffs.map((diff, idx) => (
                  <div key={idx} className="bg-[#121622] p-1.5 rounded border border-rose-900/50 flex items-center justify-between">
                    <span className="font-bold text-slate-200">
                      {diff.from} → {diff.to}
                    </span>
                    <span className="text-rose-400 font-semibold">{diff.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
