import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Forgot from '../views/Forgot.vue'
import vue3 from '../views/blog/vue3.vue'
import redis from '../views/note/redis.vue'
import proxy from '../views/note/proxy.vue'
import axios from '../views/note/axios.vue'
import pinia from '../views/note/pinia.vue'
import ele from '../views/misc/ele.vue'
import knowledge from '../views/misc/knowledge.vue'
import code from '../views/misc/code.vue'
import resume from '../views/misc/resume.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'Login' } //重定向
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: Forgot
  },
  {
    path: '/bloghome',
    name: 'BlogHome',
    // 懒加载
    component: () => import('../views/BlogHome.vue'),
  }, 
  {path: '/blog/Vue3', name: 'vue3',component: vue3}, 

  {path: '/note/redis', name: 'redis',component:redis}, 
  {path: '/note/proxy', name: 'proxy',component: proxy}, 
  {path: '/note/axios', name: 'axios',component: axios}, 
  {path: '/note/pinia', name: 'pinia',component: pinia}, 

  {path: '/ele', name: 'ele',component: ele}, 
  {path: '/knowledge', name: 'knowledge',component: knowledge}, 
  {path: '/code', name: 'code',component: code}, 
  {path: '/resume', name: 'resume',component: resume}, 

  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => { //使用路由守卫判断是否跳转登录之后才能访问的界面
  if(to.name !== 'Login' && to.name !== 'Forgot' && to.name !== 'Register' && !store.state.loggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
