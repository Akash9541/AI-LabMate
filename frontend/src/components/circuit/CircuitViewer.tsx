import React, { useRef, useState } from 'react';
import { useLabStore } from '../../stores/useLabStore';
import { Camera, Upload, Snowflake, RefreshCw, Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const CircuitViewer: React.FC = () => {
  const { 
    circuitImage, 
    setCircuitImage, 
    circuitAnalysis, 
    isWebcamActive, 
    setWebcamActive,
    addLog 
  } = useLabStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isFrozen, setIsFrozen] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCircuitImage(event.target.result as string);
          setWebcamActive(false);
          setIsFrozen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCircuitImage(event.target.result as string);
          setWebcamActive(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Webcam activation
  const startWebcam = async () => {
    try {
      setWebcamActive(true);
      setIsFrozen(false);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      addLog('Webcam video feed connected', 'info');
    } catch (err) {
      console.warn('Webcam permission or device error:', err);
      addLog('Webcam access error or permission denied', 'warn');
      setWebcamActive(false);
    }
  };

  // Capture frame from webcam
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCircuitImage(dataUrl);
        setIsFrozen(true);
        addLog('Captured frame from webcam feed', 'success');
      }
    }
  };

  return (
    <div className="bg-[#0f141d] border border-[#1d2738] rounded-lg overflow-hidden flex flex-col h-full shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
      {/* Header Toolbar */}
      <div className="bg-[#0b0f17] border-b border-[#1d2738] px-3 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-slate-200">CIRCUIT VIEWER</span>
          <span className="text-slate-400 text-[10px] bg-[#162030] px-2 py-0.5 rounded border border-[#23334d]">
            {isWebcamActive ? 'CAM_01 LIVE' : 'IMAGE SCAN'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded border transition-colors ${
              showOverlays 
                ? 'bg-cyan-950/60 border-cyan-700/80 text-cyan-300' 
                : 'bg-[#151d2a] border-[#223046] text-slate-400'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>AI OVERLAY</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 bg-[#162030] hover:bg-[#1f2d44] text-slate-200 px-2.5 py-1 rounded border border-[#263750] transition-colors"
          >
            <Upload className="w-3 h-3 text-cyan-400" />
            <span>UPLOAD</span>
          </button>

          {!isWebcamActive ? (
            <button
              onClick={startWebcam}
              className="flex items-center gap-1 bg-[#162030] hover:bg-[#1f2d44] text-slate-200 px-2.5 py-1 rounded border border-[#263750] transition-colors"
            >
              <Camera className="w-3 h-3 text-amber-400" />
              <span>WEBCAM</span>
            </button>
          ) : (
            <button
              onClick={captureFrame}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded shadow transition-colors"
            >
              <Snowflake className="w-3 h-3" />
              <span>CAPTURE</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Image View Container */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="relative flex-1 bg-[#070a0f] oscilloscope-screen flex items-center justify-center p-3 overflow-hidden min-h-[320px]"
      >
        {isWebcamActive ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="max-h-[420px] max-w-full rounded border border-[#1d2738] object-contain"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        ) : circuitImage ? (
          <div className="relative inline-block max-w-full max-h-[420px]">
            <img
              src={circuitImage}
              alt="Circuit scan"
              className="max-h-[400px] max-w-full rounded border border-[#1d2738] object-contain block"
            />

            {/* AI Bounding Box Overlays */}
            {showOverlays && circuitAnalysis?.components?.map((comp) => {
              if (!comp.coordinates) return null;
              const isSuspicious = comp.status === 'suspicious' || comp.status === 'error';
              return (
                <div
                  key={comp.id}
                  style={{
                    left: `${comp.coordinates.x - 8}%`,
                    top: `${comp.coordinates.y - 12}%`,
                    width: `${comp.coordinates.width || 18}%`,
                    height: `${comp.coordinates.height || 18}%`,
                  }}
                  className={`absolute rounded border-2 transition-all ${
                    isSuspicious
                      ? 'border-rose-500 bg-rose-500/15 shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-pulse'
                      : 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_8px_rgba(0,229,255,0.2)]'
                  }`}
                >
                  <div
                    className={`absolute -top-6 left-0 text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap flex items-center gap-1 font-bold ${
                      isSuspicious
                        ? 'bg-rose-600 text-white shadow'
                        : 'bg-cyan-500 text-slate-950 shadow'
                    }`}
                  >
                    {isSuspicious ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    <span>{comp.type} ({Math.round(comp.confidence * 100)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 rounded-full bg-[#111827] border border-[#1e2d48] flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 font-mono mb-2">
              LAB BENCH 01 // NO CIRCUIT IMAGE LOADED
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed">
              Drag & drop a circuit breadboard image, use the webcam, or select one of the competition DEMO scenarios from the top bar.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all"
              >
                LOAD IMAGE FILE
              </button>
            </div>
          </div>
        )}

        {/* Oscilloscope Grid Lines Overlay Motif */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-grid-pattern" />
      </div>

      {/* Footer Info */}
      <div className="bg-[#0b0f17] border-t border-[#1d2738] px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div>
          <span>DETECTED MODEL: </span>
          <span className="text-cyan-400 font-semibold">
            {circuitAnalysis?.model_info?.name || 'No image analysis model loaded'}
          </span>
        </div>
        <div>
          <span>LATENCY: </span>
          <span className="text-amber-400 font-semibold">
            {circuitAnalysis?.model_info?.latency_ms ? `${circuitAnalysis.model_info.latency_ms} ms` : 'UNAVAILABLE'}
          </span>
        </div>
      </div>
    </div>
  );
};
