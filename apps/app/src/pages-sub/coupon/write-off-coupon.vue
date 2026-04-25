<!--
  核销优惠券页
  功能：输入或扫码核销码，执行优惠券核销并查看核销记录

  访问地址: http://localhost:3000/#/pages-sub/coupon/write-off-coupon

  旧代码：gitee-example/pages/coupon/writeOffCoupon.vue
-->
<script setup lang="ts">
import type { CouponWriteOffOrder } from '@/types/coupon'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { listCouponPropertyUserDetail, writeOffCouponPropertyUser } from '@/api/coupon'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'

definePage({
  style: {
    navigationBarTitleText: '核销优惠券',
  },
})

type ZPagingRef = any

const pagingRef = ref<ZPagingRef>()
const couponOrders = ref<CouponWriteOffOrder[]>([])
const couponQrcode = ref('')

const { send: loadCoupons } = useRequest(
  (params: { page: number, row: number }) =>
    listCouponPropertyUserDetail({
      page: params.page,
      row: params.row,
      communityId: 'COMM_001',
      couponQrcode: couponQrcode.value.trim() || undefined,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('加载优惠券核销记录失败', error)
    pagingRef.value?.complete(false)
  })

const { loading: submitting, send: submitWriteOff } = useRequest(
  () =>
    writeOffCouponPropertyUser({
      couponQrcode: couponQrcode.value.trim(),
      communityId: 'COMM_001',
      giftCount: 1,
    }),
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({
      title: '核销成功',
      icon: 'none',
    })
    couponQrcode.value = ''
    pagingRef.value?.reload()
  })
  .onError((error) => {
    console.error('核销优惠券失败', error)
    uni.showToast({
      title: '核销失败，请稍后重试',
      icon: 'none',
    })
  })

function handleQuery(pageNo: number, pageSize: number) {
  loadCoupons({
    page: pageNo,
    row: pageSize,
  })
}

function handleSearch() {
  pagingRef.value?.reload()
}

function handleConfirm() {
  if (!couponQrcode.value.trim()) {
    uni.showToast({
      title: '请输入核销码',
      icon: 'none',
    })
    return
  }

  uni.showModal({
    title: '确认核销',
    content: `核销码：${couponQrcode.value.trim()}`,
    confirmText: '核销',
    success: (res) => {
      if (res.confirm)
        submitWriteOff()
    },
  })
}

function openQueuePage() {
  uni.navigateTo({
    url: '/pages-sub/appointment/queue',
    events: {
      selectedCode: (code: string) => {
        couponQrcode.value = code
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
        v-model="couponQrcode"
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

    <z-paging ref="pagingRef" v-model="couponOrders" @query="handleQuery">
      <template #loading>
        <ZPagingLoading
          icon="ticket"
          icon-class="i-carbon-ticket text-blue-500 animate-pulse"
          primary-text="正在加载核销记录..."
          secondary-text="请稍候"
        />
      </template>

      <view class="list-wrap">
        <view v-for="item in couponOrders" :key="item.uoId" class="order-card">
          <view class="order-head">
            <text class="label">单号</text>
            <text class="value">{{ item.uoId }}</text>
          </view>
          <view class="order-row">
            <text class="label">优惠券</text>
            <text class="value">{{ item.couponName }}（{{ item.value }}）</text>
          </view>
          <view class="order-row">
            <text class="label">用户</text>
            <text class="value">{{ item.userName }}（{{ item.tel }}）</text>
          </view>
          <view class="order-row">
            <text class="label">核销时间</text>
            <text class="value">{{ item.createTime }}</text>
          </view>
          <view class="order-row">
            <text class="label">用途</text>
            <text class="value">{{ item.remark }}</text>
          </view>
        </view>
      </view>

      <template #empty>
        <wd-status-tip image="content" tip="暂无优惠券核销记录" />
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
