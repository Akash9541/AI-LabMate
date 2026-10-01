# AI LabMate — Model Integration & Qualcomm AI Hub Architecture

## Overview

AI LabMate uses a **Model Adapter Architecture** (`/backend/app/ai/`) that decouples model inference from the business logic and user interface. This enables seamless switching between Snapdragon NPU runtimes via Qualcomm AI Hub and open-source local fallbacks.

---

## Model Adapter Interfaces

### Vision Adapter Interface (`backend/app/ai/vision/base.py`)
```python
class BaseVisionAdapter(ABC):
    @property
    @abstractmethod
    def model_name(self) -> str: pass

    @property
    @abstractmethod
    def is_npu_accelerated(self) -> bool: pass

    @abstractmethod
    async def analyze_circuit_image(self, image_data: Optional[str]) -> CircuitAnalysisResult: pass
```

### Supported Models & Providers

| Role | Target Model | Qualcomm AI Hub Runtime | Development Fallback |
| :--- | :--- | :--- | :--- |
| **Vision-Language** | Qwen3-VL-4B-Instruct | DirectML / QNN EP | Local Fallback Vision Engine |
| **Reasoning** | Qwen3-4B-Instruct | Snapdragon NPU Execution | Structured Diagnostic Engine |
| **Speech-to-Text**| Whisper-Base-ONNX | ONNX Runtime QNN | WebSpeech API |

---

## Qualcomm AI Hub Deployment Path

To connect compiled Qualcomm AI Hub ONNX models:

1. Download compiled ONNX models targeting QNN EP or DirectML from Qualcomm AI Hub.
2. Place ONNX models under `models/` directory.
3. Update `backend/app/config.py` to point `MODEL_PROVIDER="qualcomm_ai_hub"`.
4. Run `backend/main.py` — the application will automatically select `QualcommAIHubVisionAdapter` and `QualcommAIHubReasoningAdapter`.
