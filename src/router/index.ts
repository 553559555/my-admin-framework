import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/layouts/index.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import('@/pages/home/index.vue'),
            },
            {
                path: '/about',
                name: 'About',
                component: () => import('@/pages/about/index.vue'),
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/login/index.vue'),
    },
]


const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router