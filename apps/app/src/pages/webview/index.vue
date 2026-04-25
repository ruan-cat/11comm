<!--
  网页视图页
  功能：承载外部 H5 页面并支持动态标题

  访问地址: http://localhost:3000/#/pages/webview/index
  建议携带参数: ?url=xxx&title=xxx

  旧代码：gitee-example/pages/hcWebView/hcWebView.vue
-->
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: '网页视图',
  },
})

const url = ref('')

onLoad((options) => {
  const encodedUrl = options?.url || ''
  const title = options?.title ? decodeURIComponent(options.title) : ''

  if (title) {
    uni.setNavigationBarTitle({
      title,
    })
  }

  if (!encodedUrl) {
    uni.showToast({
      title: '缺少网页地址参数',
      icon: 'none',
    })
    return
  }

  url.value = decodeURIComponent(encodedUrl)
})
</script>

<template>
  <view class="page">
    <web-view v-if="url" :src="url" />
    <wd-status-tip v-else image="content" tip="未提供网页地址" />
  </view>
</template>

<style scoped>
.page {
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
}
</style>
