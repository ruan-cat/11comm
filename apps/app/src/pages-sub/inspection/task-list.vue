<!--
  巡检打卡页面
  功能：显示巡检任务列表，支持开始巡检、任务流转、补检操作

  访问地址: http://localhost:3000/#/pages-sub/inspection/task-list

  旧代码： gitee-example/pages/inspection/inspection.vue
-->

<script setup lang="ts">
import type { InspectionTask } from '@/types/inspection'
import { onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'
import { getInspectionTaskList } from '@/api/inspection'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '巡检打卡',
    enablePullDownRefresh: false,
  },
})

/** 全局 Toast */
const toast = useGlobalToast()

/** 巡检任务列表 */
const tasks = ref<InspectionTask[]>([])

/** 是否无数据 */
const noData = ref(false)

/**
 * 获取巡检任务列表
 */
const {
  loading,
  send: sendGetTasks,
} = useRequest(() => getInspectionTaskList({
  page: 1,
  row: 10,
  moreState: '20200405,20200406',
  isToday: 1,
}), {
  immediate: false,
})
  .onSuccess((event) => {
    const data = event.data
    tasks.value = data.list || []
    noData.value = tasks.value.length === 0
  })
  .onError((error) => {
    toast.error(error.error || '请求失败')
  })

async function getInspectionTasks() {
  await sendGetTasks()
}

/**
 * 开始巡检
 * @param item 任务信息
 */
function startInspection(item: InspectionTask) {
  // 检查巡检时间
  const now = dayjs()
  const planTime = dayjs(item.planInsTime.replace(/-/g, '/'))

  if (now.isBefore(planTime)) {
    toast.warning('尚未开始')
    return
  }

  // 跳转到巡检过程页
  TypedRouter.toInspectionExecute(item.taskId, item.inspectionPlanName)
}

/**
 * 任务流转
 * @param item 任务信息
 */
function transferInspection(item: InspectionTask) {
  // 跳转到任务流转页，传递完整任务对象
  TypedRouter.toInspectionTransfer(JSON.stringify(item))
}

/**
 * 跳转到巡检补检页
 */
function goToReexamine() {
  TypedRouter.toInspectionReexamine()
}

onMounted(() => {
  getInspectionTasks()
})

onShow(() => {
  // 页面显示时刷新任务列表
  getInspectionTasks()
})
</script>

<template>
  <view class="inspection-task-list">
    <!-- 顶部标题栏 -->
    <view class="header">
      <view class="title">
        巡检任务
      </view>
      <wd-button type="success" size="small" @click="goToReexamine">
        巡检补检
      </wd-button>
    </view>

    <!-- 任务列表 -->
    <view v-if="!noData && tasks.length > 0" class="task-list">
      <wd-card
        v-for="(item, index) in tasks"
        :key="index"
        class="task-card"
      >
        <!-- 任务头部：任务ID和状态 -->
        <view class="task-header">
          <text class="task-id">{{ item.taskId }}</text>
          <text class="task-status">{{ item.stateName }}</text>
        </view>

        <!-- 任务信息 -->
        <wd-cell-group border>
          <wd-cell title="巡检计划" :value="item.inspectionPlanName" />
          <wd-cell title="计划编码" :value="item.inspectionPlanId" />
          <wd-cell title="巡检人" :value="item.planUserName" />
          <wd-cell title="巡检时间" :value="item.planInsTime" />
          <wd-cell title="巡检方式" :value="item.signTypeName" />
        </wd-cell-group>

        <!-- 操作按钮 -->
        <view class="task-actions">
          <wd-button
            type="primary"
            size="small"
            plain
            @click="transferInspection(item)"
          >
            流转
          </wd-button>
          <wd-button
            type="success"
            size="small"
            custom-class="ml-20rpx"
            @click="startInspection(item)"
          >
            我要巡检
          </wd-button>
        </view>
      </wd-card>
    </view>

    <!-- 空状态 -->
    <wd-status-tip v-else-if="noData && !loading" image="search" tip="暂无巡检任务" />

    <!-- 加载状态 -->
    <wd-loading v-if="loading" type="ring" />
  </view>
</template>

<style scoped lang="scss">
.inspection-task-list {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 30rpx 20rpx;
    margin-bottom: 20rpx;

    .title {
      font-size: 32rpx;
      font-weight: 400;
      color: rgba(69, 90, 100, 0.6);
    }
  }

  .task-list {
    display: flex;
    flex-direction: column;

    .task-card {
      background: #ffffff;
      border-radius: 16rpx;
      padding: 24rpx;

      & + .task-card {
        margin-top: 20rpx;
      }

      .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 24rpx;
        border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
        margin-bottom: 24rpx;

        .task-id {
          font-size: 28rpx;
          font-weight: 500;
          color: #333333;
        }

        .task-status {
          font-size: 24rpx;
          color: #999999;
        }
      }

      .task-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 24rpx;
        padding-top: 24rpx;
        border-top: 2rpx solid rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
