from pydantic import BaseModel, EmailStr, validator

class VoluntarioBase(BaseModel):
    nombre: str
    apellido: str
    identificacion: str
    correo: EmailStr

    @validator("nombre", "apellido", "identificacion")
    def campo_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError("Este campo no puede estar vacío")
        return v