<template>
    <div class="register-container">
      <h1>Crear Cuenta</h1>
      <form @submit.prevent="handleRegister" class="form-register">
        <input v-model="email" type="email" placeholder="Correo electrónico" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit">Registrarse</button>
        <p v-if="error" class="error">❌ {{ error }}</p>
      </form>
      <p class="link">¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
    </div>
  </template>
  
  <script>
  import auth from "@/services/auth";
  
  export default {
    name: "Register",
    data() {
      return {
        email: "",
        password: "",
        error: "",
      };
    },
    methods: {
      async handleRegister() {
        const success = await auth.register(this.email, this.password);
        if (success) {
          this.$router.push("/login");
        } else {
          this.error = "No se pudo registrar. Intenta con otro correo.";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .register-container {
    min-height: 100vh;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .register-card {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 450px;
    border: 1px solid #e9ecef;
  }
  
  .register-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .register-header h1 {
    color: #495057;
    margin-bottom: 8px;
    font-size: 1.75rem;
    font-weight: 600;
  }
  
  .register-header p {
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
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 12px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 0.9rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  
  .form-group input:focus,
  .form-group select:focus {
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
  
  .register-btn {
    width: 100%;
    background: #198754;
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
  
  .register-btn:hover:not(:disabled) {
    background: #157347;
  }
  
  .register-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
  
  .login-link {
    text-align: center;
    font-size: 0.9rem;
  }
  
  .login-link a {
    color: #0d6efd;
    text-decoration: none;
    font-weight: 500;
  }
  
  .login-link a:hover {
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
  
  /* Responsive */
  @media (max-width: 480px) {
    .register-container {
      padding: 15px;
    }
    
    .register-card {
      padding: 30px 25px;
    }
    
    .register-header h1 {
      font-size: 1.5rem;
    }
    
    .form-group input,
    .form-group select {
      font-size: 16px; /* Evita zoom en iOS */
    }
  }
  </style>
  