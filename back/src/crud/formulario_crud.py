from sqlalchemy.orm import Session
from src.db.database import Formulario, Pregunta, Opcion
from src.schemas.FormularioSchema import FormularioCreate, FormularioUpdate
from typing import List, Optional
from fastapi import HTTPException, status
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_formulario(db: Session, formulario_id: int):
    return db.query(Formulario).filter(Formulario.id == formulario_id).first()

def get_formularios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Formulario).offset(skip).limit(limit).all()

def create_formulario(db: Session, formulario: FormularioCreate):
    try:
        logger.info(f"Creando formulario: {formulario.nombre}")
        logger.info(f"Preguntas recibidas: {len(formulario.preguntas)}")
        
        # Crear el formulario principal
        db_formulario = Formulario(nombre=formulario.nombre)
        db.add(db_formulario)
        db.flush()
        
        # Crear las preguntas asociadas
        for i, pregunta in enumerate(formulario.preguntas):
            logger.info(f"Procesando pregunta {i+1}: {pregunta.texto[:30]}... (tipo: {pregunta.tipo})")
            
            # Validar el tipo de pregunta
            if pregunta.tipo not in ["textual", "seleccion_multiple", "seleccion_unica"]:
                logger.warning(f"Tipo de pregunta inválido: {pregunta.tipo}. Usando 'textual' por defecto.")
                pregunta_tipo = "textual"
            else:
                pregunta_tipo = pregunta.tipo
                
            db_pregunta = Pregunta(
                formulario_id=db_formulario.id,
                texto=pregunta.texto,
                tipo=pregunta_tipo
            )
            db.add(db_pregunta)
            db.flush()
            
            # Crear opciones para preguntas de selección
            if pregunta_tipo in ["seleccion_multiple", "seleccion_unica"]:
                if not pregunta.opciones:
                    logger.warning(f"Pregunta {i+1} de tipo {pregunta_tipo} no tiene opciones")
                    # Agregar una opción por defecto para evitar problemas
                    db_opcion = Opcion(
                        pregunta_id=db_pregunta.id,
                        texto_opcion="Opción 1"
                    )
                    db.add(db_opcion)
                    continue
                    
                logger.info(f"Procesando {len(pregunta.opciones)} opciones para pregunta {i+1}")
                
                for j, opcion in enumerate(pregunta.opciones):
                    # Verificar que la opción tiene el campo texto_opcion
                    texto_opcion = getattr(opcion, 'texto_opcion', None)
                    if not texto_opcion:
                        if hasattr(opcion, '__dict__'):
                            logger.warning(f"Opción sin texto_opcion. Datos recibidos: {opcion.__dict__}")
                        else:
                            logger.warning(f"Opción sin texto_opcion. Tipo: {type(opcion)}")
                        texto_opcion = f"Opción {j+1}"
                    else:
                        logger.info(f"Opción {j+1}: {texto_opcion[:20]}...")
                    
                    db_opcion = Opcion(
                        pregunta_id=db_pregunta.id,
                        texto_opcion=texto_opcion
                    )
                    db.add(db_opcion)
        
        # Confirmar cambios en la base de datos
        db.commit()
        db.refresh(db_formulario)
        logger.info(f"Formulario creado exitosamente con ID: {db_formulario.id}")
        return db_formulario
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error al crear formulario: {str(e)}")
        
        # Proporcionar un mensaje de error detallado
        error_msg = str(e)
        if "duplicate key" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un formulario con ese nombre"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al crear el formulario: {error_msg}"
            )

def update_formulario(db: Session, formulario_id: int, formulario: FormularioUpdate):
    try:
        logger.info(f"Actualizando formulario ID: {formulario_id}")
        
        db_formulario = get_formulario(db, formulario_id)
        if not db_formulario:
            logger.warning(f"Formulario ID {formulario_id} no encontrado")
            return None
        
        # Actualizar campos del formulario
        if formulario.nombre:
            logger.info(f"Actualizando nombre a: {formulario.nombre}")
            db_formulario.nombre = formulario.nombre
        
        # Actualizar preguntas si se proporcionaron
        if formulario.preguntas is not None:
            logger.info(f"Actualizando {len(formulario.preguntas)} preguntas")
            
            # Obtener IDs de preguntas existentes para eliminarlas
            pregunta_ids = [p.id for p in db_formulario.preguntas]
            
            # Eliminar opciones existentes de las preguntas
            if pregunta_ids:
                logger.info(f"Eliminando opciones de preguntas existentes: {pregunta_ids}")
                db.query(Opcion).filter(Opcion.pregunta_id.in_(pregunta_ids)).delete(synchronize_session=False)
                
            # Eliminar preguntas existentes
            logger.info(f"Eliminando preguntas existentes del formulario ID: {formulario_id}")
            db.query(Pregunta).filter(Pregunta.formulario_id == db_formulario.id).delete(synchronize_session=False)
            
            # Crear nuevas preguntas
            for i, pregunta in enumerate(formulario.preguntas):
                logger.info(f"Creando pregunta {i+1}: {pregunta.texto[:30]}...")
                
                db_pregunta = Pregunta(
                    formulario_id=db_formulario.id,
                    texto=pregunta.texto,
                    tipo=pregunta.tipo
                )
                db.add(db_pregunta)
                db.flush()
                
                # Crear opciones para preguntas de selección
                if pregunta.tipo in ["seleccion_multiple", "seleccion_unica"] and pregunta.opciones:
                    logger.info(f"Creando {len(pregunta.opciones)} opciones para pregunta {i+1}")
                    
                    for j, opcion in enumerate(pregunta.opciones):
                        db_opcion = Opcion(
                            pregunta_id=db_pregunta.id,
                            texto_opcion=opcion.texto_opcion
                        )
                        db.add(db_opcion)
        
        # Confirmar cambios en la base de datos
        db.commit()
        db.refresh(db_formulario)
        logger.info(f"Formulario ID {formulario_id} actualizado exitosamente")
        return db_formulario
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error al actualizar formulario ID {formulario_id}: {str(e)}")
        
        # Proporcionar un mensaje de error detallado
        error_msg = str(e)
        if "duplicate key" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un formulario con ese nombre"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al actualizar el formulario: {error_msg}"
            )

def delete_formulario(db: Session, formulario_id: int):
    try:
        logger.info(f"Eliminando formulario ID: {formulario_id}")
        
        # Obtener el formulario y sus preguntas
        db_formulario = get_formulario(db, formulario_id)
        if not db_formulario:
            logger.warning(f"Formulario ID {formulario_id} no encontrado")
            raise HTTPException(status_code=404, detail="Formulario no encontrado")
        
        # Eliminar las opciones de las preguntas primero
        for pregunta in db_formulario.preguntas:
            db.query(Opcion).filter(Opcion.pregunta_id == pregunta.id).delete(synchronize_session=False)
        
        # Eliminar las preguntas
        db.query(Pregunta).filter(Pregunta.formulario_id == formulario_id).delete(synchronize_session=False)
        
        # Finalmente eliminar el formulario
        db.delete(db_formulario)
        db.commit()
        logger.info(f"Formulario ID {formulario_id} eliminado exitosamente")
        return True
    
    except HTTPException as he:
        db.rollback()
        logger.error(f"Error HTTP al eliminar formulario ID {formulario_id}: {str(he)}")
        raise he
    except Exception as e:
        db.rollback()
        logger.error(f"Error al eliminar formulario ID {formulario_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el formulario: {str(e)}"
        ) 