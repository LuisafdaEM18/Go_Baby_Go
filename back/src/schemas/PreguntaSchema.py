from pydantic import BaseModel, validator
from typing import List, Optional, Literal

class OpcionBase(BaseModel):
    texto_opcion: str

    @validator("texto_opcion")
    def campo_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError("Este campo no puede estar vacío")
        return v

class OpcionCreate(OpcionBase):
    pass

class OpcionOut(OpcionBase):
    id: int

    class Config:
        from_attributes = True

class PreguntaBase(BaseModel):
    texto: str
    tipo: Literal["textual", "seleccion_multiple", "seleccion_unica"]

    @validator("texto")
    def campo_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError("Este campo no puede estar vacío")
        return v

class PreguntaCreate(PreguntaBase):
    opciones: Optional[List[OpcionBase]] = []

class PreguntaOut(PreguntaBase):
    id: int
    opciones: List[OpcionOut] = []

    class Config:
        from_attributes = True