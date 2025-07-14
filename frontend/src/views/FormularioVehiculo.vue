<template>
  <div class="formulario-vehiculo">
    <div class="form-container">
      <header class="form-header">
        <h1>🚗 Formulario de Salida Temporal de Vehículo</h1>
        <p>Complete todos los campos requeridos para procesar su solicitud</p>
      </header>

      <form @submit.prevent="submitForm" class="vehicle-form">
        <!-- Datos del Propietario -->
        <div class="form-section">
          <h2>👤 Datos del Propietario</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="nombres">Nombres *</label>
              <input 
                v-model="form.nombres" 
                type="text" 
                id="nombres" 
                required
                :class="{ error: errors.nombres }"
              />
              <span v-if="errors.nombres" class="error-msg">{{ errors.nombres }}</span>
            </div>
            <div class="form-group">
              <label for="apellidos">Apellidos *</label>
              <input 
                v-model="form.apellidos" 
                type="text" 
                id="apellidos" 
                required
                :class="{ error: errors.apellidos }"
              />
              <span v-if="errors.apellidos" class="error-msg">{{ errors.apellidos }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="documento">Documento de Identidad *</label>
              <input 
                v-model="form.documento" 
                type="text" 
                id="documento" 
                required
                :class="{ error: errors.documento }"
              />
              <span v-if="errors.documento" class="error-msg">{{ errors.documento }}</span>
            </div>
            <div class="form-group">
              <label for="telefono">Teléfono *</label>
              <input 
                v-model="form.telefono" 
                type="tel" 
                id="telefono" 
                required
                :class="{ error: errors.telefono }"
              />
              <span v-if="errors.telefono" class="error-msg">{{ errors.telefono }}</span>
            </div>
          </div>
        </div>

        <!-- Datos del Vehículo -->
        <div class="form-section">
          <h2>🚙 Datos del Vehículo</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="placa">Placa del Vehículo *</label>
              <input 
                v-model="form.placa" 
                type="text" 
                id="placa" 
                required
                :class="{ error: errors.placa }"
                style="text-transform: uppercase"
              />
              <span v-if="errors.placa" class="error-msg">{{ errors.placa }}</span>
            </div>
            <div class="form-group">
              <label for="marca">Marca *</label>
              <select v-model="form.marca" id="marca" required :class="{ error: errors.marca }">
                <option value="">Seleccionar marca</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Ford">Ford</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Nissan">Nissan</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Otro">Otro</option>
              </select>
              <span v-if="errors.marca" class="error-msg">{{ errors.marca }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="modelo">Modelo *</label>
              <input 
                v-model="form.modelo" 
                type="text" 
                id="modelo" 
                required
                :class="{ error: errors.modelo }"
              />
              <span v-if="errors.modelo" class="error-msg">{{ errors.modelo }}</span>
            </div>
            <div class="form-group">
              <label for="año">Año *</label>
              <input 
                v-model="form.año" 
                type="number" 
                id="año" 
                min="1900" 
                :max="currentYear"
                required
                :class="{ error: errors.año }"
              />
              <span v-if="errors.año" class="error-msg">{{ errors.año }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="color">Color *</label>
              <input 
                v-model="form.color" 
                type="text" 
                id="color" 
                required
                :class="{ error: errors.color }"
              />
              <span v-if="errors.color" class="error-msg">{{ errors.color }}</span>
            </div>
            <div class="form-group">
              <label for="chasis">Número de Chasis</label>
              <input 
                v-model="form.chasis" 
                type="text" 
                id="chasis"
              />
            </div>
          </div>
        </div>

        <!-- Datos del Viaje -->
        <div class="form-section">
          <h2>✈️ Datos del Viaje</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="paisDestino">País de Destino *</label>
              <select v-model="form.paisDestino" id="paisDestino" required :class="{ error: errors.paisDestino }">
                <option value="">Seleccionar país</option>
                <option value="Colombia">Colombia</option>
                <option value="Brasil">Brasil</option>
                <option value="Argentina">Argentina</option>
                <option value="Chile">Chile</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Venezuela">Venezuela</option>
              </select>
              <span v-if="errors.paisDestino" class="error-msg">{{ errors.paisDestino }}</span>
            </div>
            <div class="form-group">
              <label for="ciudadDestino">Ciudad de Destino *</label>
              <input 
                v-model="form.ciudadDestino" 
                type="text" 
                id="ciudadDestino" 
                required
                :class="{ error: errors.ciudadDestino }"
              />
              <span v-if="errors.ciudadDestino" class="error-msg">{{ errors.ciudadDestino }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="fechaSalida">Fecha de Salida *</label>
              <input 
                v-model="form.fechaSalida" 
                type="date" 
                id="fechaSalida" 
                :min="today"
                required
                :class="{ error: errors.fechaSalida }"
              />
              <span v-if="errors.fechaSalida" class="error-msg">{{ errors.fechaSalida }}</span>
            </div>
            <div class="form-group">
              <label for="fechaRetorno">Fecha de Retorno Estimada *</label>
              <input 
                v-model="form.fechaRetorno" 
                type="date" 
                id="fechaRetorno" 
                :min="form.fechaSalida || today"
                required
                :class="{ error: errors.fechaRetorno }"
              />
              <span v-if="errors.fechaRetorno" class="error-msg">{{ errors.fechaRetorno }}</span>
            </div>
          </div>
          <div class="form-group">
            <label for="motivoViaje">Motivo del Viaje *</label>
            <select v-model="form.motivoViaje" id="motivoViaje" required :class="{ error: errors.motivoViaje }">
              <option value="">Seleccionar motivo</option>
              <option value="Turismo">Turismo</option>
              <option value="Negocios">Negocios</option>
              <option value="Familia">Visita familiar</option>
              <option value="Medico">Tratamiento médico</option>
              <option value="Otro">Otro</option>
            </select>
            <span v-if="errors.motivoViaje" class="error-msg">{{ errors.motivoViaje }}</span>
          </div>
        </div>

        <!-- Observaciones -->
        <div class="form-section">
          <h2>📝 Observaciones Adicionales</h2>
          <div class="form-group">
            <label for="observaciones">Observaciones (Opcional)</label>
            <textarea 
              v-model="form.observaciones" 
              id="observaciones" 
              rows="4"
              placeholder="Ingrese cualquier información adicional relevante para su solicitud..."
            ></textarea>
          </div>
        </div>

        <!-- Botones -->
        <div class="form-actions">
          <button type="button" @click="goBack" class="btn-secondary">
            ← Cancelar
          </button>
          <button type="submit" :disabled="submitting" class="btn-primary">
            <span v-if="submitting">⏳ Enviando...</span>
            <span v-else">✅ Enviar Solicitud</span>
          </button>
        </div>
      </form>
    </div>
    </div>
  </template>
  
  <script>
  export default {
  name: "FormularioVehiculo",
  data() {
    return {
      submitting: false,
      form: {
        nombres: '',
        apellidos: '',
        documento: '',
        telefono: '',
        placa: '',
        marca: '',
        modelo: '',
        año: '',
        color: '',
        chasis: '',
        paisDestino: '',
        ciudadDestino: '',
        fechaSalida: '',
        fechaRetorno: '',
        motivoViaje: '',
        observaciones: ''
      },
      errors: {}
    };
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    },
    currentYear() {
      return new Date().getFullYear();
    }
  },
  methods: {
    validateForm() {
      this.errors = {};
      
      // Validaciones básicas
      if (!this.form.nombres.trim()) this.errors.nombres = 'Los nombres son requeridos';
      if (!this.form.apellidos.trim()) this.errors.apellidos = 'Los apellidos son requeridos';
      if (!this.form.documento.trim()) this.errors.documento = 'El documento es requerido';
      if (!this.form.telefono.trim()) this.errors.telefono = 'El teléfono es requerido';
      if (!this.form.placa.trim()) this.errors.placa = 'La placa es requerida';
      if (!this.form.marca) this.errors.marca = 'La marca es requerida';
      if (!this.form.modelo.trim()) this.errors.modelo = 'El modelo es requerido';
      if (!this.form.año) this.errors.año = 'El año es requerido';
      if (!this.form.color.trim()) this.errors.color = 'El color es requerido';
      if (!this.form.paisDestino) this.errors.paisDestino = 'El país de destino es requerido';
      if (!this.form.ciudadDestino.trim()) this.errors.ciudadDestino = 'La ciudad de destino es requerida';
      if (!this.form.fechaSalida) this.errors.fechaSalida = 'La fecha de salida es requerida';
      if (!this.form.fechaRetorno) this.errors.fechaRetorno = 'La fecha de retorno es requerida';
      if (!this.form.motivoViaje) this.errors.motivoViaje = 'El motivo del viaje es requerido';

      // Validación de fechas
      if (this.form.fechaSalida && this.form.fechaRetorno) {
        if (new Date(this.form.fechaRetorno) <= new Date(this.form.fechaSalida)) {
          this.errors.fechaRetorno = 'La fecha de retorno debe ser posterior a la fecha de salida';
        }
      }

      return Object.keys(this.errors).length === 0;
    },
    
    async submitForm() {
      if (!this.validateForm()) {
        alert('Por favor, corrija los errores en el formulario');
        return;
      }

      this.submitting = true;
      
      try {
        const API_BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';
        
        const tramiteData = {
          tipo: 'salida_vehiculo',
          usuario: this.form.nombres + ' ' + this.form.apellidos,
          estado: 'En revisión',
          fecha: new Date().toISOString().split('T')[0],
          datosPersonales: {
            nombres: this.form.nombres,
            apellidos: this.form.apellidos,
            documento: this.form.documento,
            telefono: this.form.telefono
          },
          datosVehiculo: {
            placa: this.form.placa.toUpperCase(),
            marca: this.form.marca,
            modelo: this.form.modelo,
            año: this.form.año,
            color: this.form.color,
            chasis: this.form.chasis
          },
          datosViaje: {
            paisDestino: this.form.paisDestino,
            ciudadDestino: this.form.ciudadDestino,
            fechaSalida: this.form.fechaSalida,
            fechaRetorno: this.form.fechaRetorno,
            motivoViaje: this.form.motivoViaje,
            observaciones: this.form.observaciones
          }
        };

        const response = await fetch(`${API_BASE}/api/tramites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          body: JSON.stringify(tramiteData)
        });

        if (response.ok) {
          const result = await response.json();
          alert(`✅ Solicitud enviada exitosamente!\n\nNúmero de trámite: #${result.id}\nEstado: En revisión\n\nPodrá consultar el estado de su trámite en el panel principal.`);
          this.$router.push('/');
        } else {
          throw new Error('Error al enviar la solicitud');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al enviar la solicitud. Por favor, intente nuevamente.');
      } finally {
        this.submitting = false;
      }
    },

    goBack() {
      this.$router.push('/');
    }
  }
  };
  </script>

<style scoped>
.formulario-vehiculo {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 15px;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.1);
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.form-header {
  background: #0d6efd;
  color: white;
  padding: 30px;
  text-align: center;
}

.form-header h1 {
  margin: 0 0 10px 0;
  font-size: 1.75rem;
  font-weight: 600;
}

.form-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.vehicle-form {
  padding: 30px;
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 1px solid #e9ecef;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 20px;
}

.form-section h2 {
  color: #495057;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 6px;
  color: #495057;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.form-group input.error,
.form-group select.error {
  border-color: #dc3545;
}

.error-msg {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 4px;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 140px;
}

.btn-primary {
  background: #198754;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #157347;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5c636a;
}

/* Responsive Design */
@media (max-width: 768px) {
  .formulario-vehiculo {
    padding: 10px;
  }
  
  .form-header {
    padding: 25px 20px;
  }
  
  .form-header h1 {
    font-size: 1.5rem;
  }
  
  .vehicle-form {
    padding: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .form-section {
    margin-bottom: 25px;
    padding-bottom: 20px;
  }
  
  .form-section h2 {
    font-size: 1.1rem;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .form-container {
    margin: 0;
    border-radius: 0;
  }
  
  .form-header {
    padding: 20px 15px;
  }
  
  .form-header h1 {
    font-size: 1.3rem;
  }
  
  .vehicle-form {
    padding: 15px;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 12px;
    font-size: 16px; /* Evita zoom en iOS */
  }
}
</style>
  