<template>
  <div class="clave-unica-container">
    <!-- Fondo con texto repetido -->
    <div class="background-text"></div>
    
    <div class="clave-unica-card">
      <!-- Header con diseño oficial -->
      <div class="header-oficial">
        <div class="government-bar">
          <div class="chile-flag"></div>
        </div>
        
        <div class="logo-section">
          <div class="clave-unica-logo">
            <div class="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="#5a9fd4"/>
                <path d="M12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 20c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9z" fill="white"/>
                <path d="M12 7c-1.1 0-2 .9-2 2v2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2V9c0-1.1-.9-2-2-2zm0 2c.55 0 1 .45 1 1v2h-2V9c0-.55.45-1 1-1z" fill="white"/>
              </svg>
            </div>
            <span>ClaveÚnica</span>
          </div>
        </div>
      </div>

      <!-- Título principal -->
      <div class="main-title">
        <h1>Portal Ciudadano ClaveÚnica</h1>
      </div>

      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Formulario de login -->
      <div class="login-section">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <input 
              v-model="rut" 
              type="text" 
              placeholder="Ingresa tu RUN"
              @input="formatRut"
              maxlength="12"
              class="rut-input"
              required
            />
          </div>
          
          <div class="form-group password-group">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'"
              placeholder="Ingresa tu ClaveÚnica"
              class="password-input"
              required
            />
            <button 
              type="button" 
              class="show-password-btn"
              @click="showPassword = !showPassword"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path v-if="!showPassword" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                <path v-else d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            </button>
          </div>
          
          <button type="submit" class="ingresa-btn" :disabled="loading">
            {{ loading ? 'Validando...' : 'INGRESA' }}
          </button>
        </form>
      </div>

      <!-- Información de prueba -->
      <div class="demo-info">
        <h4>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 8px;">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          PROYECTO EDUCATIVO - RUTs de prueba:
        </h4>
        <div class="rut-examples">
          <div class="rut-item">
            <strong>11.111.111-1</strong> → Turista
          </div>
          <div class="rut-item">
            <strong>22.222.222-2</strong> → Funcionario
          </div>
          <div class="rut-item">
            <strong>33.333.333-3</strong> → Auditor
          </div>
        </div>
        <p><small>Clave para todos: <strong>123456</strong></small></p>
      </div>

      <!-- Pie de página -->
      <div class="footer-help">
        <router-link to="/login" class="back-link">← Usar login tradicional</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/services/auth";

