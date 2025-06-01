from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from src.db.database import get_db
from src.schemas.AdministradorSchema import AdministradorCreate, AdministradorOut, AdministradorWithToken
from src.schemas.PasswordResetSchema import (
    ForgotPasswordRequest, 
    ForgotPasswordResponse, 
    ResetPasswordRequest, 
    ResetPasswordResponse,
    TokenValidationResponse
)
from src.crud import administrador_crud
from src.core.auth import create_access_token
from src.services.password_reset_service import password_reset_service

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)

@router.post("/register", response_model=AdministradorOut, status_code=status.HTTP_201_CREATED)
def register(admin: AdministradorCreate, db: Session = Depends(get_db)):
    db_admin = administrador_crud.get_administrador_by_email(db, email=admin.correo)
    if db_admin:
        raise HTTPException(
            status_code=400,
            detail="Este correo ya está registrado"
        )
    return administrador_crud.create_administrador(db=db, administrador=admin)

@router.post("/login", response_model=AdministradorWithToken)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    admin = administrador_crud.authenticate_administrador(
        db, email=form_data.username, password=form_data.password
    )
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": admin.correo})
    
    return {
        "id": admin.id,
        "nombre": admin.nombre,
        "correo": admin.correo,
        "token": access_token
    }

@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Solicita el envío de un enlace de recuperación de contraseña"""
    try:
        # Buscar administrador por email
        admin = administrador_crud.get_administrador_by_email(db, email=request.email)
        
        if admin:
            # Generar token de recuperación
            reset_token = password_reset_service.create_reset_token(db, admin)
            
            # Enviar correo
            email_sent = password_reset_service.send_reset_email(admin, reset_token.token)
            
            if not email_sent:
                raise HTTPException(
                    status_code=500,
                    detail="Error al enviar el correo de recuperación"
                )
        
        # Por seguridad, siempre devolvemos el mismo mensaje
        return ForgotPasswordResponse(
            message="Si el correo está registrado, recibirás un enlace de recuperación en breve",
            success=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error en forgot_password: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error interno del servidor"
        )

@router.get("/validate-reset-token/{token}", response_model=TokenValidationResponse)
def validate_reset_token(token: str, db: Session = Depends(get_db)):
    """Valida si un token de recuperación es válido"""
    try:
        reset_token = password_reset_service.validate_token(db, token)
        
        if reset_token:
            return TokenValidationResponse(
                valid=True,
                message="Token válido"
            )
        else:
            return TokenValidationResponse(
                valid=False,
                message="Token inválido o expirado"
            )
            
    except Exception as e:
        print(f"Error validando token: {str(e)}")
        return TokenValidationResponse(
            valid=False,
            message="Error al validar el token"
        )

@router.post("/reset-password", response_model=ResetPasswordResponse)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Restablece la contraseña usando un token de recuperación"""
    try:
        # Usar el token para cambiar la contraseña
        success = password_reset_service.use_token(db, request.token, request.password)
        
        if not success:
            raise HTTPException(
                status_code=400,
                detail="Token inválido, expirado o ya utilizado"
            )
        
        # Limpiar tokens expirados
        password_reset_service.cleanup_expired_tokens(db)
        
        return ResetPasswordResponse(
            message="Contraseña restablecida exitosamente",
            success=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error en reset_password: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error interno del servidor"
        ) 