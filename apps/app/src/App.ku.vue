<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import GlobalLoading from '@/components/global/loading/global-loading.vue'
import GlobalMessage from '@/components/global/message/global-message.vue'
import GlobalToast from '@/components/global/toast/global-toast.vue'
import { useThemeStore } from '@/store'
import FgTabbar from '@/tabbar/index.vue'
import { shouldShowCustomTabbar } from './tabbar/store'
import { currRoute } from './utils'

const themeStore = useThemeStore()

const isCurrentPageTabbar = ref(true)
onShow(() => {
  console.log('App.ku.vue onShow', currRoute())
  const { path } = currRoute()
  isCurrentPageTabbar.value = shouldShowCustomTabbar(path)
})

const helloKuRoot = ref('Hello AppKuVue')

const exposeRef = ref('this is form app.Ku.vue')

defineExpose({
  exposeRef,
})
</script>

<template>
  <wd-config-provider :theme-vars="themeStore.themeVars" :theme="themeStore.theme">
    <!-- 这个先隐藏了，知道这样用就行 -->
    <view class="hidden text-center">
      {{ helloKuRoot }}，这里可以配置全局的东西
    </view>

    <!-- <view>  fagaerg </view> -->

    <KuRootView />

    <FgTabbar v-if="isCurrentPageTabbar" />

    <wd-notify />
    <wd-message-box />
    <wd-toast />
    <global-loading />
    <global-toast />
    <global-message />
  </wd-config-provider>
</template>
