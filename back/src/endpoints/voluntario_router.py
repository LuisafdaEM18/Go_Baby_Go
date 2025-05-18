from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.schemas.VoluntarioSchema import VoluntarioBase
from src.services.voluntario_service import registrar_voluntario
from src.db.database import get_db

router = APIRouter(prefix="/voluntarios", tags=["Voluntarios"])

@router.post("/")
def registrar_voluntario_endpoint(voluntario_data: VoluntarioBase, db: Session = Depends(get_db)):
    try:
        return registrar_voluntario(db, voluntario_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