export default {
  name: "ClaveUnicaView",
  data() {
    return {
      rut: "",
      password: "",
      showPassword: false,
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    formatRut() {
      let value = this.rut.replace(/[^0-9kK]/g, '');
      if (value.length > 1) {
        const body = value.slice(0, -1);
        const dv = value.slice(-1);
        const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        this.rut = `${formattedBody}-${dv}`;
      } else {
        this.rut = value;
      }
    },

    validateRut(rut) {
      const validRuts = {
        '11.111.111-1': { email: 'turista@example.com', password: 'turista123' },
        '22.222.222-2': { email: 'funcionario@aduana.com', password: 'func123' },
        '33.333.333-3': { email: 'admin@aduana.com', password: 'admin123' }
      };
      return validRuts[rut] || null;
    },

    async handleLogin() {
      this.loading = true;
      this.errorMessage = "";
      
      try {
        const userData = this.validateRut(this.rut);
        if (!userData) {
          this.errorMessage = "RUN no registrado en el sistema. Verifica el formato.";
          this.loading = false;
          return;
        }

        if (this.password !== '123456') {
          this.errorMessage = "Clave incorrecta. Para la demo, usa: 123456";
          this.loading = false;
          return;
        }

        // Simular delay de validación oficial
        await new Promise(resolve => setTimeout(resolve, 2000));

        const userRole = await auth.login(userData.email, userData.password);
        
        if (userRole) {
          // Redirigir según el rol del usuario
          switch (userRole) {
            case 'turista':
              this.$router.push({ name: "turista" });
              break;
            case 'funcionario':
              this.$router.push({ name: "funcionario" });
              break;
            case 'auditor':
              this.$router.push({ name: "auditoria" });
              break;
            default:
              this.$router.push({ name: "turista" });
          }
        } else {
          this.errorMessage = "Error interno. Contacta al administrador.";
        }
      } catch (error) {
        console.error("ClaveÚnica login error:", error);
        this.errorMessage = "Error de conexión con los servidores.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.clave-unica-container {
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

/* Fondo con texto repetido */
.background-text {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='60' viewBox='0 0 800 60'%3E%3Ctext x='0' y='20' font-family='Arial, sans-serif' font-size='16' font-weight='bold' fill='%23dc3545' fill-opacity='0.15'%3EESTO ES UN PROYECTO DE INSTITUTO ESTO ES UN PROYECTO DE INSTITUTO ESTO ES UN PROYECTO DE INSTITUTO%3C/text%3E%3Ctext x='0' y='40' font-family='Arial, sans-serif' font-size='16' font-weight='bold' fill='%23dc3545' fill-opacity='0.15'%3EESTO ES UN PROYECTO DE INSTITUTO ESTO ES UN PROYECTO DE INSTITUTO ESTO ES UN PROYECTO DE INSTITUTO%3C/text%3E%3C/svg%3E");
  background-repeat: repeat;
}

.clave-unica-card {
  background: white;
  border-radius: 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 2;
  border: 2px solid #e0e0e0;
}

.header-oficial {
  background: white;
}

.government-bar {
  height: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;
  background: white;
}

.chile-flag {
  width: 100%;
  height: 100%;
  background: #dc3545;
  position: relative;
}

.chile-flag::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 33%;
  height: 100%;
  background: #0066cc;
}

.chile-flag::after {
  content: '';
  position: absolute;
  left: 33%;
  top: 0;
  width: 34%;
  height: 100%;
  background: white;
}



.logo-section {
  padding: 20px;
  text-align: left;
}

.clave-unica-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 300;
  color: #5a9fd4;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-title {
  text-align: center;
  padding: 30px 20px 20px;
  background: #f8f9fa;
}

.main-title h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 300;
  color: #6c757d;
  letter-spacing: -0.5px;
}

.login-section {
  padding: 40px;
  background: white;
}

.form-group {
  margin-bottom: 20px;
}

.rut-input, .password-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 0;
  font-size: 16px;
  background: #f8f9fa;
  color: #666;
  box-sizing: border-box;
}

.rut-input:focus, .password-input:focus {
  outline: none;
  border-color: #5a9fd4;
  background: white;
}

.password-group {
  position: relative;
}

.show-password-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: #5a9fd4;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ingresa-btn {
  width: 100%;
  background: #5a9fd4;
  color: white;
  border: none;
  padding: 15px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background-color 0.3s ease;
}

.ingresa-btn:hover:not(:disabled) {
  background: #4a8bc2;
}

.ingresa-btn:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}

.demo-info {
  background: #fff3e0;
  border: 2px solid #ff9800;
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
}

.demo-info h4 {
  margin: 0 0 15px 0;
  color: #f57c00;
  font-size: 14px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
}

.rut-examples {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.rut-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255,152,0,0.1);
  border-radius: 4px;
  font-size: 13px;
}

.rut-item strong {
  color: #1976d2;
}

.footer-help {
  background: white;
  padding: 20px 40px;
  text-align: center;
  border-top: 1px solid #e0e0e0;
}



.back-link {
  color: #5a9fd4;
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  text-decoration: underline;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  margin: 20px;
  border-radius: 4px;
  border-left: 4px solid #d32f2f;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 600px) {
  .clave-unica-container {
    padding: 10px;
  }
  
  .main-title h1 {
    font-size: 22px;
  }
  
  .login-section {
    padding: 30px 20px;
  }
  
  .footer-help {
    padding: 15px 20px;
  }
  
  .rut-input, .password-input {
    font-size: 16px; /* Evita zoom en iOS */
  }
  
  .demo-info {
    margin: 15px;
    padding: 15px;
  }
  
  .rut-item {
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }
}
</style> 