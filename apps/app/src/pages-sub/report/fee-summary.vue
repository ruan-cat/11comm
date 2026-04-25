<!--
  费用汇总报表页面
  功能：查询费用汇总统计数据

  访问地址: http://localhost:3000/#/pages-sub/report/fee-summary
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/report/fee-summary?communityId=COMM_001

  旧代码：gitee-example/pages/report/reportFeeSummary.vue
-->

<script setup lang="ts">
import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { computed, reactive, ref } from 'vue'
import { getFeeSummaryReport, queryDictInfo } from '@/api/fee'
import { getFloorList } from '@/api/floor'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '费用汇总报表',
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

/** 费用汇总数据 */
const feeSummary = ref<{
  roomCount: number
  feeRoomCount: number
  oweRoomCount: number
  curOweFee: number
  hisOweFee: number
  receivedFee: number
  curReceivableFee: number
  hisReceivedFee: number
}>({
  roomCount: 0,
  feeRoomCount: 0,
  oweRoomCount: 0,
  curOweFee: 0,
  hisOweFee: 0,
  receivedFee: 0,
  curReceivableFee: 0,
  hisReceivedFee: 0,
})

/** 加载费用类型 */
const { send: loadFeeTypes } = useRequest(
  () =>
    queryDictInfo({
      name: 'pay_fee_config',
      type: 'fee_type_cd',
    }),
  { immediate: false },
).onSuccess((event) => {
  const data = event.data as Array<{ statusCd: string, name: string }>
  feeTypeCds.value = data.map(item => ({
    value: item.statusCd,
    label: item.name,
  }))
}).onError((error) => {
  console.error('加载费用类型失败:', error)
  toast.warning('加载费用类型失败')
})

