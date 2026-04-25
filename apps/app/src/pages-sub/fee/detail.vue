<!--
  费用详情页面
  功能：显示费用详细信息和缴费历史

  访问地址: http://localhost:3000/#/pages-sub/fee/detail
  建议携带参数: ?feeId=xxx&communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/fee/detail?feeId=FEE_001&communityId=COMM_001

  旧代码：gitee-example/pages/feeDetail/feeDetail.vue
-->

<script setup lang="ts">
import type { Fee, FeeDetail } from '@/types/fee'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getFeeDetail, getFeeList } from '@/api/fee'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '费用详情',
    enablePullDownRefresh: false,
  },
})

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

/** 费用ID */
const feeId = ref('')

/** 费用信息 */
const feeInfo = ref<Fee>({
  feeId: '',
  feeName: '',
  feeType: 'PROPERTY',
  feeTypeCdName: '',
  roomId: '',
  roomName: '',
  communityId: '',
  ownerName: '',
  ownerTel: '',
  receivedAmount: 0,
  paidAmount: 0,
  oweAmount: 0,
  startTime: '',
  endTime: '',
  deadlineTime: '',
  feeFlagName: '',
  state: 'UNPAID',
  stateName: '',
  createTime: '',
  updateTime: '',
})

/** 缴费历史列表 */
const feeDetails = ref<FeeDetail[]>([])

/** 是否无数据 */
const noData = ref(false)

/** 加载费用信息 */
const { send: loadFeeInfo, loading: feeInfoLoading } = useRequest(
  (id: string) =>
    getFeeList({
      page: 1,
      row: 1,
      communityId: communityInfo.communityId,
      feeId: id,
    }),
  { immediate: false },
).onSuccess((event) => {
  if (event.data.list && event.data.list.length > 0) {
    feeInfo.value = event.data.list[0]
  }
}).onError((error) => {
  console.error('加载费用信息失败:', error)
})

/** 加载缴费历史 */
const { send: loadFeeDetail, loading: detailLoading } = useRequest(
  (id: string) =>
    getFeeDetail({
      page: 1,
      row: 30,
      feeId: id,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
).onSuccess((event) => {
  feeDetails.value = (event.data.list || []).map((item: FeeDetail) => ({
    ...item,
    // 格式化日期
    createTime: item.createTime?.replace(/-/g, '/') || '',
  }))

  if (feeDetails.value.length < 1) {
    noData.value = true
  }
}).onError((error) => {
  console.error('加载缴费历史失败:', error)
})

/** 页面加载 */
onLoad((options) => {
  feeId.value = options?.feeId || ''

  if (feeId.value) {
    loadFeeInfo(feeId.value)
    loadFeeDetail(feeId.value)
  }
})
</script>

<template>
  <view class="fee-detail-page">
    <!-- 费用信息 -->
    <FormSectionTitle title="费用信息" />

    <wd-cell-group>
      <wd-cell title="费用名称">
        <text>{{ feeInfo.feeName || '-' }}</text>
      </wd-cell>
      <wd-cell title="费用类型">
        <text>{{ feeInfo.feeTypeCdName || '-' }}</text>
      </wd-cell>
      <wd-cell title="到期时间">
        <text>{{ feeInfo.deadlineTime || '-' }}</text>
      </wd-cell>
      <wd-cell title="费用标识">
        <text>{{ feeInfo.feeFlagName || '-' }}</text>
      </wd-cell>
      <wd-cell title="收费状态">
        <text>{{ feeInfo.stateName || '-' }}</text>
      </wd-cell>
    </wd-cell-group>

    <!-- 缴费历史 -->
    <FormSectionTitle v-if="!noData" title="缴费历史" />

    <view v-if="!noData" class="fee-details px-3">
      <view
        v-for="(item, index) in feeDetails"
        :key="index"
        class="detail-card mb-3 rounded-lg bg-white p-3"
      >
        <view class="flex items-center justify-between border-b border-gray-200 pb-2">
          <text class="font-medium">缴费金额</text>
          <text class="text-green-500">¥{{ item.receivedAmount }}</text>
        </view>

        <view class="detail-grid mt-2 text-sm">
          <view class="detail-grid__item text-gray-500">
            <text>缴费编码:</text>
            <text class="ml-1 text-gray-700">{{ item.detailId }}</text>
          </view>
          <view class="detail-grid__item text-gray-500">
            <text>缴费周期:</text>
            <text class="ml-1 text-gray-700">{{ item.cycles || 1 }}个月</text>
          </view>
          <view class="detail-grid__item detail-grid__item--full text-gray-500">
            <text>缴费时间:</text>
            <text class="ml-1 text-gray-700">{{ item.createTime }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="noData" class="flex flex-col items-center justify-center py-20">
      <text class="text-gray-400">暂无缴费记录</text>
    </view>

    <!-- 加载状态 -->
    <view v-if="feeInfoLoading || detailLoading" class="p-3 text-center text-gray-400">
      <text>加载中...</text>
    </view>
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

.detail-card {
  background-color: #fff;
}
</style>
