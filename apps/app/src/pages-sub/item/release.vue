<!--
  物品发布页
  功能：查看物品放行待办与已办任务，支持进入详情处理

  访问地址: http://localhost:3000/#/pages-sub/item/release

  旧代码：gitee-example/pages/itemRelease/itemRelease.vue
-->
<script setup lang="ts">
import type { ItemReleaseTask } from '@/types/item-release'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { queryFinishItemRelease, queryUndoItemRelease } from '@/api/item-release'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '物品放行',
  },
})

type ZPagingRef = any

const communityInfo = getCurrentCommunity()
const active = ref(0)
const pagingRef = ref<ZPagingRef>()
const releaseTasks = ref<ItemReleaseTask[]>([])

const { send: loadTaskList } = useRequest(
  (params: { page: number, row: number }) =>
    (active.value === 0
      ? queryUndoItemRelease({
          page: params.page,
          row: params.row,
          communityId: communityInfo.communityId,
        })
      : queryFinishItemRelease({
          page: params.page,
          row: params.row,
          communityId: communityInfo.communityId,
        })),
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('加载物品放行列表失败', error)
    pagingRef.value?.complete(false)
  })

function handleTabChange(e: { index: number }) {
  active.value = e.index
  pagingRef.value?.reload()
}

function handleQuery(pageNo: number, pageSize: number) {
  loadTaskList({
    page: pageNo,
    row: pageSize,
  })
}

function openDetail(item: ItemReleaseTask) {
  const query = [
    `irId=${item.irId}`,
    `flowId=${item.flowId}`,
    `action=${item.action}`,
    `taskId=${item.taskId || ''}`,
  ].join('&')

  uni.navigateTo({
    url: `/pages-sub/item/release-detail?${query}`,
  })
}

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <wd-tabs :value="active" @change="handleTabChange">
      <wd-tab title="待办" />
      <wd-tab title="已办" />
    </wd-tabs>

    <z-paging ref="pagingRef" v-model="releaseTasks" @query="handleQuery">
      <template #loading>
        <ZPagingLoading
          icon="cube"
          icon-class="i-carbon-cube text-blue-500 animate-pulse"
          primary-text="正在加载放行任务..."
          secondary-text="请稍候"
        />
      </template>

      <view class="list-wrap">
        <view v-for="item in releaseTasks" :key="item.irId" class="task-card" @click="openDetail(item)">
          <view class="task-head">
            <text class="title">{{ item.typeName }} - {{ item.stateName }}</text>
            <wd-icon name="" custom-class="i-carbon-chevron-right text-gray-400 text-28rpx" />
          </view>
          <view class="task-row">
            <text class="label">通行时间</text>
            <text class="value">{{ item.passTime }}</text>
          </view>
          <view class="task-row">
            <text class="label">物品数量</text>
            <text class="value">{{ item.amount }}</text>
          </view>
        </view>
      </view>

      <template #empty>
        <wd-status-tip image="content" tip="暂无放行任务" />
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

.task-card {
  margin-bottom: 14rpx;
  border-radius: 12rpx;
  background: #fff;
  padding: 20rpx;
}

.task-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 28rpx;
  color: #111827;
  font-weight: 600;
}

.task-row {
  margin-top: 10rpx;
  display: flex;
  justify-content: space-between;
}

.label {
  font-size: 24rpx;
  color: #6b7280;
}

.value {
  font-size: 24rpx;
  color: #111827;
}
</style>
