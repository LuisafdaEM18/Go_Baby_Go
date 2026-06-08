import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.main import app
from src.db.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture()
def client(setup_database):
    with TestClient(app) as c:
        yield c

def test_register_and_login(client):
    admin_data = {
        "nombre": "Admin Prueba",
        "correo": "admin_test@gobabygofundacion.org",
        "contrasena": "admin1234"
    }
    response = client.post("/api/auth/register", json=admin_data)
    assert response.status_code == 201
    data = response.json()
    assert data["nombre"] == "Admin Prueba"
    assert data["correo"] == "admin_test@gobabygofundacion.org"
    assert "id" in data

    login_data = {
        "username": "admin_test@gobabygofundacion.org",
        "password": "admin1234"
    }
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["correo"] == "admin_test@gobabygofundacion.org"

def test_login_invalid_credentials(client):
    login_data = {
        "username": "no_existe@gobabygofundacion.org",
        "password": "wrongpassword"
    }
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Correo o contraseña incorrectos"