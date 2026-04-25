<!--
  投诉受理单列表页面
  功能：显示需要处理的投诉工单列表

  访问地址: http://localhost:3000/#/pages-sub/complaint/list

  完整示例: http://localhost:3000/#/pages-sub/complaint/list

  旧代码：gitee-example/pages/complaintList/complaintList.vue
-->

<script setup lang="ts">
import type { Complaint, QueryComplaintListParams } from '@/types/complaint'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'
import { getTodoComplaintList } from '@/api/complaint'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { TypedRouter } from '@/router'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '投诉受理单',
    enablePullDownRefresh: false,
  },
})

/** 获取小区信息 */
const communityInfo = getCurrentCommunity()

/** z-paging 组件引用 */
const pagingRef = ref()

/** 投诉列表（由 z-paging 接管） */
const complaintList = ref<Complaint[]>([])

/**
 * 使用 useRequest 管理请求状态 - 链式回调写法
 * @description 必须设置 immediate: false，由 z-paging 控制请求时机
 */
const { send: loadList } = useRequest(
  (params: QueryComplaintListParams) => getTodoComplaintList(params),
  { immediate: false },
)
  .onSuccess((event) => {
    const result = event.data
    const list = result.data || []

    // 格式化日期为 MM-DD
    const formattedList = list.map((item) => {
      const date = dayjs(item.createTime)
      return {
        ...item,
        createTime: `${date.month() + 1}-${date.date()}`,
      }
    })

    pagingRef.value?.complete(formattedList)
  })
  .onError((error) => {
    console.error('加载列表失败:', error)
    pagingRef.value?.complete(false)
  })

/**
 * z-paging 的 @query 回调
 * @description 接收分页参数，触发请求（不使用 await/try-catch）
 */
function handleQuery(pageNo: number, pageSize: number) {
  loadList({
    page: pageNo,
    row: pageSize,
    userId: 'USER_001', // TODO: 从用户信息获取
    storeId: 'STORE_001', // TODO: 从用户信息获取
    communityId: communityInfo.communityId,
  })
}

/**
 * 查看投诉详情
 * @example handleDetail(complaint)
 */
function handleDetail(complaint: Complaint) {
  TypedRouter.toComplaintDetail(complaint.complaintId)
}

/**
 * 处理投诉
 * @example handleDispatch(complaint)
 */
function handleDispatch(complaint: Complaint) {
  TypedRouter.toComplaintHandle(complaint.complaintId)
}

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="complaint-list-page">
    <z-paging
      ref="pagingRef"
      v-model="complaintList"
      @query="handleQuery"
    >
      <!-- 投诉列表 -->
      <view class="p-3">
        <view
          v-for="(item, index) in complaintList"
          :key="index"
          class="complaint-card mb-3 rounded bg-white p-3"
        >
          <!-- 头部：投诉ID 和 电话 -->
          <view class="flex items-center justify-between border-b border-gray-200 pb-2">
            <text class="font-medium">{{ item.complaintId }}</text>
            <text class="text-sm text-gray-500">{{ item.tel }}</text>
          </view>

          <!-- 投诉信息 -->
          <view class="mt-2">
            <view class="info-row flex items-center justify-between text-sm">
              <text class="text-gray-500">投诉类型</text>
              <text class="text-gray-700">{{ item.typeName }}</text>
            </view>

            <view class="info-row flex items-center justify-between text-sm">
              <text class="text-gray-500">投诉人</text>
              <text class="text-gray-700">{{ item.complaintName }}</text>
            </view>

            <view class="info-row flex items-center justify-between text-sm">
              <text class="text-gray-500">房间</text>
              <text class="text-gray-700">{{ item.roomName }}</text>
            </view>

            <view class="info-row flex items-center justify-between text-sm">
              <text class="text-gray-500">投诉时间</text>
              <text class="text-gray-700">{{ item.createTime }}</text>
            </view>

            <view class="info-row flex items-center justify-between text-sm">
              <text class="text-gray-500">投诉内容</text>
              <text class="line-clamp-2 text-gray-700">{{ item.context }}</text>
            </view>
          </view>

          <!-- 底部操作按钮 -->
          <view class="complaint-card-actions mt-3 flex items-center justify-end border-t border-gray-200 pt-3">
            <wd-button size="small" plain @click="handleDetail(item)">
              详情
            </wd-button>
            <wd-button size="small" type="success" custom-class="ml-8rpx" @click="handleDispatch(item)">
              办结
            </wd-button>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <template #empty>
        <view class="flex flex-col items-center justify-center" style="min-height: 60vh;">
          <wd-icon name="inbox" custom-class="text-gray-300" size="80px" />
          <text class="mt-4 text-gray-400">暂无投诉数据</text>
        </view>
      </template>

      <!-- 加载状态 -->
      <template #loading>
        <ZPagingLoading
          icon="document"
          icon-class="i-carbon-document text-orange-400 animate-pulse"
          primary-text="正在加载投诉列表..."
          secondary-text="请稍候片刻"
        />
      </template>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.complaint-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.complaint-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.complaint-card-actions {
  min-height: 56rpx;
}

/* 信息行间距 - 兼容微信小程序 */
.info-row + .info-row {
  margin-top: 0.5rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
