<!--
  活动详情页
  功能：展示单个活动详情，支持分享与统计

  访问地址: http://localhost:3000/#/pages/activity/detail
  建议参数: ?activitiesId=ACT_018&currentCommunityId=COMM_001

  旧代码：gitee-example/pages/activityDetail/activityDetail.vue
-->

<script setup lang="ts">
import type { Activity } from '@/types/activity'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, nextTick, reactive, ref } from 'vue'
import { getActivityDetail, increaseActivityView } from '@/api/activity'
import ActivityActions from '@/components/activity/activity-actions.vue'
import ActivityContent from '@/components/activity/activity-content.vue'
import ActivityError from '@/components/activity/activity-error.vue'
import ActivityHeroImage from '@/components/activity/activity-hero.vue'
import ActivityInfo from '@/components/activity/activity-info.vue'
import ActivitySkeleton from '@/components/activity/activity-skeleton.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

/** 页面配置 */
definePage({
  style: {
    navigationBarTitleText: '活动详情',
    navigationBarBackgroundColor: '#368CFE',
    navigationBarTextStyle: 'white',
  },
})

const toast = useGlobalToast()

/** 接口参数 */
interface PageOptions {
  activitiesId: string
  currentCommunityId: string
}

/** 响应式数据 */
const activitiesId = ref<string>('')
const currentCommunityId = ref<string>('')
const pageVisible = ref<boolean>(true)
const errorState = ref<{
  show: boolean
  type: 'network' | 'not-found' | 'permission' | 'server' | 'unknown'
  message: string
}>({
  show: false,
  type: 'unknown',
  message: '',
})
const retryCount = ref<number>(0)
const maxRetryCount = 3

// 活动数据
const activity = reactive<Partial<Activity>>({
  activitiesId: '',
  title: '',
  userName: '',
  avatar: '',
  startTime: '',
  endTime: '',
  context: '',
  headerImg: '',
  src: '',
  status: 'UPCOMING',
  viewCount: 0,
  likeCount: 0,
  collectCount: 0,
  readCount: 0,
})

// 图片加载状态
const isImageLoading = ref<boolean>(true)

const shareData = computed(() => ({
  title: activity.title || '精彩活动',
  path: `/pages/activity/detail?activitiesId=${activitiesId.value}&currentCommunityId=${currentCommunityId.value}`,
  imageUrl: activity.src || '',
}))

/** 请求管理 */
const {
  loading,
  data: activityData,
  send: refreshActivity,
  error: requestError,
} = useRequest(
  () => getActivityDetail({
    page: 1,
    row: 1,
    activitiesId: activitiesId.value,
    communityId: currentCommunityId.value,
  }),
  {
    immediate: false,
    onError: (error) => {
      console.error('加载活动详情失败:', error)
    },
  },
)

/** 方法 */
async function loadActivities() {
  if (!activitiesId.value || !currentCommunityId.value) {
    showError('unknown', '缺少必要的参数')
    return
  }

  try {
    errorState.value.show = false
    const result = await refreshActivity()

    if (result?.activitiess?.length > 0) {
      const activityItem = result.activitiess[0]

      /**
       * 处理图片路径
       * @description
       * 这里无需处理图片路径 根据mock数据的返回格式 有意义的输出结果是 src ，而不是 headerImg 。
       * getImageUrl 事实上失去设计意义
       */
      // activityItem.src = getImageUrl(activityItem.headerImg, currentCommunityId.value)

      /** 更新活动数据 */
      Object.assign(activity, activityItem)

      // 增加浏览量
      await increaseViewCount()

      // 重置重试次数
      retryCount.value = 0
    }
    else {
      showError('not-found', '未找到相关活动')
    }
  }
  catch (error: any) {
    console.error('加载活动详情失败:', error)

    // 根据错误类型显示不同的错误信息
    const errorType = error.code === 'NETWORK_ERROR'
      ? 'network'
      : error.code === 'NOT_FOUND'
        ? 'not-found'
        : error.code === 'PERMISSION_DENIED'
          ? 'permission'
          : error.code === 'SERVER_ERROR' ? 'server' : 'unknown'

    showError(errorType, error.message || '加载失败，请稍后重试')
  }
}

async function increaseViewCount() {
  try {
    await increaseActivityView(activitiesId.value)
    activity.viewCount = (activity.viewCount || 0) + 1
  }
  catch (error) {
    console.warn('增加浏览量失败:', error)
  }
}

function showError(type: typeof errorState.value.type, message: string) {
  errorState.value = {
    show: true,
    type,
    message,
  }
}

function handleRetry() {
  if (retryCount.value >= maxRetryCount) {
    toast.warning('已达到最大重试次数')
    return
  }

  retryCount.value++
  loadActivities()
}

function handleRefresh() {
  retryCount.value = 0
  loadActivities()
}

function handleBack() {
  uni.navigateBack({
    delta: 1,
    fail: () => {
      uni.switchTab({
        url: '/pages/activity/index',
      })
    },
  })
}

function handleImageError() {
  console.log('图片加载失败')
  activity.src = ''
  isImageLoading.value = false
}

function handleImageLoad() {
  isImageLoading.value = false
}

/**
 * 处理点赞状态变更
 * 子组件内部已完成 API 调用和交互逻辑，这里仅同步数据到父组件状态
 */
function handleLikeUpdate(data: { isLiked: boolean, likeCount: number }) {
  // 同步数据到本地状态
  activity.likeCount = data.likeCount
}

