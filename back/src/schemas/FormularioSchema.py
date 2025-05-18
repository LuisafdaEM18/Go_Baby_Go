from pydantic import BaseModel
from back.src.schemas import PreguntaBase


class FormularioBase(BaseModel):
    nombre: str
    descripcion: str
    preguntas: list[PreguntaBase]