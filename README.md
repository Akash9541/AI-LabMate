# AI LabMate
> **On-Device Electronics Troubleshooting Assistant**  
> *Submission for the Snapdragon AI Lab Build & Present Challenge 2026*

AI LabMate is a local-first, on-device electronics troubleshooting workstation designed to assist electronics students, hobbyists, and engineers in diagnosing circuit wiring errors, component selection faults, and power rail inversions. Operating entirely locally on Snapdragon-powered Windows laptops (such as Snapdragon® X Elite workstations), AI LabMate combines live camera circuit scanning, digital multimeter node measurements, reference schematic comparisons, and local lab manual PDF retrieval into a dedicated laboratory instrument interface—completely eliminating reliance on cloud APIs or generic chatbot bubbles.

---

## 1. Problem & Vision

Traditional AI assistants present electronics troubleshooting as a generic chat prompt, forcing students to describe complex breadboard wiring in text. Generic chatbots lack real-time measurement inputs, schematic diffing tools, or on-device privacy guarantees.

**AI LabMate** turns the laptop into a professional engineering diagnostic instrument:
- **Visual Inspection**: Live webcam capture & drag-and-drop breadboard scanning.
- **Multimeter Inputs**: Integrated voltage (V), current (mA), and resistance (Ω) node measurements.
- **Diagnostic Instrument Layout**: Structured fault status (`POTENTIAL_FAULT`, `CRITICAL_FAULT`), likely cause, evidence checklist, recommended student checks, and expected next measurement ranges.
- **Local & Offline**: Runs AI models locally on Snapdragon NPU without sending sensitive images to cloud APIs.

---

## 2. Key Features

- **Lab Bench 01 Workspace**: Oscilloscope dark graphite aesthetic (`#07090c`), amber/cyan accents, and real-time telemetry displays.
- **Structured Circuit Image Analysis**: Structured JSON bounding box detection of LEDs, resistors, microcontrollers (Arduino/ESP32), power rails, and sensors.
- **Schematic Comparison Engine**: Visual netlist comparison between reference schematics and observed circuit scans, highlighting suspicious connections.
- **Local PDF Lab Manual RAG**: Ingests technical manuals and datasheets, displaying exact document name, page number, and quote citations.
- **Multimeter Measurement Panel**: Dedicated digital instrument for entering probe readings with real-time digital readouts.
- **Voice Input**: Hold-to-Talk button interfacing with local Whisper speech recognition.
- **Competition Demo Mode**: 1-click execution for 3 scenarios:
  1. *LED Polarity Swap* (Reversed diode bias, V_LED = 0.01V).
  2. *Resistor Value Mismatch* (10kΩ instead of 220Ω, choking current to 0.34mA).
  3. *Arduino Sensor Wiring Inversion* (VCC & GND swapped on DHT11, critical thermal risk).
- **Snapdragon Telemetry Page**: Real platform detection and DirectML / QNN NPU runtime status without fake benchmarks.

---

## 3. Architecture & Tech Stack

```
AI-LabMate/
├── frontend/             # React 18 + Vite + TypeScript + Tailwind CSS + Zustand
│   ├── src/
│   │   ├── components/   # CircuitViewer, ComponentList, DiagnosticResultPanel, etc.
│   │   ├── stores/       # Zustand lab workbench state store
│   │   └── pages/        # LabBenchPage, SchematicComparePage, DocumentsPage, DevicePage
├── backend/              # Python FastAPI Server + PyMuPDF + RAG Engine
│   ├── app/
│   │   ├── ai/           # Vision, Reasoning, & Speech Model Adapters
│   │   ├── diagnostics/  # Circuit diagnostic rule & netlist engine
│   │   ├── documents/    # Local PDF TF-IDF & vector RAG retriever
│   │   ├── device/       # System & hardware telemetry detector
│   │   └── api/          # FastAPI route controllers
├── models/               # Model weights & ONNX Qualcomm AI Hub runtimes
├── docs/                 # Architecture, Deployment, & Model Integration docs
└── README.md
```

---

## 4. AI Model Adapter Architecture

AI LabMate uses a clean **Model Adapter Pattern** (`backend/app/ai/`) that supports Qualcomm AI Hub runtimes with local open-source fallbacks:

| Model Category | Target Model | Qualcomm AI Hub Runtime | Local Development Fallback |
| :--- | :--- | :--- | :--- |
| **Vision-Language** | Qwen3-VL-4B-Instruct | DirectML / QNN EP | Local Fallback Vision Engine |
| **Reasoning Engine**| Qwen3-4B-Instruct | Snapdragon NPU Execution | Structured Diagnostic Engine |
| **Speech-to-Text**  | Whisper-Base-ONNX | ONNX Runtime QNN | WebSpeech API |

---

## 5. Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+

### Step 1: Install & Launch Frontend
```bash
cd frontend
npm install
npm run dev
```
Open browser at `http://localhost:5173`.

### Step 2: Install & Launch Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 main.py
```
Backend API will start at `http://localhost:8000`.

---

## 6. Safety Disclaimer

> [!IMPORTANT]
> **Educational Use Only:** AI LabMate is designed exclusively for low-voltage educational electronics (5V / 12V breadboards, Arduino, ESP32). Do not attempt to use this tool on mains voltage (110V/220V AC) or high-voltage energy systems. Always verify diagnostic recommendations with standard laboratory multimeter instruments and safety procedures.

---

## 7. License

MIT License. Developed for the Snapdragon AI Lab Build & Present Challenge 2026.
