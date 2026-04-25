<!--
  巡检过程页面
  功能：显示巡检任务的详细内容，展示各巡检项的完成情况

  访问地址: http://localhost:3000/#/pages-sub/inspection/execute
  建议携带参数: ?taskId=xxx&inspectionPlanName=xxx

  示例: http://localhost:3000/#/pages-sub/inspection/execute?taskId=TASK_001&inspectionPlanName=小区日常巡检

  旧代码： gitee-example/pages/excuteInspection/excuteInspection.vue
-->

<script setup lang="ts">
import type { InspectionTaskDetail } from '@/types/inspection'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, onMounted, ref } from 'vue'
import { getInspectionTaskDetail } from '@/api/inspection'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '巡检过程',
    enablePullDownRefresh: false,
  },
})

/** 全局 Toast */
const toast = useGlobalToast()

/** 路由参数 */
const taskId = ref('')
const inspectionPlanName = ref('')

/** 获取路由参数 */
onLoad((options) => {
  taskId.value = options?.taskId as string || ''
  inspectionPlanName.value = options?.inspectionPlanName as string || ''
})

/** 巡检任务详情列表 */
const taskDetails = ref<InspectionTaskDetail[]>([])

/** 计算巡检进度 */
const progress = computed(() => {
  if (taskDetails.value.length === 0)
    return 0
  const completedCount = taskDetails.value.filter(item => item.state === '20200407').length
  return Math.round((completedCount / taskDetails.value.length) * 100)
})

/** 已完成数量 */
const completedCount = computed(() => {
  return taskDetails.value.filter(item => item.state === '20200407').length
})

/** 总数量 */
const totalCount = computed(() => {
  return taskDetails.value.length
})

/**
 * 获取巡检任务详情
 */
const {
  loading,
  send: sendGetTaskDetails,
} = useRequest(() => getInspectionTaskDetail({
  taskId: taskId.value,
  page: 1,
  row: 100,
}), {
  immediate: false,
})
  .onSuccess((event) => {
    const data = event.data
    taskDetails.value = data.list || []
  })
  .onError((error) => {
    toast.error(error.error || '请求失败')
  })

async function getTaskDetails() {
  await sendGetTaskDetails()
}

/**
 * 执行单项巡检
 * @param item 巡检项详情
 */
function executeInspection(item: InspectionTaskDetail) {
  TypedRouter.toInspectionExecuteSingle({
    taskDetailId: item.taskDetailId,
    taskId: item.taskId,
    inspectionId: item.inspectionId,
    inspectionName: item.inspectionName,
    itemId: item.itemId,
  })
}

/**
 * 预览图片
 * @param item 巡检项详情
 * @param index 当前图片索引
 */
function previewImage(item: InspectionTaskDetail, index: number) {
  if (!item.photos || item.photos.length === 0)
    return

  const urls = item.photos.map(photo => photo.url)
  uni.previewImage({
    urls,
    current: index,
  })
}

onMounted(() => {
  getTaskDetails()
})

onShow(() => {
  // 页面显示时刷新详情
  getTaskDetails()
})
</script>

<template>
  <view class="inspection-execute">
    <!-- 标题 -->
    <view class="page-title">
      {{ inspectionPlanName }}
    </view>

    <!-- 进度信息 -->
    <view class="progress-info">
      <wd-cell-group>
        <wd-cell title="巡检进度" center>
          <template #right>
            <view class="progress-value">
              <text class="count">{{ completedCount }}/{{ totalCount }}</text>
              <wd-progress :percentage="progress" hide-label />
            </view>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 巡检项列表 -->
    <view v-if="!loading && taskDetails.length > 0" class="inspection-list">
      <view class="list-header">
        巡检点
      </view>

      <view
        v-for="(item, index) in taskDetails"
        :key="index"
        class="inspection-item"
        :class="{ completed: item.state === '20200407' }"
      >
        <!-- 巡检项名称和时间 -->
        <view class="item-header">
          <view class="item-name">
            <wd-icon
              :name="item.state === '20200407' ? 'check-outline' : 'clock'"
              :color="item.state === '20200407' ? '#4CAF50' : '#999999'"
              size="20px"
            />
            <text class="name-text">{{ item.inspectionName }}</text>
          </view>
          <view v-if="item.state !== '20200407' && item.pointStartTime && item.pointEndTime" class="item-time">
            {{ item.pointStartTime }} - {{ item.pointEndTime }}
          </view>
        </view>

        <!-- 已完成项的处理意见 -->
        <view v-if="item.state === '20200407'" class="item-description">
          <wd-cell-group>
            <wd-cell title="处理意见" :value="item.description" />
          </wd-cell-group>
        </view>

        <!-- 已完成项的照片 -->
        <view v-if="item.state === '20200407' && item.photos && item.photos.length > 0" class="item-photos">
          <view
            v-for="(photo, photoIndex) in item.photos"
            :key="photoIndex"
            class="photo-item"
            @click="previewImage(item, photoIndex)"
          >
            <wd-img
              :src="photo.url"
              mode="aspectFill"
              class="photo-image"
            />
          </view>
        </view>

        <!-- 未完成项的操作按钮 -->
        <view v-if="item.state !== '20200407'" class="item-action">
          <wd-button
            type="success"
            size="large"
            block
            @click="executeInspection(item)"
          >
            <wd-icon name="camera" size="18px" />
            巡检
          </wd-button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <wd-status-tip v-else-if="!loading && taskDetails.length === 0" image="search" tip="暂无巡检项" />

    <!-- 加载状态 -->
    <wd-loading v-if="loading" type="ring" />
  </view>
</template>

<style scoped lang="scss">
.inspection-execute {
  min-height: 100vh;
  background-color: #f5f5f5;

  .page-title {
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(69, 90, 100, 0.6);
    padding: 40rpx 30rpx 20rpx;
  }

  .progress-info {
    margin: 0 20rpx 20rpx;
    background: #ffffff;
    border-radius: 16rpx;
    overflow: hidden;

    .progress-value {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      min-width: 200rpx;

      .count {
        margin-bottom: 12rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: #333333;
      }
    }
  }

  .inspection-list {
    padding: 0 20rpx;

    .list-header {
      font-size: 28rpx;
      color: rgba(69, 90, 100, 0.6);
      padding: 20rpx 0;
      text-align: center;
    }

    .inspection-item {
      background: #ffffff;
      border-radius: 16rpx;
      padding: 32rpx;
      margin-bottom: 20rpx;
      border-left: 6rpx solid #e0e0e0;
      transition: all 0.3s ease;

      &.completed {
        border-left-color: #4caf50;
      }

      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;

        .item-name {
          display: flex;
          align-items: center;

          .wd-icon {
            margin-right: 16rpx;
          }

          .name-text {
            font-size: 32rpx;
            font-weight: 500;
            color: #333333;
          }
        }

        .item-time {
          font-size: 24rpx;
          color: #999999;
        }
      }

      .item-description {
        margin-top: 20rpx;
      }

      .item-photos {
        display: flex;
        flex-wrap: wrap;
        margin: 20rpx -10rpx 0;

        .photo-item {
          position: relative;
          width: calc(33.3333% - 20rpx);
          height: 0;
          padding-bottom: 100%;
          margin: 0 10rpx 20rpx;
          border-radius: 12rpx;
          overflow: hidden;
          background: #f5f5f5;

          .photo-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
      }

      .item-action {
        margin-top: 24rpx;
      }
    }
  }
}
</style>
