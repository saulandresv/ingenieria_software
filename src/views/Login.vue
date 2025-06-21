<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Sistema Aduana</h1>
        <p>Acceso al sistema de gestión aduanera</p>
      </div>

      <div class="demo-accounts">
        <h4>Cuentas de prueba:</h4>
        <ul>
          <li><strong>Turista:</strong> turista@example.com / turista123</li>
          <li><strong>Funcionario:</strong> funcionario@aduana.com / func123</li>
          <li><strong>Auditor:</strong> admin@aduana.com / admin123</li>
        </ul>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            placeholder="usuario@example.com"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>
        
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'INICIAR SESIÓN' }}
        </button>
      </form>

      <div class="alternative-login">
        <p>¿Prefieres usar Clave Única?</p>
        <router-link to="/clave-unica" class="clave-unica-btn">
          Ingresar con Clave Única
        </router-link>
      </div>

      <div class="register-link">
        ¿No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/services/auth";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = "";
      
      try {
        const isValid = await auth.login(this.email, this.password);
        if (isValid) {
          this.$router.push({ name: "home" });
        } else {
          this.errorMessage = "Credenciales inválidas. Verifica tu email y contraseña.";
        }
      } catch (error) {
        console.error("Login error:", error);
        this.errorMessage = "Error de conexión. Intenta nuevamente.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  border: 1px solid #e9ecef;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #495057;
  margin-bottom: 8px;
  font-size: 1.75rem;
  font-weight: 600;
}

.login-header p {
  color: #6c757d;
  margin: 0;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #495057;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.login-btn {
  width: 100%;
  background: #0d6efd;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 20px;
}

.login-btn:hover:not(:disabled) {
  background: #0b5ed7;
}

.login-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.alternative-login {
  text-align: center;
  margin-bottom: 20px;
  padding: 20px 0;
  border-top: 1px solid #e9ecef;
}

.alternative-login p {
  margin-bottom: 10px;
  color: #6c757d;
  font-size: 0.9rem;
}

.clave-unica-btn {
  display: inline-block;
  background: #dc3545;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.clave-unica-btn:hover {
  background: #c82333;
  text-decoration: none;
}

.register-link {
  text-align: center;
  font-size: 0.9rem;
}

.register-link a {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

.error-message {
  background: #f8d7da;
  color: #842029;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #f5c2c7;
  font-size: 0.9rem;
}

.demo-accounts {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
}

.demo-accounts h4 {
  margin: 0 0 10px 0;
  color: #0c5460;
  font-size: 0.9rem;
  font-weight: 600;
}

.demo-accounts ul {
  margin: 0;
  padding-left: 20px;
  color: #0c5460;
  font-size: 0.85rem;
}

.demo-accounts ul li {
  margin-bottom: 4px;
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 15px;
  }
  
  .login-card {
    padding: 30px 25px;
  }
  
  .login-header h1 {
    font-size: 1.5rem;
  }
  
  .form-group input {
    font-size: 16px; /* Evita zoom en iOS */
  }
}
</style>
  