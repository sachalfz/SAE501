import { createRouter, createWebHistory } from 'vue-router'
import SoloView from '../views/SoloView.vue'
import TreeDGameView from '../views/ThreeDGameView.vue'
import AccountView from '../views/AccountView.vue'
import ShopView from '../views/ShopView.vue'

const devServerURL = 'http://localhost:5173/';
const isProduction = import.meta.env.MODE === 'production';

const routerBase = isProduction ? 'rapguess/' : 'rapguess/';

const routes = [
  {
    path: '/',
    name: 'solo',
    component: SoloView
  },
  {
    path: '/3dgame',
    name: '3dgame',
    component: TreeDGameView
  },
  {
    path: '/account/:id',
    name: 'account',
    component: AccountView
  },
  {
    path: '/shop',
    name: 'shop',
    component: ShopView
  }
];

const router = createRouter({
  history: createWebHistory(routerBase),
  routes,
  base: '/rapguess/'
});

export default router
