from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.db.database import Base, engine

from src.endpoints import formulario_router, evento_router, voluntario_router, auth_router

app = FastAPI(
    title="Go Baby Go API",
    description="API para gestión de eventos y formularios de Go Baby Go",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5176",
    "http://localhost:5177",
    "http://127.0.0.1:5177",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth_router.router)
app.include_router(formulario_router.router)
app.include_router(evento_router.router)
app.include_router(voluntario_router.router)

@app.get("/")
def root():
    return {"message": "Go Baby Go API"}