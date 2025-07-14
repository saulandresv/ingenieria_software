# Turista Trámites

Sistema de gestión de trámites para turistas en aduanas chilenas.

## Configuración de Base de Datos

### Opción Recomendada: Vercel KV

Para una conexión rápida y segura, usa Vercel KV:

1. **Crear proyecto en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Crea un nuevo proyecto
   - Conecta tu repositorio de GitHub

2. **Configurar Vercel KV:**
   - En el dashboard de Vercel, ve a Storage
   - Crea una nueva base de datos KV
   - Copia las variables de entorno automáticamente

3. **Variables de entorno:**
   Vercel configurará automáticamente:
   ```
   KV_URL=redis://...
   KV_REST_API_URL=https://...
   KV_REST_API_TOKEN=...
   KV_REST_API_READ_ONLY_TOKEN=...
   ```

4. **Instalar dependencias:**
   ```bash
   npm install
   ```

5. **Desplegar:**
   ```bash
   git push origin main
   ```

## Desarrollo

```bash
npm run dev
```

## Despliegue

El proyecto está configurado para desplegar en Vercel con KV como base de datos.

## 👤 Usuarios de Prueba

```javascript
// Turista
Email: turista@example.com
Password: turista123

// Funcionario  
Email: funcionario@aduana.com
Password: func123

// Auditor
Email: admin@aduana.com
Password: admin123
```

## 📊 Funcionalidades Principales

### ✨ Gestión de Trámites
- Formulario completo de salida temporal
- Validación en tiempo real
- Estados: En revisión, Aprobado, Rechazado
- Comentarios del funcionario

### 🔍 Sistema de Filtros
- Por estado, fecha, usuario
- Búsqueda en tiempo real
- Paginación automática

### 📈 Dashboard y Estadísticas
- Métricas por rol
- Gráficos de tendencias
- Actividad reciente
- Reportes exportables

### 🔐 Seguridad
- Autenticación por roles
- Validación de sesiones
- Rutas protegidas
- Datos encriptados

## 🌟 Estándares de Calidad

### ISO/IEC 25010
- **Funcionalidad:** Completitud, corrección, pertinencia
- **Confiabilidad:** Madurez, tolerancia a fallos, recuperabilidad
- **Usabilidad:** Comprensibilidad, aprendizaje, operabilidad
- **Eficiencia:** Tiempo, recursos, capacidad
- **Mantenibilidad:** Modularidad, reutilización, modificabilidad
- **Portabilidad:** Adaptabilidad, instalabilidad

### Buenas Prácticas
- ✅ Código modular y reutilizable
- ✅ Separación de responsabilidades
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Responsive design
- ✅ Documentación completa

## 📱 Características Responsivas

### Móvil (< 768px)
- Navegación adaptativa
- Formularios optimizados
- Botones touch-friendly
- Tipografía legible

### Tablet (768px - 1024px)
- Layout de 2 columnas
- Menús colapsibles
- Cards reorganizadas

### Desktop (> 1024px)
- Layout completo
- Múltiples columnas
- Hover effects
- Navegación completa

## 🔄 Flujo de Trabajo

### 1. Desarrollo
```bash
npm run dev
```

### 2. Testing
```bash
npm run test
```

### 3. Build
```bash
npm run build
```

### 4. Deploy
```bash
# Automático via GitHub → Vercel
git push origin main
```

## 📞 Soporte y Contacto

### Desarrolladores
- **Jesús Santis** - Frontend Developer
- **Saúl Vega** - Backend Developer

### Asignatura
- **Ingeniería de Software**
- **Docente:** Federico Loshe
- **Fecha:** 18/05/2025

## 📄 Licencia

Este proyecto es parte de un trabajo académico de Ingeniería de Software.

## 🔗 Enlaces Útiles

- [Vue.js Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Vercel Deployment](https://vercel.com/)

---

**© 2025 Sistema de Modernización y Fiscalización Aduanera**
