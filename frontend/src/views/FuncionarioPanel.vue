<template>
  <div class="panel-funcionario">
    <div class="header">
      <h2>🏛️ Panel del Funcionario</h2>
      <span>Funcionario de Aduana</span>
      <button class="logout-btn" @click="cerrarSesion">Cerrar Sesión</button>
    </div>

    <div class="resumen">
      <div class="card orange">
        <h3>{{ pendientes }}</h3>
        <p>Pendientes de Revisión</p>
      </div>
      <div class="card blue">
        <h3>{{ procesados }}</h3>
        <p>Procesados Hoy</p>
      </div>
      <div class="card gray">
        <h3>{{ total }}</h3>
        <p>Total de Trámites</p>
      </div>
    </div>

    <div class="filtros">
      <h3>🔍 Filtros de Búsqueda</h3>
      <div class="filtro-row">
        <label>Estado:</label>
        <select v-model="filtro.estado">
          <option value="">Todos los estados</option>
          <option value="En revisión">En revisión</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Rechazado">Rechazado</option>
        </select>

        <label>Fecha:</label>
        <input type="date" v-model="filtro.fecha" />
      </div>
      <div class="filtro-row">
        <label>Usuario:</label>
        <input type="text" v-model="filtro.nombre" placeholder="Buscar por nombre..." />
        <button @click="limpiarFiltros">Limpiar</button>
      </div>
    </div>

    <div class="tabla-tramites">
      <h3>📋 Trámites para Revisión</h3>
      <button class="actualizar-btn" @click="obtenerTramites">🔄 Actualizar</button>

      <table v-if="tramitesFiltrados.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>RUT</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tramite in tramitesFiltrados" :key="tramite.id">
            <td>{{ tramite.id }}</td>
            <td>{{ tramite.nombre }}</td>
            <td>{{ tramite.apellido }}</td>
            <td>{{ tramite.rut }}</td>
            <td>{{ tramite.tipo }}</td>
            <td>{{ tramite.descripcion }}</td>
            <td>{{ tramite.estado }}</td>
            <td>{{ formatFecha(tramite.created_at) }}</td>
            <td>
              <button v-if="tramite.estado === 'En revisión'" @click="actualizarEstado(tramite.id, 'Aprobado')">Aprobar</button>
              <button v-if="tramite.estado === 'En revisión'" @click="actualizarEstado(tramite.id, 'Rechazado')">Rechazar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="no-data">
        <p>📂 <strong>No hay trámites para mostrar</strong></p>
        <p>No se encontraron trámites con los filtros aplicados</p>
      </div>
    </div>

    <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>
  </div>
</template>

<script>
import auth from '@/services/auth';

export default {
  data() {
    return {
      tramites: [],
      mensaje: '',
      filtro: {
        estado: '',
        fecha: '',
        nombre: '',
      },
    };
  },
  computed: {
    tramitesFiltrados() {
      return this.tramites.filter((t) => {
        const estadoOk = !this.filtro.estado || t.estado === this.filtro.estado;
        const fechaOk = !this.filtro.fecha || t.created_at?.startsWith(this.filtro.fecha);
        const nombreOk = !this.filtro.nombre || (t.nombre || '').toLowerCase().includes(this.filtro.nombre.toLowerCase());
        return estadoOk && fechaOk && nombreOk;
      });
    },
    pendientes() {
      return this.tramites.filter((t) => t.estado === 'En revisión').length;
    },
    procesados() {
      const hoy = new Date().toISOString().split('T')[0];
      return this.tramites.filter(
        (t) =>
          (t.estado === 'Aprobado' || t.estado === 'Rechazado') &&
          t.created_at?.startsWith(hoy)
      ).length;
    },
    total() {
      return this.tramites.length;
    },
  },
  methods: {
    async obtenerTramites() {
      try {
        const token = auth.getToken();
        const res = await fetch('/api/tramites/en_revision', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        this.tramites = Array.isArray(data.tramites) ? data.tramites : [];
      } catch (err) {
        console.error(err);
        this.mensaje = 'Error al obtener los trámites.';
      }
    },
    async actualizarEstado(tramiteId, nuevoEstado) {
      const token = auth.getToken();
      if (!token) {
        this.mensaje = 'No hay sesión activa.';
        return;
      }

      try {
        const res = await fetch('/api/tramites/actualizar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tramite_id: tramiteId, nuevo_estado: nuevoEstado }),
        });

        const data = await res.json();
        if (res.ok) {
          this.mensaje = `Trámite ${tramiteId} actualizado a "${nuevoEstado}"`;
          await this.obtenerTramites();
        } else {
          this.mensaje = data.error || 'Error al actualizar el trámite.';
        }
      } catch (err) {
        console.error(err);
        this.mensaje = 'Error al enviar la solicitud.';
      }
    },
    formatFecha(fecha) {
      return new Date(fecha).toLocaleString();
    },
    limpiarFiltros() {
      this.filtro = { estado: '', fecha: '', nombre: '' };
    },
    cerrarSesion() {
      auth.logout();
      this.$router.push('/login');
    },
  },
  mounted() {
    this.obtenerTramites();
  },
};
</script>

<style scoped>
.panel-funcionario {
  padding: 1rem;
  max-width: 1200px;
  margin: auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logout-btn {
  background: #d33;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}
.resumen {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}
.card {
  flex: 1;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  color: white;
}
.card.orange {
  background-color: orange;
}
.card.blue {
  background-color: #2196f3;
}
.card.gray {
  background-color: #777;
}
.filtros {
  background: #f6f6f6;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.filtro-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}
.filtro-row input,
.filtro-row select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.tabla-tramites {
  background: white;
  border-radius: 8px;
  padding: 1rem;
}
.actualizar-btn {
  float: right;
  background: #1e88e5;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}
th, td {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
.no-data {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}
.mensaje {
  margin-top: 1rem;
  color: green;
}
</style>
