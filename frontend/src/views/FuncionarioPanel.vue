<template>
  <div class="panel-funcionario">
    <h2>Panel del Funcionario</h2>

    <div>
      <label for="estado">Filtrar por estado:</label>
      <select id="estado" v-model="filtroEstado" @change="filtrarTramites">
        <option value="">Todos</option>
        <option value="En revisión">En revisión</option>
        <option value="Aprobado">Aprobado</option>
        <option value="Rechazado">Rechazado</option>
      </select>
    </div>

    <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
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
          <td>{{ tramite.tipo }}</td>
          <td>{{ tramite.descripcion }}</td>
          <td>{{ tramite.estado }}</td>
          <td>{{ formatFecha(tramite.created_at) }}</td>
          <td>
            <button
              v-if="tramite.estado === 'En revisión'"
              @click="actualizarEstado(tramite.id, 'Aprobado')"
            >
              Aprobar
            </button>
            <button
              v-if="tramite.estado === 'En revisión'"
              @click="actualizarEstado(tramite.id, 'Rechazado')"
            >
              Rechazar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import auth from '@/services/auth';

export default {
  data() {
    return {
      tramites: [],
      filtroEstado: '',
      mensaje: '',
    };
  },
  computed: {
    tramitesFiltrados() {
      if (!this.filtroEstado) return this.tramites;
      return this.tramites.filter((t) => t.estado === this.filtroEstado);
    },
  },
  methods: {
    async obtenerTramites() {
      const token = auth.getToken();
      if (!token) {
        this.mensaje = 'No hay sesión activa.';
        return;
      }

      try {
        const res = await fetch('/api/tramites/todos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data.tramites)) {
          this.tramites = data.tramites;
        } else {
          this.tramites = [];
          this.mensaje = 'No se recibieron trámites.';
        }
      } catch (err) {
        this.mensaje = 'Error al obtener los trámites.';
        console.error(err);
      }
    },

    formatFecha(fecha) {
      return new Date(fecha).toLocaleString();
    },

    filtrarTramites() {
      // El filtro es reactivo, no se requiere lógica adicional.
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
          body: JSON.stringify({
            tramite_id: tramiteId,
            nuevo_estado: nuevoEstado,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          this.mensaje = `Trámite ${tramiteId} actualizado a "${nuevoEstado}".`;
          await this.obtenerTramites();
        } else {
          this.mensaje = data.error || 'Error al actualizar el trámite.';
        }
      } catch (err) {
        this.mensaje = 'Error al enviar la solicitud.';
        console.error(err);
      }
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
}
table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
}
th,
td {
  padding: 0.5rem;
  border: 1px solid #ccc;
  text-align: left;
}
.mensaje {
  margin-top: 1rem;
  color: green;
}
</style>
