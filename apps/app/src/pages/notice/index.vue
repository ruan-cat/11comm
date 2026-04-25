<!--
  公告列表页
  功能：展示公告列表，支持分页浏览并进入详情

  访问地址: http://localhost:3000/#/pages/notice/index

  旧代码：gitee-example/pages/notice/notice.vue
-->
<script setup lang="ts">
import type { NoticeItem, NoticeListParams, NoticeListResponse } from '@/types/notice'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'
import { queryNotices } from '@/api/notice'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '公告列表',
  },
})

type ZPagingRef = any

const communityInfo = getCurrentCommunity()
const pagingRef = ref<ZPagingRef>()
const notices = ref<NoticeItem[]>([])

const { send: loadNotices } = useRequest(
  (params: NoticeListParams) => queryNotices(params),
  { immediate: false },
)
  .onSuccess((event) => {
    const result = event.data as NoticeListResponse
    pagingRef.value?.complete(result?.notices || [])
  })
  .onError((error) => {
    console.error('加载公告列表失败', error)
    pagingRef.value?.complete(false)
  })

function handleQuery(pageNo: number, pageSize: number) {
  loadNotices({
    page: pageNo,
    row: pageSize,
    communityId: communityInfo.communityId,
    noticeTypeCd: '1001',
  })
}

function formatNoticeTime(value: string): string {
  if (!value)
    return '-'

  return dayjs(value).format('YYYY-MM-DD HH:mm')
}

onMounted(() => {
  pagingRef.value?.reload()
})

function gotoDetail(item: NoticeItem) {
  uni.navigateTo({
    url: `/pages/notice/detail?noticeId=${item.noticeId}`,
  })
}
</script>

<template>
  <view class="page">
    <z-paging ref="pagingRef" v-model="notices" @query="handleQuery">
      <template #loading>
        <ZPagingLoading
          icon="notification"
          icon-class="i-carbon-notification text-blue-500 animate-pulse"
          primary-text="正在加载公告..."
          secondary-text="请稍候片刻"
        />
      </template>

      <view class="list-wrap">
        <wd-cell-group v-if="notices.length > 0" border>
          <wd-cell
            v-for="item in notices"
            :key="item.noticeId"
            :title="item.title"
            :label="`发布时间：${item.timeStr || formatNoticeTime(item.startTime)}`"
            is-link
            @click="gotoDetail(item)"
          >
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-notification text-green-500 mr-8rpx" />
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>

      <template #empty>
        <wd-status-tip image="content" tip="暂无公告信息" />
      </template>
    </z-paging>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

.list-wrap {
  padding: 20rpx;
}
</style>
