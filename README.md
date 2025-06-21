# 🚢 Turista Trámites - Sistema de Gestión Aduanera

Sistema web para la gestión de trámites aduaneros de vehículos de turistas.

## 🚀 Tecnologías

- **Frontend**: Vue.js 3 + Vue Router + Vite
- **Backend**: Vercel Serverless Functions
- **Deploy**: Vercel desde GitHub

## 🌐 Deploy Automático

### Subir a GitHub y Deploy en Vercel:

1. **Push a GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Conectar en Vercel**:
   - Ir a [vercel.com](https://vercel.com)
   - "New Project" → Import from GitHub
   - Seleccionar este repositorio
   - Deploy automático ✅

## 👥 Usuarios de Prueba

- **Admin**: `admin@aduana.com` / `admin123`
- **Turista**: `turista@example.com` / `turista123`
- **Funcionario**: `funcionario@aduana.com` / `func123`

## 🎯 Funcionalidades

- ✅ Sistema de autenticación completo
- ✅ Panel de Turista
- ✅ Panel de Funcionario  
- ✅ Panel de Auditoría
- ✅ Formulario de Vehículos

## 📡 API Endpoints

- `POST /api/login` - Autenticación
- `POST /api/register` - Registro
- `GET /api/tramites` - Listar trámites
- `POST /api/tramites` - Crear trámite

---

**🚀 Listo para producción en Vercel!**
