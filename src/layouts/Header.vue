<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElBreadcrumb, ElBreadcrumbItem, ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton } from 'element-plus'

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)

// 面包屑数据
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  // 如果没有匹配项，添加首页
  if (matched.length === 0) {
    return [{ path: '/', meta: { title: '首页' } }]
  }
  return matched
})

// 暴露折叠状态给父组件
defineExpose({
  collapsed
})

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      // 个人中心
      break
    case 'logout':
      // 退出登录
      router.push('/login')
      break
  }
}

const handleBreadcrumbClick = (path: string) => {
  if (path !== route.path) {
    router.push(path)
  }
}
</script>

<template>
  <div class="layout-header">
    <div class="header-left">
      <!-- 面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="item in breadcrumbs"
          :key="item.path"
          :to="item.path"
        >
          {{ item.meta?.title || '首页' }}
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div class="logo">
        <span class="logo-text">管理后台</span>
      </div>
    </div>

    <div class="header-right">
      <el-dropdown @command="handleCommand" trigger="click">
        <span class="user-info">
          <span class="username">管理员</span>
          <el-button link>
            <el-icon><User /></el-icon>
          </el-button>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  height: 60px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
}

.username {
  margin-right: 8px;
  color: #606266;
}
</style>
