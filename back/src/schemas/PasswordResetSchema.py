from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    message: str
    success: bool = True


class ResetPasswordRequest(BaseModel):
    token: str
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres')
        if not any(c.islower() for c in v):
            raise ValueError('La contraseña debe contener al menos una letra minúscula')
        if not any(c.isupper() for c in v):
            raise ValueError('La contraseña debe contener al menos una letra mayúscula')
        if not any(c.isdigit() for c in v):
            raise ValueError('La contraseña debe contener al menos un número')
        return v


class ResetPasswordResponse(BaseModel):
    message: str
    success: bool = True


class TokenValidationResponse(BaseModel):
    valid: bool
    message: Optional[str] = None


class PasswordResetTokenOut(BaseModel):
    id: int
    admin_id: int
    token: str
    expires_at: datetime
    used: bool
    created_at: datetime

    class Config:
        from_attributes = True 