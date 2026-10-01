import React from 'react';
import { useLabStore } from '../../stores/useLabStore';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  ArrowRight, 
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  BookOpen
} from 'lucide-react';
import { VoiceInputButton } from '../voice/VoiceInputButton';

export const DiagnosticResultPanel: React.FC = () => {
  const { 
    diagnosticResult, 
    isDiagnosing, 
    runDiagnostic, 
    userQuestion, 
    setUserQuestion 
  } = useLabStore();

  if (isDiagnosing) {
    return (
      <div className="bg-[#0f141d] border border-[#1d2738] rounded-lg p-6 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
          <Activity className="w-10 h-10 text-amber-400 animate-spin" />
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
        </div>
        <h3 className="text-sm font-bold text-amber-400 font-mono mb-2 tracking-wider">
          RUNNING LOCAL AI DIAGNOSTIC ENGINE...
        </h3>
        <p className="text-xs text-slate-400 font-mono max-w-xs leading-relaxed">
          Evaluating the submitted measurements, available circuit analysis, and locally indexed lab-manual citations.
        </p>
      </div>
    );
  }

  if (!diagnosticResult) {
    return (
      <div className="bg-[#0f141d] border border-[#1d2738] rounded-lg p-6 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <ShieldAlert className="w-12 h-12 text-slate-600 mb-3" />
        <h3 className="text-sm font-bold text-slate-300 font-mono mb-2">
          DIAGNOSTIC INSTRUMENT // STANDBY
        </h3>
        <p className="text-xs text-slate-400 font-mono max-w-xs mb-4">
          Upload circuit image, enter node measurements, or select a demo scenario to run automated troubleshooting analysis.
        </p>
        <button
          onClick={() => runDiagnostic()}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded text-xs font-mono shadow-[0_0_12px_rgba(255,176,0,0.3)] transition-all"
        >
          RUN DIAGNOSTIC NOW
        </button>
      </div>
    );
  }

  const {
    status,
    fault_category,
    confidence,
    confidence_score,
    observed,
    likely_cause,
    evidence,
    recommended_checks,
    next_measurement,
    lab_manual_evidence
  } = diagnosticResult;

  const isCritical = status === 'CRITICAL_FAULT';
  const isPotential = status === 'POTENTIAL_FAULT';
  const isNormal = status === 'NORMAL';

  return (
    <div className="bg-[#0f141d] border border-[#1d2738] rounded-lg overflow-hidden flex flex-col h-full shadow-[0_4px_16px_rgba(0,0,0,0.5)] font-mono">
      {/* Instrument Panel Top Header */}
      <div className="bg-[#0b0f17] border-b border-[#1d2738] px-3 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-200">DIAGNOSTIC RESULT</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">CONFIDENCE:</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#162032] border border-[#23334d] text-cyan-300">
            {confidence} ({Math.round(confidence_score * 100)}%)
          </span>
        </div>
      </div>

      {/* Main Diagnostic Display Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* User Question Bar with Voice Input */}
        <div className="bg-[#070a0f] p-2.5 rounded border border-[#1d2738] flex items-center gap-2">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            placeholder="Ask a specific question (e.g., Why isn't my LED turning on?)"
            className="bg-transparent text-xs text-slate-200 focus:outline-none flex-1 font-mono"
          />
          <VoiceInputButton />
        </div>

        {/* Status Badge Box */}
        <div
          className={`p-3.5 rounded-md border ${
            isCritical
              ? 'bg-rose-950/30 border-rose-600/80 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
              : isPotential
              ? 'bg-amber-950/30 border-amber-600/80 text-amber-200 shadow-[0_0_15px_rgba(255,176,0,0.15)]'
              : 'bg-emerald-950/30 border-emerald-600/80 text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1">
            {isCritical ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
            ) : isPotential ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>STATUS: {status.replace('_', ' ')}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-100">{fault_category}</h4>
        </div>

        {/* Observed Observations */}
        <div className="bg-[#0b0e16] p-3 rounded border border-[#192336]">
          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>OBSERVED CIRCUIT STATE</span>
          </h5>
          <ul className="space-y-1 text-xs text-slate-300">
            {observed.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Likely Cause */}
        <div className="bg-[#0b0e16] p-3 rounded border border-[#192336]">
          <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>LIKELY CAUSE</span>
          </h5>
          <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
            {likely_cause}
          </p>
        </div>

        {/* Measured Evidence */}
        {evidence && evidence.length > 0 && (
          <div className="bg-[#0b0e16] p-3 rounded border border-[#192336]">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              EVIDENCE MATRIX
            </h5>
            <div className="space-y-2 text-xs">
              {evidence.map((ev, idx) => (
                <div key={idx} className="bg-[#121927] p-2 rounded border border-[#1e2a3f]">
                  <span className="text-cyan-400 font-bold block mb-0.5">{ev.label}</span>
                  <span className="text-slate-300">{ev.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Checks */}
        <div className="bg-[#0b0e16] p-3 rounded border border-[#192336]">
          <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>RECOMMENDED CHECKS</span>
          </h5>
          <ol className="space-y-2 text-xs text-slate-200">
            {recommended_checks.map((check, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="bg-emerald-950 text-emerald-400 font-bold text-[10px] w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 border border-emerald-800">
                  {idx + 1}
                </span>
                <span>{check}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Next Recommended Measurement */}
        {next_measurement && (
          <div className="bg-gradient-to-r from-[#0d1726] to-[#0d121c] p-3.5 rounded border border-cyan-800/80 shadow-[0_0_12px_rgba(0,229,255,0.1)]">
            <h5 className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              <span>NEXT MEASUREMENT PROCEDURE</span>
            </h5>
            <div className="text-xs text-slate-200 font-bold mb-1">
              Target: <span className="text-amber-300">{next_measurement.parameter}</span>
            </div>
            <div className="text-xs text-emerald-400 mb-1 font-mono">
              Expected: <strong>{next_measurement.expected_range}</strong>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Instructions: {next_measurement.instructions}
            </p>
          </div>
        )}

        {/* Evidence from Lab Manual */}
        {lab_manual_evidence && lab_manual_evidence.length > 0 && (
          <div className="bg-[#080d16] p-3 rounded border border-[#1c2b42]">
            <h5 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>EVIDENCE FROM LAB MANUAL</span>
            </h5>
            {lab_manual_evidence.map((citation, idx) => (
              <div key={idx} className="bg-[#0f1726] p-2.5 rounded border border-[#1b283d] text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-bold text-cyan-300">{citation.doc_name}</span>
                  {citation.page && <span>PAGE {citation.page}</span>}
                </div>
                <blockquote className="text-slate-300 italic border-l-2 border-cyan-500 pl-2 text-[11px]">
                  "{citation.excerpt}"
                </blockquote>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="bg-[#0b0f17] border-t border-[#1d2738] p-2.5 flex items-center justify-between">
        <span className="text-[10px] text-slate-500">ENGINE: LOCAL RULES / CONFIGURED MODEL</span>
        <button
          onClick={() => runDiagnostic()}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded text-xs transition-colors shadow flex items-center gap-1"
        >
          <Zap className="w-3 h-3" />
          <span>RE-RUN DIAGNOSTIC</span>
        </button>
      </div>
    </div>
  );
};
