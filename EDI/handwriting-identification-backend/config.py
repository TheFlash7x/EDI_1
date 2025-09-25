from pydantic_settings import BaseSettings
from pydantic import Field, ConfigDict


class Settings(BaseSettings):
    app_name: str = "Handwriting Writer Identification Backend"
    mongo_uri: str = Field(...)
    database_name: str = "handwriting_identification"
    port: int = 5501

    model_config = ConfigDict(env_file=".env", env_prefix="")


settings = Settings()
