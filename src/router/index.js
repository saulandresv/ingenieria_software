import { createRouter, createWebHistory } from 'vue-router';
import TuristaPanel from '../views/TuristaPanel.vue';
import FormularioVehiculo from '../views/FormularioVehiculo.vue';
import FuncionarioPanel from '../views/FuncionarioPanel.vue';
import AuditoriaPanel from '../views/AuditoriaPanel.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

const routes = [
  { path: '/', name: 'home', component: TuristaPanel },
  { path: '/formulario', name: 'formulario', component: FormularioVehiculo },
  { path: '/funcionario', name: 'funcionario', component: FuncionarioPanel },
  { path: '/auditoria', name: 'auditoria', component: AuditoriaPanel },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
