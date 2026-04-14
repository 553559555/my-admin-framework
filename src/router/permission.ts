import type { RouteRecordRaw } from 'vue-router'
import { usePermissionStore } from '@/store/permission'
import type { MenuItem } from '@/services/menu'

type RouteComponent = NonNullable<RouteRecordRaw['component']>
type ResolvedRouteComponent = {
  component: RouteComponent
  missingComponent?: string
}

const pageModules = import.meta.glob('../pages/**/*.vue')
const layoutModules = import.meta.glob('../layouts/**/*.vue')
const fallbackRouteComponent = pageModules['../pages/system/route-missing.vue'] as
  | RouteComponent
  | undefined

function normalizeModulePath(filePath: string, baseDir: 'pages' | 'layouts') {
  return filePath.replace(new RegExp(`^\.\./${baseDir}/`), '').replace(/\.vue$/, '')
}

function createPageComponentMap() {
  return Object.fromEntries(
    Object.entries(pageModules).map(([filePath, component]) => [
      normalizeModulePath(filePath, 'pages'),
      component as RouteComponent,
    ]),
  )
}

function createLayoutComponentMap() {
  return Object.entries(layoutModules).reduce<Record<string, RouteComponent>>((accumulator, [filePath, component]) => {
    const normalizedPath = normalizeModulePath(filePath, 'layouts')

    accumulator[normalizedPath] = component as RouteComponent
    if (normalizedPath === 'index') {
      accumulator.Layout = component as RouteComponent
    }

    return accumulator
  }, {})
}

const pageComponentMap = createPageComponentMap()
const layoutComponentMap = createLayoutComponentMap()

function normalizeComponentPath(component: string) {
  return component
    .trim()
    .replace(/^@\//, '')
    .replace(/^\/?src\//, '')
    .replace(/^\/+/, '')
    .replace(/\.vue$/, '')
}

function resolveRouteComponent(component: string): ResolvedRouteComponent {
  const normalizedPath = normalizeComponentPath(component)
  const layoutComponent = layoutComponentMap[normalizedPath.replace(/^layouts\//, '')]

  if (layoutComponent) {
    return { component: layoutComponent }
  }

  const pageComponent = pageComponentMap[normalizedPath.replace(/^pages\//, '')]

  if (pageComponent) {
    return { component: pageComponent }
  }

  if (!fallbackRouteComponent) {
    throw new Error('未找到降级页面组件: system/route-missing')
  }

  console.warn(`[router] 未找到路由组件: ${component}`)

  return {
    component: fallbackRouteComponent,
    missingComponent: component,
  }
}

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
    const resolvedComponent = resolveRouteComponent(menu.component)

    route.component = resolvedComponent.component

    if (resolvedComponent.missingComponent) {
      route.meta = {
        ...(route.meta ?? {}),
        missingComponent: resolvedComponent.missingComponent,
      }
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
