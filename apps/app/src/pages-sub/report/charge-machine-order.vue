<!--
  充电桩订单页面
  功能：查询充电桩订单列表

  访问地址: http://localhost:3000/#/pages-sub/report/charge-machine-order
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/report/charge-machine-order?communityId=COMM_001

  旧代码：gitee-example/pages/report/chargeMachineOrder.vue
-->

<script setup lang="ts">
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getChargeMachineOrderList } from '@/api/fee'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '充电桩订单',
    enablePullDownRefresh: false,
  },
})

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

/** 订单列表 */
const orders = ref<
  Array<{
    orderId: string
    personName: string
    personTel: string
    machineName: string
    machineCode: string
    portCode: string
    chargeHours: number
    durationPrice: number
    energy: number
    amount: number
    startTime: string
    endTime: string
    stateName: string
    remark: string
  }>
>([])

/** z-paging 引用 */
const pagingRef = ref()

/** 加载订单列表 */
const { send: loadOrders, loading: ordersLoading } = useRequest(
  (page: number, pageSize: number) =>
    getChargeMachineOrderList({
      page,
      row: pageSize,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
).onSuccess((event) => {
  const list = event.data.list || []
  orders.value = list
  pagingRef.value?.complete(list)
}).onError(() => {
  toast.warning('加载充电桩订单失败')
  pagingRef.value?.complete(false)
})

/** z-paging 查询回调 */
function handleQuery(pageNo: number, pageSize: number) {
  loadOrders(pageNo, pageSize)
}

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="charge-order-page">
    <!-- 列表 -->
    <z-paging ref="pagingRef" v-model="orders" @query="handleQuery">
      <template #loading>
        <z-paging-loading
          icon="document"
          icon-class="i-carbon-document text-orange-400 animate-pulse"
          primary-text="正在加载充电桩订单..."
          secondary-text="请稍候片刻"
        />
      </template>

      <view class="p-3">
        <view v-for="(item, index) in orders" :key="index" class="order-card mb-3 rounded-lg bg-white p-3">
          <view class="flex items-center justify-between border-b border-gray-200 pb-2">
            <text class="font-medium">{{ item.personName }}/{{ item.personTel }}</text>
            <text class="text-sm text-gray-500">{{ item.orderId }}</text>
          </view>
          <view class="detail-grid mt-2 text-sm">
            <view class="detail-grid__item text-gray-500">
              充电桩: {{ item.machineName }}
            </view>
            <view class="detail-grid__item text-gray-500">
              插座: {{ item.portCode }}
            </view>
            <view class="detail-grid__item text-gray-500">
              充电小时: {{ item.chargeHours }}h
            </view>
            <view class="detail-grid__item text-gray-500">
              扣款: <text class="text-red-500">¥{{ item.amount }}</text>
            </view>
            <view class="detail-grid__item detail-grid__item--full text-gray-500">
              时间: {{ item.startTime }} ~ {{ item.endTime }}
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<style scoped>
.detail-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -8rpx;
}

.detail-grid__item {
  box-sizing: border-box;
  width: 50%;
  padding: 8rpx;
}

.detail-grid__item--full {
  width: 100%;
}

.order-card {
  background-color: #fff;
}
</style>
