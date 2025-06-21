import { ref } from 'vue';

const token = localStorage.getItem("accessToken");
const isAuthenticated = ref(!!token);

// URL base para desarrollo y producción
const API_BASE = process.env.NODE_ENV === 'production' 
  ? '' // En Vercel, las API functions están en el mismo dominio
  : 'http://localhost:3000';

async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) return false;

  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
  isAuthenticated.value = true;
  return true;
}

async function register(email, password) {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.ok;
}

function logout() {
  localStorage.removeItem("accessToken");
  isAuthenticated.value = false;
}

export default {
  login,
  register,
  logout,
  isLogged: () => isAuthenticated.value
};
