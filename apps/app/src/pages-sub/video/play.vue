<!--
  视频播放页
  功能：根据设备信息拉取播放地址并加载视频

  访问地址: http://localhost:3000/#/pages-sub/video/play
  建议携带参数: ?communityId=xxx&machineId=xxx&machineName=xxx

  旧代码：gitee-example/pages/video/playVideo.vue
-->
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getPlayVideoUrl } from '@/api/video'

definePage({
  style: {
    navigationBarTitleText: '视频播放',
  },
})

const communityId = ref('')
const machineId = ref('')
const machineName = ref('')
const playUrl = ref('')

const { loading, send: loadVideoUrl } = useRequest(
  () =>
    getPlayVideoUrl({
      communityId: communityId.value,
      machineId: machineId.value,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    playUrl.value = event.data?.url || ''
  })
  .onError((error) => {
    console.error('加载视频播放地址失败', error)
    playUrl.value = ''
    uni.showToast({
      title: '加载视频地址失败',
      icon: 'none',
    })
  })

onLoad((options) => {
  communityId.value = options?.communityId || ''
  machineId.value = options?.machineId || ''
  machineName.value = decodeURIComponent(options?.machineName || '')

  if (machineName.value) {
    uni.setNavigationBarTitle({
      title: machineName.value,
    })
  }

  if (!communityId.value || !machineId.value) {
    uni.showToast({
      title: '缺少视频参数',
      icon: 'none',
    })
    return
  }

  loadVideoUrl()
})
</script>

<template>
  <view class="page">
    <view v-if="loading" class="loading-wrap">
      <wd-loading type="ring" size="28px" />
      <text class="loading-text">视频地址加载中...</text>
    </view>

    <web-view v-else-if="playUrl" :src="playUrl" />

    <wd-status-tip v-else image="content" tip="未获取到视频地址" />
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

.loading-wrap {
  min-height: 320rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.loading-text {
  margin-left: 12rpx;
}
</style>
