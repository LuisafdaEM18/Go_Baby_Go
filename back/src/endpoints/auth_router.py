from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from src.db.database import get_db
from src.schemas.AdministradorSchema import AdministradorCreate, AdministradorOut, AdministradorWithToken
from src.crud import administrador_crud
from src.core.auth import create_access_token

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