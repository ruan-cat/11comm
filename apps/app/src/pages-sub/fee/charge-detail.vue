<!--
  充电桩详情页面
  功能：显示充电桩信息、订单记录和插座状态

  访问地址: http://localhost:3000/#/pages-sub/fee/charge-detail
  建议携带参数: ?machineId=xxx&machineName=xxx&communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/fee/charge-detail?machineId=MACHINE_001&machineName=充电桩1&communityId=COMM_001

  旧代码：gitee-example/pages/charge/chargeDetail.vue
-->

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { getChargeMachineList, getChargeMachineOrderList, getChargeMachinePortList } from '@/api/fee'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '充电桩详情',
    enablePullDownRefresh: false,
  },
})

interface ChargeMachine {
  machineId: string
  machineName: string
  machineCode: string
  communityId: string
  factoryName: string
  ruleName: string
  chargeTypeName: string
  stateName: string
  monitorId?: string
}

interface ChargeOrder {
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
}

interface ChargePort {
  portId: string
  portName: string
  portCode: string
  stateName: string
}

const communityInfo = getCurrentCommunity()
const toast = useGlobalToast()

const pageParams = reactive({
  machineId: '',
  machineName: '',
  communityId: '',
})

const machine = ref<ChargeMachine>({
  machineId: '',
  machineName: '',
  machineCode: '',
  communityId: '',
  factoryName: '',
  ruleName: '',
  chargeTypeName: '',
  stateName: '',
})

const orders = ref<ChargeOrder[]>([])
const ports = ref<ChargePort[]>([])
const activeTab = ref(0)

const { send: loadMachine, loading: machineLoading } = useRequest(
  (machineId: string, communityId: string) =>
    getChargeMachineList({
      page: 1,
      row: 1,
      communityId,
      machineId,
    }),
  { immediate: false },
).onSuccess((event) => {
  const list = event.data.list || []
  if (list.length > 0) {
    machine.value = list[0] as ChargeMachine
  }
}).onError((error) => {
  console.error('加载充电桩信息失败:', error)
})

const { send: loadOrders, loading: ordersLoading } = useRequest(
  (machineId: string, communityId: string) =>
    getChargeMachineOrderList({
      page: 1,
      row: 100,
      communityId,
      machineId,
    }),
  { immediate: false },
).onSuccess((event) => {
  orders.value = (event.data.list || []) as ChargeOrder[]
}).onError((error) => {
  console.error('加载充电桩订单失败:', error)
})

const { send: loadPorts, loading: portsLoading } = useRequest(
  (machineId: string, communityId: string) =>
    getChargeMachinePortList({
      page: 1,
      row: 100,
      communityId,
      machineId,
    }),
  { immediate: false },
).onSuccess((event) => {
  ports.value = (event.data.list || []) as ChargePort[]
}).onError((error) => {
  console.error('加载充电桩插座失败:', error)
})

function handleTabChange(e: { index: number }) {
  activeTab.value = e.index
  if (activeTab.value === 0) {
    loadOrders(pageParams.machineId, pageParams.communityId)
  }
  else {
    loadPorts(pageParams.machineId, pageParams.communityId)
  }
}

onLoad((options) => {
  pageParams.machineId = options?.machineId || ''
  pageParams.machineName = options?.machineName || ''
  pageParams.communityId = options?.communityId || communityInfo.communityId

  if (!pageParams.machineId) {
    toast.warning('缺少充电桩参数')
    return
  }

  loadMachine(pageParams.machineId, pageParams.communityId)
  loadOrders(pageParams.machineId, pageParams.communityId)
})
</script>

