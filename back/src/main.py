from fastapi import FastAPI
from src.db.database import Base, engine

from src.endpoints import evento_router, formulario_router, voluntario_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(formulario_router.router)
app.include_router(evento_router.router)
app.include_router(voluntario_router.router)