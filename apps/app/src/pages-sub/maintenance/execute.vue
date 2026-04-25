<!--
  保养执行页
  功能：显示保养任务详情和执行项列表，支持开始/完成保养

  访问地址: http://localhost:3000/#/pages-sub/maintenance/execute
  建议携带参数: ?taskId=xxx

  示例: http://localhost:3000/#/pages-sub/maintenance/execute?taskId=MT_001

  旧代码：gitee-example/pages/maintainance/excuteMaintainance.vue
-->

<script setup lang="ts">
import type { MaintenanceTask, MaintenanceTaskDetail } from '@/types/maintenance'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import { completeMaintenanceTask, getMaintenanceDetail, getMaintenanceDetailItems, startMaintenanceTask } from '@/api/maintenance'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router/helpers'

definePage({
  style: {
    navigationBarTitleText: '保养执行',
    enablePullDownRefresh: false,
  },
})

const toast = useGlobalToast()

/** 路由参数 */
const taskId = ref('')

/** 获取路由参数 */
onLoad((options) => {
  taskId.value = options?.taskId as string || ''
})

/** 任务详情 */
const taskInfo = ref<MaintenanceTask | null>(null)

/** 保养项列表 */
const detailItems = ref<MaintenanceTaskDetail[]>([])

/** 计算保养进度 */
const progress = computed(() => {
  if (detailItems.value.length === 0)
    return 0
  const completedCount = detailItems.value.filter(item => item.result).length
  return Math.round((completedCount / detailItems.value.length) * 100)
})

/** 已完成数量 */
const completedCount = computed(() => {
  return detailItems.value.filter(item => item.result).length
})

/** 总数量 */
const totalCount = computed(() => {
  return detailItems.value.length
})

/** 是否全部完成 */
const isAllCompleted = computed(() => {
  return detailItems.value.length > 0 && completedCount.value === totalCount.value
})

