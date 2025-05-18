from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.schemas.FormularioSchema import FormularioBase
from src.services.formulario_service import crear_formulario, modificar_formulario, eliminar_formulario
from src.db.database import get_db

router = APIRouter(prefix="/formularios", tags=["Formularios"])

@router.post("/")
def crear_formulario_endpoint(formulario_data: FormularioBase, db: Session = Depends(get_db)):
    try:
        return crear_formulario(db, formulario_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{formulario_id}")
def modificar_formulario_endpoint(formulario_id: int, formulario_data: FormularioBase, db: Session = Depends(get_db)):
    try:
        return modificar_formulario(db, formulario_id, formulario_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{formulario_id}")
def eliminar_formulario_endpoint(formulario_id: int, db: Session = Depends(get_db)):
    try:
        return eliminar_formulario(db, formulario_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))