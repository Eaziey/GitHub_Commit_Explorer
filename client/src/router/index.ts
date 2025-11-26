
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../Pages/Home.vue';
import Repo from '../Pages/Repo.vue';
import differencesView from '../components/differencesView.vue';
import Forbidden from '../Pages/403Page.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/repos/:username', name: 'Repo', component: Repo, props: true, meta: { showNavbar: true, transition: 'fade' } },
  { path: '/diff/:filename',name: 'DiffView',component: differencesView, props: true, meta: { showNavbar: true, transition: 'fade' }},
  { path: '/forbidden',name: 'forbiddenView',component: Forbidden, props: true, meta: { showNavbar: true, transition: 'fade' }},

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
