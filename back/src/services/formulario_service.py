from sqlalchemy.orm import Session
from src.modules.Formulario import Formulario
from src.modules.Pregunta import Pregunta
from src.schemas.FormularioSchema import FormularioBase

def crear_formulario(db: Session, formulario_data: FormularioBase):
    validar_nombre_unico_formulario(db, formulario_data.nombre)

    formulario = Formulario(nombre=formulario_data.nombre, descripcion=formulario_data.descripcion)
    db.add(formulario)
    db.commit()
    db.refresh(formulario)

    for pregunta_data in formulario_data.preguntas:
        pregunta = Pregunta(titulo=pregunta_data.titulo, descripcion=pregunta_data.descripcion, formulario_id=formulario.id)
        db.add(pregunta)

    db.commit()
    db.refresh(formulario)
    return formulario



def modificar_formulario(db: Session, formulario_id: int, formulario_data: FormularioBase):
    formulario = db.query(Formulario).filter(Formulario.id == formulario_id).first()

    if not formulario:
        raise ValueError("Formulario no encontrado")
    
    validar_nombre_unico_formulario(db, formulario_data.nombre)

    formulario.nombre = formulario_data.nombre
    formulario.descripcion = formulario_data.descripcion

    db.query(Pregunta).filter(Pregunta.formulario_id == formulario_id).delete()

    for pregunta_data in formulario_data.preguntas:
        nueva_pregunta = Pregunta(
            titulo=pregunta_data.titulo,
            descripcion=pregunta_data.descripcion,
            formulario_id=formulario_id
        )
        db.add(nueva_pregunta)

    db.commit()
    db.refresh(formulario)
    return formulario



def eliminar_formulario(db: Session, formulario_id: int):
    formulario = db.query(Formulario).filter(Formulario.id == formulario_id).first()

    if not formulario:
        raise ValueError("Formulario no encontrado")

    db.delete(formulario)
    db.commit()
    return {"mensaje": "Formulario eliminado correctamente"}



def validar_nombre_unico_formulario(db: Session, nombre: str, formulario_id: int = None):
    query = db.query(Formulario).filter_by(nombre=nombre)
    if formulario_id:
        query = query.filter(Formulario.id != formulario_id)
    if query.first():
        raise ValueError("Ya existe un formulario con ese nombre")
