from pydantic import BaseModel
from datetime import date
from back.src.schemas import FormularioBase


class EventoBase(BaseModel):
    nombre: str
    fecha: date
    hora: str
    lugar: str 
    descripcion: str
    forumulario_preevento: FormularioBase
    forumulario_postevento: FormularioBase