/** 获取任务详情 */
const { loading: loadingTask, send: loadTaskDetail } = useRequest(
  () => getMaintenanceDetail({ taskId: taskId.value }),
  { immediate: false },
)
  .onSuccess((event) => {
    taskInfo.value = event.data?.task ?? null
  })
  .onError((error) => {
    console.error('获取任务详情失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

/** 获取保养项列表 */
const { loading: loadingItems, send: loadDetailItems } = useRequest(
  () => getMaintenanceDetailItems({ taskId: taskId.value }),
  { immediate: false },
)
  .onSuccess((event) => {
    detailItems.value = event.data?.items ?? []
  })
  .onError((error) => {
    console.error('获取保养项列表失败:', error)
    toast.error('获取保养项列表失败')
  })

/** 加载数据 */
async function loadData() {
  if (!taskId.value)
    return
  await Promise.all([loadTaskDetail(), loadDetailItems()])
}

/** 开始保养任务 */
const { loading: startingTask, send: startTask } = useRequest(
  () => startMaintenanceTask({ taskId: taskId.value }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('开始保养成功')
    loadData()
  })
  .onError((error) => {
    console.error('开始保养失败:', error)
    toast.error('开始保养失败')
  })

/** 完成保养任务 */
const { loading: completingTask, send: completeTask } = useRequest(
  () => completeMaintenanceTask({ taskId: taskId.value }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('保养完成')
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  })
  .onError((error) => {
    console.error('完成保养失败:', error)
    toast.error('完成保养失败')
  })

/** 执行单项保养 */
function handleExecuteSingle(item: MaintenanceTaskDetail) {
  TypedRouter.toMaintenanceExecuteSingle(item.taskDetailId, item.taskId, item.itemName)
}

/** 预览图片 */
function previewImage(photos: string[], index: number) {
  uni.previewImage({
    urls: photos,
    current: index,
  })
}

/** 获取状态标签类型 */
function getStatusType(status: string): 'primary' | 'success' | 'warning' | 'danger' | 'default' {
  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'default'> = {
    10001: 'warning', // 待保养
    10002: 'primary', // 保养中
    10003: 'success', // 已完成
  }
  return typeMap[status] || 'default'
}

onShow(() => {
  loadData()
})
</script>

<template>
  <view class="maintenance-execute">
    <!-- 任务信息卡片 -->
    <view v-if="taskInfo" class="task-card">
      <view class="task-header">
        <view class="task-name">
          <wd-icon name="" custom-class="i-carbon-settings text-colorui-blue text-24px" />
          <text>{{ taskInfo.taskName }}</text>
        </view>
        <wd-tag :type="getStatusType(taskInfo.status)" size="small">
          {{ taskInfo.statusName }}
        </wd-tag>
      </view>

      <view class="task-info">
        <view class="info-item">
          <wd-icon name="" custom-class="i-carbon-machine-learning text-gray-400 text-16px" />
          <text>设备：{{ taskInfo.machineName }}</text>
        </view>
        <view class="info-item">
          <wd-icon name="" custom-class="i-carbon-time text-gray-400 text-16px" />
          <text>计划时间：{{ taskInfo.planTime }}</text>
        </view>
        <view v-if="taskInfo.staffName" class="info-item">
          <wd-icon name="" custom-class="i-carbon-user text-gray-400 text-16px" />
          <text>执行人：{{ taskInfo.staffName }}</text>
        </view>
      </view>

      <!-- 进度条 -->
      <view class="progress-section">
        <view class="progress-label">
          <text>保养进度</text>
          <text class="progress-count">{{ completedCount }}/{{ totalCount }}</text>
        </view>
        <wd-progress :percentage="progress" />
      </view>
    </view>

    <!-- 保养项列表 -->
    <view class="detail-section">
      <FormSectionTitle title="保养项目" icon="i-carbon-list-checked" />

      <view v-if="!loadingItems && detailItems.length > 0" class="detail-list">
        <view
          v-for="item in detailItems"
          :key="item.taskDetailId"
          class="detail-item"
          :class="{ completed: item.result }"
        >
          <view class="item-header">
            <view class="item-name">
              <wd-icon
                :name="item.result ? 'check-outline' : 'clock'"
                :color="item.result ? '#4CAF50' : '#999999'"
                size="20px"
              />
              <text>{{ item.itemName }}</text>
            </view>
          </view>

          <view class="item-content">
            <text class="content-text">{{ item.itemContent }}</text>
          </view>

          <!-- 已完成项的结果 -->
          <view v-if="item.result" class="item-result">
            <wd-cell-group>
              <wd-cell title="执行结果" :value="item.result" />
              <wd-cell v-if="item.remark" title="备注" :value="item.remark" />
            </wd-cell-group>
          </view>

          <!-- 已完成项的照片 -->
          <view v-if="item.photos && item.photos.length > 0" class="item-photos">
            <view
              v-for="(photo, photoIndex) in item.photos"
              :key="photoIndex"
              class="photo-item"
              @click="previewImage(item.photos!, photoIndex)"
            >
              <wd-img :src="photo" mode="aspectFill" class="photo-image" />
            </view>
          </view>

          <!-- 未完成项的操作按钮 -->
          <view v-if="!item.result && taskInfo?.status === '10002'" class="item-action">
            <wd-button type="success" size="medium" @click="handleExecuteSingle(item)">
              <wd-icon name="" custom-class="i-carbon-edit text-16px mr-1" />
              执行保养
            </wd-button>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <wd-status-tip v-else-if="!loadingItems && detailItems.length === 0" image="search" tip="暂无保养项" />

      <!-- 加载状态 -->
      <view v-if="loadingItems" class="loading-wrap">
        <wd-loading type="ring" />
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view v-if="taskInfo" class="bottom-bar">
      <!-- 待保养状态：显示开始保养按钮 -->
      <wd-button
        v-if="taskInfo.status === '10001'"
        type="primary"
        size="large"
        block
        :loading="startingTask"
        @click="startTask"
      >
        开始保养
      </wd-button>

      <!-- 保养中状态：显示完成保养按钮（需要全部完成） -->
      <wd-button
        v-else-if="taskInfo.status === '10002'"
        type="success"
        size="large"
        block
        :disabled="!isAllCompleted"
        :loading="completingTask"
        @click="completeTask"
      >
        {{ isAllCompleted ? '完成保养' : `还有 ${totalCount - completedCount} 项未完成` }}
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.maintenance-execute {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.task-card {
  margin: 20rpx;
  padding: 32rpx;
  background: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;

    .task-name {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }

    .task-name .wd-icon {
      margin-right: 12rpx;
    }
  }

  .task-info {
    .info-item {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      color: #666666;
      margin-bottom: 12rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .wd-icon {
        margin-right: 12rpx;
      }
    }
  }

  .progress-section {
    margin-top: 24rpx;
    padding-top: 24rpx;
    border-top: 1rpx solid #f0f0f0;

    .progress-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;
      font-size: 28rpx;
      color: #666666;

      .progress-count {
        font-weight: 500;
        color: #333333;
      }
    }
  }
}

.detail-section {
  padding: 0 20rpx;

  .detail-list {
    margin-top: 20rpx;

    .detail-item {
      background: #ffffff;
      border-radius: 16rpx;
      padding: 32rpx;
      margin-bottom: 20rpx;
      border-left: 6rpx solid #e0e0e0;

      &.completed {
        border-left-color: #4caf50;
      }

      .item-header {
        margin-bottom: 16rpx;

        .item-name {
          display: flex;
          align-items: center;
          font-size: 30rpx;
          font-weight: 500;
          color: #333333;
        }

        .item-name .wd-icon {
          margin-right: 12rpx;
        }
      }

      .item-content {
        margin-bottom: 16rpx;

        .content-text {
          font-size: 26rpx;
          color: #666666;
          line-height: 1.6;
        }
      }

      .item-result {
        margin-top: 16rpx;
      }

      .item-photos {
        display: flex;
        flex-wrap: wrap;
        margin: 16rpx -8rpx 0;

        .photo-item {
          position: relative;
          width: calc(33.3333% - 16rpx);
          height: 0;
          padding-bottom: 100%;
          margin: 0 8rpx 16rpx;
          border-radius: 8rpx;
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
        margin-top: 20rpx;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}

.loading-wrap {
  padding: 60rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + var(--window-bottom, 0px));
  background: #ffffff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
}
</style>
