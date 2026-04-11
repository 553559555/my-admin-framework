<script setup lang="ts">
import { ref } from 'vue'
import { getUserProfile, RequestError, type UserProfile } from '@/services'

const loading = ref(false)
const errorMessage = ref('')
const profile = ref<UserProfile | null>(null)

const fetchProfile = async () => {
	loading.value = true
	errorMessage.value = ''

	try {
		profile.value = await getUserProfile()
	} catch (error) {
		if (error instanceof RequestError) {
			errorMessage.value = error.message
		} else {
			errorMessage.value = '请求失败'
		}
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<section>
		<h1>网络请求示例</h1>
		<p>点击下面按钮调用 /user/profile 接口。</p>
		<button type="button" @click="fetchProfile" :disabled="loading">
			{{ loading ? '请求中...' : '获取用户信息' }}
		</button>
		<p v-if="errorMessage">{{ errorMessage }}</p>
		<pre v-if="profile">{{ JSON.stringify(profile, null, 2) }}</pre>
	</section>
</template>
