from pydantic import BaseModel, validator

class PreguntaBase(BaseModel):
    titulo: str
    descripcion: str

    @validator("titulo", "descripcion")
    def campo_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError("Este campo no puede estar vacío")
        return v