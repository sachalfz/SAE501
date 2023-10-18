import { createRouter, createWebHistory } from 'vue-router'
import SoloView from '../views/SoloView.vue'
import TestView from '../views/SoloTestView.vue'
import TreeDGameView from '../views/ThreeDGameView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/solo',
      name: 'solo',
      component: SoloView
    },
    {
      path: '/3dgame',
      name: '3dgame',
      component: TreeDGameView
    },
    {
      path: '/test',
      name: 'test',
      component: TestView
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
