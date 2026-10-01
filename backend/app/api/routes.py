from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import List, Optional
from app.models.schemas import (
    DiagnosticRequest, 
    DiagnoseResponse, 
    CircuitAnalysisResult, 
    SpeechTranscribeResponse, 
    DeviceTelemetry,
    Measurement
)
from app.ai.vision.qualcomm_ai_hub_adapter import QualcommAIHubVisionAdapter
from app.ai.reasoning.qualcomm_ai_hub_adapter import QualcommAIHubReasoningAdapter
from app.ai.speech.whisper_adapter import WhisperAdapter
from app.documents.rag_engine import rag_engine
from app.device.hardware import detect_device_telemetry

router = APIRouter()

vision_adapter = QualcommAIHubVisionAdapter()
reasoning_adapter = QualcommAIHubReasoningAdapter()
speech_adapter = WhisperAdapter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AI LabMate Workstation Engine",
        "runtime": "Local development runtime; accelerator availability is reported by /api/device"
    }

@router.post("/analyze/circuit", response_model=CircuitAnalysisResult)
async def analyze_circuit(request: DiagnosticRequest):
    analysis = await vision_adapter.analyze_circuit_image(request.circuit_image)
    return analysis

@router.post("/diagnose", response_model=DiagnoseResponse)
async def diagnose(request: DiagnosticRequest):
    # 1. Vision Scan
    analysis = await vision_adapter.analyze_circuit_image(request.circuit_image)

    # 2. Local RAG retrieval
    citations = []
    if request.question:
        citations = rag_engine.search(request.question, top_k=2)

    # 3. Diagnostic Reasoning
    diagnostic = await reasoning_adapter.diagnose_circuit(request, citations)

    # Exact connection extraction is not available without a real vision/netlist model.
    schematic_diff = None

    return DiagnoseResponse(
        diagnostic=diagnostic,
        analysis=analysis,
        schematic_diff=schematic_diff
    )

@router.post("/measurements")
async def save_measurements(measurements: List[Measurement]):
    """Validate a local measurement set for clients that persist it themselves."""
    return {"status": "accepted", "measurement_count": len(measurements)}

@router.post("/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    contents = await file.read()
    if file.filename.lower().endswith(".pdf"):
        try:
            import fitz
        except ImportError as exc:
            raise HTTPException(status_code=503, detail="PDF extraction is unavailable. Install PyMuPDF to index PDF manuals locally.") from exc
        pdf = fitz.open(stream=contents, filetype="pdf")
        rag_engine.add_pdf_document(file.filename, [(index + 1, page.get_text()) for index, page in enumerate(pdf)])
        page_count = len(pdf)
    else:
        text = contents.decode("utf-8", errors="ignore")
        rag_engine.add_document(file.filename, text)
        page_count = 1
    return {
        "status": "success",
        "filename": file.filename,
        "size_bytes": len(contents),
        "page_count": page_count,
        "message": "Document text extracted and indexed locally."
    }

@router.post("/documents/search")
async def search_documents(query: str = Form(...)):
    results = rag_engine.search(query, top_k=3)
    return {"query": query, "results": results}

@router.post("/speech/transcribe", response_model=SpeechTranscribeResponse)
async def transcribe_speech():
    res = await speech_adapter.transcribe_audio(None)
    return res

@router.get("/device", response_model=DeviceTelemetry)
async def get_device_telemetry():
    return detect_device_telemetry()

@router.get("/models")
async def get_active_models():
    return {
        "vision_model": vision_adapter.model_name,
        "reasoning_model": reasoning_adapter.model_name,
        "speech_model": speech_adapter.model_name,
        "npu_accelerated": vision_adapter.is_npu_accelerated
    }
