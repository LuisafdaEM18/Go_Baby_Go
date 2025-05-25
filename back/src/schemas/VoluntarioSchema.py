from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional

class VoluntarioBase(BaseModel):
    nombre: str
    correo: EmailStr
    confirmacion_correo: EmailStr
    numero_identificacion: str

    @validator("nombre", "numero_identificacion")
    def campo_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError("Este campo no puede estar vacío")
        return v
    
    @validator('confirmacion_correo')
    def emails_match(cls, v, values):
        if 'correo' in values and v != values['correo']:
            raise ValueError('Los correos electrónicos no coinciden')
        return v

class VoluntarioCreate(VoluntarioBase):
    aceptacion_terminos: bool = Field(..., description="Indica si el voluntario acepta los términos y condiciones")
    
    @validator('aceptacion_terminos')
    def must_accept_terms(cls, v):
        if not v:
            raise ValueError('Debe aceptar los términos y condiciones para continuar')
        return v

class VoluntarioInscripcion(VoluntarioBase):
    evento_id: int
    aceptacion_terminos: bool = Field(..., description="Indica si el voluntario acepta los términos y condiciones")
    
    @validator('aceptacion_terminos')
    def must_accept_terms(cls, v):
        if not v:
            raise ValueError('Debe aceptar los términos y condiciones para continuar')
        return v

class VoluntarioOut(VoluntarioBase):
    id: int

    class Config:
        from_attributes = True