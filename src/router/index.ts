import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/home/index.vue'),
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@/pages/about/index.vue'),
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