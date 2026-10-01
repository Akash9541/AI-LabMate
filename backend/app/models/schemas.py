from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ComponentCoordinate(BaseModel):
    x: float
    y: float
    width: Optional[float] = None
    height: Optional[float] = None
    label: Optional[str] = None

class CircuitComponent(BaseModel):
    id: str
    type: str
    confidence: float
    location: str
    coordinates: Optional[ComponentCoordinate] = None
    status: Optional[str] = "normal"
    notes: Optional[str] = None

class ModelInfo(BaseModel):
    name: str
    backend: str
    latency_ms: int

class CircuitAnalysisResult(BaseModel):
    components: List[CircuitComponent]
    observations: List[str]
    possible_issues: List[str]
    uncertainty_notes: Optional[str] = None
    model_info: Optional[ModelInfo] = None

class Measurement(BaseModel):
    id: Optional[str] = None
    nodeName: str
    voltage: str
    current: str
    resistance: str
    frequency: Optional[str] = None
    temperature: Optional[str] = None

class DiagnosticRequest(BaseModel):
    circuit_image: Optional[str] = None
    measurements: List[Measurement] = []
    question: Optional[str] = None
    reference_schematic: Optional[str] = None

class EvidenceItem(BaseModel):
    label: str
    text: str

class NextMeasurement(BaseModel):
    parameter: str
    expected_range: str
    instructions: str

class LabCitation(BaseModel):
    doc_name: str
    page: Optional[int] = None
    excerpt: str
    relevance_score: float

class DiagnosticResult(BaseModel):
    id: str
    status: str  # NORMAL, POTENTIAL_FAULT, CRITICAL_FAULT, UNCERTAIN
    fault_category: str
    confidence: str  # High, Medium, Low
    confidence_score: float
    observed: List[str]
    likely_cause: str
    evidence: List[EvidenceItem]
    recommended_checks: List[str]
    next_measurement: Optional[NextMeasurement] = None
    lab_manual_evidence: Optional[List[LabCitation]] = None
    timestamp: str

class ConnectionDiff(BaseModel):
    from_node: str = Field(alias="from")
    to_node: str = Field(alias="to")
    status: str
    reason: str

    class Config:
        populate_by_name = True

class SchematicComparisonResult(BaseModel):
    reference_name: str
    observed_name: str
    matching_components: List[str]
    missing_components: List[str]
    unexpected_components: List[str]
    connection_diffs: List[Dict[str, Any]]
    confidence: float
    summary: str

class DiagnoseResponse(BaseModel):
    diagnostic: DiagnosticResult
    analysis: CircuitAnalysisResult
    schematic_diff: Optional[SchematicComparisonResult] = None

class SpeechTranscribeResponse(BaseModel):
    transcript: str
    confidence: float
    model_used: str

class DeviceTelemetry(BaseModel):
    device_name: str
    processor: str
    ai_runtime: str
    accelerator: str
    vision_model: str
    reasoning_model: str
    speech_model: str
    status: str
    inference_type: str
    network_status: str
    last_inference_ms: Optional[int] = None
    memory_used_mb: Optional[int] = None
    cpu_percent: Optional[int] = None
    npu_active: bool
    is_hardware_verified: bool
