from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.schemas.EventoSchema import EventoBase
from src.services.evento_service import crear_evento, modificar_evento
from src.db.database import get_db

router = APIRouter(prefix="/eventos", tags=["Eventos"])

@router.post("/")
def crear_evento_endpoint(evento_data: EventoBase, formulario_pre_id: int, formulario_post_id: int, db: Session = Depends(get_db)):
    try:
        return crear_evento(db, evento_data, formulario_pre_id, formulario_post_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{evento_id}")
def modificar_evento_endpoint(evento_id: int, evento_data: EventoBase, formulario_pre_id: int, formulario_post_id: int, db: Session = Depends(get_db)):
    try:
        return modificar_evento(db, evento_id, evento_data, formulario_pre_id, formulario_post_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
