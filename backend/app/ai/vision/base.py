from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.models.schemas import CircuitAnalysisResult

class BaseVisionAdapter(ABC):
    @property
    @abstractmethod
    def model_name(self) -> str:
        pass

    @property
    @abstractmethod
    def is_npu_accelerated(self) -> bool:
        pass

    @abstractmethod
    async def analyze_circuit_image(self, image_data: Optional[str]) -> CircuitAnalysisResult:
        """
        Analyzes a base64 or URL circuit image and returns structured component JSON.
        Must return structured information rather than raw text.
        """
        pass
