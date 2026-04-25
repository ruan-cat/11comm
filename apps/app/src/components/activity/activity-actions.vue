<!--
  活动操作按钮组件
  包含点赞、收藏、分享、报名等功能按钮
  所有交互逻辑和状态管理均在组件内部完成，增强内聚性
-->
<script setup lang="ts">
import type { ActivityStatus } from '@/types/activity'
import { useRequest } from 'alova/client'
import { computed, ref, watch } from 'vue'
import { updateActivityCollect, updateActivityLike } from '@/api/activity'
import { useGlobalToast } from '@/hooks/useGlobalToast'

interface Props {
  /** 活动ID */
  activityId: string
  /** 活动标题 */
  activityTitle?: string
  /** 活动图片 */
  activityImage?: string
  /** 分享路径 */
  sharePath?: string
  /** 初始点赞状态 */
  initialLiked?: boolean
  /** 初始收藏状态 */
  initialCollected?: boolean
  /** 初始报名状态 */
  initialRegistered?: boolean
  /** 初始点赞数量 */
  initialLikeCount?: number
  /** 初始收藏数量 */
  initialCollectCount?: number
  /** 初始报名数量 */
  initialRegisterCount?: number
  /** 活动状态 */
  status?: ActivityStatus
  /** 是否显示报名按钮 */
  showRegisterButton?: boolean
}

interface Emits {
  /** 点赞状态变更事件 - 用于父组件同步数据 */
  (e: 'update:liked', value: { isLiked: boolean, likeCount: number }): void
  /** 收藏状态变更事件 - 用于父组件同步数据 */
  (e: 'update:collected', value: { isCollected: boolean, collectCount: number }): void
  /** 报名状态变更事件 - 用于父组件同步数据 */
  (e: 'update:registered', value: { isRegistered: boolean }): void
}

const props = withDefaults(defineProps<Props>(), {
  activityTitle: '精彩活动',
  activityImage: '',
  sharePath: '',
  initialLiked: false,
  initialCollected: false,
  initialRegistered: false,
  initialLikeCount: 0,
  initialCollectCount: 0,
  initialRegisterCount: 0,
  status: 'UPCOMING',
  showRegisterButton: true,
})

const emit = defineEmits<Emits>()

/** Toast 实例 */
const toast = useGlobalToast()

/** 组件内部状态管理 */
const isLiked = ref<boolean>(props.initialLiked)
const isCollected = ref<boolean>(props.initialCollected)
const isRegistered = ref<boolean>(props.initialRegistered)
const likeCount = ref<number>(props.initialLikeCount)
const collectCount = ref<number>(props.initialCollectCount)
const registerCount = ref<number>(props.initialRegisterCount)
const isRegistering = ref<boolean>(false)

/** 监听 props 变化同步到内部状态 */
watch(() => props.initialLiked, (val) => {
  isLiked.value = val
})
watch(() => props.initialCollected, (val) => {
  isCollected.value = val
})
watch(() => props.initialRegistered, (val) => {
  isRegistered.value = val
})
watch(() => props.initialLikeCount, (val) => {
  likeCount.value = val
})
watch(() => props.initialCollectCount, (val) => {
  collectCount.value = val
})
watch(() => props.initialRegisterCount, (val) => {
  registerCount.value = val
})

/**
 * 点赞请求管理
 * 使用 useRequest 管理点赞接口的状态和请求
 */
const {
  loading: isLiking,
  send: sendLikeRequest,
  onSuccess: onLikeSuccess,
  onError: onLikeError,
} = useRequest(
  (newLikedState: boolean, newLikeCount: number) =>
    updateActivityLike({
      activitiesId: props.activityId,
      isLiked: newLikedState,
      likeCount: newLikeCount,
    }),
  {
    immediate: false,
  },
)

/** 点赞成功回调 */
onLikeSuccess((response) => {
  /** 更新内部状态 */
  isLiked.value = response.data.isLiked
  likeCount.value = response.data.likeCount

  /** 显示交互反馈 */
  showInteractionFeedback('like', isLiked.value ? '点赞成功' : '取消点赞')

  /** 通知父组件数据变更 */
  emit('update:liked', {
    isLiked: isLiked.value,
    likeCount: likeCount.value,
  })
})

/** 点赞失败回调 */
onLikeError((error) => {
  console.error('点赞操作失败:', error)
  showInteractionFeedback('error', '操作失败')
})

