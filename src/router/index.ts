import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { setupPermissionGuard } from './permission'

// 基础静态路由（登录页等公共路由）
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录' },
    component: () => import('@/pages/login/index.vue'),
  },
]

// 动态路由（由权限守卫动态添加）
const dynamicRoutes: RouteRecordRaw[] = []

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...constantRoutes, ...dynamicRoutes],
})

// 设置权限守卫
setupPermissionGuard(router)

export default router
