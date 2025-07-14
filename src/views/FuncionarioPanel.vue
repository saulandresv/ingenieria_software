<template>
  <div class="funcionario-panel">
    <header class="panel-header">
      <h1>🏛️ Panel del Funcionario</h1>
      <div class="user-info">
        <span>Funcionario de Aduana</span>
        <button @click="logout" class="logout-btn">Cerrar Sesión</button>
      </div>
    </header>

    <div class="dashboard">
      <!-- Estadísticas -->
      <div class="stats-cards">
        <div class="stat-card pending">
          <h3>{{ tramitesPendientes }}</h3>
          <p>Pendientes de Revisión</p>
        </div>
        <div class="stat-card today">
          <h3>{{ tramitesHoy }}</h3>
          <p>Procesados Hoy</p>
        </div>
        <div class="stat-card total">
          <h3>{{ tramitesTotal }}</h3>
          <p>Total de Trámites</p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <h2>🔍 Filtros de Búsqueda</h2>
        <div class="filters">
          <div class="filter-group">
            <label>Estado:</label>
            <select v-model="filtros.estado">
              <option value="">Todos los estados</option>
              <option value="En revisión">En revisión</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Fecha:</label>
            <input v-model="filtros.fecha" type="date" />
          </div>
          <div class="filter-group">
            <label>Usuario:</label>
            <input v-model="filtros.usuario" type="text" placeholder="Buscar por nombre..." />
          </div>
          <button @click="limpiarFiltros" class="btn-secondary">Limpiar</button>
        </div>
      </div>

      <!-- Lista de Trámites -->
      <div class="tramites-section">
        <div class="section-header">
          <h2>📋 Trámites para Revisión</h2>
          <button @click="refreshTramites" class="btn-refresh">🔄 Actualizar</button>
        </div>

        <div v-if="loading" class="loading">
          ⏳ Cargando trámites...
        </div>

        <div v-else-if="tramitesFiltrados.length === 0" class="empty-state">
          <h3>📂 No hay trámites para mostrar</h3>
          <p>No se encontraron trámites con los filtros aplicados</p>
        </div>

        <div v-else class="tramites-list">
          <div v-for="tramite in tramitesFiltrados" :key="tramite.id" class="tramite-card">
            <div class="tramite-header">
              <div class="tramite-info">
                <h3>🚗 {{ tramite.tipo?.replace('_', ' ').toUpperCase() || 'TRÁMITE' }}</h3>
                <p><strong>ID:</strong> #{{ tramite.id }}</p>
                <p><strong>Usuario:</strong> {{ tramite.usuario }}</p>
                <p><strong>Fecha:</strong> {{ formatDate(tramite.fecha) }}</p>
              </div>
              <div class="tramite-status">
                <span :class="['status', getStatusClass(tramite.estado)]">
                  {{ tramite.estado }}
                </span>
              </div>
            </div>

            <!-- Detalles expandibles -->
            <div v-if="tramite.expanded" class="tramite-details">
              <div v-if="tramite.datosPersonales" class="details-section">
                <h4>👤 Datos Personales</h4>
                <div class="details-grid">
                  <p><strong>Nombres:</strong> {{ tramite.datosPersonales.nombres }}</p>
                  <p><strong>Apellidos:</strong> {{ tramite.datosPersonales.apellidos }}</p>
                  <p><strong>Documento:</strong> {{ tramite.datosPersonales.documento }}</p>
                  <p><strong>Teléfono:</strong> {{ tramite.datosPersonales.telefono }}</p>
                </div>
              </div>

              <div v-if="tramite.datosVehiculo" class="details-section">
                <h4>🚙 Datos del Vehículo</h4>
                <div class="details-grid">
                  <p><strong>Placa:</strong> {{ tramite.datosVehiculo.placa }}</p>
                  <p><strong>Marca:</strong> {{ tramite.datosVehiculo.marca }}</p>
                  <p><strong>Modelo:</strong> {{ tramite.datosVehiculo.modelo }}</p>
                  <p><strong>Año:</strong> {{ tramite.datosVehiculo.año }}</p>
                  <p><strong>Color:</strong> {{ tramite.datosVehiculo.color }}</p>
                </div>
              </div>

              <div v-if="tramite.datosViaje" class="details-section">
                <h4>✈️ Datos del Viaje</h4>
                <div class="details-grid">
                  <p><strong>Destino:</strong> {{ tramite.datosViaje.ciudadDestino }}, {{ tramite.datosViaje.paisDestino }}</p>
                  <p><strong>Salida:</strong> {{ formatDate(tramite.datosViaje.fechaSalida) }}</p>
                  <p><strong>Retorno:</strong> {{ formatDate(tramite.datosViaje.fechaRetorno) }}</p>
                  <p><strong>Motivo:</strong> {{ tramite.datosViaje.motivoViaje }}</p>
                </div>
                <div v-if="tramite.datosViaje.observaciones" class="observaciones">
                  <p><strong>Observaciones:</strong> {{ tramite.datosViaje.observaciones }}</p>
                </div>
              </div>

              <!-- Sección de revisión -->
              <div v-if="tramite.estado === 'En revisión'" class="revision-section">
                <h4>📝 Revisión del Funcionario</h4>
                <div class="form-group">
                  <label for="comentarios">Comentarios:</label>
                  <textarea 
                    v-model="tramite.comentarios"
                    placeholder="Ingrese comentarios sobre la revisión..."
                    rows="3"
                  ></textarea>
                </div>
                <div class="decision-buttons">
                  <button 
                    @click="aprobarTramite(tramite)" 
                    class="btn-approve"
                    :disabled="procesando"
                  >
                    ✅ Aprobar
                  </button>
                  <button 
                    @click="rechazarTramite(tramite)" 
                    class="btn-reject"
                    :disabled="procesando"
                  >
                    ❌ Rechazar
                  </button>
                </div>
              </div>

              <!-- Mostrar comentarios si existen -->
              <div v-else-if="tramite.comentarios" class="comentarios-section">
                <h4>💬 Comentarios del Funcionario</h4>
                <p class="comentarios-text">{{ tramite.comentarios }}</p>
              </div>
            </div>

            <div class="tramite-actions">
              <button 
                @click="toggleTramiteExpansion(tramite)" 
                class="btn-expand"
              >
                {{ tramite.expanded ? '🔼 Ocultar Detalles' : '🔽 Ver Detalles' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '@/services/auth';

export default {
  name: "FuncionarioPanel",
  data() {
    return {
      tramites: [],
      loading: true,
      procesando: false,
      filtros: {
        estado: '',
        fecha: '',
        usuario: ''
      }
    };
  },
  computed: {
    tramitesPendientes() {
      return this.tramites.filter(t => t.estado === 'En revisión').length;
    },
    tramitesHoy() {
      const hoy = new Date().toISOString().split('T')[0];
      return this.tramites.filter(t => t.fecha === hoy).length;
    },
    tramitesTotal() {
      return this.tramites.length;
    },
    tramitesFiltrados() {
      return this.tramites.filter(tramite => {
        const matchEstado = !this.filtros.estado || tramite.estado === this.filtros.estado;
        const matchFecha = !this.filtros.fecha || tramite.fecha === this.filtros.fecha;
        const matchUsuario = !this.filtros.usuario || 
          tramite.usuario.toLowerCase().includes(this.filtros.usuario.toLowerCase());
        
        return matchEstado && matchFecha && matchUsuario;
      });
    }
  },
  mounted() {
    this.loadTramites();
  },
  methods: {
    async loadTramites() {
      try {
        this.loading = true;
        const API_BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';
        const response = await fetch(`${API_BASE}/api/tramites`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          }
        });
        if (response.ok) {
          this.tramites = (await response.json()).map(tramite => ({
            ...tramite,
            expanded: false,
            comentarios: tramite.comentarios || ''
          }));
        }
      } catch (error) {
        console.error('Error loading tramites:', error);
      } finally {
        this.loading = false;
      }
    },

    async refreshTramites() {
      await this.loadTramites();
    },

    toggleTramiteExpansion(tramite) {
      tramite.expanded = !tramite.expanded;
    },

    async aprobarTramite(tramite) {
      if (!confirm('¿Está seguro de que desea aprobar este trámite?')) {
        return;
      }

      this.procesando = true;
      try {
        // Simular actualización del trámite
        tramite.estado = 'Aprobado';
        tramite.fechaRevision = new Date().toISOString().split('T')[0];
        tramite.funcionarioRevisor = 'Funcionario Actual';
        
        alert(`✅ Trámite #${tramite.id} aprobado exitosamente`);
        await this.loadTramites();
      } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al aprobar el trámite');
      } finally {
        this.procesando = false;
      }
    },

    async rechazarTramite(tramite) {
      if (!tramite.comentarios.trim()) {
        alert('⚠️ Debe agregar comentarios antes de rechazar el trámite');
        return;
      }

      if (!confirm('¿Está seguro de que desea rechazar este trámite?')) {
        return;
      }

      this.procesando = true;
      try {
        // Simular actualización del trámite
        tramite.estado = 'Rechazado';
        tramite.fechaRevision = new Date().toISOString().split('T')[0];
        tramite.funcionarioRevisor = 'Funcionario Actual';
        
        alert(`❌ Trámite #${tramite.id} rechazado`);
        await this.loadTramites();
      } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al rechazar el trámite');
      } finally {
        this.procesando = false;
      }
    },

    limpiarFiltros() {
      this.filtros = {
        estado: '',
        fecha: '',
        usuario: ''
      };
    },

    getStatusClass(estado) {
      return {
        'En revisión': 'pending',
        'Aprobado': 'approved',
        'Rechazado': 'rejected'
      }[estado] || 'pending';
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('es-ES');
    },

    logout() {
      auth.logout();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.funcionario-panel {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 15px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
}

.panel-header h1 {
  margin: 0;
  color: #495057;
  font-size: 1.5rem;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.9rem;
  color: #6c757d;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background: #c82333;
}

.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e9ecef;
  transition: box-shadow 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 15px rgba(0,0,0,0.12);
}

