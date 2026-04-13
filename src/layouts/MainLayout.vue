<script setup lang="ts">
import { ref } from 'vue'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="layout-sidebar" :class="{ collapsed: isCollapsed }">
      <Sidebar />
    </div>

    <!-- 右侧内容区 -->
    <div class="layout-main">
      <!-- 顶部导航 -->
      <div class="layout-header">
        <Header />
      </div>

      <!-- 主内容 -->
      <div class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.layout-sidebar {
  width: 200px;
  flex-shrink: 0;
  transition: width 0.3s;
  background: #304156;
}

.layout-sidebar.collapsed {
  width: 64px;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f0f2f5;
}

.layout-header {
  flex-shrink: 0;
}

.layout-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
