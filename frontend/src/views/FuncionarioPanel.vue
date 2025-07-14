<template>
  <div>
    <h2>Panel del Funcionario</h2>
    <div v-if="tramites.length === 0">
      <p>No hay trámites en revisión.</p>
    </div>
    <div v-else>
      <div v-for="tramite in tramites" :key="tramite.id" class="tramite">
        <p><strong>ID:</strong> {{ tramite.id }}</p>
        <p><strong>Tipo:</strong> {{ tramite.tipo }}</p>
        <p><strong>Descripción:</strong> {{ tramite.descripcion }}</p>
        <p><strong>Estado:</strong> {{ tramite.estado }}</p>
        <button @click="actualizarEstado(tramite.id, 'Aprobado')">✅ Aprobar</button>
        <button @click="actualizarEstado(tramite.id, 'Rechazado')">❌ Rechazar</button>
        <hr />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const tramites = ref([]);

async function cargarTramites() {
  try {
    const response = await fetch('/api/tramites/en_revision');
    const data = await response.json();
    tramites.value = data.tramites || [];
  } catch (err) {
    console.error('Error al cargar trámites:', err);
    tramites.value = [];
  }
}

async function actualizarEstado(tramiteId, nuevoEstado) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/tramites/actualizar', {
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

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al actualizar');

    alert('Trámite actualizado correctamente');
    await cargarTramites(); // recargar lista
  } catch (err) {
    console.error(err);
    alert('No se pudo actualizar el trámite');
  }
}

onMounted(() => {
  cargarTramites();
});
</script>

<style scoped>
.tramite {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f9f9f9;
}
button {
  margin-right: 10px;
}
</style>
