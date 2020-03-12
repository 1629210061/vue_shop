import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import User from '../components/user/user.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/user', component: User }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫，实现的功能，但用户没用进行登录去访问网页其他页面（也就是sessionStroage中没有token值）的时候，需要跳转到登录页面，强制他进行登录
router.beforeEach((to, from, next) => {
  // 如果用户访问的是登录页面，直接放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果不存在token则跳转到登录页面
  if (!tokenStr) return next('/login')
  next()
})

export default router
