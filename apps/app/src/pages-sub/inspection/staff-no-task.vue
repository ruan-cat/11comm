<!--
  员工未巡检页面
  功能：显示特定员工的巡检情况详情

  访问地址: http://localhost:3000/#/pages-sub/inspection/staff-no-task
  建议携带参数: ?staffId=xxx&staffName=xxx&queryTime=xxx

  示例: http://localhost:3000/#/pages-sub/inspection/staff-no-task?staffId=STAFF_001&staffName=张三&queryTime=2025-12-29

  旧代码： gitee-example/pages/inspection/staffNoInspection.vue
-->

<script setup lang="ts">
import type { InspectionTaskDetail } from '@/types/inspection'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getInspectionTaskDetail } from '@/api/inspection'
import { useGlobalToast } from '@/hooks/useGlobalToast'

definePage({
  style: {
    navigationBarTitleText: '员工未巡检',
    enablePullDownRefresh: false,
  },
})

/** 全局 Toast */
const toast = useGlobalToast()

/** 路由参数 */
const staffId = ref('')
const staffName = ref('')
const queryTime = ref('')

/** 获取路由参数 */
onLoad((options) => {
  staffId.value = options?.staffId as string || ''
  staffName.value = options?.staffName as string || ''
  queryTime.value = options?.queryTime as string || ''
})

/** 巡检详情列表 */
const inspections = ref<InspectionTaskDetail[]>([])

/** 是否无数据 */
const noData = ref(false)

/**
 * 加载员工巡检详情
 */
const {
  loading,
  send: sendLoadStaffInspectionDetail,
} = useRequest(() => getInspectionTaskDetail({
  planUserId: staffId.value,
  queryTime: queryTime.value,
  page: 1,
  row: 100,
}), {
  immediate: false,
})
  .onSuccess((event) => {
    const data = event.data
    inspections.value = data.list || []
    noData.value = inspections.value.length === 0
  })
  .onError((error) => {
    console.error('请求失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

async function loadStaffInspectionDetail() {
  await sendLoadStaffInspectionDetail()
}

onMounted(() => {
  loadStaffInspectionDetail()
})
</script>

<template>
  <view class="inspection-staff-no-task">
    <!-- 标题 -->
    <view class="page-title">
      {{ staffName }}巡检情况
    </view>

    <!-- 巡检详情列表 -->
    <view v-if="!noData && inspections.length > 0" class="inspection-list">
      <wd-cell-group>
        <wd-cell
          v-for="(item, index) in inspections"
          :key="index"
          :title="`${item.inspectionName} (${item.stateName})`"
        >
          <template #label>
            <view class="inspection-time">
              巡检时间: {{ item.pointStartTime || "-" }} - {{ item.pointEndTime || "-" }}
            </view>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 空状态 -->
    <wd-status-tip v-else-if="noData && !loading" image="search" tip="暂无巡检记录" />

    <!-- 加载状态 -->
    <wd-loading v-if="loading" type="ring" />
  </view>
</template>

<style scoped lang="scss">
.inspection-staff-no-task {
  min-height: 100vh;
  background-color: #f5f5f5;

  .page-title {
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(69, 90, 100, 0.6);
    padding: 40rpx 30rpx 20rpx;
  }

  .inspection-list {
    margin-top: 20rpx;

    .inspection-time {
      font-size: 24rpx;
      color: #999999;
      margin-top: 8rpx;
    }
  }
}
</style>
