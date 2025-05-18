from pydantic import BaseModel, validator
from typing import List
from .PreguntaSchema import PreguntaBase

class FormularioBase(BaseModel):
    nombre: str
    descripcion: str
    preguntas: List[PreguntaBase]

    @validator("nombre", "descripcion")
    def campo_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError("Este campo no puede estar vacío")
        return v

    @validator("preguntas")
    def al_menos_una_pregunta(cls, v):
        if not v or len(v) == 0:
            raise ValueError("Debe haber al menos una pregunta")
        return v