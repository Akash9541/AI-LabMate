# AI LabMate — System Architecture Document

## Overview

AI LabMate is an on-device, local-first electronics troubleshooting assistant designed specifically for Qualcomm Snapdragon-powered Windows laptops (such as Snapdragon® X Elite workstations). 

Unlike generic chatbot interfaces, AI LabMate presents a dedicated **Electronics Laboratory Instrument Workspace** reminiscent of oscilloscopes, digital multimeters, logic analyzers, and PCB inspection stations.

---

## 1. High-Level Data Flow

```
┌───────────────────────────┐      ┌──────────────────────────┐
│ Physical Breadboard Image │      │ Digital Multimeter Nodes │
│ (Webcam / Upload / Freeze)│      │ (Voltage, Current, R)    │
└─────────────┬─────────────┘      └────────────┬─────────────┘
              │                                 │
              ▼                                 ▼
┌───────────────────────────┐      ┌──────────────────────────┐
│ Vision Model Adapter      │      │ Reference Schematic /    │
│ (Qwen3-VL-4B / NPU EP)    │      │ Lab PDF Manual (RAG)     │
└─────────────┬─────────────┘      └────────────┬─────────────┘
              │                                 │
              └────────────────┬────────────────┘
                               │
                               ▼
              ┌─────────────────────────────────┐
              │ Reasoning Model Adapter         │
              │ (Qwen3-4B / Snapdragon NPU)     │
              └────────────────┬────────────────┘
                               │
                               ▼
              ┌─────────────────────────────────┐
              │ Diagnostic Result Workstation   │
              │ (Status, Likely Cause, Checks,  │
              │  Expected Range, Citations)     │
              └─────────────────────────────────┘
```

---

## 2. Core Subsystems

### A. Lab Bench Workstation UI (`frontend/src/`)
- Built with **React 18 + Vite + TypeScript + Tailwind CSS**.
- **Dark Graphite Laboratory Aesthetic (`#07090c`)**: Oscilloscope screen grid patterns, amber (`#ffb000`) and cyan (`#00e5ff`) accents, technical monospaced typography (`JetBrains Mono`), and status indicators.
- **Circuit Viewer Component**: HTML5 Webcam capture with real-time video stream, drag-and-drop file uploader, freeze-frame mode, and animated bounding box markers showing model detection confidence.
- **Digital Multimeter Measurement Panel**: Tabular input for node voltages (V), currents (mA), and component resistance values (Ω) with live digital readouts.
- **Diagnostic Result Panel**: Instrument display rendering diagnostic status (`POTENTIAL_FAULT`, `CRITICAL_FAULT`, `NORMAL`), evidence matrix, step-by-step recommended checks for students, and next measurement expected ranges.

### B. AI Model Adapter Engine (`backend/app/ai/`)
AI LabMate implements an abstract **Model Adapter Pattern**:
- **Vision Adapters (`/ai/vision/`)**:
  - `QualcommAIHubVisionAdapter`: Interfacing with Qwen3-VL-4B on DirectML / QNN Execution Provider.
  - `QwenVLAdapter`: Local open-source vision model interface.
  - `LocalFallbackVisionAdapter`: Open-source rule engine fallback for local development.
- **Reasoning Adapters (`/ai/reasoning/`)**:
  - `QualcommAIHubReasoningAdapter`: Snapdragon-optimized Qwen3 reasoning engine.
  - `LocalFallbackReasoningAdapter`: Structured electronic diagnostic analyzer.
- **Speech Adapters (`/ai/speech/`)**:
  - `WhisperAdapter`: Local Whisper-Base ONNX model for on-device speech-to-text.
  - `LocalFallbackSpeechAdapter`: WebSpeech API browser fallback.

### C. Local Document RAG Engine (`backend/app/documents/`)
- Ingests laboratory PDFs, datasheets, and experiment instructions.
- Extracts document text locally and indexes passages using a TF-IDF & cosine similarity vector retriever.
- Formats evidence cards featuring document name, page number, and exact quote excerpts for diagnostic verification.

### D. Hardware & Telemetry Engine (`backend/app/device/`)
- Queries system capabilities (`psutil`, DirectML / QNN Execution Providers).
- Reports real hardware metrics (CPU utilization, memory usage, backend accelerator type, inference latency) without fake benchmark numbers.
