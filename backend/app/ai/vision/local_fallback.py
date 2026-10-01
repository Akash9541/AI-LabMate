from typing import Optional
from app.ai.vision.base import BaseVisionAdapter
from app.models.schemas import CircuitAnalysisResult, CircuitComponent, ComponentCoordinate, ModelInfo

class LocalFallbackVisionAdapter(BaseVisionAdapter):
    """
    Development placeholder used until a local vision model is configured.
    """
    def __init__(self):
        self._name = "Local vision model unavailable (development placeholder)"
        self._npu = False

    @property
    def model_name(self) -> str:
        return self._name

    @property
    def is_npu_accelerated(self) -> bool:
        return self._npu

    async def analyze_circuit_image(self, image_data: Optional[str]) -> CircuitAnalysisResult:
        return CircuitAnalysisResult(
            components=[],
            observations=[],
            possible_issues=[],
            uncertainty_notes="No local vision model is configured. Use Demo Mode for predefined analysis data.",
            model_info=ModelInfo(
                name=self._name,
                backend="Unavailable",
                latency_ms=0
            )
        )
