import { createRouter, createWebHistory } from 'vue-router';
import TuristaPanel from '../views/TuristaPanel.vue';
import FormularioVehiculo from '../views/FormularioVehiculo.vue';
import FuncionarioPanel from '../views/FuncionarioPanel.vue';
import AuditoriaPanel from '../views/AuditoriaPanel.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ClaveUnica from '../views/ClaveUnica.vue';

const routes = [
  { path: '/', name: 'login', component: Login },
  { path: '/turista', name: 'turista', component: TuristaPanel },
  { path: '/formulario', name: 'formulario', component: FormularioVehiculo },
  { path: '/funcionario', name: 'funcionario', component: FuncionarioPanel },
  { path: '/auditoria', name: 'auditoria', component: AuditoriaPanel },
  { path: '/register', name: 'register', component: Register },
  { path: '/clave-unica', name: 'clave-unica', component: ClaveUnica },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
