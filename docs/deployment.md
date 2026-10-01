# AI LabMate — Deployment & Setup Guide

## System Requirements

- **Target OS:** Windows 11 ARM64 (Snapdragon® X Elite / 8cx Gen 3) or macOS / Linux for development.
- **Node.js:** v18.0.0 or higher
- **Python:** v3.10 or higher
- **AI Acceleration:** Qualcomm AI Hub / ONNX Runtime with DirectML or QNN Execution Provider (optional fallback included for development).

---

## 1. Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend workstation interface will launch at `http://localhost:5173`.

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 main.py
```
The FastAPI backend server will start at `http://localhost:8000`.

---

## 2. Environment Variables

Create `.env` in `backend/`:

```env
APP_NAME="AI LabMate"
ENVIRONMENT="development"
MODEL_PROVIDER="qualcomm_ai_hub"
DEVICE_ACCELERATOR="NPU"
```

---

## 3. Demo Mode Verification

AI LabMate includes 3 built-in competition presentation scenarios that require zero physical hardware to demonstrate:

1. **[ LOAD DEMO: LED POLARITY ]**: Evaluates 5V breadboard circuit with reversed diode polarity.
2. **[ LOAD DEMO: RESISTOR VALUE ]**: Pinpoints dim LED caused by 10kΩ resistor installed instead of 220Ω.
3. **[ LOAD DEMO: ARDUINO SENSOR ]**: Flags critical power rail inversion (VCC & GND reversed) on DHT11 sensor.
