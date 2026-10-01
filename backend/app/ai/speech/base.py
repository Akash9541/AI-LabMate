from abc import ABC, abstractmethod
from typing import Optional
from app.models.schemas import SpeechTranscribeResponse

class BaseSpeechAdapter(ABC):
    @property
    @abstractmethod
    def model_name(self) -> str:
        pass

    @property
    @abstractmethod
    def is_npu_accelerated(self) -> bool:
        pass

    @abstractmethod
    async def transcribe_audio(self, audio_bytes: Optional[bytes] = None) -> SpeechTranscribeResponse:
        pass
