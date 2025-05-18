from pydantic import BaseModel, EmailStr, validator

class AdministradorBase(BaseModel):
    nombre: str
    apellido: str
    correo: EmailStr
    contrasena: str

    @validator("nombre", "apellido", "contrasena")
    def campo_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError("Este campo no puede estar vacío")
        return v