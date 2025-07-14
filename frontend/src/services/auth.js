import { ref } from 'vue';

const token = localStorage.getItem("accessToken");
const isAuthenticated = ref(!!token);

// Simulación de usuarios para desarrollo local
const mockUsers = [
  { id: 1, email: 'admin@aduana.com', password: 'admin123', role: 'auditor' },
  { id: 2, email: 'turista@example.com', password: 'turista123', role: 'turista' },
  { id: 3, email: 'funcionario@aduana.com', password: 'func123', role: 'funcionario' }
];

// URL base para desarrollo y producción
const API_BASE = process.env.NODE_ENV === 'production' 
  ? '' // En Vercel, las API functions están en el mismo dominio
  : 'http://localhost:3000';

async function login(email, password) {
  // Para desarrollo local, usar simulación en lugar de API
  if (process.env.NODE_ENV !== 'production') {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Buscar usuario en datos simulados
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return false;
    }
    
    // Generar token simulado y guardar datos del usuario
    const accessToken = Buffer.from(email + ':' + Date.now()).toString('base64');
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userId", user.id.toString());
    isAuthenticated.value = true;
    return user.role; // Devolver el rol en lugar de solo true
  }
  
  // Para producción, usar API real
  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("userEmail", email);
    isAuthenticated.value = true;
    
    // Determinar rol basado en email para producción
    let role = 'turista';
    if (email.includes('admin')) role = 'auditor';
    else if (email.includes('funcionario')) role = 'funcionario';
    
    localStorage.setItem("userRole", role);
    return role;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

async function register(email, password) {
  // Para desarrollo local, simular registro exitoso
  if (process.env.NODE_ENV !== 'production') {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
  
  // Para producción, usar API real
  try {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return res.ok;
  } catch (error) {
    console.error('Register error:', error);
    return false;
  }
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userId");
  isAuthenticated.value = false;
}

function getUserRole() {
  return localStorage.getItem("userRole");
}

function getUserEmail() {
  return localStorage.getItem("userEmail");
}

function getToken() {
  return localStorage.getItem("accessToken");
}

export default {
  login,
  register,
  logout,
  getUserRole,
  getUserEmail,
  getToken,
  isLogged: () => isAuthenticated.value
};
