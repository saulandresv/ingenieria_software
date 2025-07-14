<template>
  <div class="panel-funcionario">
    <h2>Panel del Funcionario</h2>

    <div class="filtro-estado">
      <label for="estado">Filtrar por estado:</label>
      <select id="estado" v-model="filtroEstado">
        <option value="">Todos</option>
        <option value="En revisión">En revisión</option>
        <option value="Aprobado">Aprobado</option>
        <option value="Rechazado">Rechazado</option>
      </select>
    </div>

    <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>

    <div v-if="tramitesFiltrados.length === 0" class="sin-tramites">
      No hay trámites para mostrar.
    </div>

    <div class="tramite-card" v-for="tramite in tramitesFiltrados" :key="tramite.id">
      <p><strong>ID:</strong> {{ tramite.id }}</p>
      <p><strong>Nombre:</strong> {{ tramite.nombre_completo || 'N/A' }}</p>
      <p><strong>RUT:</strong> {{ tramite.rut || 'N/A' }}</p>
      <p><strong>Tipo:</strong> {{ tramite.tipo }}</p>
      <p><strong>Descripción:</strong> {{ tramite.descripcion }}</p>
      <p><strong>Estado:</strong> {{ tramite.estado }}</p>
      <p><strong>Fecha:</strong> {{ formatFecha(tramite.created_at) }}</p>

      <div v-if="tramite.estado === 'En revisión'" class="acciones">
        <button @click="actualizarEstado(tramite.id, 'Aprobado')">Aprobar</button>
        <button @click="actualizarEstado(tramite.id, 'Rechazado')">Rechazar</button>
      </div>
    </div>
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
        this.tramites = Array.isArray(data.tramites) ? data.tramites : [];
      } catch (err) {
        this.mensaje = 'Error al obtener los trámites.';
        console.error(err);
      }
    },

    formatFecha(fecha) {
      return new Date(fecha).toLocaleString();
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
          this.mensaje = `Trámite ${tramiteId} actualizado a "${nuevoEstado}".`;
          this.obtenerTramites();
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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #f9f9f9;
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.filtro-estado {
  text-align: center;
  margin-bottom: 1rem;
}

select {
  margin-left: 0.5rem;
  padding: 0.3rem;
}

.mensaje {
  text-align: center;
  color: green;
  margin-bottom: 1rem;
}

.tramite-card {
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tramite-card p {
  margin: 0.3rem 0;
}

.acciones {
  margin-top: 1rem;
}

.acciones button {
  margin-right: 0.5rem;
  background-color: #111;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.acciones button:hover {
  background-color: #333;
}

.sin-tramites {
  text-align: center;
  color: #777;
  margin-top: 2rem;
}
</style>
