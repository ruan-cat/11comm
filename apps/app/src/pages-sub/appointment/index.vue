<!--
  预约管理页
  功能：查询预约核销订单，支持扫码或输入核销码执行核销

  访问地址: http://localhost:3000/#/pages-sub/appointment/index

  旧代码：gitee-example/pages/appointment/appointment.vue
-->
<script setup lang="ts">
import type { AppointmentOrder, AppointmentOrderQueryParams } from '@/types/appointment'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { listCommunitySpaceConfirmOrder, saveCommunitySpaceConfirmOrder } from '@/api/appointment'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '预约管理',
  },
})

type ZPagingRef = any

const communityInfo = getCurrentCommunity()
const toast = useGlobalToast()
const pagingRef = ref<ZPagingRef>()
const orders = ref<AppointmentOrder[]>([])
const timeId = ref('')

const { send: loadOrders } = useRequest(
  (params: AppointmentOrderQueryParams) => listCommunitySpaceConfirmOrder(params),
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('加载预约订单失败', error)
    pagingRef.value?.complete(false)
  })

const { loading: confirming, send: submitConfirm } = useRequest(
  () =>
    saveCommunitySpaceConfirmOrder({
      timeId: timeId.value,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('核销成功')
    timeId.value = ''
    pagingRef.value?.reload()
  })
  .onError((error) => {
    console.error('核销失败', error)
  })

function handleQuery(pageNo: number, pageSize: number) {
  loadOrders({
    page: pageNo,
    row: pageSize,
    communityId: communityInfo.communityId,
    timeId: timeId.value.trim() || undefined,
  })
}

function handleSearch() {
  pagingRef.value?.reload()
}

function handleConfirm() {
  if (!timeId.value.trim()) {
    toast.warning('请输入核销码')
    return
  }

  submitConfirm()
}

function openQueuePage() {
  uni.navigateTo({
    url: '/pages-sub/appointment/queue',
    events: {
      selectedCode: (code: string) => {
        timeId.value = code
      },
    },
  })
}

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <view class="search-wrap">
      <wd-input
        v-model="timeId"
        placeholder="输入核销码"
        clearable
      />
      <wd-button plain custom-class="ml-10rpx" @click="openQueuePage">
        扫码
      </wd-button>
      <wd-button type="primary" custom-class="ml-10rpx" :loading="confirming" @click="handleConfirm">
        核销
      </wd-button>
      <wd-button custom-class="ml-10rpx" @click="handleSearch">
        搜索
      </wd-button>
    </view>

    <z-paging ref="pagingRef" v-model="orders" @query="handleQuery">
      <template #loading>
        <ZPagingLoading
          icon="calendar"
          icon-class="i-carbon-calendar text-blue-500 animate-pulse"
          primary-text="正在加载预约订单..."
          secondary-text="请稍候片刻"
        />
      </template>

      <view class="list-wrap">
        <view
          v-for="item in orders"
          :key="item.orderId"
          class="order-card"
        >
          <view class="order-head">
            <text class="label">单号</text>
            <text class="value">{{ item.orderId }}</text>
          </view>
          <view class="order-row">
            <text class="label">核销码</text>
            <text class="value">{{ item.timeId }}</text>
          </view>
          <view class="order-row">
            <text class="label">场地</text>
            <text class="value">{{ item.spaceName }}</text>
          </view>
          <view class="order-row">
            <text class="label">预约日期</text>
            <text class="value">{{ item.appointmentDate }}</text>
          </view>
          <view class="order-row">
            <text class="label">预约时间</text>
            <text class="value">{{ item.hours }}</text>
          </view>
          <view class="order-row">
            <text class="label">预约人</text>
            <text class="value">{{ item.personName }} / {{ item.personTel }}</text>
          </view>
          <view class="order-row">
            <text class="label">核销状态</text>
            <text class="value">{{ item.state === 'CONFIRMED' ? '已核销' : '待核销' }}</text>
          </view>
        </view>
      </view>

      <template #empty>
        <wd-status-tip image="content" tip="暂无预约核销订单" />
      </template>
    </z-paging>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.search-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.list-wrap {
  padding-bottom: 20rpx;
}

.order-card {
  margin-bottom: 14rpx;
  border-radius: 12rpx;
  background: #fff;
  padding: 20rpx;
}

.order-head,
.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8rpx;
}

.order-head {
  margin-top: 0;
  padding-bottom: 10rpx;
  border-bottom: 1rpx solid #f3f4f6;
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
