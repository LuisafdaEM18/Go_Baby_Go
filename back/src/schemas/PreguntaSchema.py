from pydantic import BaseModel

class PreguntaBase(BaseModel):
    titulo: str
    descripcion: str