<template>
  <div class="turista-panel">
    <header class="panel-header">
      <h1>🚢 Panel del Turista</h1>
      <div class="user-info">
        <span>Bienvenido</span>
        <button @click="logout" class="logout-btn">Cerrar Sesión</button>
      </div>
    </header>

    <div class="dashboard">
      <div class="stats-cards">
        <div class="stat-card pending">
          <h3>{{ tramitesEnRevision }}</h3>
          <p>En Revisión</p>
        </div>
        <div class="stat-card approved">
          <h3>{{ tramitesAprobados }}</h3>
          <p>Aprobados</p>
        </div>
        <div class="stat-card rejected">
          <h3>{{ tramitesRechazados }}</h3>
          <p>Rechazados</p>
        </div>
      </div>

      <div class="actions">
        <router-link to="/formulario" class="btn-primary">
          ✈️ Nuevo Trámite de Vehículo
        </router-link>
        <button @click="refreshTramites" class="btn-secondary">
          🔄 Actualizar Estado
        </button>
      </div>

      <div class="tramites-section">
        <h2>📋 Mis Trámites</h2>
        
        <div v-if="loading" class="loading">
          ⏳ Cargando trámites...
        </div>

        <div v-else-if="tramites.length === 0" class="empty-state">
          <h3>📋 No tienes trámites registrados</h3>
          <p>Inicia creando tu primer trámite de vehículo</p>
          <router-link to="/formulario" class="btn-primary">Crear Trámite</router-link>
        </div>

        <div v-else class="tramites-list">
          <div v-for="tramite in tramites" :key="tramite.id" class="tramite-card">
            <div class="tramite-header">
              <h3>🚗 {{ tramite.tipo.replace('_', ' ').toUpperCase() }}</h3>
              <span :class="['status', getStatusClass(tramite.estado)]">
                {{ tramite.estado }}
              </span>
            </div>
            <div class="tramite-details">
              <p><strong>ID:</strong> #{{ tramite.id }}</p>
              <p><strong>Fecha:</strong> {{ formatDate(tramite.fecha) }}</p>
              <p><strong>Usuario:</strong> {{ tramite.usuario }}</p>
              <div v-if="tramite.comentarios" class="comentarios">
                <strong>📝 Comentarios:</strong>
                <p>{{ tramite.comentarios }}</p>
              </div>
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
  name: "TuristaPanel",
  data() {
    return {
      tramites: [],
      loading: true
    };
  },
  computed: {
    tramitesEnRevision() {
      return this.tramites.filter(t => t.estado === 'En revisión').length;
    },
    tramitesAprobados() {
      return this.tramites.filter(t => t.estado === 'Aprobado').length;
    },
    tramitesRechazados() {
      return this.tramites.filter(t => t.estado === 'Rechazado').length;
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
        const response = await fetch(`${API_BASE}/api/tramites`);
        if (response.ok) {
          this.tramites = await response.json();
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
    getStatusClass(estado) {
      return {
        'En revisión': 'pending',
        'Aprobado': 'approved',
        'Rechazado': 'rejected'
      }[estado] || 'pending';
    },
    formatDate(dateString) {
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
.turista-panel {
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
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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
.stat-card.approved h3 { color: #198754; }
.stat-card.rejected h3 { color: #dc3545; }

.stat-card p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;
}

.btn-primary {
  background: #0d6efd;
  color: white;
}

.btn-primary:hover {
  background: #0b5ed7;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5c636a;
}

.tramites-section {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  border: 1px solid #e9ecef;
}

.tramites-section h2 {
  margin-bottom: 20px;
  color: #495057;
  font-size: 1.25rem;
  font-weight: 600;
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

.empty-state h3 {
  color: #6c757d;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.empty-state p {
  color: #868e96;
  margin-bottom: 20px;
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

.tramite-header h3 {
  margin: 0;
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600;
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

.tramite-details p {
  margin: 6px 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.comentarios {
  margin-top: 15px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #0d6efd;
}

.comentarios p {
  margin: 0;
  font-style: italic;
  color: #495057;
}

/* Responsive Design */
@media (max-width: 768px) {
  .turista-panel {
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
  
  .actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-primary, .btn-secondary {
    text-align: center;
  }
  
  .tramites-section {
    padding: 15px;
  }
  
  .tramite-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .status {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .stat-card h3 {
    font-size: 1.8rem;
  }
  
  .tramite-card {
    padding: 15px;
  }
}
</style>
  