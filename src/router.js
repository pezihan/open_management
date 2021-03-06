import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'

import Order from '@/views/order/Order.vue'

import Detail from '@/views/finance/Detail.vue'

import Product from '@/views/product/Product.vue'
import Shipments from '@/views/product/Shipments.vue'

import All from '@/views/users/All.vue'
import Datum from '@/views/users/Datum.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome', // 登录时候重定向到home的子路由组件welcome上
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/order', component: Order },
      { path: '/detail', component: Detail },
      { path: '/product', component: Product },
      { path: '/shipments', component: Shipments },
      { path: '/all', component: All },
      { path: '/datum', component: Datum }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由守卫 控制没有登录状态直接跳转到登录页
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从那个路径跳转过来
  // next 是一个函数，next()表示放行  next('xxx') 表示强制跳转
  if (to.path === '/login') return next()
  // 获取浏览器中的token进行认证
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
