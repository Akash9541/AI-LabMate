import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "AI LabMate"
    APP_VERSION: str = "1.0.0-SNAPDRAGON"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    MODEL_PROVIDER: str = os.getenv("MODEL_PROVIDER", "qualcomm_ai_hub_fallback")
    DEVICE_ACCELERATOR: str = os.getenv("DEVICE_ACCELERATOR", "NPU")

settings = Settings()
