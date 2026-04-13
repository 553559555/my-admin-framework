import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/layouts/index.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        meta: { title: '首页' },
        children: [
            {
                path: '/home',
                name: 'Home',
                meta: { title: '首页' },
                component: () => import('@/pages/home/index.vue'),
            },
            {
                path: '/about',
                name: 'About',
                meta: { title: '关于' },
                component: () => import('@/pages/about/index.vue'),
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        meta: { title: '登录' },
        component: () => import('@/pages/login/index.vue'),
    },
]


const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router