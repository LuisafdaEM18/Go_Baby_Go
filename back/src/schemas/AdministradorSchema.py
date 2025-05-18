from pydantic import BaseModel

class AdministradorBase(BaseModel):
    nombre: str
    apellido: str
    correo: str
    contrasena: str