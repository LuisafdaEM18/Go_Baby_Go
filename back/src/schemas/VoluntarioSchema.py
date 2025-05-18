from pydantic import BaseModel

class VoluntarioBase(BaseModel):
    nombre: str
    apellido: str
    identificacion: str
    correo: str