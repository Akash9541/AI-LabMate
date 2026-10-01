import React, { useState } from 'react';
import { useLabStore } from '../../stores/useLabStore';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export const VoiceInputButton: React.FC = () => {
  const { isRecordingVoice, setIsRecordingVoice, setVoiceTranscript, addLog } = useLabStore();
  const [speechStatus, setSpeechStatus] = useState<'idle' | 'listening' | 'transcribing'>('idle');

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      addLog('Web Speech API fallback not supported in browser', 'warn');
      addLog('No browser or local speech recognition runtime is available', 'warn');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecordingVoice(true);
        setSpeechStatus('listening');
        addLog('Voice input active: Listening...', 'info');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceTranscript(transcript);
        setIsRecordingVoice(false);
        setSpeechStatus('idle');
        addLog(`Voice Transcribed: "${transcript}"`, 'success');
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsRecordingVoice(false);
        setSpeechStatus('idle');
        addLog('Speech recognition did not complete; no transcript was added', 'warn');
      };

      recognition.start();
    } catch (e) {
      addLog('Unable to start browser speech recognition', 'warn');
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={startVoiceInput}
        disabled={isRecordingVoice}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all ${
          isRecordingVoice
            ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.5)]'
            : 'bg-[#162235] hover:bg-[#1e2d46] text-amber-300 border border-[#273852]'
        }`}
        title="Voice Input (browser speech recognition when available)"
      >
        {isRecordingVoice ? (
          <>
            <MicOff className="w-3.5 h-3.5" />
            <span>LISTENING...</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span>HOLD TO TALK</span>
          </>
        )}
      </button>

      {isRecordingVoice && (
        <div className="flex items-center gap-0.5 px-1 text-cyan-400">
          <span className="w-1 h-3 bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1 h-4 bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1 h-2 bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
};
