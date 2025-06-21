<template>
  <div class="auditoria-panel">
    <header class="panel-header">
      <h1>📊 Panel de Auditoría</h1>
      <div class="user-info">
        <span>Auditor Supervisor</span>
        <button @click="logout" class="logout-btn">Cerrar Sesión</button>
      </div>
    </header>

    <div class="dashboard">
      <!-- Métricas Principales -->
      <div class="metrics-section">
        <h2>📈 Métricas del Sistema</h2>
        <div class="stats-cards">
          <div class="stat-card total">
            <h3>{{ totalTramites }}</h3>
            <p>Total de Trámites</p>
          </div>
          <div class="stat-card approved">
            <h3>{{ tramitesAprobados }}</h3>
            <p>Aprobados</p>
            <small>{{ porcentajeAprobados }}%</small>
          </div>
          <div class="stat-card rejected">
            <h3>{{ tramitesRechazados }}</h3>
            <p>Rechazados</p>
            <small>{{ porcentajeRechazados }}%</small>
          </div>
          <div class="stat-card pending">
            <h3>{{ tramitesPendientes }}</h3>
            <p>En Revisión</p>
            <small>{{ porcentajePendientes }}%</small>
          </div>
        </div>
      </div>

      <!-- Filtros de Período -->
      <div class="period-section">
        <h2>🗓️ Análisis por Período</h2>
        <div class="period-filters">
          <div class="filter-group">
            <label>Desde:</label>
            <input v-model="filtros.fechaInicio" type="date" />
          </div>
          <div class="filter-group">
            <label>Hasta:</label>
            <input v-model="filtros.fechaFin" type="date" />
          </div>
          <button @click="generarReporte" class="btn-primary">📄 Generar Reporte</button>
        </div>
      </div>

      <!-- Gráfico de Tendencias -->
      <div class="trends-section">
        <h2>📊 Tendencias de Trámites</h2>
        <div class="chart-container">
          <div class="chart-placeholder">
            <div class="bars">
              <div class="bar" :style="{ height: getBarHeight('En revisión') }">
                <span class="bar-label">En Revisión</span>
                <span class="bar-value">{{ tramitesPendientes }}</span>
              </div>
              <div class="bar" :style="{ height: getBarHeight('Aprobado') }">
                <span class="bar-label">Aprobados</span>
                <span class="bar-value">{{ tramitesAprobados }}</span>
              </div>
              <div class="bar" :style="{ height: getBarHeight('Rechazado') }">
                <span class="bar-label">Rechazados</span>
                <span class="bar-value">{{ tramitesRechazados }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actividad Reciente -->
      <div class="activity-section">
        <h2>🕒 Actividad Reciente</h2>
        <div class="activity-list">
          <div v-for="actividad in actividadReciente" :key="actividad.id" class="activity-item">
            <div class="activity-icon">
              {{ getActivityIcon(actividad.tipo) }}
            </div>
            <div class="activity-details">
              <h4>{{ actividad.descripcion }}</h4>
              <p>{{ actividad.detalles }}</p>
              <small>{{ formatDateTime(actividad.fecha) }}</small>
            </div>
            <div class="activity-status">
              <span :class="['status', getStatusClass(actividad.estado)]">
                {{ actividad.estado }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trazabilidad de Trámites -->
      <div class="trazabilidad-section">
        <h2>🔍 Trazabilidad de Trámites</h2>
        <div class="search-bar">
          <input 
            v-model="busquedaTramite" 
            type="text" 
            placeholder="Buscar por ID de trámite, usuario o placa..."
            @input="buscarTramites"
          />
          <button @click="buscarTramites" class="btn-search">🔍 Buscar</button>
        </div>

        <div v-if="tramitesBuscados.length > 0" class="search-results">
          <h3>Resultados de Búsqueda</h3>
          <div class="tramites-list">
            <div v-for="tramite in tramitesBuscados" :key="tramite.id" class="tramite-card">
              <div class="tramite-header">
                <h4>Trámite #{{ tramite.id }}</h4>
                <span :class="['status', getStatusClass(tramite.estado)]">
                  {{ tramite.estado }}
                </span>
              </div>
              <div class="tramite-timeline">
                <div class="timeline-item">
                  <div class="timeline-dot created"></div>
                  <div class="timeline-content">
                    <strong>Solicitud Creada</strong>
                    <p>{{ formatDate(tramite.fecha) }}</p>
                    <small>Usuario: {{ tramite.usuario }}</small>
                  </div>
                </div>
                <div v-if="tramite.fechaRevision" class="timeline-item">
                  <div class="timeline-dot reviewed"></div>
                  <div class="timeline-content">
                    <strong>Revisado por Funcionario</strong>
                    <p>{{ formatDate(tramite.fechaRevision) }}</p>
                    <small v-if="tramite.funcionarioRevisor">Por: {{ tramite.funcionarioRevisor }}</small>
                  </div>
                </div>
                <div v-if="tramite.comentarios" class="timeline-item">
                  <div class="timeline-dot comments"></div>
                  <div class="timeline-content">
                    <strong>Comentarios</strong>
                    <p>{{ tramite.comentarios }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reportes Rápidos -->
      <div class="reports-section">
        <h2>📋 Reportes Rápidos</h2>
        <div class="reports-grid">
          <div class="report-card">
            <h3>📊 Reporte Diario</h3>
            <p>Trámites procesados hoy</p>
            <div class="report-stats">
              <span>{{ tramitesHoy }} trámites</span>
            </div>
            <button @click="exportarReporteDiario" class="btn-export">Exportar PDF</button>
          </div>
          <div class="report-card">
            <h3>📅 Reporte Semanal</h3>
            <p>Resumen de la semana</p>
            <div class="report-stats">
              <span>{{ tramitesSemana }} trámites</span>
            </div>
            <button @click="exportarReporteSemanal" class="btn-export">Exportar Excel</button>
          </div>
          <div class="report-card">
            <h3>📈 Reporte Mensual</h3>
            <p>Estadísticas del mes</p>
            <div class="report-stats">
              <span>{{ tramitesMes }} trámites</span>
            </div>
            <button @click="exportarReporteMensual" class="btn-export">Exportar PDF</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '@/services/auth';

export default {
  name: "AuditoriaPanel",
  data() {
    return {
      tramites: [],
      tramitesBuscados: [],
      busquedaTramite: '',
      filtros: {
        fechaInicio: '',
        fechaFin: ''
      },
      actividadReciente: [
        {
          id: 1,
          tipo: 'creacion',
          descripcion: 'Nuevo trámite creado',
          detalles: 'Trámite de salida de vehículo - Usuario: María García',
          fecha: new Date().toISOString(),
          estado: 'En revisión'
        },
        {
          id: 2,
          tipo: 'aprobacion',
          descripcion: 'Trámite aprobado',
          detalles: 'Trámite #123 aprobado por funcionario',
          fecha: new Date(Date.now() - 3600000).toISOString(),
          estado: 'Aprobado'
        },
        {
          id: 3,
          tipo: 'rechazo',
          descripcion: 'Trámite rechazado',
          detalles: 'Trámite #121 rechazado - Documentación incompleta',
          fecha: new Date(Date.now() - 7200000).toISOString(),
          estado: 'Rechazado'
        }
      ]
    };
  },
  computed: {
    totalTramites() {
      return this.tramites.length;
    },
    tramitesAprobados() {
      return this.tramites.filter(t => t.estado === 'Aprobado').length;
    },
    tramitesRechazados() {
      return this.tramites.filter(t => t.estado === 'Rechazado').length;
    },
    tramitesPendientes() {
      return this.tramites.filter(t => t.estado === 'En revisión').length;
    },
    porcentajeAprobados() {
      return this.totalTramites > 0 ? Math.round((this.tramitesAprobados / this.totalTramites) * 100) : 0;
    },
    porcentajeRechazados() {
      return this.totalTramites > 0 ? Math.round((this.tramitesRechazados / this.totalTramites) * 100) : 0;
    },
    porcentajePendientes() {
      return this.totalTramites > 0 ? Math.round((this.tramitesPendientes / this.totalTramites) * 100) : 0;
    },
    tramitesHoy() {
      const hoy = new Date().toISOString().split('T')[0];
      return this.tramites.filter(t => t.fecha === hoy).length;
    },
    tramitesSemana() {
      // Simulado: últimos 7 días
      return Math.round(this.totalTramites * 0.3);
    },
    tramitesMes() {
      // Simulado: último mes
      return this.totalTramites;
    }
  },
  mounted() {
    this.loadTramites();
    this.setDefaultDates();
  },
  methods: {
    async loadTramites() {
      try {
        const API_BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';
        const response = await fetch(`${API_BASE}/api/tramites`);
        if (response.ok) {
          this.tramites = await response.json();
        }
      } catch (error) {
        console.error('Error loading tramites:', error);
      }
    },

    setDefaultDates() {
      const hoy = new Date();
      const hace30Dias = new Date(hoy.getTime() - (30 * 24 * 60 * 60 * 1000));
      
      this.filtros.fechaFin = hoy.toISOString().split('T')[0];
      this.filtros.fechaInicio = hace30Dias.toISOString().split('T')[0];
    },

    buscarTramites() {
      if (!this.busquedaTramite.trim()) {
        this.tramitesBuscados = [];
        return;
      }

      const termino = this.busquedaTramite.toLowerCase();
      this.tramitesBuscados = this.tramites.filter(tramite => {
        return (
          tramite.id.toString().includes(termino) ||
          tramite.usuario.toLowerCase().includes(termino) ||
          (tramite.datosVehiculo?.placa?.toLowerCase().includes(termino))
        );
      });
    },

    getBarHeight(estado) {
      const max = Math.max(this.tramitesAprobados, this.tramitesRechazados, this.tramitesPendientes);
      let value = 0;
      
      switch(estado) {
        case 'Aprobado':
          value = this.tramitesAprobados;
          break;
        case 'Rechazado':
          value = this.tramitesRechazados;
          break;
        case 'En revisión':
          value = this.tramitesPendientes;
          break;
      }
      
      return max > 0 ? `${(value / max) * 100}%` : '0%';
    },

    getActivityIcon(tipo) {
      const icons = {
        'creacion': '📝',
        'aprobacion': '✅',
        'rechazo': '❌',
        'revision': '👀'
      };
      return icons[tipo] || '📋';
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

    formatDateTime(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleString('es-ES');
    },

    generarReporte() {
      if (!this.filtros.fechaInicio || !this.filtros.fechaFin) {
        alert('⚠️ Seleccione ambas fechas para generar el reporte');
        return;
      }

      const tramitesFiltrados = this.tramites.filter(tramite => {
        const fechaTramite = new Date(tramite.fecha);
        const fechaInicio = new Date(this.filtros.fechaInicio);
        const fechaFin = new Date(this.filtros.fechaFin);
        
        return fechaTramite >= fechaInicio && fechaTramite <= fechaFin;
      });

      alert(`📊 Reporte generado:\n\nPeríodo: ${this.formatDate(this.filtros.fechaInicio)} - ${this.formatDate(this.filtros.fechaFin)}\nTotal de trámites: ${tramitesFiltrados.length}\nAprobados: ${tramitesFiltrados.filter(t => t.estado === 'Aprobado').length}\nRechazados: ${tramitesFiltrados.filter(t => t.estado === 'Rechazado').length}\nEn revisión: ${tramitesFiltrados.filter(t => t.estado === 'En revisión').length}`);
    },

    exportarReporteDiario() {
      alert('📄 Exportando reporte diario a PDF...\n\n(Funcionalidad simulada)');
    },

    exportarReporteSemanal() {
      alert('📊 Exportando reporte semanal a Excel...\n\n(Funcionalidad simulada)');
    },

    exportarReporteMensual() {
      alert('📈 Exportando reporte mensual a PDF...\n\n(Funcionalidad simulada)');
    },

    logout() {
      auth.logout();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.auditoria-panel {
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

.metrics-section,
.period-section,
.trends-section,
.activity-section,
.trazabilidad-section,
.reports-section {
  background: white;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e9ecef;
}

.metrics-section h2,
.period-section h2,
.trends-section h2,
.activity-section h2,
.trazabilidad-section h2,
.reports-section h2 {
  margin-bottom: 20px;
  color: #495057;
  font-size: 1.2rem;
  font-weight: 600;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 15px;
}

.stat-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  transition: box-shadow 0.2s ease;
  border: 1px solid #e9ecef;
}

.stat-card:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.stat-card h3 {
  font-size: 2rem;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.stat-card.total h3 { color: #495057; }
.stat-card.approved h3 { color: #198754; }
.stat-card.rejected h3 { color: #dc3545; }
.stat-card.pending h3 { color: #fd7e14; }

.stat-card p {
  margin: 4px 0;
  font-weight: 500;
  color: #6c757d;
  font-size: 0.9rem;
}

.stat-card small {
  color: #868e96;
  font-size: 0.8rem;
}

.period-filters {
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

.filter-group input {
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
}

.btn-primary {
  background: #0d6efd;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  height: fit-content;
}

.btn-primary:hover {
  background: #0b5ed7;
}

.chart-container {
  padding: 15px 0;
}

.chart-placeholder {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 25px;
  min-height: 180px;
  display: flex;
  align-items: end;
  justify-content: center;
  border: 1px solid #e9ecef;
}

.bars {
  display: flex;
  gap: 25px;
  align-items: end;
  height: 120px;
}

.bar {
  width: 50px;
  background: #0d6efd;
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 8px 4px;
  color: white;
  font-weight: 500;
  font-size: 0.8rem;
}

.bar-label {
  position: absolute;
  bottom: -25px;
  font-size: 0.75rem;
  color: #495057;
  text-align: center;
  width: 70px;
  left: -10px;
}

.bar-value {
  font-size: 0.8rem;
}

.activity-list {
  display: grid;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  border: 1px solid #e9ecef;
}

.activity-item:hover {
  background: #e9ecef;
}

.activity-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.activity-details {
  flex: 1;
}

.activity-details h4 {
  margin: 0 0 4px 0;
  color: #495057;
  font-size: 0.95rem;
  font-weight: 600;
}

.activity-details p {
  margin: 0 0 4px 0;
  color: #6c757d;
  font-size: 0.85rem;
}

.activity-details small {
  color: #868e96;
  font-size: 0.8rem;
}

.activity-status .status {
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.7rem;
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

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
}

.btn-search {
  background: #495057;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.btn-search:hover {
  background: #343a40;
}

.search-results h3 {
  margin-bottom: 15px;
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600;
}

.tramites-list {
  display: grid;
  gap: 15px;
}

.tramite-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
}

.tramite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.tramite-header h4 {
  margin: 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
}

.tramite-timeline {
  display: grid;
  gap: 12px;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.timeline-dot.created { background: #0d6efd; }
.timeline-dot.reviewed { background: #fd7e14; }
.timeline-dot.comments { background: #6c757d; }

.timeline-content strong {
  color: #495057;
  font-size: 0.9rem;
}

.timeline-content p {
  margin: 4px 0;
  color: #6c757d;
  font-size: 0.85rem;
}

.timeline-content small {
  color: #868e96;
  font-size: 0.8rem;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.report-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.report-card h3 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600;
}

.report-card p {
  margin: 0 0 12px 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.report-stats {
  margin: 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #495057;
}

.btn-export {
  background: #198754;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  transition: background-color 0.2s ease;
}

.btn-export:hover {
  background: #157347;
}

/* Responsive Design */
@media (max-width: 768px) {
  .auditoria-panel {
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
  
  .stats-cards,
  .reports-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-card h3 {
    font-size: 1.5rem;
  }
  
  .period-filters {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .search-bar {
    flex-direction: column;
  }
  
  .bars {
    gap: 15px;
  }
  
  .bar {
    width: 35px;
  }
  
  .activity-item {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .metrics-section,
  .period-section,
  .trends-section,
  .activity-section,
  .trazabilidad-section,
  .reports-section {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .stats-cards,
  .reports-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card h3 {
    font-size: 1.8rem;
  }
  
  .tramite-card {
    padding: 12px;
  }
  
  .bars {
    gap: 10px;
  }
  
  .bar {
    width: 30px;
  }
}
</style>
  