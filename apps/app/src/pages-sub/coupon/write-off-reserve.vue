<!--
  核销预约页
  功能：输入或扫码预约核销码，完成预约核销并查看核销记录

  访问地址: http://localhost:3000/#/pages-sub/coupon/write-off-reserve

  旧代码：gitee-example/pages/coupon/wirteOffReserve.vue
-->
<script setup lang="ts">
import type { ReserveWriteOffOrder } from '@/types/coupon'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { listReserveGoodsConfirmOrder, saveReserveGoodsConfirmOrder } from '@/api/coupon'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'

definePage({
  style: {
    navigationBarTitleText: '核销预约',
  },
})

type ZPagingRef = any

const pagingRef = ref<ZPagingRef>()
const reserveOrders = ref<ReserveWriteOffOrder[]>([])
const reserveQrcode = ref('')

const { send: loadReserveOrders } = useRequest(
  (params: { page: number, row: number }) =>
    listReserveGoodsConfirmOrder({
      page: params.page,
      row: params.row,
      communityId: 'COMM_001',
      reserveQrcode: reserveQrcode.value.trim() || undefined,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('加载预约核销记录失败', error)
    pagingRef.value?.complete(false)
  })

const { loading: submitting, send: submitReserveWriteOff } = useRequest(
  () =>
    saveReserveGoodsConfirmOrder({
      timeId: reserveQrcode.value.trim(),
      communityId: 'COMM_001',
    }),
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({
      title: '核销成功',
      icon: 'none',
    })
    reserveQrcode.value = ''
    pagingRef.value?.reload()
  })
  .onError((error) => {
    console.error('核销预约失败', error)
    uni.showToast({
      title: '核销失败，请稍后重试',
      icon: 'none',
    })
  })

function handleQuery(pageNo: number, pageSize: number) {
  loadReserveOrders({
    page: pageNo,
    row: pageSize,
  })
}

function handleSearch() {
  pagingRef.value?.reload()
}

function handleConfirm() {
  if (!reserveQrcode.value.trim()) {
    uni.showToast({
      title: '请输入核销码',
      icon: 'none',
    })
    return
  }

  uni.showModal({
    title: '确认核销',
    content: `核销码：${reserveQrcode.value.trim()}`,
    confirmText: '核销',
    success: (res) => {
      if (res.confirm)
        submitReserveWriteOff()
    },
  })
}

function openQueuePage() {
  uni.navigateTo({
    url: '/pages-sub/appointment/queue',
    events: {
      selectedCode: (code: string) => {
        reserveQrcode.value = code
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
        v-model="reserveQrcode"
        placeholder="请输入核销码"
        clearable
      />
      <wd-button plain custom-class="ml-10rpx" @click="openQueuePage">
        扫码
      </wd-button>
      <wd-button type="primary" custom-class="ml-10rpx" :loading="submitting" @click="handleConfirm">
        核销
      </wd-button>
      <wd-button custom-class="ml-10rpx" @click="handleSearch">
        搜索
      </wd-button>
    </view>

    <z-paging ref="pagingRef" v-model="reserveOrders" @query="handleQuery">
      <template #loading>
        <ZPagingLoading
          icon="task"
          icon-class="i-carbon-task text-blue-500 animate-pulse"
          primary-text="正在加载预约核销记录..."
          secondary-text="请稍候"
        />
      </template>

      <view class="list-wrap">
        <view v-for="item in reserveOrders" :key="item.orderId" class="order-card">
          <view class="order-head">
            <text class="label">单号</text>
            <text class="value">{{ item.orderId }}</text>
          </view>
          <view class="order-row">
            <text class="label">商品/服务</text>
            <text class="value">{{ item.goodsName }}</text>
          </view>
          <view class="order-row">
            <text class="label">核销数量</text>
            <text class="value">{{ item.quantity }}</text>
          </view>
          <view class="order-row">
            <text class="label">预约日期</text>
            <text class="value">{{ item.appointmentTime }}</text>
          </view>
          <view class="order-row">
            <text class="label">预约时段</text>
            <text class="value">{{ item.hours }}</text>
          </view>
          <view class="order-row">
            <text class="label">预约人</text>
            <text class="value">{{ item.personName }}（{{ item.personTel }}）</text>
          </view>
          <view class="order-row">
            <text class="label">核销时间</text>
            <text class="value">{{ item.createTime }}</text>
          </view>
        </view>
      </view>

      <template #empty>
        <wd-status-tip image="content" tip="暂无预约核销记录" />
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
