from typing import Optional
from app.ai.speech.base import BaseSpeechAdapter
from app.models.schemas import SpeechTranscribeResponse

class LocalFallbackSpeechAdapter(BaseSpeechAdapter):
    """
    Development placeholder used until a local speech model is configured.
    """
    def __init__(self):
        self._name = "Local speech model unavailable (development placeholder)"
        self._npu = False

    @property
    def model_name(self) -> str:
        return self._name

    @property
    def is_npu_accelerated(self) -> bool:
        return self._npu

    async def transcribe_audio(self, audio_bytes: Optional[bytes] = None) -> SpeechTranscribeResponse:
        return SpeechTranscribeResponse(
            transcript="",
            confidence=0.0,
            model_used=self._name
        )
