from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel

from src.db.database import get_db
from src.schemas.VoluntarioSchema import VoluntarioCreate, VoluntarioOut, VoluntarioInscripcion
from src.crud import voluntario_crud

# Esquema para actualizar estado de inscripción
class ActualizarEstadoInscripcion(BaseModel):
    aceptado: bool

router = APIRouter(
    prefix="/api/voluntarios",
    tags=["voluntarios"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=VoluntarioOut, status_code=status.HTTP_201_CREATED)
def crear_voluntario(voluntario: VoluntarioCreate, db: Session = Depends(get_db)):
    return voluntario_crud.create_voluntario(db=db, voluntario=voluntario)

@router.get("/", response_model=List[VoluntarioOut])
def obtener_voluntarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    voluntarios = voluntario_crud.get_voluntarios(db, skip=skip, limit=limit)
    return voluntarios

@router.get("/{voluntario_id}", response_model=VoluntarioOut)
def obtener_voluntario(voluntario_id: int, db: Session = Depends(get_db)):
    db_voluntario = voluntario_crud.get_voluntario(db, voluntario_id=voluntario_id)
    if db_voluntario is None:
        raise HTTPException(status_code=404, detail="Voluntario no encontrado")
    return db_voluntario

@router.post("/inscripcion/", status_code=status.HTTP_201_CREATED)
def inscribir_voluntario(inscripcion: VoluntarioInscripcion, db: Session = Depends(get_db)):
    result = voluntario_crud.inscribir_voluntario(db=db, inscripcion=inscripcion)
    
    # Si hay un error, devolver el mensaje
    if isinstance(result, tuple) and len(result) == 2:
        message, status_code = result
        raise HTTPException(status_code=status_code, detail=message["message"])
        
    return result

@router.get("/inscripciones/evento/{evento_id}")
def obtener_inscripciones_por_evento(evento_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    inscripciones = voluntario_crud.get_inscripciones_by_evento(
        db, evento_id=evento_id, skip=skip, limit=limit
    )
    return inscripciones

@router.get("/inscripciones/evento/{evento_id}/detalladas")
def obtener_inscripciones_detalladas(evento_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    inscripciones = voluntario_crud.get_inscripciones_detalladas_by_evento(
        db, evento_id=evento_id, skip=skip, limit=limit
    )
    return inscripciones

@router.put("/inscripciones/{inscripcion_id}/aceptar")
def aceptar_inscripcion(
    inscripcion_id: int, 
    datos: ActualizarEstadoInscripcion, 
    db: Session = Depends(get_db)
):
    db_inscripcion = voluntario_crud.actualizar_estado_inscripcion(
        db, inscripcion_id=inscripcion_id, aceptado=datos.aceptado
    )
    if db_inscripcion is None:
        raise HTTPException(status_code=404, detail="Inscripción no encontrada")
    return db_inscripcion

@router.post("/inscripciones/{inscripcion_id}/respuestas/{tipo_formulario}")
def guardar_respuestas(
    inscripcion_id: int, 
    tipo_formulario: str,
    respuestas: Dict[str, Any],
    db: Session = Depends(get_db)
):
    if tipo_formulario not in ["pre", "post"]:
        raise HTTPException(
            status_code=400, 
            detail="El tipo de formulario debe ser 'pre' o 'post'"
        )
        
    result = voluntario_crud.guardar_respuestas_formulario(
        db, inscripcion_id=inscripcion_id, tipo_formulario=tipo_formulario, respuestas=respuestas
    )
    
    if result is None:
        raise HTTPException(status_code=404, detail="Inscripción no encontrada")
        
    return result 