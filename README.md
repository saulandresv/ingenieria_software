# Sistema de Modernización y Fiscalización Aduanera

## 📋 Descripción del Proyecto

Sistema para digitalizar y automatizar trámites aduaneros, reduciendo tiempos de espera y mejorando la interoperabilidad entre servicios nacionales e internacionales.

## 🎯 Propósito del Software

El sistema busca automatizar trámites aduaneros en pasos fronterizos terrestres de Chile, con énfasis en puntos de alto flujo. Incluye validación de documentos para personas, vehículos y productos regulados.

## 🏗️ Arquitectura (Modelo 4+1)

### 📖 Vista de Escenarios
- **Actores:** Turista, Funcionario, Auditor
- **Casos de Uso:** Gestión de trámites, validación, reportes, auditoría

### 🧠 Vista Lógica
- **Entidades:** Usuario, Trámite, Documento, Auditoría, Reporte
- **Relaciones:** Usuarios tienen roles, trámites tienen estados, auditoría registra cambios

### ⚙️ Vista de Procesos
1. **Autenticación** → Login con roles diferenciados
2. **Creación de Trámite** → Formulario de salida de vehículo
3. **Validación** → Revisión por funcionario
4. **Decisión** → Aprobación/Rechazo con comentarios
5. **Auditoría** → Registro y trazabilidad completa

### 🏗️ Vista de Desarrollo
```
src/
├── views/           # Interfaz de usuario
│   ├── Login.vue
│   ├── TuristaPanel.vue
│   ├── FormularioVehiculo.vue
│   ├── FuncionarioPanel.vue
│   └── AuditoriaPanel.vue
├── services/        # Lógica de negocio
│   └── auth.js
├── router/          # Navegación
│   └── index.js
└── api/             # Servicios externos
    ├── login.js
    ├── register.js
    └── tramites.js
```

### 🌐 Vista Física
- **Frontend:** Vue.js 3 + Vite
- **Backend:** Serverless Functions (Vercel)
- **Base de Datos:** JSON simulada (extensible a PostgreSQL/MongoDB)
- **Comunicación:** HTTPS + REST API
- **Despliegue:** Vercel (GitHub integration)

## 👥 Roles del Sistema

### 🚢 Turista
- Crear trámites de salida temporal de vehículos
- Consultar estado de trámites
- Ver historial de solicitudes

### 🏛️ Funcionario
- Revisar trámites pendientes
- Aprobar/rechazar con comentarios
- Filtrar y buscar trámites
- Validar documentación

### 📊 Auditor
- Supervisar el sistema completo
- Generar reportes estadísticos
- Trazabilidad de actividades
- Análisis de tendencias

## 🔧 Tecnologías Utilizadas

### Frontend
- **Vue.js 3** - Framework progressive
- **Vue Router** - Navegación SPA
- **CSS3** - Estilos responsivos
- **Vite** - Build tool rápido

### Backend
- **Node.js** - Runtime JavaScript
- **Serverless Functions** - Escalabilidad automática
- **JSON** - Almacenamiento de datos (temporal)

### Herramientas de Desarrollo
- **npm** - Gestión de dependencias
- **Git** - Control de versiones
- **VS Code** - Editor de código

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm 9+
- Git

### Instalación Local
```bash
# Clonar repositorio
git clone [repository-url]
cd turista-tramites

# Instalar dependencias
npm install

# Ejecutar desarrollo
npm run dev

# Construir para producción
npm run build
```

### Variables de Entorno
```env
NODE_ENV=development|production
API_BASE_URL=http://localhost:3000
```

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
