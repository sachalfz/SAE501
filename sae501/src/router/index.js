import { createRouter, createWebHistory } from 'vue-router'
import SoloView from '../views/SoloView.vue'
import TreeDGameView from '../views/ThreeDGameView.vue'
import AccountView from '../views/AccountView.vue'
import ShopView from '../views/ShopView.vue'
import LoginView from '../views/LoginView.vue'
import LogoutView from '../views/LogoutView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminAddMusicView from '../views/AdminAddMusicView.vue'
import AdminAddItemView from '../views/AdminAddItemView.vue'

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
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutView,
  },
  {
    path: '/admin/addmusic',
    name: 'AdminAddMusic',
    component: AdminAddMusicView,
  },
  {
    path: '/admin/additem',
    name: 'AdminAddItem',
    component: AdminAddItemView,
  },
];

const router = createRouter({
  history: createWebHistory(routerBase),
  routes,
  base: '/rapguess/'
});

export default router
