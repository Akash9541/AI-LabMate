import React from 'react';
import { useLabStore } from '../../stores/useLabStore';
import { Cpu, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

export const ComponentList: React.FC = () => {
  const { circuitAnalysis } = useLabStore();
  const components = circuitAnalysis?.components || [];

  return (
    <div className="bg-[#0f141d] border border-[#1d2738] rounded-lg overflow-hidden flex flex-col h-full shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
      {/* Table Header */}
      <div className="bg-[#0b0f17] border-b border-[#1d2738] px-3 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200">COMPONENTS DETECTED</span>
        </div>
        <span className="text-[10px] bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
          COUNT: {components.length}
        </span>
      </div>

      {/* Component Table Body */}
      <div className="flex-1 overflow-y-auto max-h-[220px] divide-y divide-[#172030] text-xs font-mono">
        {components.length > 0 ? (
          components.map((comp) => {
            const isUncertain = comp.confidence < 0.70;
            const isSuspicious = comp.status === 'suspicious' || comp.status === 'error';
            const pct = Math.round(comp.confidence * 100);

            return (
              <div
                key={comp.id}
                className={`p-2.5 flex items-center justify-between transition-colors ${
                  isSuspicious 
                    ? 'bg-rose-950/20 hover:bg-rose-950/30' 
                    : 'hover:bg-[#141b28]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isSuspicious ? (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : isUncertain ? (
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}

                  <div>
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <span>{comp.type}</span>
                      {isSuspicious && (
                        <span className="text-[9px] bg-rose-900/80 text-rose-200 px-1 py-0.2 rounded">
                          FLAGGED
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      POS: <span className="text-slate-300">{comp.location}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <div className="w-16 h-1.5 bg-[#172235] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isSuspicious 
                            ? 'bg-rose-500' 
                            : isUncertain 
                            ? 'bg-amber-400' 
                            : 'bg-cyan-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`font-bold ${isUncertain ? 'text-amber-400' : 'text-cyan-300'}`}>
                      {pct}%
                    </span>
                  </div>
                  {isUncertain && (
                    <span className="text-[9px] text-amber-400 font-semibold block mt-0.5">
                      UNCERTAIN CONFIDENCE
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-slate-400">
            <HelpCircle className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-xs">No circuit components identified yet.</p>
            <p className="text-[10px] text-slate-500 mt-1">Upload image to run visual model scanning.</p>
          </div>
        )}
      </div>

      {/* Uncertainty Notice */}
      <div className="bg-[#0b0f17] border-t border-[#1d2738] p-2 text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <span>Structured AI vision extraction | No invented certainty</span>
      </div>
    </div>
  );
};
