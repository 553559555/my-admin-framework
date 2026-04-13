import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MenuItem } from '@/services/menu'
import { getMenuList, getPermissions } from '@/services/menu'

export const usePermissionStore = defineStore('permission', () => {
  // 菜单路由
  const menus = ref<MenuItem[]>([])
  // 权限列表
  const permissions = ref<string[]>([])
  // 动态路由是否已加载
  const isRoutesLoaded = ref(false)

  /**
   * 获取菜单并生成路由
   */
  async function fetchMenus() {
    try {
      const data = await getMenuList()
      menus.value = data
      isRoutesLoaded.value = true
      return data
    } catch (error) {
      console.error('获取菜单失败:', error)
      return []
    }
  }

  /**
   * 获取权限列表
   */
  async function fetchPermissions() {
    try {
      const data = await getPermissions()
      permissions.value = data
      return data
    } catch (error) {
      console.error('获取权限失败:', error)
      return []
    }
  }

  /**
   * 检查是否有权限
   */
  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission)
  }

  /**
   * 重置状态
   */
  function reset() {
    menus.value = []
    permissions.value = []
    isRoutesLoaded.value = false
  }

  return {
    menus,
    permissions,
    isRoutesLoaded,
    fetchMenus,
    fetchPermissions,
    hasPermission,
    reset,
  }
})
