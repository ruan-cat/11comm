<!--
  房间详情页
  功能：查询并显示房间与业主信息

  访问地址: http://localhost:3000/#/pages-sub/property/room-detail
  建议携带参数: ?roomId=xxx

  旧代码：gitee-example/pages/roomDetail/roomDetail.vue
-->
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import { getRoomDetail, getRoomInfo } from '@/api/room'

definePage({
  style: {
    navigationBarTitleText: '房间详情',
  },
})

const roomId = ref('')
const floorNum = ref('')
const unitNum = ref('')
const roomNum = ref('')
const roomInfo = ref<Record<string, any> | null>(null)

const hasInfo = computed(() => !!roomInfo.value)

const { send: queryRoomDetail } = useRequest(
  (params: { roomId: string }) => getRoomDetail(params),
  { immediate: false },
)
  .onSuccess((event) => {
    const detail = event.data
    if (!detail) {
      roomInfo.value = null
      return
    }

    roomInfo.value = {
      roomId: detail.roomId,
      roomNum: detail.roomNum,
      floorId: detail.floorId,
      unitId: detail.unitId,
      communityId: detail.communityId,
      floorNum: detail.floorId?.split('_').pop() || '',
      unitNum: detail.unitId?.split('_').pop() || '',
      ownerName: '-',
      link: '-',
      builtUpArea: '-',
    }

    floorNum.value = String(Number(roomInfo.value.floorNum || 1))
    unitNum.value = String(Number(roomInfo.value.unitNum || 1))
    roomNum.value = detail.roomNum || ''

    queryRoomInfo()
  })
  .onError((error) => {
    console.error('加载房间详情失败', error)
    roomInfo.value = null
  })

const { send: queryRoomInfoByCondition } = useRequest(
  () =>
    getRoomInfo({
      page: 1,
      row: 1,
      communityId: 'COMM_001',
      floorNum: floorNum.value || undefined,
      unitNum: unitNum.value || undefined,
      roomNum: roomNum.value || undefined,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const first = event.data?.rooms?.[0]
    if (!first) {
      return
    }

    roomInfo.value = {
      ...roomInfo.value,
      ...first,
      floorNum: first.floorNum || roomInfo.value?.floorNum,
      unitNum: first.unitNum || roomInfo.value?.unitNum,
      roomNum: first.roomNum || roomInfo.value?.roomNum,
      ownerName: first.ownerName || '-',
      link: first.link || '-',
      builtUpArea: first.builtUpArea || '-',
    }
  })
  .onError((error) => {
    console.error('按条件查询房间失败', error)
  })

function queryRoomInfo() {
  queryRoomInfoByCondition()
}

function openFloorList() {
  uni.navigateTo({
    url: '/pages-sub/property/floor-list',
  })
}

function openUnitList() {
  if (!floorNum.value) {
    uni.showToast({
      title: '请先输入楼栋编号',
      icon: 'none',
    })
    return
  }

  const floorIdValue = `F_COMM_001_${floorNum.value.padStart(3, '0')}`
  uni.navigateTo({
    url: `/pages-sub/property/unit-list?floorId=${floorIdValue}`,
  })
}

function openRoomList() {
  const floorIdValue = `F_COMM_001_${(floorNum.value || '1').padStart(3, '0')}`
  const unitIdValue = `U_COMM_001_${(floorNum.value || '1').padStart(3, '0')}_${(unitNum.value || '1').padStart(2, '0')}`
  uni.navigateTo({
    url: `/pages-sub/property/room-list?floorId=${floorIdValue}&unitId=${unitIdValue}`,
  })
}

onLoad((options) => {
  roomId.value = options?.roomId || ''
  if (roomId.value) {
    queryRoomDetail({ roomId: roomId.value })
  }
})
</script>

<template>
  <view class="page">
    <wd-cell-group border>
      <wd-input v-model="floorNum" label="楼栋" label-width="88px" placeholder="请输入楼栋编号" />
      <wd-input v-model="unitNum" label="单元" label-width="88px" placeholder="请输入单元编号" />
      <wd-input v-model="roomNum" label="房屋" label-width="88px" placeholder="请输入房间号" />
    </wd-cell-group>

    <view class="action-link-row">
      <wd-button plain size="small" @click="openFloorList">
        选择楼栋
      </wd-button>
      <wd-button plain size="small" custom-class="ml-12rpx" @click="openUnitList">
        选择单元
      </wd-button>
      <wd-button plain size="small" custom-class="ml-12rpx" @click="openRoomList">
        选择房屋
      </wd-button>
    </view>

    <view class="actions">
      <wd-button type="primary" block @click="queryRoomInfo">
        查询房间信息
      </wd-button>
    </view>

    <wd-cell-group v-if="hasInfo" border class="detail-card">
      <wd-cell title="房屋编号" :value="roomInfo?.roomId || '-'" />
      <wd-cell title="楼栋单元" :value="`${roomInfo?.floorNum || '-'}栋 ${roomInfo?.unitNum || '-'}单元`" />
      <wd-cell title="房间号" :value="`${roomInfo?.roomNum || '-'}室`" />
      <wd-cell title="业主" :value="roomInfo?.ownerName || '-'" />
      <wd-cell title="联系方式" :value="roomInfo?.link || '-'" />
      <wd-cell title="建筑面积" :value="`${roomInfo?.builtUpArea || '-'} 平方米`" />
    </wd-cell-group>

    <wd-status-tip v-else image="content" tip="请输入条件查询房间信息" />
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24rpx;
}

.actions {
  margin: 24rpx 0;
}

.action-link-row {
  margin-top: 16rpx;
  display: flex;
}

.detail-card {
  margin-bottom: 24rpx;
}
</style>
