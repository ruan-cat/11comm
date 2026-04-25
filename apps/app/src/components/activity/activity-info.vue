<!--
  活动信息组件
  显示活动标题、发布者、时间等元信息
-->
<script setup lang="ts">
import type { ActivityStatus } from '@/types/activity'
import dayjs from 'dayjs'
import { computed } from 'vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

interface Props {
  /** 活动标题 */
  title: string
  /** 发布者姓名 */
  author: string
  /** 发布者头像 */
  avatar?: string
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime?: string
  /** 活动状态 */
  status?: ActivityStatus
  /** 浏览量 */
  viewCount?: number
  /** 点赞数 */
  likeCount?: number
}

const props = defineProps<Props>()

const toast = useGlobalToast()

/** 计算属性 */
const formattedStartTime = computed(() => {
  return props.startTime ? dayjs(props.startTime).format('YYYY-MM-DD HH:mm') : ''
})

const formattedEndTime = computed(() => {
  return props.endTime ? dayjs(props.endTime).format('YYYY-MM-DD HH:mm') : ''
})

const showEndTime = computed(() => {
  return props.endTime && props.endTime !== props.startTime
})

const formattedViewCount = computed(() => {
  if (!props.viewCount)
    return ''
  return props.viewCount >= 1000 ? `${(props.viewCount / 1000).toFixed(1)}k` : props.viewCount.toString()
})

const formattedLikeCount = computed(() => {
  if (!props.likeCount)
    return ''
  return props.likeCount >= 1000 ? `${(props.likeCount / 1000).toFixed(1)}k` : props.likeCount.toString()
})

const statusConfig = computed(() => {
  const statusMap: Record<ActivityStatus, { text: string, color: string }> = {
    ONGOING: { text: '进行中', color: 'green' },
    UPCOMING: { text: '即将开始', color: 'blue' },
    COMPLETED: { text: '已结束', color: 'gray' },
    CANCELLED: { text: '已取消', color: 'red' },
  }
  return props.status ? statusMap[props.status] : { text: '未知', color: 'gray' }
})

/** 方法 */
function handleAuthorClick() {
  // 可以跳转到发布者详情页
  toast.info('查看发布者信息')
}

function handleTimeClick() {
  // 可以添加到日历
  if (props.startTime) {
    toast.success('已添加到日历')
  }
}
</script>

