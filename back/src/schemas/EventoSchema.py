from pydantic import BaseModel, validator
from datetime import date
from .FormularioSchema import FormularioOut

class EventoBase(BaseModel):
    nombre: str
    fecha: date
    hora: str
    lugar: str
    descripcion: str

    @validator("nombre", "hora", "lugar", "descripcion")
    def campo_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError("Este campo no puede estar vacío")
        return v

    @validator("fecha")
    def fecha_no_pasada(cls, v):
        from datetime import date
        if v < date.today():
            raise ValueError("La fecha del evento no puede estar en el pasado")
        return v
    
class EventoCreate(EventoBase):
    formulario_pre_id: int
    formulario_post_id: int

class EventoOut(EventoBase):
    id: int
    formulario_pre: FormularioOut
    formulario_post: FormularioOut

    class Config:
        orm_mode = True