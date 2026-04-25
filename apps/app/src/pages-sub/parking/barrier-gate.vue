<!--
  道闸管理页
  功能：选择停车场，管理道闸设备并查看出入场/收费明细

  访问地址: http://localhost:3000/#/pages-sub/parking/barrier-gate

  旧代码：gitee-example/pages/car/barrierGate.vue
-->
<script setup lang="ts">
import type { BarrierMachine, CarInoutDetail, CarInoutPayment, ParkingArea } from '@/types/parking'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import {
  closeDoor,
  listCarInoutDetail,
  listCarInoutPayment,
  listParkingAreaMachines,
  listParkingAreas,
  openDoor,
} from '@/api/parking'

definePage({
  style: {
    navigationBarTitleText: '道闸管理',
  },
})

const activeTab = ref(0)
const selectedArea = ref<ParkingArea | null>(null)
const areaList = ref<ParkingArea[]>([])
const machineList = ref<BarrierMachine[]>([])
const inoutList = ref<CarInoutDetail[]>([])
const paymentList = ref<CarInoutPayment[]>([])
const currentMachineCode = ref('')

const tabs = [
  { label: '总控台', value: 0 },
  { label: '出入场明细', value: 1 },
  { label: '收费明细', value: 2 },
]

const hasArea = computed(() => !!selectedArea.value)

const { send: loadAreas } = useRequest(
  () => listParkingAreas({ page: 1, row: 50, communityId: 'COMM_001' }),
  { immediate: false },
)
  .onSuccess((event) => {
    areaList.value = event.data || []
    if (!selectedArea.value && areaList.value.length === 1) {
      chooseArea(areaList.value[0])
    }
  })
  .onError((error) => {
    console.error('查询停车场失败', error)
  })

const { send: loadMachines } = useRequest(
  () => {
    if (!selectedArea.value) {
      throw new Error('未选择停车场')
    }

    return listParkingAreaMachines({
      page: 1,
      row: 50,
      communityId: 'COMM_001',
      paNum: selectedArea.value.num,
    })
  },
  { immediate: false },
)
  .onSuccess((event) => {
    machineList.value = event.data || []
  })
  .onError((error) => {
    console.error('查询道闸设备失败', error)
  })

const { send: loadInouts } = useRequest(
  () => {
    if (!selectedArea.value) {
      throw new Error('未选择停车场')
    }

    return listCarInoutDetail({
      page: 1,
      row: 50,
      communityId: 'COMM_001',
      paNum: selectedArea.value.num,
    })
  },
  { immediate: false },
)
  .onSuccess((event) => {
    inoutList.value = event.data?.list || []
  })
  .onError((error) => {
    console.error('查询出入场明细失败', error)
  })

const { send: loadPayments } = useRequest(
  () => {
    if (!selectedArea.value) {
      throw new Error('未选择停车场')
    }

    return listCarInoutPayment({
      page: 1,
      row: 50,
      communityId: 'COMM_001',
      paNum: selectedArea.value.num,
    })
  },
  { immediate: false },
)
  .onSuccess((event) => {
    paymentList.value = event.data?.list || []
  })
  .onError((error) => {
    console.error('查询收费明细失败', error)
  })

const { send: openBarrierDoor } = useRequest(
  () => openDoor({ communityId: 'COMM_001', machineCode: currentMachineCode.value }),
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({ title: '开闸成功', icon: 'none' })
  })
  .onError((error) => {
    console.error('开闸失败', error)
  })

const { send: closeBarrierDoor } = useRequest(
  () => closeDoor({ communityId: 'COMM_001', machineCode: currentMachineCode.value }),
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({ title: '关闸成功', icon: 'none' })
  })
  .onError((error) => {
    console.error('关闸失败', error)
  })

function chooseArea(item: ParkingArea) {
  selectedArea.value = item
  activeTab.value = 0
  loadMachines()
}

function handleTabChange(event: { index: number }) {
  activeTab.value = event.index
  if (event.index === 1) {
    loadInouts()
  }
  else if (event.index === 2) {
    loadPayments()
  }
  else {
    loadMachines()
  }
}

function doOpenDoor(machine: BarrierMachine) {
  currentMachineCode.value = machine.machineCode
  openBarrierDoor()
}

function doCloseDoor(machine: BarrierMachine) {
  currentMachineCode.value = machine.machineCode
  closeBarrierDoor()
}

