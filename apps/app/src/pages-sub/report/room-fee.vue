<!--
  房间费用报表页面
  功能：查询房间费用明细

  访问地址: http://localhost:3000/#/pages-sub/report/room-fee
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/report/room-fee?communityId=COMM_001

  旧代码：gitee-example/pages/report/reportRoomFee.vue
-->

<script setup lang="ts">
import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'
import { useRequest } from 'alova/client'
import { onMounted, reactive, ref } from 'vue'
import { getRoomFeeReport, queryDictInfo } from '@/api/fee'
import { getFloorList } from '@/api/floor'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '房间费用报表',
    enablePullDownRefresh: false,
  },
})

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

/** 搜索表单 */
const searchForm = reactive({
  feeTypeCd: '',
  floorId: '',
  startDate: '',
  endDate: '',
})

/** 费用类型选项 */
const feeTypeCds = ref<ColumnItem[]>([])

/** 楼栋选项 */
const floors = ref<ColumnItem[]>([])

/** 房间费用列表 */
const roomFees = ref<
  Array<{
    roomId: string
    roomName: string
    ownerName: string
    feeName: string
    receivableFee: number
    receivedFee: number
    oweFee: number
    stateName: string
  }>
>([])

/** z-paging 引用 */
const pagingRef = ref()

/** 加载费用类型 */
const { send: loadFeeTypes } = useRequest(
  () => queryDictInfo({ name: 'pay_fee_config', type: 'fee_type_cd' }),
  { immediate: false },
).onSuccess((event) => {
  const data = event.data as Array<{ statusCd: string, name: string }>
  feeTypeCds.value = data.map(item => ({ value: item.statusCd, label: item.name }))
}).onError((error) => {
  console.error('加载费用类型失败:', error)
  toast.warning('加载费用类型失败')
})

/** 加载楼栋列表 */
const { send: loadFloors } = useRequest(
  () => getFloorList({ page: 1, row: 50, communityId: communityInfo.communityId }),
  { immediate: false },
).onSuccess((event) => {
  const data = event.data as { list: Array<{ floorId: string, floorName: string }> }
  floors.value = (data.list || []).map(item => ({ value: item.floorId, label: item.floorName }))
}).onError((error) => {
  console.error('加载楼栋列表失败:', error)
  toast.warning('加载楼栋列表失败')
})

/** 加载房间费用 */
const { send: loadRoomFees } = useRequest(
  (page: number, pageSize: number) =>
    getRoomFeeReport({
      page,
      row: pageSize,
      communityId: communityInfo.communityId,
      startDate: searchForm.startDate,
      endDate: searchForm.endDate,
      feeTypeCd: searchForm.feeTypeCd,
      floorId: searchForm.floorId,
    }),
  { immediate: false },
).onSuccess((event) => {
  const list = event.data.list || []
  roomFees.value = list
  pagingRef.value?.complete(list)
}).onError(() => {
  toast.warning('加载房间费用失败')
  pagingRef.value?.complete(false)
})

/** 搜索并重新加载（搜索按钮点击） */
function handleSearch() {
  pagingRef.value?.reload()
}

/** z-paging 查询回调 */
function handleQuery(pageNo: number, pageSize: number) {
  loadRoomFees(pageNo, pageSize)
}

// 初始加载
loadFeeTypes()
loadFloors()

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="room-fee-page">
    <!-- 搜索栏 -->
    <view class="search-bar bg-white p-3">
      <view class="form-grid">
        <view class="form-grid__item search-item">
          <wd-picker v-model="searchForm.feeTypeCd" :columns="feeTypeCds" placeholder="请选择费用类型" />
        </view>
        <view class="form-grid__item search-item">
          <wd-picker v-model="searchForm.floorId" :columns="floors" placeholder="请选择楼栋" />
        </view>
      </view>
      <view class="mt-3">
        <wd-button type="primary" size="large" block @click="handleSearch">
          搜索
        </wd-button>
      </view>
    </view>

    <!-- 列表 -->
    <z-paging ref="pagingRef" v-model="roomFees" @query="handleQuery">
      <template #loading>
        <z-paging-loading
          icon="home"
          icon-class="i-carbon-home text-purple-400 animate-pulse"
          primary-text="正在加载房间费用..."
          secondary-text="请稍候片刻"
        />
      </template>

      <view class="p-3">
        <view v-for="(item, index) in roomFees" :key="index" class="detail-card mb-3 rounded-lg bg-white p-3">
          <view class="flex items-center justify-between border-b border-gray-200 pb-2">
            <text class="font-medium">{{ item.roomName }}</text>
            <text :class="item.oweFee > 0 ? 'text-red-500' : 'text-green-500'">欠费: ¥{{ item.oweFee }}</text>
          </view>
          <view class="detail-grid mt-2 text-sm">
            <view class="detail-grid__item text-gray-500">
              业主: {{ item.ownerName }}
            </view>
            <view class="detail-grid__item text-gray-500">
              费用: {{ item.feeName }}
            </view>
            <view class="detail-grid__item text-gray-500">
              应收: ¥{{ item.receivableFee }}
            </view>
            <view class="detail-grid__item text-gray-500">
              实收: ¥{{ item.receivedFee }}
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<style scoped>
.form-grid,
.detail-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -8rpx;
}

.form-grid__item,
.detail-grid__item {
  box-sizing: border-box;
  width: 50%;
  padding: 8rpx;
}

.search-item {
  background-color: #f1f1f1;
  border-radius: 8rpx;
  padding: 10rpx 20rpx;
}
.detail-card {
  background-color: #fff;
}
</style>
