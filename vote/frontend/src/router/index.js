import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Rank from '../views/Rank.vue'
import Detail from '../views/Detail.vue'
import Assist from '../views/Assist.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页 - 作品投票打榜' }
  },
  {
    path: '/rank',
    name: 'Rank',
    component: Rank,
    meta: { title: '排行榜 - 作品投票打榜' }
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: Detail,
    meta: { title: '作品详情' }
  },
  {
    path: '/assist/:id',
    name: 'Assist',
    component: Assist,
    meta: { title: '助力投票' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