/**
 * 收藏请求管理
 * 使用 useRequest 管理收藏接口的状态和请求
 */
const {
  loading: isCollecting,
  send: sendCollectRequest,
  onSuccess: onCollectSuccess,
  onError: onCollectError,
} = useRequest(
  (newCollectedState: boolean, newCollectCount: number) =>
    updateActivityCollect({
      activitiesId: props.activityId,
      isCollected: newCollectedState,
      collectCount: newCollectCount,
    }),
  {
    immediate: false,
  },
)

/** 收藏成功回调 */
onCollectSuccess((response) => {
  /** 更新内部状态 */
  isCollected.value = response.data.isCollected
  collectCount.value = response.data.collectCount

  /** 显示交互反馈 */
  showInteractionFeedback('collect', isCollected.value ? '收藏成功' : '取消收藏')

  /** 通知父组件数据变更 */
  emit('update:collected', {
    isCollected: isCollected.value,
    collectCount: collectCount.value,
  })
})

/** 收藏失败回调 */
onCollectError((error) => {
  console.error('收藏操作失败:', error)
  showInteractionFeedback('error', '操作失败')
})

/** 计算属性 */
const formattedLikeCount = computed(() => {
  return likeCount.value >= 1000 ? `${(likeCount.value / 1000).toFixed(1)}k` : likeCount.value.toString()
})

const formattedCollectCount = computed(() => {
  return collectCount.value >= 1000 ? `${(collectCount.value / 1000).toFixed(1)}k` : collectCount.value.toString()
})

const formattedRegisterCount = computed(() => {
  return registerCount.value >= 1000 ? `${(registerCount.value / 1000).toFixed(1)}k` : registerCount.value.toString()
})

const canRegister = computed(() => {
  return props.status !== 'COMPLETED' && props.status !== 'CANCELLED' && props.showRegisterButton
})

const registerButtonText = computed(() => {
  if (isRegistered.value)
    return '取消报名'
  if (props.status === 'ONGOING')
    return '立即报名'
  if (props.status === 'UPCOMING')
    return '预约报名'
  return '已结束'
})

const registerButtonClass = computed(() => {
  if (isRegistered.value)
    return 'bg-gray-500 text-white'
  if (props.status === 'ONGOING')
    return 'bg-green-500 text-white'
  if (props.status === 'UPCOMING')
    return 'bg-blue-500 text-white'
  return 'bg-gray-300 text-gray-500 cursor-not-allowed'
})

/**
 * 显示交互反馈
 * 使用 wot-design-uni 的 toast 组件
 */
function showInteractionFeedback(type: 'like' | 'collect' | 'share' | 'register' | 'success' | 'error', text: string) {
  const options = {
    msg: text,
    duration: 1500,
  }

  switch (type) {
    case 'error':
      toast.error(options)
      break
    case 'success':
      toast.success(options)
      break
    case 'like':
    case 'collect':
    case 'share':
    case 'register':
      toast.success(options)
      break
    default:
      toast.show(options)
  }
}

/**
 * 点赞操作
 * 计算新状态并发送请求
 */
function handleLike() {
  /** 防止重复点击 */
  if (isLiking.value)
    return

  /** 计算新的状态 */
  const newLikedState = !isLiked.value
  const newLikeCount = newLikedState
    ? likeCount.value + 1
    : Math.max(likeCount.value - 1, 0)

  /** 发送点赞请求 */
  sendLikeRequest(newLikedState, newLikeCount)
}

/**
 * 收藏操作
 * 计算新状态并发送请求
 */
function handleCollect() {
  /** 防止重复点击 */
  if (isCollecting.value)
    return

  /** 计算新的状态 */
  const newCollectedState = !isCollected.value
  const newCollectCount = newCollectedState
    ? collectCount.value + 1
    : Math.max(collectCount.value - 1, 0)

  /** 发送收藏请求 */
  sendCollectRequest(newCollectedState, newCollectCount)
}

/**
 * 报名操作
 * 暂时保持模拟实现
 */
