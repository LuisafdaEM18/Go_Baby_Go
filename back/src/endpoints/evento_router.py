from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from src.db.database import get_db
from src.schemas.EventoSchema import EventoCreate, EventoOut, EventoUpdate, EventoWithVoluntariosOut
from src.crud import evento_crud

router = APIRouter(
    prefix="/api/eventos",
    tags=["eventos"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=EventoOut, status_code=status.HTTP_201_CREATED)
def crear_evento(evento: EventoCreate, db: Session = Depends(get_db)):
    return evento_crud.create_evento(db=db, evento=evento)

@router.get("/", response_model=List[EventoOut])
def obtener_eventos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    eventos = evento_crud.get_eventos(db, skip=skip, limit=limit)
    return eventos

@router.get("/stats", response_model=List[Dict[str, Any]])
def obtener_eventos_con_estadisticas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return evento_crud.get_eventos_with_stats(db, skip=skip, limit=limit)

@router.get("/{evento_id}", response_model=EventoOut)
def obtener_evento(evento_id: int, db: Session = Depends(get_db)):
    db_evento = evento_crud.get_evento(db, evento_id=evento_id)
    if db_evento is None:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return db_evento

@router.put("/{evento_id}", response_model=EventoOut)
def actualizar_evento(evento_id: int, evento: EventoUpdate, db: Session = Depends(get_db)):
    db_evento = evento_crud.update_evento(db, evento_id=evento_id, evento=evento)
    if db_evento is None:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return db_evento

@router.delete("/{evento_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_evento(evento_id: int, db: Session = Depends(get_db)):
    result = evento_crud.delete_evento(db, evento_id=evento_id)
    if not result:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return {"message": "Evento eliminado correctamente"} 