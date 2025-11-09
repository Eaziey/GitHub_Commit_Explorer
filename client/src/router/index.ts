
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../Pages/Home.vue';
import Repo from '../Pages/Repo.vue';
import differencesView from '../components/differencesView.vue';
import Forbidden from '../Pages/403Page.vue'
import Favourites from '../Pages/Favourites.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/repos/:username', name: 'Repo', component: Repo, props: true, meta: { showNavbar: true } },
  { path: '/diff/:filename',name: 'DiffView',component: differencesView, props: true, meta: { showNavbar: true }},
  { path: '/forbidden',name: 'forbiddenView',component: Forbidden, props: true, meta: { showNavbar: true }},
  { path: '/favourites/:username',name: 'favourites',component: Favourites, props: true, meta: { showNavbar: true }}

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
