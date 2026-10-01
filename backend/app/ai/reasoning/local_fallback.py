from typing import List, Optional
from app.ai.reasoning.base import BaseReasoningAdapter
from app.models.schemas import DiagnosticRequest, DiagnosticResult, LabCitation
from app.diagnostics.engine import evaluate_circuit_diagnostics

class LocalFallbackReasoningAdapter(BaseReasoningAdapter):
    """
    DEVELOPMENT FALLBACK: Clearly labeled open-source reasoning fallback engine.
    """
    def __init__(self):
        self._name = "Local Open-Source Reasoning Engine (Development Fallback)"
        self._npu = False

    @property
    def model_name(self) -> str:
        return self._name

    @property
    def is_npu_accelerated(self) -> bool:
        return self._npu

    async def diagnose_circuit(
        self, 
        request: DiagnosticRequest, 
        rag_citations: Optional[List[LabCitation]] = None
    ) -> DiagnosticResult:
        return evaluate_circuit_diagnostics(request, rag_citations)