/**
 * 处理收藏状态变更
 * 子组件内部已完成 API 调用和交互逻辑，这里仅同步数据到父组件状态
 */
function handleCollectUpdate(data: { isCollected: boolean, collectCount: number }) {
  // 同步数据到本地状态
  activity.collectCount = data.collectCount
}

/**
 * 处理报名状态变更
 * 子组件内部已完成所有交互逻辑，这里仅用于同步数据到服务器
 */
function handleRegisterUpdate(data: { isRegistered: boolean }) {
  // TODO: 调用实际的报名API同步到服务器
  // 目前不清楚报名相关的api实现 故暂时保留这里的逻辑 未来考虑实现模拟接口
  console.log('报名状态变更:', data)
}

/** 生命周期 */
onLoad((options: PageOptions) => {
  activitiesId.value = options.activitiesId
  currentCommunityId.value = options.currentCommunityId

  // 延迟加载以提升用户体验
  nextTick(() => {
    loadActivities()
  })
})

onShareAppMessage(() => {
  return shareData.value
})

onPullDownRefresh(() => {
  handleRefresh()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
</script>

<template>
  <view class="activity-detail min-h-screen bg-gray-50 animate-fade-in">
    <!-- 错误状态显示 -->
    <ActivityError
      v-if="errorState.show"
      :show-error="errorState.show"
      :error-type="errorState.type"
      :error-message="errorState.message"
      :retry-count="retryCount"
      :max-retry-count="maxRetryCount"
      @retry="handleRetry"
      @refresh="handleRefresh"
      @back="handleBack"
    />

    <!-- 骨架屏显示 -->
    <ActivitySkeleton
      v-else-if="loading"
      :show="loading"
    />

    <!-- 主要内容显示 -->
    <view v-else-if="activity.title" class="content-wrapper relative mx-auto">
      <!-- 头部图片组件 -->
      <ActivityHeroImage
        :src="activity.src"
        :show-gradient="true"
        placeholder="暂无活动图片"
        @error="handleImageError"
        @load="handleImageLoad"
      />

      <!-- 活动信息组件 -->
      <view class="relative z-20 mx-4 -mt-8">
        <ActivityInfo
          :title="activity.title"
          :author="activity.userName"
          :avatar="activity.avatar"
          :start-time="activity.startTime"
          :end-time="activity.endTime"
          :status="activity.status"
          :view-count="activity.viewCount"
          :like-count="activity.likeCount"
        />
      </view>

      <!-- 活动内容组件 -->
      <view class="relative z-10 mx-4 mt-4">
        <ActivityContent
          :content="activity.context"
          :show-expand-button="true"
          :max-height="400"
        />
      </view>

      <!-- 操作按钮组件 -->
      <view class="mt-4">
        <ActivityActions
          :activity-id="activity.activitiesId"
          :activity-title="activity.title"
          :activity-image="activity.src"
          :share-path="shareData.path"
          :initial-liked="false"
          :initial-collected="false"
          :initial-registered="false"
          :initial-like-count="activity.likeCount || 0"
          :initial-collect-count="activity.collectCount || 0"
          :initial-register-count="0"
          :status="activity.status"
          :show-register-button="true"
          @update:liked="handleLikeUpdate"
          @update:collected="handleCollectUpdate"
          @update:registered="handleRegisterUpdate"
        />
      </view>

      <!-- 底部间距 -->
      <view class="h-20" />
    </view>

    <!-- 空状态 -->
    <view v-else class="min-h-screen flex items-center justify-center px-8">
      <wd-status-tip
        image="content"
        tip="暂无活动信息"
        :image-size="{ height: 200, width: 200 }"
      />
    </view>
  </view>
</template>

<style scoped>
/** 页面平滑滚动 */
.activity-detail {
  scroll-behavior: smooth;
}

/** 内容包装器基础样式 */
.content-wrapper {
  max-width: 750rpx;
}

/** 页面级淡入动画 */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/** 响应式适配 - 小屏幕 */
@media (max-width: 750rpx) {
  .content-wrapper {
    @apply px-3;
  }
}

@media (max-width: 600rpx) {
  .content-wrapper {
    @apply px-2;
  }
}

/** 横屏适配 */
@media (orientation: landscape) and (max-height: 600rpx) {
  .content-wrapper {
    @apply px-4 py-2;
  }
}

/** 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .activity-detail {
    @apply bg-gray-900;
  }
}

/** 高对比度模式 */
@media (prefers-contrast: high) {
  .activity-detail {
    @apply bg-white;
  }

  .content-wrapper {
    @apply border border-gray-800;
  }
}

/** 无障碍支持 - 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .activity-detail {
    animation: none;
  }

  .content-wrapper {
    scroll-behavior: auto;
  }
}

/** 焦点可见性增强 */
.content-wrapper:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/** 打印样式 */
@media print {
  .activity-detail {
    @apply bg-white text-black;
  }

  .content-wrapper {
    @apply px-0;
    max-width: none;
  }
}

/** 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .content-wrapper {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
}

/** 小屏幕设备适配 */
@media (max-device-width: 375px) {
  .content-wrapper {
    @apply px-2;
  }
}

/** 大屏幕设备适配 */
@media (min-device-width: 1024px) {
  .content-wrapper {
    max-width: 600rpx;
    @apply mx-auto overflow-hidden;
    box-shadow: 0 0 40rpx rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
    margin-top: 32rpx;
    margin-bottom: 32rpx;
  }
}

/** 网络状态适配 - 节省数据 */
@media (prefers-reduced-data) {
  .activity-detail {
    animation: none;
  }
}
</style>
