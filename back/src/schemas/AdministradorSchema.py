from pydantic import BaseModel, EmailStr, validator
from typing import Optional


class AdministradorBase(BaseModel):
    nombre: str
    correo: EmailStr

    @validator("nombre")
    def campo_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError("Este campo no puede estar vacío")
        return v


class AdministradorCreate(AdministradorBase):
    contrasena: str

    @validator("contrasena")
    def contrasena_fuerte(cls, v):
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        return v


class AdministradorLogin(BaseModel):
    correo: EmailStr
    contrasena: str


class AdministradorOut(AdministradorBase):
    id: int

    class Config:
        from_attributes = True


class AdministradorWithToken(AdministradorOut):
    token: str
