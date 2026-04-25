<!--
  数据报表页面
  功能：查看各种数据统计报表

  访问地址: http://localhost:3000/#/pages-sub/report/data-report
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/report/data-report?communityId=COMM_001

  旧代码：gitee-example/pages/report/dataReport.vue
-->

<script setup lang="ts">
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getDataReport } from '@/api/fee'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '数据报表',
    enablePullDownRefresh: false,
  },
})

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

/** 报表数据列表 */
const reportData = ref<
  Array<{
    name: string
    value: number
    unit?: string
  }>
>([])

/** 加载报表数据 */
const { send: loadReport, loading: reportLoading } = useRequest(
  (communityId: string) =>
    getDataReport({
      communityId,
      reportCode: 'FEE_REPORT',
    }),
  { immediate: false },
).onSuccess((event) => {
  const data = event.data as { list: Array<{ name: string, value: number, unit?: string }> }
  reportData.value = data.list || []
}).onError((error) => {
  console.error('加载数据报表失败:', error)
  toast.warning('加载数据报表失败')
})

/** 页面加载 */
// loadReport(communityInfo.communityId)
</script>

<template>
  <view class="data-report-page p-3">
    <view class="mb-3 text-lg font-medium">
      费用数据统计
    </view>
    <view class="text-gray-400">
      数据报表功能开发中...
    </view>
  </view>
</template>
