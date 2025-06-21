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
    max-width: 400px;
    margin: auto;
    padding: 2rem;
    text-align: center;
    font-family: "Segoe UI", sans-serif;
  }
  h1 {
    margin-bottom: 1rem;
  }
  .form-register {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  input {
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
  }
  .error {
    color: red;
    margin-top: 0.5rem;
  }
  .link {
    margin-top: 1rem;
    font-size: 0.9rem;
  }
  </style>
  