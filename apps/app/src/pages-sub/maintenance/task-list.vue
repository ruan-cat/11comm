<!--
  设备保养任务列表页
  功能：显示设备保养任务列表，支持下拉刷新和上拉加载

  访问地址: http://localhost:3000/#/pages-sub/maintenance/task-list

  旧代码：gitee-example/pages/maintainance/maintainance.vue
-->

<script lang="ts" setup>
import type { MaintenanceTask } from '@/types/maintenance'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getMaintenanceList } from '@/api/maintenance'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { TypedRouter } from '@/router/helpers'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '设备保养',
    navigationBarBackgroundColor: '#368bff',
    navigationBarTextStyle: 'white',
  },
})

/** z-paging 实例引用 */
const pagingRef = ref()

/** 列表数据 */
const dataList = ref<MaintenanceTask[]>([])

/** 当前小区信息 */
const communityInfo = getCurrentCommunity()

/** 加载数据请求 */
const { send: loadList } = useRequest(
  (params: { page: number, row: number }) =>
    getMaintenanceList({
      ...params,
      communityId: communityInfo.communityId || 'COMM_001',
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const { list = [] } = event.data || {}
    pagingRef.value?.complete(list)
  })
  .onError((error) => {
    console.error('加载设备保养列表失败:', error)
    pagingRef.value?.complete(false)
  })

/** 处理分页查询 */
function handleQuery(pageNo: number, pageSize: number) {
  loadList({ page: pageNo, row: pageSize })
}

/** 进入页面自动触发首次加载 */
onMounted(() => {
  pagingRef.value?.reload()
})

/** 获取状态标签样式 */
function getStatusType(status: string): 'primary' | 'success' | 'warning' | 'danger' | 'default' {
  const statusMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'default'> = {
    10001: 'warning', // 待保养
    10002: 'primary', // 保养中
    10003: 'success', // 已完成
  }
  return statusMap[status] || 'default'
}

/** 跳转到保养执行页 */
function handleExecute(task: MaintenanceTask) {
  TypedRouter.toMaintenanceExecute(task.taskId)
}

/** 跳转到任务流转页 */
function handleTransfer(task: MaintenanceTask) {
  TypedRouter.toMaintenanceTransfer(task.taskId)
}
</script>

<template>
  <z-paging
    ref="pagingRef"
    v-model="dataList"
    @query="handleQuery"
  >
    <!-- 加载状态 -->
    <template #loading>
      <ZPagingLoading
        icon="settings"
        icon-class="i-carbon-settings text-blue-400 animate-pulse"
        primary-text="正在加载保养任务..."
        secondary-text="请稍候片刻"
      />
    </template>

    <!-- 列表内容 -->
    <view class="p-3">
      <view
        v-for="item in dataList"
        :key="item.taskId"
        class="mb-3 rounded-lg bg-white p-4 shadow-sm"
      >
        <!-- 任务头部 -->
        <view class="mb-3 flex items-center justify-between">
          <view class="title-row flex items-center">
            <wd-icon name="" custom-class="i-carbon-settings text-colorui-blue text-20px" />
            <text class="font-medium">{{ item.taskName }}</text>
          </view>
          <wd-tag :type="getStatusType(item.status)" size="small">
            {{ item.statusName }}
          </wd-tag>
        </view>

        <!-- 任务信息 -->
        <view class="mb-3 text-sm text-gray-600">
          <view class="task-info-item flex items-center">
            <wd-icon name="" custom-class="i-carbon-machine-learning text-gray-400 text-16px" />
            <text>设备：{{ item.machineName }}</text>
          </view>
          <view class="task-info-item flex items-center">
            <wd-icon name="" custom-class="i-carbon-time text-gray-400 text-16px" />
            <text>计划时间：{{ item.planTime }}</text>
          </view>
          <view v-if="item.staffName" class="task-info-item flex items-center">
            <wd-icon name="" custom-class="i-carbon-user text-gray-400 text-16px" />
            <text>执行人：{{ item.staffName }}</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="action-row flex">
          <wd-button
            v-if="item.status === '10001' || item.status === '10002'"
            type="primary"
            size="small"
            @click="handleExecute(item)"
          >
            {{ item.status === '10001' ? '开始保养' : '继续保养' }}
          </wd-button>
          <wd-button
            v-if="item.status !== '10003'"
            type="info"
            size="small"
            plain
            custom-class="ml-8rpx"
            @click="handleTransfer(item)"
          >
            任务流转
          </wd-button>
          <wd-button
            v-if="item.status === '10003'"
            type="success"
            size="small"
            plain
            custom-class="ml-8rpx"
            @click="handleExecute(item)"
          >
            查看详情
          </wd-button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <template #empty>
      <wd-status-tip image="search" tip="暂无保养任务" />
    </template>
  </z-paging>
</template>

<style scoped lang="scss">
/* 任务信息行间距 - 使用兼容微信小程序的写法 */
.task-info-item + .task-info-item {
  margin-top: 8rpx;
}

.title-row > text,
.task-info-item > text {
  margin-left: 8rpx;
}
</style>
