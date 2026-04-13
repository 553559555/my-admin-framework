<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 菜单数据
const menuData = [
  {
    path: '/',
    title: '首页',
    icon: 'House'
  },
  {
    path: '/about',
    title: '关于',
    icon: 'InfoFilled'
  }
]

const activeMenu = computed(() => route.path)

const handleMenuSelect = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="layout-sidebar">
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="false"
      @select="handleMenuSelect"
    >
      <el-menu-item v-for="item in menuData" :key="item.path" :index="item.path">
        <el-icon><component :is="item.icon" /></el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.layout-sidebar {
  width: 200px;
  height: 100%;
  background: #304156;
  overflow-y: auto;
}

.sidebar-menu {
  border-right: none;
  background: transparent;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}

:deep(.el-menu) {
  background: transparent;
}

:deep(.el-menu-item) {
  color: #bfcbd9;
}

:deep(.el-menu-item:hover) {
  background: #263445;
}

:deep(.el-menu-item.is-active) {
  background: #409eff !important;
  color: #fff;
}
</style>
