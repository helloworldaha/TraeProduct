import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue')
  },
  {
    path: '/generator',
    name: 'Generator',
    component: () => import('@/pages/Generator.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/pages/History.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
