from sqlalchemy.orm import Session
from src.modules.Voluntario import Voluntario
from src.schemas.VoluntarioSchema import VoluntarioCreate

def registrar_voluntario(db: Session, voluntario_data: VoluntarioCreate):
    voluntario_existente = db.query(Voluntario).filter(Voluntario.identificacion == voluntario_data.identificacion).first()
    if voluntario_existente:
        raise ValueError("Ya existe un voluntario con esa identificación")

    nuevo_voluntario = Voluntario(**voluntario_data.dict())
    db.add(nuevo_voluntario)
    db.commit()
    db.refresh(nuevo_voluntario)
    return nuevo_voluntario