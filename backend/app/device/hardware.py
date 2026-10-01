import platform
import psutil
import importlib.util
from app.models.schemas import DeviceTelemetry

def detect_device_telemetry() -> DeviceTelemetry:
    """
    Queries actual system platform and runtime environment.
    Never fabricates fake benchmark claims.
    """
    uname = platform.uname()
    system_name = uname.system
    processor = uname.processor or uname.machine or "Unknown processor"

    # Check CPU usage & RAM memory
    cpu_percent = int(psutil.cpu_percent(interval=None))
    memory_info = psutil.virtual_memory()
    memory_used_mb = int(memory_info.used / (1024 * 1024))

    # A Windows or ARM machine alone does not prove a usable NPU runtime. Check the
    # installed ONNX Runtime providers before reporting an accelerator.
    providers = []
    if importlib.util.find_spec("onnxruntime"):
        import onnxruntime as ort
        providers = ort.get_available_providers()

    if "QNNExecutionProvider" in providers:
        accelerator, ai_runtime, npu_active = "NPU", "ONNX Runtime QNN Execution Provider", True
    elif "DmlExecutionProvider" in providers:
        accelerator, ai_runtime, npu_active = "GPU", "ONNX Runtime DirectML Execution Provider", False
    else:
        accelerator, ai_runtime, npu_active = "CPU", "No supported local accelerator runtime detected", False

    model_status = "No model loaded"

    return DeviceTelemetry(
        device_name=f"{system_name} {uname.machine}",
        processor=processor,
        ai_runtime=ai_runtime,
        accelerator=accelerator,
        vision_model=model_status,
        reasoning_model="Structured local rules (development fallback)",
        speech_model="No local speech model loaded",
        status="Ready" if npu_active else "Fallback",
        inference_type="Local / On-Device",
        network_status="Offline Ready",
        last_inference_ms=None,
        memory_used_mb=memory_used_mb,
        cpu_percent=cpu_percent,
        npu_active=npu_active,
        is_hardware_verified=npu_active
    )
