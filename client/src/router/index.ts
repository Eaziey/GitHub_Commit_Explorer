
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../Pages/Home.vue';
import Repo from '../Pages/Repo.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/repos/:username', name: 'Repo', component: Repo, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
