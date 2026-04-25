<!--
  道闸视频页
  功能：展示道闸摄像头视频流

  访问地址: http://localhost:3000/#/pages-sub/parking/barrier-video
  建议携带参数: ?machineId=xxx&communityId=xxx

  旧代码：gitee-example/pages/car/barrierVideo.vue
-->
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getBarrierCloudVideo } from '@/api/parking'

definePage({
  style: {
    navigationBarTitleText: '视频管理',
  },
})

const videoUrl = ref('')
const machineId = ref('')
const communityId = ref('COMM_001')

const { send: loadVideo } = useRequest(
  () => getBarrierCloudVideo({ machineId: machineId.value, communityId: communityId.value }),
  { immediate: false },
)
  .onSuccess((event) => {
    videoUrl.value = event.data?.url || ''
  })
  .onError((error) => {
    console.error('加载视频地址失败', error)
  })

onLoad((options) => {
  machineId.value = options?.machineId || ''
  communityId.value = options?.communityId || 'COMM_001'
  videoUrl.value = decodeURIComponent(options?.videoUrl || '')

  if (!videoUrl.value && machineId.value) {
    loadVideo()
  }
})
</script>

<template>
  <view class="page">
    <video
      v-if="videoUrl"
      :src="videoUrl"
      controls
      autoplay
      muted
      object-fit="contain"
      class="player"
    />
    <wd-status-tip v-else image="content" tip="暂无视频流地址" />
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
}

.player {
  width: 100%;
  border-radius: 12rpx;
}
</style>