<template>
  <view class="charge-detail-page">
    <FormSectionTitle title="充电桩" />
    <wd-cell-group border>
      <wd-cell title="名称" :value="machine.machineName || '-'" />
      <wd-cell title="设备编号" :value="machine.machineCode || '-'" />
      <wd-cell title="厂家" :value="machine.factoryName || '-'" />
      <wd-cell title="充电规则" :value="machine.ruleName || '-'" />
      <wd-cell title="充电类型" :value="machine.chargeTypeName || '-'" />
      <wd-cell title="状态" :value="machine.stateName || '-'" />
    </wd-cell-group>

    <FormSectionTitle title="记录" />
    <wd-tabs :value="activeTab" @change="handleTabChange">
      <wd-tab title="订单" />
      <wd-tab title="插座" />
    </wd-tabs>

    <view class="tab-content">
      <view v-show="activeTab === 0">
        <view v-for="(item, index) in orders" :key="item.orderId || index" class="order-card">
          <view class="card-title">
            <text class="title-text">{{ item.personName }}/{{ item.personTel }}</text>
            <text class="title-sub">{{ item.orderId }}</text>
          </view>

          <view class="card-grid">
            <view class="grid-item">
              <text class="label">充电桩:</text>
              <text class="value">{{ item.machineName }}>{{ item.machineCode }}</text>
            </view>
            <view class="grid-item">
              <text class="label">插座:</text>
              <text class="value">{{ item.portCode }}</text>
            </view>
            <view class="grid-item">
              <text class="label">充电小时:</text>
              <text class="value">{{ item.chargeHours }}</text>
            </view>
            <view class="grid-item">
              <text class="label">小时电价:</text>
              <text class="value">¥{{ item.durationPrice }}</text>
            </view>
            <view class="grid-item">
              <text class="label">充电量:</text>
              <text class="value">{{ item.energy }}</text>
            </view>
            <view class="grid-item">
              <text class="label">扣款金额:</text>
              <text class="value text-danger">¥{{ item.amount }}</text>
            </view>
            <view class="grid-item grid-span-2">
              <text class="label">时间:</text>
              <text class="value">{{ item.startTime }} ~ {{ item.endTime }}</text>
            </view>
            <view class="grid-item">
              <text class="label">状态:</text>
              <text class="value">{{ item.stateName }}</text>
            </view>
            <view v-if="item.remark" class="grid-item grid-span-2">
              <text class="label">备注:</text>
              <text class="value">{{ item.remark }}</text>
            </view>
          </view>
        </view>

        <view v-if="orders.length === 0 && !ordersLoading" class="empty-wrap">
          <wd-status-tip image="content" tip="暂无订单记录" />
        </view>
      </view>

      <view v-show="activeTab === 1">
        <view v-for="(item, index) in ports" :key="item.portId || index" class="port-card">
          <view class="card-title">
            <text class="title-text">{{ item.portName }}</text>
            <text class="title-sub">{{ item.portId }}</text>
          </view>
          <view class="card-grid">
            <view class="grid-item">
              <text class="label">编号:</text>
              <text class="value">{{ item.portCode }}</text>
            </view>
            <view class="grid-item">
              <text class="label">状态:</text>
              <text class="value">{{ item.stateName }}</text>
            </view>
          </view>
        </view>

        <view v-if="ports.length === 0 && !portsLoading" class="empty-wrap">
          <wd-status-tip image="content" tip="暂无插座记录" />
        </view>
      </view>
    </view>

    <view v-if="machineLoading || ordersLoading || portsLoading" class="loading-wrap">
      <wd-loading />
    </view>
  </view>
</template>

<style scoped lang="scss">
.charge-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.tab-content {
  padding: 20rpx 24rpx 32rpx;
}

.order-card,
.port-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.title-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.title-sub {
  font-size: 24rpx;
  color: #999;
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 14rpx -9rpx 0;
}

.grid-item {
  display: flex;
  align-items: center;
  width: calc(50% - 18rpx);
  margin: 0 9rpx 12rpx;
}

.grid-span-2 {
  width: 100%;
}

.label {
  font-size: 24rpx;
  color: #999;
}

.value {
  margin-left: 8rpx;
  font-size: 24rpx;
  color: #333;
  word-break: break-all;
}

.text-danger {
  color: #ee0a24;
}

.empty-wrap {
  padding: 100rpx 0;
}

.loading-wrap {
  padding: 20rpx 0 36rpx;
  display: flex;
  justify-content: center;
}
</style>
