from abc import ABC, abstractmethod
from typing import List, Optional
from app.models.schemas import DiagnosticRequest, DiagnosticResult, Measurement

class BaseReasoningAdapter(ABC):
    @property
    @abstractmethod
    def model_name(self) -> str:
        pass

    @property
    @abstractmethod
    def is_npu_accelerated(self) -> bool:
        pass

    @abstractmethod
    async def diagnose_circuit(
        self, 
        request: DiagnosticRequest, 
        rag_citations: Optional[List[Any]] = None
    ) -> DiagnosticResult:
        """
        Synthesizes circuit image observations + measurements + schematics + RAG citations
        into a structured diagnostic output.
        """
        pass
