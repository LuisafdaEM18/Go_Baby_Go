from pydantic import BaseModel, root_validator, validator
from .PreguntaSchema import PreguntaBase, PreguntaOut

class FormularioBase(BaseModel):
    nombre: str
    descripcion: str

    @validator("nombre", "descripcion")
    def campo_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError("Este campo no puede estar vacío")
        return v

class FormularioCreate(FormularioBase):
    preguntas: list[PreguntaBase]

    @root_validator
    def validar_preguntas_no_vacias(cls, values):
        preguntas = values.get("preguntas")
        if not preguntas or len(preguntas) == 0:
            raise ValueError("El formulario debe tener al menos una pregunta.")
        titulos = [p.titulo for p in preguntas]
    
class FormularioOut(FormularioBase):
    id: int
    preguntas: list[PreguntaOut]

    class Config:
        orm_mode = True