.stat-card h3 {
  font-size: 2rem;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.stat-card.pending h3 { color: #fd7e14; }
.stat-card.today h3 { color: #0d6efd; }
.stat-card.total h3 { color: #495057; }

.stat-card p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.filters-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e9ecef;
}

.filters-section h2 {
  margin-bottom: 15px;
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: 500;
  margin-bottom: 6px;
  color: #495057;
  font-size: 0.9rem;
}

.filter-group input,
.filter-group select {
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  height: fit-content;
}

.btn-secondary:hover {
  background: #5c636a;
}

.tramites-section {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e9ecef;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #495057;
  font-size: 1.2rem;
  font-weight: 600;
}

.btn-refresh {
  background: #0d6efd;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.btn-refresh:hover {
  background: #0b5ed7;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 1rem;
  color: #6c757d;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.tramites-list {
  display: grid;
  gap: 15px;
}

.tramite-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  transition: box-shadow 0.2s ease;
}

.tramite-card:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.tramite-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 15px;
}

.tramite-info h3 {
  margin: 0 0 8px 0;
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600;
}

.tramite-info p {
  margin: 4px 0;
  color: #6c757d;
  font-size: 0.85rem;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.75rem;
  white-space: nowrap;
}

.status.pending { 
  background: #fff3cd; 
  color: #664d03; 
  border: 1px solid #ffecb5;
}
.status.approved { 
  background: #d1e7dd; 
  color: #0f5132; 
  border: 1px solid #badbcc;
}
.status.rejected { 
  background: #f8d7da; 
  color: #842029; 
  border: 1px solid #f5c2c7;
}

.tramite-details {
  margin: 15px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.details-section {
  margin-bottom: 15px;
}

.details-section h4 {
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.details-grid p {
  margin: 4px 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.observaciones,
.comentarios-section {
  margin-top: 12px;
  padding: 12px;
  background: #e9ecef;
  border-radius: 6px;
}

.revision-section {
  border-top: 1px solid #dee2e6;
  padding-top: 15px;
}

.revision-section h4 {
  margin-bottom: 12px;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 6px;
  display: block;
  color: #495057;
  font-size: 0.9rem;
}

.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  resize: vertical;
  font-size: 0.9rem;
}

.decision-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-approve,
.btn-reject {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.btn-approve {
  background: #198754;
  color: white;
}

.btn-approve:hover:not(:disabled) {
  background: #157347;
}

.btn-reject {
  background: #dc3545;
  color: white;
}

.btn-reject:hover:not(:disabled) {
  background: #bb2d3b;
}

.btn-approve:disabled,
.btn-reject:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.tramite-actions {
  text-align: center;
  margin-top: 12px;
}

.btn-expand {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.btn-expand:hover {
  background: #e9ecef;
}

.comentarios-text {
  font-style: italic;
  color: #495057;
}

/* Responsive Design */
@media (max-width: 768px) {
  .funcionario-panel {
    padding: 10px;
  }
  
  .panel-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding: 15px;
  }
  
  .panel-header h1 {
    font-size: 1.3rem;
  }
  
  .user-info {
    justify-content: center;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-card h3 {
    font-size: 1.5rem;
  }
  
  .filters {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .tramite-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .decision-buttons {
    flex-direction: column;
  }
  
  .btn-approve,
  .btn-reject {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .tramites-section {
    padding: 15px;
  }
  
  .tramite-card {
    padding: 15px;
  }
  
  .filters-section {
    padding: 15px;
  }
}
</style>
  