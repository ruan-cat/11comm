<!--
  抄送工作单页面
  功能：显示抄送给我的工作单列表

  访问地址: http://localhost:3000/#/pages-sub/work/copy-work

  旧代码：gitee-example/pages/work/copyWork.vue
-->

<script lang="ts" setup>
import type { WorkOrder } from '@/types/work-order'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getWorkOrderCopyList } from '@/api/work-order'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { TypedRouter } from '@/router/helpers'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '抄送工作单',
    navigationBarBackgroundColor: '#368bff',
    navigationBarTextStyle: 'white',
  },
})

/** z-paging 实例引用 */
const pagingRef = ref()

/** 列表数据 */
const dataList = ref<WorkOrder[]>([])

/** 当前小区信息 */
const communityInfo = getCurrentCommunity()

/** 加载数据请求 */
const { send: loadList } = useRequest(
  (params: { page: number, row: number }) =>
    getWorkOrderCopyList({
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
    console.error('加载抄送工作单列表失败:', error)
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
    10001: 'warning',
    10002: 'primary',
    10003: 'success',
    10004: 'danger',
    10005: 'default',
  }
  return statusMap[status] || 'default'
}

/** 跳转到工作单详情页 */
function handleDetail(order: WorkOrder) {
  TypedRouter.toWorkDetail(order.orderId)
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
        icon="copy"
        icon-class="i-carbon-copy text-blue-400 animate-pulse"
        primary-text="正在加载抄送工作单..."
        secondary-text="请稍候片刻"
      />
    </template>

    <!-- 列表内容 -->
    <view class="p-3">
      <view
        v-for="item in dataList"
        :key="item.orderId"
        class="mb-3 rounded-lg bg-white p-4 shadow-sm"
        @click="handleDetail(item)"
      >
        <!-- 工作单头部 -->
        <view class="mb-3 flex items-center justify-between">
          <view class="title-row flex flex-1 items-center overflow-hidden">
            <wd-icon name="" custom-class="i-carbon-copy text-colorui-orange text-20px flex-shrink-0" />
            <text class="truncate font-medium">{{ item.title }}</text>
          </view>
          <wd-tag :type="getStatusType(item.status)" size="small">
            {{ item.statusName }}
          </wd-tag>
        </view>

        <!-- 工作单信息 -->
        <view class="mb-3 text-sm text-gray-600">
          <view class="info-item flex items-center">
            <wd-icon name="" custom-class="i-carbon-category text-gray-400 text-16px" />
            <text>类型：{{ item.typeName }}</text>
          </view>
          <view class="info-item flex items-center">
            <wd-icon name="" custom-class="i-carbon-time text-gray-400 text-16px" />
            <text>创建时间：{{ item.createTime }}</text>
          </view>
          <view class="info-item flex items-center">
            <wd-icon name="" custom-class="i-carbon-user-avatar text-gray-400 text-16px" />
            <text>创建人：{{ item.creatorName }}</text>
          </view>
          <view v-if="item.staffName" class="info-item flex items-center">
            <wd-icon name="" custom-class="i-carbon-user text-gray-400 text-16px" />
            <text>执行人：{{ item.staffName }}</text>
          </view>
        </view>

        <!-- 工作内容预览 -->
        <view class="line-clamp-2 mb-3 text-sm text-gray-500">
          {{ item.content }}
        </view>

        <!-- 操作提示 -->
        <view class="flex items-center justify-end text-xs text-gray-400">
          <text>点击查看详情</text>
          <wd-icon name="" custom-class="i-carbon-chevron-right text-14px" />
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <template #empty>
      <wd-status-tip image="search" tip="暂无抄送工作单" />
    </template>
  </z-paging>
</template>

<style scoped lang="scss">
/* 信息行间距 - 兼容微信小程序 */
.info-item + .info-item {
  margin-top: 8rpx;
}

.title-row > text,
.info-item > text {
  margin-left: 8rpx;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
