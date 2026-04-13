import type { RouteRecordRaw } from 'vue-router'
import { usePermissionStore } from '@/store/permission'
import type { MenuItem } from '@/services/menu'

/**
 * 过滤隐藏的菜单
 */
function filterHiddenMenus(menus: MenuItem[]): MenuItem[] {
  return menus
    .filter((menu) => !menu.meta?.hidden)
    .map((menu) => ({
      ...menu,
      children: menu.children ? filterHiddenMenus(menu.children) : undefined,
    }))
}

/**
 * 将菜单转换为路由配置
 */
function transformMenuToRoute(menu: MenuItem): RouteRecordRaw {
  const route: Partial<RouteRecordRaw> = {
    path: menu.path,
    name: menu.name,
    meta: menu.meta,
  }

  // 处理组件路径
  if (menu.component) {
    // 布局组件
    if (menu.component === 'Layout') {
      route.component = () => import('@/layouts/index.vue')
    } else {
      // 页面组件
      route.component = () => import(`@/pages/${menu.component}.vue`)
    }
  }

  // 处理子路由
  if (menu.children && menu.children.length > 0) {
    route.children = menu.children
      .filter((child) => !child.meta?.hidden)
      .map((child) => transformMenuToRoute(child))
  }

  return route as RouteRecordRaw
}

/**
 * 生成动态路由
 */
export function generateRoutes(menus: MenuItem[]): RouteRecordRaw[] {
  const filteredMenus = filterHiddenMenus(menus)
  return filteredMenus.map((menu) => transformMenuToRoute(menu))
}

/**
 * 权限守卫
 */
export async function setupPermissionGuard(router: ReturnType<typeof import('vue-router').createRouter>) {
  const permissionStore = usePermissionStore()

  // 白名单路由
  const whiteList = ['/login']

  router.beforeEach(async (to, from, next) => {
    const hasToken = localStorage.getItem('token')

    // 已登录
    if (hasToken) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        // 检查是否已加载动态路由
        if (!permissionStore.isRoutesLoaded) {
          try {
            await permissionStore.fetchMenus()
            await permissionStore.fetchPermissions()

            // 动态添加路由
            const accessRoutes = generateRoutes(permissionStore.menus)
            accessRoutes.forEach((route) => {
              router.addRoute(route)
            })

            // 重新导航到目标路由
            next({ ...to, replace: true })
          } catch (error) {
            console.error('加载动态路由失败:', error)
            // 加载失败，清除缓存并跳转到登录
            permissionStore.reset()
            localStorage.removeItem('token')
            next(`/login?redirect=${to.path}`)
          }
        } else {
          next()
        }
      }
    } else {
      // 未登录
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
      }
    }
  })
}