/** 加载楼栋列表 */
const { send: loadFloors } = useRequest(
  () =>
    getFloorList({
      page: 1,
      row: 50,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
).onSuccess((event) => {
  const data = event.data as { list: Array<{ floorId: string, floorName: string }> }
  floors.value = (data.list || []).map(item => ({
    value: item.floorId,
    label: item.floorName,
  }))
}).onError((error) => {
  console.error('加载楼栋列表失败:', error)
  toast.warning('加载楼栋列表失败')
})

/** 加载费用汇总 */
const { send: loadFeeSummary, loading: summaryLoading } = useRequest(
  (params: typeof searchForm) =>
    getFeeSummaryReport({
      page: 1,
      row: 1,
      communityId: communityInfo.communityId,
      startDate: params.startDate,
      endDate: params.endDate,
      feeTypeCd: params.feeTypeCd,
      floorId: params.floorId,
    }),
  { immediate: false },
).onSuccess((event) => {
  const data = event.data as { list: Array<typeof feeSummary.value> }
  if (data.list && data.list.length > 0) {
    feeSummary.value = data.list[0]
  }
}).onError((error) => {
  console.error('加载费用汇总失败:', error)
  toast.warning('加载费用汇总失败')
})

/** 费用类型变更 */
function handleFeeTypeChange({ value }: { value: string }) {
  searchForm.feeTypeCd = value
}

/** 楼栋变更 */
function handleFloorChange({ value }: { value: string }) {
  searchForm.floorId = value
}

/** 开始日期变更 */
function handleStartDateChange({ value }: { value: string }) {
  searchForm.startDate = value
}

/** 结束日期变更 */
function handleEndDateChange({ value }: { value: string }) {
  searchForm.endDate = value
}

/** 查询 */
function handleQuery() {
  loadFeeSummary(searchForm)
}

/** 计算属性：户收费率 */
const roomRate = computed(() => {
  if (feeSummary.value.feeRoomCount <= 0)
    return '0%'
  const rate = ((feeSummary.value.feeRoomCount - feeSummary.value.oweRoomCount) / feeSummary.value.feeRoomCount) * 100
  return `${rate.toFixed(2)}%`
})

/** 计算属性：收费率 */
const feeRate = computed(() => {
  if (feeSummary.value.curReceivableFee <= 0)
    return '0%'
  const rate = ((feeSummary.value.curReceivableFee - feeSummary.value.curOweFee) / feeSummary.value.curReceivableFee) * 100
  return `${rate.toFixed(2)}%`
})

/** 计算属性：清缴率 */
const clearRate = computed(() => {
  const total = feeSummary.value.hisReceivedFee + feeSummary.value.hisOweFee
  if (total <= 0)
    return '0%'
  const rate = (feeSummary.value.hisReceivedFee / total) * 100
  return `${rate.toFixed(2)}%`
})

/** 页面加载 */
onLoad(() => {
  // 设置默认日期（本月）
  const now = dayjs()
  searchForm.startDate = now.startOf('month').format('YYYY-MM-DD')
  searchForm.endDate = now.endOf('month').format('YYYY-MM-DD')

  // 加载选项
  loadFeeTypes()
  loadFloors()

  // 加载数据
  loadFeeSummary(searchForm)
})
</script>

<template>
  <view class="fee-summary-page">
    <!-- 搜索栏 -->
    <view class="search-bar bg-white p-3">
      <view class="form-grid">
        <!-- 费用类型 -->
        <view class="form-grid__item search-item">
          <wd-picker
            v-model="searchForm.feeTypeCd"
            :columns="feeTypeCds"
            placeholder="请选择费用类型"
            @change="handleFeeTypeChange"
          />
        </view>

        <!-- 楼栋 -->
        <view class="form-grid__item search-item">
          <wd-picker
            v-model="searchForm.floorId"
            :columns="floors"
            placeholder="请选择楼栋"
            @change="handleFloorChange"
          />
        </view>

        <!-- 开始日期 -->
        <view class="form-grid__item search-item">
          <wd-datetime-picker
            v-model="searchForm.startDate"
            type="date"
            placeholder="开始日期"
            @change="handleStartDateChange"
          />
        </view>

        <!-- 结束日期 -->
        <view class="form-grid__item search-item">
          <wd-datetime-picker
            v-model="searchForm.endDate"
            type="date"
            placeholder="结束日期"
            @change="handleEndDateChange"
          />
        </view>
      </view>

      <!-- 搜索按钮 -->
      <view class="mt-3">
        <wd-button type="primary" size="large" block @click="handleQuery">
          搜索
        </wd-button>
      </view>
    </view>

    <!-- 汇总数据 -->
    <view class="p-3">
      <view class="summary-card rounded-lg bg-white p-4">
        <view class="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
          <text class="text-lg font-medium">{{ feeSummary.roomCount }}</text>
          <text class="text-gray-500">{{ feeSummary.feeRoomCount }}/{{ feeSummary.oweRoomCount }}</text>
        </view>

        <view class="summary-grid text-sm">
          <view class="summary-grid__item text-gray-500">
            <text>欠费:</text>
            <text class="ml-1 text-red-500">¥{{ (feeSummary.curOweFee + feeSummary.hisOweFee).toFixed(2) }}</text>
          </view>
          <view class="summary-grid__item text-gray-500">
            <text>实缴:</text>
            <text class="ml-1 text-green-500">¥{{ feeSummary.receivedFee }}</text>
          </view>
          <view class="summary-grid__item text-gray-500">
            <text>当期应收:</text>
            <text class="ml-1 text-gray-700">¥{{ feeSummary.curReceivableFee }}</text>
          </view>
          <view class="summary-grid__item text-gray-500">
            <text>当期实收:</text>
            <text class="ml-1 text-green-500">¥{{ (feeSummary.curReceivableFee - feeSummary.curOweFee).toFixed(2) }}</text>
          </view>
          <view class="summary-grid__item text-gray-500">
            <text>户收费率:</text>
            <text class="ml-1 text-blue-500">{{ roomRate }}</text>
          </view>
          <view class="summary-grid__item text-gray-500">
            <text>收费率:</text>
            <text class="ml-1 text-blue-500">{{ feeRate }}</text>
          </view>
          <view class="summary-grid__item summary-grid__item--full text-gray-500">
            <text>清缴率:</text>
            <text class="ml-1 text-blue-500">{{ clearRate }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="summaryLoading" class="p-3 text-center text-gray-400">
      <text>加载中...</text>
    </view>
  </view>
</template>

<style scoped>
.form-grid,
.summary-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -8rpx;
}

.form-grid__item,
.summary-grid__item {
  box-sizing: border-box;
  width: 50%;
  padding: 8rpx;
}

.summary-grid__item--full {
  width: 100%;
}

.search-item {
  background-color: #f1f1f1;
  border-radius: 8rpx;
  padding: 10rpx 20rpx;
}
.summary-card {
  background-color: #fff;
}
</style>
