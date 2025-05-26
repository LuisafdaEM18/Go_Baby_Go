#!/usr/bin/env python3
"""
Script de prueba para verificar que el login funciona correctamente
"""
import requests
import json

def test_login():
    """Test the login endpoint"""
    print("=== Prueba de Login ===\n")
    
    # Credenciales por defecto
    username = "admin@gobabygofundacion.org"
    password = "admin123"
    
    url = "http://localhost:8001/api/auth/login"
    
    # Preparar datos del formulario
    data = {
        'username': username,
        'password': password
    }
    
    try:
        print(f"Probando login con:")
        print(f"  📧 Email: {username}")
        print(f"  🔐 Password: {password}")
        print(f"  🌐 URL: {url}\n")
        
        # Realizar petición POST
        response = requests.post(url, data=data)
        
        print(f"📊 Respuesta del servidor:")
        print(f"  Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"  ✅ Login exitoso!")
            print(f"  👤 Usuario: {result.get('nombre', 'N/A')}")
            print(f"  📧 Email: {result.get('correo', 'N/A')}")
            print(f"  🆔 ID: {result.get('id', 'N/A')}")
            print(f"  🔑 Token: {result.get('token', 'N/A')[:50]}...")
            print("\n✅ El sistema de autenticación está funcionando correctamente!")
            
        else:
            print(f"  ❌ Error en login:")
            try:
                error_detail = response.json()
                print(f"  {json.dumps(error_detail, indent=2)}")
            except:
                print(f"  {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se pudo conectar al servidor.")
        print("   Asegúrate de que el backend esté ejecutándose en http://localhost:8001")
        
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

if __name__ == "__main__":
    test_login() 