<template>
  <view class="activity-info-card rounded-2xl bg-white p-6 shadow-lg animate-slide-up max-sm:p-4">
    <!-- 活动标题和状态 -->
    <view class="activity-info-title-row mb-4 flex flex-wrap items-center">
      <text class="text-2xl text-gray-900 font-bold leading-tight tracking-[0.5rpx] max-sm:text-xl">
        {{ props.title }}
      </text>

      <!-- 状态标签 -->
      <view
        v-if="props.status"
        class="activity-info-title-status inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-[0.2rpx]"
        :class="`bg-${statusConfig.color}-100 text-${statusConfig.color}-600`"
      >
        <view
          class="mr-1 h-2 w-2 animate-pulse rounded-full"
          :class="`bg-${statusConfig.color}-500`"
        />
        <text>{{ statusConfig.text }}</text>
      </view>
    </view>

    <!-- 元信息区域 -->
    <view class="meta-info-area">
      <!-- 发布者信息 -->
      <view
        class="group flex cursor-pointer items-center border-b border-gray-50 py-3 transition-all duration-200 hover:bg-gray-50"
        @click="handleAuthorClick"
      >
        <!-- 头像显示区域 -->
        <view
          class="avatar-wrapper mr-4 h-10 w-10 flex items-center justify-center overflow-hidden rounded-full shadow-md transition-transform duration-200 max-sm:mr-3 max-sm:h-8 max-sm:w-8 group-hover:scale-110"
        >
          <wd-img
            v-if="props.avatar"
            :round="true"
            :src="props.avatar"
            mode="aspectFill"
            class="h-full w-full"
          >
            <!-- 加载失败时显示默认图标 -->
            <template #error>
              <view
                class="icon-wrapper-blue h-full w-full flex items-center justify-center from-blue-500 to-blue-600 bg-gradient-to-r"
              >
                <wd-icon name="user" size="18" custom-class="i-carbon-user-avatar text-white max-sm:text-sm" />
              </view>
            </template>
          </wd-img>
          <!-- 无头像时显示默认图标 -->
          <view
            v-else
            class="icon-wrapper-blue h-full w-full flex items-center justify-center rounded-full from-blue-500 to-blue-600 bg-gradient-to-r"
          >
            <wd-icon name="user" size="18" custom-class="i-carbon-user-avatar text-white max-sm:text-sm" />
          </view>
        </view>

        <view class="flex-1">
          <text class="text-base text-gray-900 font-medium tracking-[0.2rpx] max-sm:text-sm">
            {{ props.author }}
          </text>
          <text class="mt-1 block text-sm text-gray-500 tracking-[0.2rpx]">发布者</text>
        </view>

        <wd-icon name="arrow-right" size="16" custom-class="i-carbon-chevron-right text-gray-400" />
      </view>

      <!-- 时间信息 -->
      <view
        class="group flex cursor-pointer items-center border-b border-gray-50 py-3 transition-all duration-200 hover:bg-gray-50"
        @click="handleTimeClick"
      >
        <view
          class="icon-wrapper-orange mr-4 h-10 w-10 flex items-center justify-center rounded-full bg-orange-50 shadow-sm transition-transform duration-200 max-sm:mr-3 max-sm:h-8 max-sm:w-8 group-hover:scale-110"
        >
          <wd-icon name="time" size="18" custom-class="i-carbon-time text-orange-500 max-sm:text-sm" />
        </view>

        <view class="flex-1">
          <text class="text-base text-gray-900 font-medium tracking-[0.2rpx] max-sm:text-sm">
            {{ formattedStartTime }}
          </text>
          <text class="mt-1 block text-sm text-gray-500 tracking-[0.2rpx]">开始时间</text>

          <!-- 结束时间 -->
          <view v-if="showEndTime" class="mt-2">
            <text class="text-base text-gray-900 font-medium tracking-[0.2rpx] max-sm:text-sm">
              {{ formattedEndTime }}
            </text>
            <text class="block text-sm text-gray-500 tracking-[0.2rpx]">结束时间</text>
          </view>
        </view>

        <wd-icon name="calendar" size="16" custom-class="i-carbon-calendar text-gray-400" />
      </view>

      <!-- 统计信息 -->
      <view
        v-if="props.viewCount || props.likeCount"
        class="flex items-center py-3"
      >
        <view
          class="icon-wrapper-purple mr-4 h-10 w-10 flex items-center justify-center rounded-full bg-purple-50 shadow-sm transition-transform duration-200 max-sm:mr-3 max-sm:h-8 max-sm:w-8 group-hover:scale-110"
        >
          <wd-icon name="chart" size="18" custom-class="i-carbon-analytics text-purple-500 max-sm:text-sm" />
        </view>

        <view class="activity-info-stats flex flex-1 items-center max-sm:flex-col max-sm:items-start">
          <!-- 浏览量 -->
          <view v-if="props.viewCount" class="activity-info-stat-item flex items-center">
            <wd-icon name="view" size="16" custom-class="i-carbon-view text-gray-400 mr-2" />
            <text class="text-sm text-gray-600 tracking-[0.1rpx]">{{ formattedViewCount }} 浏览</text>
          </view>

          <!-- 点赞数 -->
          <view v-if="props.likeCount" class="activity-info-stat-item flex items-center">
            <wd-icon name="like" size="16" custom-class="i-carbon-thumbs-up text-gray-400 mr-2" />
            <text class="text-sm text-gray-600 tracking-[0.1rpx]">{{ formattedLikeCount }} 点赞</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
/** 元信息区域 - 无间距 */
.meta-info-area {
  /* 无额外间距 */
}

/** 卡片阴影效果 */
.activity-info-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.activity-info-title-status {
  margin-top: 8rpx;
  margin-left: 8rpx;
}

.activity-info-stats {
  flex-wrap: wrap;
  margin: -12rpx -24rpx;
}

.activity-info-stat-item {
  margin: 12rpx 24rpx;
}

/** 头像包装器阴影 */
.avatar-wrapper {
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/** 蓝色图标包装器阴影 */
.icon-wrapper-blue {
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/** 橙色图标包装器阴影 */
.icon-wrapper-orange {
  box-shadow: 0 2px 8px rgba(251, 146, 60, 0.2);
}

/** 紫色图标包装器阴影 */
.icon-wrapper-purple {
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.2);
}

/** 滑入动画定义 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}

/** 无障碍支持 - 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .animate-slide-up {
    animation: none;
  }
}

@media (max-width: 640px) {
  .activity-info-title-status {
    margin-left: 0;
  }

  .activity-info-stats {
    margin: -4rpx 0;
  }

  .activity-info-stat-item {
    margin: 4rpx 0;
  }
}
</style>
