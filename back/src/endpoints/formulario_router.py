from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from src.db.database import get_db
from src.schemas.FormularioSchema import FormularioCreate, FormularioOut, FormularioUpdate
from src.crud import formulario_crud

# Configurar logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/formularios",
    tags=["formularios"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=FormularioOut, status_code=status.HTTP_201_CREATED)
def crear_formulario(formulario: FormularioCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Recibida solicitud para crear formulario: {formulario.nombre}")
        logger.info(f"Cantidad de preguntas recibidas: {len(formulario.preguntas)}")
        
        # Validar que el formulario tenga al menos una pregunta
        if not formulario.preguntas or len(formulario.preguntas) == 0:
            logger.warning("Intento de crear formulario sin preguntas")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El formulario debe tener al menos una pregunta"
            )
        
        # Validar que todas las preguntas tengan texto
        for i, pregunta in enumerate(formulario.preguntas):
            if not pregunta.texto or not pregunta.texto.strip():
                logger.warning(f"Pregunta {i+1} sin texto")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"La pregunta {i+1} debe tener texto"
                )
            
            # Validar que las preguntas de selección tengan opciones
            if pregunta.tipo in ["seleccion_multiple", "seleccion_unica"]:
                if not pregunta.opciones or len(pregunta.opciones) == 0:
                    logger.warning(f"Pregunta {i+1} de tipo {pregunta.tipo} sin opciones")
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"La pregunta {i+1} de tipo {pregunta.tipo} debe tener al menos una opción"
                    )
                
                # Validar que todas las opciones tengan texto
                for j, opcion in enumerate(pregunta.opciones):
                    if not hasattr(opcion, 'texto_opcion') or not opcion.texto_opcion or not opcion.texto_opcion.strip():
                        logger.warning(f"Opción {j+1} de la pregunta {i+1} sin texto")
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"La opción {j+1} de la pregunta {i+1} debe tener texto"
                        )
        
        nuevo_formulario = formulario_crud.create_formulario(db=db, formulario=formulario)
        logger.info(f"Formulario creado exitosamente con ID: {nuevo_formulario.id}")
        return nuevo_formulario
        
    except HTTPException:
        # Re-lanzar excepciones HTTP ya formateadas
        raise
        
    except Exception as e:
        logger.error(f"Error inesperado al crear formulario: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear el formulario: {str(e)}"
        )

@router.get("/", response_model=List[FormularioOut])
def obtener_formularios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    formularios = formulario_crud.get_formularios(db, skip=skip, limit=limit)
    return formularios

@router.get("/{formulario_id}", response_model=FormularioOut)
def obtener_formulario(formulario_id: int, db: Session = Depends(get_db)):
    db_formulario = formulario_crud.get_formulario(db, formulario_id=formulario_id)
    if db_formulario is None:
        raise HTTPException(status_code=404, detail="Formulario no encontrado")
    return db_formulario

@router.put("/{formulario_id}", response_model=FormularioOut)
def actualizar_formulario(formulario_id: int, formulario: FormularioUpdate, db: Session = Depends(get_db)):
    db_formulario = formulario_crud.update_formulario(db, formulario_id=formulario_id, formulario=formulario)
    if db_formulario is None:
        raise HTTPException(status_code=404, detail="Formulario no encontrado")
    return db_formulario

@router.delete("/{formulario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_formulario(formulario_id: int, db: Session = Depends(get_db)):
    result = formulario_crud.delete_formulario(db, formulario_id=formulario_id)
    if not result:
        raise HTTPException(status_code=404, detail="Formulario no encontrado")
    return {"message": "Formulario eliminado correctamente"} 