async function handleRegister() {
  if (isRegistering.value || !canRegister.value)
    return

  isRegistering.value = true
  try {
    /** 模拟API调用 */
    await new Promise(resolve => setTimeout(resolve, 500))

    /** 更新内部状态 */
    isRegistered.value = !isRegistered.value

    /** 显示交互反馈 */
    if (isRegistered.value) {
      uni.showModal({
        title: '报名成功',
        content: '您已成功报名本次活动，请准时参加。',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#3b82f6',
      })
    }
    else {
      showInteractionFeedback('register', '已取消报名')
    }

    /** 通知父组件数据变更 */
    emit('update:registered', {
      isRegistered: isRegistered.value,
    })
  }
  catch (error) {
    console.error('报名操作失败:', error)
    showInteractionFeedback('error', '操作失败')
  }
  finally {
    isRegistering.value = false
  }
}

/** 分享操作 */
function handleShare() {
  uni.showActionSheet({
    itemList: ['分享给好友', '复制链接', '保存图片'],
    success: (res) => {
      if (res.tapIndex === 0) {
        /** 触发原生分享 */
        uni.share({
          provider: 'weixin',
          scene: 'WXSceneSession',
          type: 0,
          href: '',
          title: props.activityTitle,
          summary: `我发现了一个很不错的活动:${props.activityTitle}`,
          imageUrl: props.activityImage,
          success: () => {
            showInteractionFeedback('share', '分享成功')
          },
          fail: () => {
            showInteractionFeedback('error', '分享失败')
          },
        })
      }
      else if (res.tapIndex === 1) {
        /** 复制链接 */
        uni.setClipboardData({
          data: props.sharePath,
          success: () => {
            showInteractionFeedback('success', '链接已复制')
          },
        })
      }
      else if (res.tapIndex === 2) {
        /** 保存图片 */
        if (props.activityImage) {
          uni.saveImageToPhotosAlbum({
            filePath: props.activityImage,
            success: () => {
              showInteractionFeedback('success', '图片已保存')
            },
            fail: () => {
              showInteractionFeedback('error', '保存失败')
            },
          })
        }
        else {
          showInteractionFeedback('error', '暂无图片可保存')
        }
      }
    },
  })
}

/** 联系客服 */
function handleContact() {
  uni.makePhoneCall({
    phoneNumber: '400-123-4567',
    fail: () => {
      showInteractionFeedback('error', '拨打失败')
    },
  })
}
</script>

