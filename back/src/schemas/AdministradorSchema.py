from pydantic import BaseModel, EmailStr, validator


class AdministradorBase(BaseModel):
    nombre: str
    apellido: str
    correo: EmailStr

    @validator("nombre", "apellido", "correo")
    def campo_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError("Este campo no puede estar vacío")
        return v


class AdministradorCreate(AdministradorBase):
    contrasena: str


class AdministradorOut(AdministradorBase):
    id: int

    class Config:
        orm_mode = True
