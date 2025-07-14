<script>
export default {
  name: 'App'
}
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* Estilos globales mejorados */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f8f9fa;
}

#app {
  min-height: 100vh;
}

/* Utilidades globales */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }

.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }

/* Botones globales */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

/* Cards globales */
.card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}

.card-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* Formularios globales */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 5px;
  font-size: 0.875rem;
  color: #dc3545;
}

/* Estados de carga */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.1rem;
  color: #666;
}

.loading::before {
  content: '';
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state h3 {
  margin-bottom: 15px;
  color: #333;
}

/* Alertas globales */
.alert {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 8px;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert-warning {
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeaa7;
}

.alert-info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 15px;
}

.badge-primary { background-color: #667eea; color: white; }
.badge-secondary { background-color: #6c757d; color: white; }
.badge-success { background-color: #28a745; color: white; }
.badge-danger { background-color: #dc3545; color: white; }
.badge-warning { background-color: #ffc107; color: #212529; }
.badge-info { background-color: #17a2b8; color: white; }

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  
  .card {
    padding: 15px;
  }
  
  .form-control {
    padding: 10px;
  }
}

/* Animaciones */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Selección de texto */
::selection {
  background-color: rgba(102, 126, 234, 0.3);
  color: #333;
}

/* Focus visible para accesibilidad */
*:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
</style>
