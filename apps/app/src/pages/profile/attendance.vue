<!--
  员工考勤页
  功能：按月份查看员工每日上下班考勤记录

  访问地址: http://localhost:3000/#/pages/profile/attendance

  旧代码：gitee-example/pages/my/staffDetailAttendance.vue
-->
<script setup lang="ts">
import type { AttendanceDayRecord } from '@/types/profile'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { queryAttendanceRecords } from '@/api/profile'

definePage({
  style: {
    navigationBarTitleText: '员工考勤',
  },
})

const monthColumns = Array.from({ length: 24 }).map((_, index) => {
  const month = dayjs().subtract(index, 'month').format('YYYY-MM')
  return {
    label: month,
    value: month,
  }
})

const currentMonth = ref(dayjs().format('YYYY-MM'))
const records = ref<AttendanceDayRecord[]>([])

const dayCount = computed(() => dayjs(`${currentMonth.value}-01`).daysInMonth())

const { send: loadAttendance } = useRequest(
  () =>
    queryAttendanceRecords({
      month: currentMonth.value,
      staffId: 'STAFF_001',
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    records.value = event.data || []
  })
  .onError((error) => {
    console.error('查询考勤失败', error)
  })

function handleSearch() {
  loadAttendance()
}

function getDayDetail(day: number) {
  const target = records.value.find(item => item.taskDay === day)
  return target?.attendanceClassesTaskDetails || []
}

function formatTime(timestamp: number) {
  return dayjs(timestamp).format('HH:mm:ss')
}

onLoad(() => {
  loadAttendance()
})
</script>

<template>
  <view class="page">
    <view class="toolbar">
      <wd-picker
        v-model="currentMonth"
        label="月份"
        label-width="64px"
        :columns="monthColumns"
      />
      <wd-button type="primary" @click="handleSearch">
        搜索
      </wd-button>
    </view>

    <view class="grid-wrap">
      <view v-for="day in dayCount" :key="day" class="day-card">
        <text class="day-title">{{ currentMonth }}-{{ day.toString().padStart(2, '0') }}</text>
        <view v-if="getDayDetail(day).length > 0" class="detail-wrap">
          <view v-for="(item, index) in getDayDetail(day)" :key="index" class="detail-item">
            <text>{{ item.specCd === '1001' ? '上班' : '下班' }}：</text>
            <text>{{ formatTime(item.checkTime) }}</text>
            <text>（{{ item.stateName }}）</text>
          </view>
        </view>
        <text v-else class="empty-text">无需考勤</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.toolbar .wd-button {
  margin-left: 12rpx;
}

.grid-wrap {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -6rpx;
}

.day-card {
  width: calc(50% - 12rpx);
  margin: 0 6rpx 12rpx;
  border-radius: 12rpx;
  background: #fff;
  padding: 16rpx;
}

.day-title {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: #111827;
}

.detail-wrap {
  margin-top: 10rpx;
}

.detail-item {
  margin-top: 6rpx;
  font-size: 22rpx;
  color: #374151;
}

.empty-text {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #9ca3af;
}
</style>