<template>
  <view class="activity-actions-container mx-4 max-sm:mx-3">
    <!-- 主操作按钮区域 -->
    <view class="mb-4 flex">
      <!-- 报名按钮 -->
      <view
        v-if="canRegister"
        class="register-button flex-1"
      >
        <wd-button
          type="primary"
          size="large"
          :loading="isRegistering"
          :disabled="isRegistering || props.status === 'COMPLETED' || props.status === 'CANCELLED'"
          :class="registerButtonClass"
          round
          block
          @click="handleRegister"
        >
          <view class="flex items-center justify-center">
            <wd-icon
              :name="isRegistered ? 'close' : 'calendar'"
              size="18"
              :custom-class="`i-carbon-${isRegistered ? 'close' : 'calendar'} mr-2`"
            />
            <text class="font-medium tracking-[0.2rpx]">{{ registerButtonText }}</text>
          </view>
        </wd-button>
      </view>

      <!-- 联系客服按钮 -->
      <view v-if="!canRegister" class="contact-button flex-1">
        <wd-button
          type="primary"
          size="large"
          round
          block
          @click="handleContact"
        >
          <view class="flex items-center justify-center">
            <wd-icon name="phone" size="18" custom-class="i-carbon-phone mr-2" />
            <text class="font-medium tracking-[0.2rpx]">联系客服</text>
          </view>
        </wd-button>
      </view>
    </view>

    <!-- 次要操作按钮区域 -->
    <view
      class="flex items-center justify-around rounded-2xl bg-gray-50 py-4 transition-colors group-hover:bg-gray-100 max-sm:py-3"
      style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid rgba(0, 0, 0, 0.05);"
    >
      <!-- 点赞按钮 -->
      <view
        class="action-item flex flex-col cursor-pointer items-center rounded-xl p-2 transition-all duration-200 active:translate-y-0 hover:bg-gray-100 hover:-translate-y-0.5"
        :class="{ 'like-active': isLiked }"
        @click="handleLike"
      >
        <view class="group relative">
          <wd-icon
            :name="isLiked ? 'like-filled' : 'like'"
            size="24"
            :custom-class="`action-icon i-carbon-${isLiked ? 'thumbs-up-filled' : 'thumbs-up'} ${isLiked ? 'text-red-500' : 'text-gray-600'} transition-transform duration-200 group-hover:scale-110`"
          />
          <view v-if="isLiking" class="absolute inset-0 flex items-center justify-center">
            <wd-loading size="20" />
          </view>
        </view>
        <text class="mt-1 text-xs font-medium tracking-[0.1rpx]" :class="isLiked ? 'text-red-500' : 'text-gray-600'">{{ formattedLikeCount }}</text>
      </view>

      <!-- 收藏按钮 -->
      <view
        class="action-item flex flex-col cursor-pointer items-center rounded-xl p-2 transition-all duration-200 active:translate-y-0 hover:bg-gray-100 hover:-translate-y-0.5"
        :class="{ 'collect-active': isCollected }"
        @click="handleCollect"
      >
        <view class="group relative">
          <wd-icon
            :name="isCollected ? 'star-filled' : 'star'"
            size="24"
            :custom-class="`action-icon i-carbon-${isCollected ? 'star-filled' : 'star'} ${isCollected ? 'text-yellow-500' : 'text-gray-600'} transition-transform duration-200 group-hover:scale-110`"
          />
          <view v-if="isCollecting" class="absolute inset-0 flex items-center justify-center">
            <wd-loading size="20" />
          </view>
        </view>
        <text class="mt-1 text-xs font-medium tracking-[0.1rpx]" :class="isCollected ? 'text-yellow-500' : 'text-gray-600'">{{ formattedCollectCount }}</text>
      </view>

      <!-- 分享按钮 -->
      <view
        class="action-item flex flex-col cursor-pointer items-center rounded-xl p-2 text-gray-600 transition-all duration-200 active:translate-y-0 hover:bg-gray-100 hover:-translate-y-0.5"
        @click="handleShare"
      >
        <view class="group">
          <wd-icon
            name="share"
            size="24"
            custom-class="i-carbon-share transition-transform duration-200 group-hover:scale-110"
          />
        </view>
        <text class="mt-1 text-xs font-medium tracking-[0.1rpx]">分享</text>
      </view>

      <!-- 统计信息 -->
      <view
        v-if="canRegister && registerCount > 0"
        class="flex flex-col items-center p-2 text-gray-600"
      >
        <view class="group">
          <wd-icon
            name="group"
            size="24"
            custom-class="i-carbon-group-account transition-transform duration-200 group-hover:scale-110"
          />
        </view>
        <text class="mt-1 text-xs font-medium tracking-[0.1rpx]">{{ formattedRegisterCount }}人报名</text>
      </view>
    </view>

    <!-- 操作提示 -->
    <view
      class="mt-4 rounded-xl bg-blue-50 p-3 max-sm:p-2"
      style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12rpx;"
    >
      <view class="flex items-start">
        <wd-icon name="information" size="16" custom-class="i-carbon-information text-blue-500 mr-2 mt-0.5" />
        <text class="text-xs text-blue-700 leading-relaxed tracking-[0.1rpx]">
          报名成功后，我们将在活动开始前通过短信提醒您，请保持手机畅通。
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* 滑入动画定义 */
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

.activity-actions-container {
  animation: slideUp 0.6s ease-out 0.2s both;
}

/* 报名按钮样式 - 使用深度选择器 */
.register-button :deep(.wd-button) {
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
}

.register-button :deep(.wd-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.register-button :deep(.wd-button:active) {
  transform: translateY(0);
}

/* 联系客服按钮样式 - 使用深度选择器 */
.contact-button :deep(.wd-button) {
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4);
  transition: all 0.3s ease;
}

.contact-button :deep(.wd-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.5);
}

/* 点赞动画效果 */
.like-active .action-icon {
  animation: likeAnimation 0.6s ease-out;
}

@keyframes likeAnimation {
  0% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.3);
  }
  30% {
    transform: scale(0.9);
  }
  45% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 收藏动画效果 */
.collect-active .action-icon {
  animation: collectAnimation 0.6s ease-out;
}

@keyframes collectAnimation {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

/* 无障碍支持 - 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .activity-actions-container {
    animation: none;
  }

  .register-button :deep(.wd-button),
  .contact-button :deep(.wd-button) {
    transition: none;
  }

  .register-button :deep(.wd-button:hover),
  .contact-button :deep(.wd-button:hover) {
    transform: none;
  }

  .like-active .action-icon,
  .collect-active .action-icon {
    animation: none;
  }
}
</style>
