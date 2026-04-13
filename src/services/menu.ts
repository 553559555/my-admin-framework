import request from './request'

export interface MenuItem {
  id: number
  path: string
  name: string
  title: string
  icon?: string
  component?: string
  parentId?: number
  sort: number
  children?: MenuItem[]
  meta?: {
    title: string
    icon?: string
    hidden?: boolean
    keepAlive?: boolean
  }
}

// 开发环境模拟菜单数据
const mockMenus: MenuItem[] = [
  {
    id: 1,
    path: '/home',
    name: 'Home',
    title: '首页',
    icon: 'House',
    component: 'home/index',
    sort: 1,
    meta: { title: '首页', icon: 'House' },
  },
  {
    id: 2,
    path: '/about',
    name: 'About',
    title: '关于',
    icon: 'InfoFilled',
    component: 'about/index',
    sort: 2,
    meta: { title: '关于', icon: 'InfoFilled' },
  },
]

// 开发环境模拟权限
const mockPermissions = ['admin', 'user']

/**
 * 获取用户菜单列表
 */
export function getMenuList() {
  // 开发环境返回模拟数据
  if (import.meta.env.DEV) {
    return Promise.resolve(mockMenus)
  }
  return request.get<MenuItem[]>('/menu/list')
}

/**
 * 获取用户权限列表
 */
export function getPermissions() {
  // 开发环境返回模拟数据
  if (import.meta.env.DEV) {
    return Promise.resolve(mockPermissions)
  }
  return request.get<string[]>('/menu/permissions')
}
