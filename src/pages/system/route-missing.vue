<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const routeTitle = computed(() => String(route.meta.title ?? route.name ?? '未命名路由'))
const missingComponent = computed(() => String(route.meta.missingComponent ?? '未知组件'))

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push('/')
}
</script>

<template>
  <section class="route-missing">
    <div class="route-missing__card">
      <p class="route-missing__badge">Route Fallback</p>
      <h1 class="route-missing__title">页面组件未找到</h1>
      <p class="route-missing__description">
        当前路由已降级显示，避免因为菜单配置错误导致整套路由加载失败。
      </p>

      <dl class="route-missing__details">
        <div>
          <dt>路由标题</dt>
          <dd>{{ routeTitle }}</dd>
        </div>
        <div>
          <dt>当前路径</dt>
          <dd>{{ route.fullPath }}</dd>
        </div>
        <div>
          <dt>缺失组件</dt>
          <dd>{{ missingComponent }}</dd>
        </div>
      </dl>

      <button type="button" class="route-missing__button" @click="goBack">返回上一页</button>
    </div>
  </section>
</template>

<style scoped>
.route-missing {
  min-height: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
}

.route-missing__card {
  width: min(100%, 560px);
  padding: 32px;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%);
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.12);
}

.route-missing__badge {
  margin: 0 0 12px;
  color: #b45309;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.route-missing__title {
  margin: 0;
  color: #0f172a;
  font-size: 28px;
}

.route-missing__description {
  margin: 12px 0 0;
  color: #475569;
  line-height: 1.6;
}

.route-missing__details {
  margin: 24px 0;
  display: grid;
  gap: 12px;
}

.route-missing__details div {
  padding: 14px 16px;
  border-radius: 14px;
  background: #eff6ff;
}

.route-missing__details dt {
  margin-bottom: 6px;
  color: #475569;
  font-size: 13px;
}

.route-missing__details dd {
  margin: 0;
  color: #0f172a;
  font-weight: 600;
  word-break: break-all;
}

.route-missing__button {
  border: 0;
  border-radius: 999px;
  padding: 12px 18px;
  background: #0f172a;
  color: #ffffff;
  cursor: pointer;
}
</style>