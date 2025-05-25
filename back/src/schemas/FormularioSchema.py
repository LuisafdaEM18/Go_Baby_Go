from pydantic import BaseModel, validator, model_validator
from typing import List, Optional
from datetime import datetime
from .PreguntaSchema import PreguntaBase, PreguntaOut, PreguntaCreate

class FormularioBase(BaseModel):
    nombre: str

    @validator("nombre")
    def campo_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError("Este campo no puede estar vacío")
        return v

class FormularioCreate(FormularioBase):
    preguntas: List[PreguntaCreate]

    @model_validator(mode='after')
    def validar_preguntas_no_vacias(self):
        preguntas = self.preguntas
        if not preguntas or len(preguntas) == 0:
            raise ValueError("El formulario debe tener al menos una pregunta.")
        return self
    
class FormularioUpdate(FormularioBase):
    preguntas: Optional[List[PreguntaCreate]] = None
    
class FormularioOut(FormularioBase):
    id: int
    fecha_creacion: datetime
    preguntas: List[PreguntaOut] = []

    class Config:
        from_attributes = True