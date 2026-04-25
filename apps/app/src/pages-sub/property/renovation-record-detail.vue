<!--
  装修记录详情页
  功能：显示装修跟踪记录详情，支持删除记录

  访问地址: http://localhost:3000/#/pages-sub/property/renovation-record-detail
  建议携带参数: ?apply=JSON

  旧代码：gitee-example/pages/roomRenovationRecordDetail/roomRenovationRecordDetail.vue
-->
<script setup lang="ts">
import type { RenovationRecordMedia } from '@/types/property-management'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import {
  deleteRoomRenovationRecord,
  queryRoomRenovationRecordDetail,
} from '@/api/renovation'

definePage({
  style: {
    navigationBarTitleText: '记录详情',
  },
})

const recordInfo = ref<Record<string, any>>({})
const mediaList = ref<RenovationRecordMedia[]>([])

const imageList = computed(() => mediaList.value.filter(item => item.relTypeCd === 19000))
const videoList = computed(() => mediaList.value.filter(item => item.relTypeCd === 21000))

const { send: loadDetail } = useRequest(
  () =>
    queryRoomRenovationRecordDetail({
      page: 1,
      row: 50,
      communityId: recordInfo.value.communityId,
      recordId: recordInfo.value.recordId,
      roomName: recordInfo.value.roomName,
      roomId: recordInfo.value.roomId,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    mediaList.value = event.data || []
  })
  .onError((error) => {
    console.error('查询记录详情失败', error)
  })

const { send: removeRecord } = useRequest(
  () =>
    deleteRoomRenovationRecord({
      recordId: recordInfo.value.recordId,
      communityId: recordInfo.value.communityId,
    }),
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({ title: '删除成功', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 800)
  })
  .onError((error) => {
    console.error('删除记录失败', error)
  })

function preview(index: number) {
  uni.previewImage({
    current: index,
    urls: imageList.value.map(item => item.url),
  })
}

function handleDelete() {
  uni.showModal({
    title: '提示',
    content: '是否确认删除？',
    success: (res) => {
      if (res.confirm) {
        removeRecord()
      }
    },
  })
}

onLoad((options) => {
  if (!options?.apply)
    return

  try {
    recordInfo.value = JSON.parse(decodeURIComponent(options.apply))
    loadDetail()
  }
  catch (error) {
    console.error('参数解析失败', error)
  }
})
</script>

<template>
  <view class="page">
    <wd-cell-group border>
      <wd-cell title="操作" value="删除" is-link @click="handleDelete" />
      <wd-cell title="申请房间" :value="recordInfo.roomName || '-'" />
      <wd-cell title="跟踪备注" :value="recordInfo.remark || '-'" />
    </wd-cell-group>

    <view v-if="imageList.length > 0" class="media-block">
      <view class="media-title">
        图片
      </view>
      <view class="image-grid">
        <image
          v-for="(item, index) in imageList"
          :key="item.detailId"
          :src="item.url"
          mode="aspectFill"
          class="image-item"
          @click="preview(index)"
        />
      </view>
    </view>

    <view v-if="videoList.length > 0" class="media-block">
      <view class="media-title">
        视频
      </view>
      <video
        v-for="item in videoList"
        :key="item.detailId"
        :src="item.url"
        controls
        class="video-item"
      />
    </view>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.media-block {
  margin-top: 20rpx;
  border-radius: 12rpx;
  background: #fff;
  padding: 20rpx;
}

.media-title {
  margin-bottom: 12rpx;
  color: #4b5563;
  font-size: 28rpx;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -6rpx;
}

.image-item {
  width: calc(33.3333% - 12rpx);
  height: 200rpx;
  margin: 0 6rpx 12rpx;
  border-radius: 8rpx;
}

.video-item {
  width: 100%;
  border-radius: 8rpx;
}
</style>
