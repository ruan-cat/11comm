<!--
  公告详情页
  功能：展示公告详细内容

  访问地址: http://localhost:3000/#/pages/notice/detail
  建议携带参数: ?noticeId=NOTICE_0001

  旧代码：gitee-example/pages/notice/detail/noticeDetail.vue
-->
<script setup lang="ts">
import type { NoticeItem } from '@/types/notice'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { queryNotices } from '@/api/notice'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '公告详情',
  },
})

const communityInfo = getCurrentCommunity()
const noticeId = ref('')
const notice = ref<NoticeItem | null>(null)

const noticeTime = computed(() => {
  if (!notice.value)
    return '-'

  return notice.value.timeStr || dayjs(notice.value.startTime).format('YYYY-MM-DD HH:mm')
})

const { loading, send: loadNoticeDetail } = useRequest(
  () =>
    queryNotices({
      page: 1,
      row: 1,
      communityId: communityInfo.communityId,
      noticeId: noticeId.value,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const first = event.data?.notices?.[0]
    notice.value = first || null
  })
  .onError((error) => {
    console.error('加载公告详情失败', error)
    notice.value = null
  })

onLoad((options) => {
  noticeId.value = options?.noticeId || ''
  if (!noticeId.value) {
    uni.showToast({
      title: '缺少公告编号',
      icon: 'none',
    })
    return
  }

  loadNoticeDetail()
})
</script>

<template>
  <view class="page">
    <view v-if="loading" class="loading-wrap">
      <wd-loading type="ring" size="28px" />
      <text class="loading-text">公告内容加载中...</text>
    </view>

    <view v-else-if="notice" class="detail-card">
      <view class="header">
        <text class="title">{{ notice.title }}</text>
        <text class="time">发布时间：{{ noticeTime }}</text>
      </view>

      <view class="content-wrap">
        <rich-text class="rich-content" :nodes="notice.context" />
      </view>
    </view>

    <wd-status-tip v-else image="content" tip="未查询到公告详情" />
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
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

.detail-card {
  border-radius: 16rpx;
  background: #fff;
  overflow: hidden;
}

.header {
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #f3f4f6;
}

.title {
  display: block;
  font-size: 34rpx;
  font-weight: 600;
  color: #111827;
  line-height: 1.5;
}

.time {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.content-wrap {
  padding: 24rpx;
}

.rich-content {
  font-size: 28rpx;
  line-height: 1.8;
  color: #374151;
}

.rich-content :deep(p) {
  margin-bottom: 16rpx;
}
</style>
