from pydantic import BaseModel, validator, Field
from datetime import date
from typing import Optional
from .FormularioSchema import FormularioOut

class EventoBase(BaseModel):
    nombre: str
    fecha_evento: date
    lugar: str
    descripcion: str

    @validator("nombre", "lugar", "descripcion")
    def campo_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError("Este campo no puede estar vacío")
        return v

    @validator("fecha_evento")
    def fecha_no_pasada(cls, v):
        from datetime import date
        if v < date.today():
            raise ValueError("La fecha del evento no puede estar en el pasado")
        return v
    
class EventoCreate(EventoBase):
    formulario_pre_evento: Optional[int] = None
    formulario_post_evento: Optional[int] = None
    
class EventoUpdate(BaseModel):
    nombre: Optional[str] = None
    fecha_evento: Optional[date] = None
    lugar: Optional[str] = None
    descripcion: Optional[str] = None
    formulario_pre_evento: Optional[int] = None
    formulario_post_evento: Optional[int] = None

class EventoOut(EventoBase):
    id: int
    formulario_pre: Optional[FormularioOut] = None
    formulario_post: Optional[FormularioOut] = None

    class Config:
        from_attributes = True
        
class EventoWithVoluntariosOut(EventoOut):
    total_voluntarios: int = 0
    voluntarios_aceptados: int = 0