function viewVideo(machine: BarrierMachine) {
  uni.navigateTo({
    url: `/pages-sub/parking/barrier-video?machineId=${machine.machineId}&communityId=COMM_001&videoUrl=${encodeURIComponent(machine.videoUrl)}`,
  })
}

function manualIn(machine: BarrierMachine) {
  if (!selectedArea.value)
    return

  uni.navigateTo({
    url: `/pages-sub/parking/car-in?machineId=${machine.machineId}&machineCode=${machine.machineCode}&paId=${selectedArea.value.paId}&paNum=${selectedArea.value.num}&boxId=${machine.boxId}`,
  })
}

function manualOut(machine: BarrierMachine) {
  if (!selectedArea.value)
    return

  uni.navigateTo({
    url: `/pages-sub/parking/car-out?machineId=${machine.machineId}&machineCode=${machine.machineCode}&paId=${selectedArea.value.paId}&paNum=${selectedArea.value.num}&boxId=${machine.boxId}`,
  })
}

onLoad(() => {
  loadAreas()
})
</script>

<template>
  <view class="page">
    <view v-if="!hasArea" class="area-wrap">
      <view class="title">
        选择停车场
      </view>
      <wd-cell-group v-if="areaList.length > 0" border>
        <wd-cell
          v-for="item in areaList"
          :key="item.paId"
          :title="item.num"
          :label="item.name"
          is-link
          @click="chooseArea(item)"
        />
      </wd-cell-group>
      <wd-status-tip v-else image="content" tip="暂无停车场" />
    </view>

    <view v-else>
      <wd-tabs :value="activeTab" @change="handleTabChange">
        <wd-tab v-for="item in tabs" :key="item.value" :title="item.label" />
      </wd-tabs>

      <view v-if="activeTab === 0" class="panel">
        <view v-if="machineList.length === 0" class="empty-wrap">
          <wd-status-tip image="content" tip="暂无道闸设备" />
        </view>
        <view v-else>
          <view v-for="machine in machineList" :key="machine.machineId" class="machine-card">
            <view class="machine-title">
              {{ machine.machineName }}
            </view>
            <view class="btn-row">
              <wd-button size="small" plain @click="doOpenDoor(machine)">
                开闸
              </wd-button>
              <wd-button size="small" plain custom-class="ml-10rpx" @click="doCloseDoor(machine)">
                关闸
              </wd-button>
              <wd-button size="small" plain custom-class="ml-10rpx" @click="viewVideo(machine)">
                视频
              </wd-button>
              <wd-button v-if="machine.direction === '3306'" size="small" type="success" custom-class="ml-10rpx" @click="manualIn(machine)">
                进场
              </wd-button>
              <wd-button v-else size="small" type="warning" custom-class="ml-10rpx" @click="manualOut(machine)">
                出场
              </wd-button>
            </view>
          </view>
        </view>
      </view>

      <view v-if="activeTab === 1" class="panel">
        <wd-cell-group v-if="inoutList.length > 0" border>
          <wd-cell
            v-for="item in inoutList"
            :key="item.inoutId"
            :title="`${item.carNum} (${item.stateName})`"
            :label="`${item.paNum} | ${item.hours}小时${item.min}分钟 | ${item.inTime}`"
          />
        </wd-cell-group>
        <wd-status-tip v-else image="content" tip="暂无出入场明细" />
      </view>

      <view v-if="activeTab === 2" class="panel">
        <wd-cell-group v-if="paymentList.length > 0" border>
          <wd-cell
            v-for="item in paymentList"
            :key="item.inoutId"
            :title="`${item.carNum} (${item.stateName})`"
            :label="`${item.payTypeName} | 应收:${item.payCharge} 实收:${item.realCharge}`"
          />
        </wd-cell-group>
        <wd-status-tip v-else image="content" tip="暂无收费明细" />
      </view>
    </view>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

.area-wrap,
.panel {
  padding: 20rpx;
}

.title {
  margin-bottom: 12rpx;
  color: #6b7280;
  font-size: 26rpx;
}

.machine-card {
  margin-bottom: 16rpx;
  border-radius: 12rpx;
  background: #fff;
  padding: 20rpx;
}

.machine-title {
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 10rpx;
}

.btn-row {
  display: flex;
  flex-wrap: wrap;
}

.empty-wrap {
  margin-top: 20rpx;
}
</style>
