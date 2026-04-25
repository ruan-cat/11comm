<!--
  今日巡检统计页面
  功能：显示今日巡检统计和详细记录

  访问地址: http://localhost:3000/#/pages-sub/inspection/today-report

  旧代码： gitee-example/pages/inspection/inspectionTodayReport.vue
-->

<script setup lang="ts">
import type { InspectionTodayReport } from '@/types/inspection'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'
import { getInspectionTodayReport } from '@/api/inspection'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '今日巡检',
    enablePullDownRefresh: false,
  },
})

/** 巡检统计列表 */
const inspections = ref<InspectionTodayReport[]>([])

/** 是否无数据 */
const noData = ref(false)

/** 查询日期 */
const queryDate = ref('')

/** 全局 Toast */
const toast = useGlobalToast()

/**
 * 加载今日巡检统计
 */
const {
  loading,
  send: sendLoadTodayReport,
} = useRequest((queryTime: string) => getInspectionTodayReport({
  queryTime,
}), {
  immediate: false,
})
  .onSuccess((event) => {
    inspections.value = event.data || []
    noData.value = inspections.value.length === 0
  })
  .onError((event) => {
    console.error('请求失败:', event)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

async function loadTodayReport() {
  await sendLoadTodayReport(queryDate.value)
}

/**
 * 日期选择变更
 * @param value 选中的日期
 */
function handleDateChange(value: string) {
  queryDate.value = value
  loadTodayReport()
}

/**
 * 跳转到员工详情
 * @param item 巡检统计信息
 */
function goToDetail(item: InspectionTodayReport) {
  TypedRouter.toInspectionStaffNoTask(item.staffId, item.staffName, queryDate.value)
}

onMounted(() => {
  // 初始化日期为今天
  queryDate.value = dayjs().format('YYYY-MM-DD')
  loadTodayReport()
})
</script>

<template>
  <view class="inspection-today-report">
    <!-- 标题 -->
    <view class="page-title">
      今日巡检统计
    </view>

    <!-- 日期选择 -->
    <wd-cell-group>
      <wd-cell title="查询日期" is-link center>
        <wd-datetime-picker
          v-model="queryDate"
          type="date"
          @confirm="handleDateChange"
        />
      </wd-cell>
    </wd-cell-group>

    <!-- 统计列表 -->
    <view v-if="!noData && inspections.length > 0" class="report-list">
      <wd-cell-group>
        <wd-cell
          v-for="(item, index) in inspections"
          :key="index"
          :title="item.staffName"
          is-link
          @click="goToDetail(item)"
        >
          <template #right>
            <view class="staff-status">
              <text class="finish-count">已巡检: {{ item.finishCount }}</text>
              <text class="wait-count">未巡检: {{ item.waitCount }}</text>
            </view>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 空状态 -->
    <wd-status-tip v-else-if="noData && !loading" image="search" tip="暂无巡检统计" />

    <!-- 加载状态 -->
    <wd-loading v-if="loading" type="ring" />
  </view>
</template>

<style scoped lang="scss">
.inspection-today-report {
  min-height: 100vh;
  background-color: #f5f5f5;

  .page-title {
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(69, 90, 100, 0.6);
    padding: 40rpx 30rpx 20rpx;
  }

  .report-list {
    margin-top: 20rpx;

    .staff-status {
      display: flex;
      font-size: 24rpx;

      .finish-count {
        color: #4caf50;
      }

      .wait-count {
        margin-left: 20rpx;
        color: #ff9800;
      }
    }
  }
}
</style>
