<!--
  活动内容组件
  显示富文本内容，支持展开/收起功能
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

interface Props {
  /** 富文本内容 */
  content: string
  /** 最大显示高度（rpx） */
  maxHeight?: number
  /** 是否显示展开/收起按钮 */
  showExpandButton?: boolean
  /** 展开状态文字 */
  expandText?: string
  /** 收起状态文字 */
  collapseText?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxHeight: 400,
  showExpandButton: true,
  expandText: '展开全文',
  collapseText: '收起内容',
})

const toast = useGlobalToast()

/** 响应式数据 */
const isExpanded = ref<boolean>(false)
const contentHeight = ref<number>(0)

/** 计算属性 */
const isOverflow = computed(() => {
  return contentHeight.value > props.maxHeight && props.showExpandButton
})

const containerStyle = computed(() => {
  if (!isOverflow.value || isExpanded.value) {
    return {}
  }
  return {
    maxHeight: `${props.maxHeight}rpx`,
    overflow: 'hidden',
  }
})

const buttonText = computed(() => {
  return isExpanded.value ? props.collapseText : props.expandText
})

/** 方法 */
function toggleExpand() {
  isExpanded.value = !isExpanded.value

  // 滚动到内容区域
  if (isExpanded.value) {
    uni.createSelectorQuery()
      .select('.activity-content')
      .boundingClientRect((rect) => {
        const rectItem = Array.isArray(rect) ? rect[0] : rect
        if (rectItem) {
          uni.pageScrollTo({
            scrollTop: rectItem.top - 100,
            duration: 300,
          })
        }
      })
      .exec()
  }
}

function handleContentLoad() {
  // 获取内容高度
  uni.createSelectorQuery()
    .select('.content-body')
    .boundingClientRect((rect) => {
      const rectItem = Array.isArray(rect) ? rect[0] : rect
      if (rectItem) {
        contentHeight.value = Math.ceil(rectItem.height * 2) // px 转 rpx
      }
    })
    .exec()
}

function copyContent() {
  uni.setClipboardData({
    data: props.content.replace(/<[^>]*>/g, ''), // 移除HTML标签
    success: () => {
      toast.success('内容已复制')
    },
  })
}

function shareContent() {
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    href: '',
    title: '分享活动内容',
    summary: props.content.replace(/<[^>]*>/g, '').substring(0, 100),
    success: () => {
      toast.success('分享成功')
    },
    fail: () => {
      toast.error('分享失败')
    },
  })
}
</script>

<template>
  <view class="activity-content relative overflow-hidden rounded-2xl bg-white animate-slide-up">
    <!-- 内容标题栏 -->
    <view class="activity-header border-b border-gray-100 bg-gray-50 p-6 pb-4 max-sm:p-4 max-sm:pb-3">
      <view class="flex items-center justify-between">
        <view class="flex items-center">
          <view class="icon-wrapper mr-3 h-6 w-6 flex items-center justify-center rounded-lg from-blue-500 to-blue-600 bg-gradient-to-r">
            <wd-icon name="document" size="14" custom-class="i-carbon-document text-white" />
          </view>
          <text class="text-lg text-gray-900 font-semibold tracking-[0.3rpx] max-sm:text-base">活动详情</text>
        </view>

        <!-- 操作按钮 -->
        <view class="flex items-center">
          <wd-icon
            name="copy"
            size="18"
            custom-class="i-carbon-copy mr-3 text-gray-400 hover:text-blue-500 transition-all duration-200 cursor-pointer hover:scale-110"
            @click="copyContent"
          />
          <wd-icon
            name="share"
            size="18"
            custom-class="i-carbon-share text-gray-400 hover:text-blue-500 transition-all duration-200 cursor-pointer hover:scale-110"
            @click="shareContent"
          />
        </view>
      </view>
    </view>

    <!-- 内容主体 -->
    <view class="relative p-6 pt-4 max-sm:p-4 max-sm:pt-3">
      <view
        class="rich-text-content transition-all duration-300"
        :style="containerStyle"
        @load="handleContentLoad"
      >
        <rich-text
          :nodes="props.content"
          class="content-body text-base text-gray-700 leading-relaxed tracking-[0.2rpx] max-sm:text-sm"
        />
      </view>

      <!-- 展开/收起按钮 -->
      <view v-if="isOverflow" class="mt-4 text-center">
        <view
          class="expand-button inline-flex cursor-pointer items-center rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-600 font-medium transition-all duration-200 active:scale-95 hover:scale-105 hover:bg-blue-100 max-sm:px-3 max-sm:py-1.5 max-sm:text-xs"
          @click="toggleExpand"
        >
          <text class="mr-1">{{ buttonText }}</text>
          <wd-icon
            :name="isExpanded ? 'up' : 'down'"
            size="14"
            :custom-class="`i-carbon-chevron-${isExpanded ? 'up' : 'down'} transition-transform duration-200`"
          />
        </view>
      </view>

      <!-- 渐变遮罩 -->
      <view
        v-if="isOverflow && !isExpanded"
        class="gradient-mask pointer-events-none absolute bottom-0 left-0 right-0 h-20"
      />
    </view>
  </view>
</template>

<style scoped>
/** 动画定义 */
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
  animation: slideUp 0.6s ease-out 0.1s both;
}

/** 活动内容容器的阴影和边框 */
.activity-content {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.02);
}

/** 图标包装器的阴影 */
.icon-wrapper {
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.25);
}

/** 展开按钮的阴影和间距 */
.expand-button {
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  letter-spacing: 0.2rpx;
}

/** 渐变遮罩 */
.gradient-mask {
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.8), white);
}

/** Rich Text 内容样式优化 */
.rich-text-content :deep(.rich-text) {
  color: #374151;
  line-height: 1.8;
  letter-spacing: 0.2rpx;
}

.rich-text-content :deep(.rich-text img) {
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  max-width: 100%;
  height: auto;
  margin: 16rpx 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.rich-text-content :deep(.rich-text img:hover) {
  transform: scale(1.02);
}

.rich-text-content :deep(.rich-text p) {
  color: #374151;
  margin: 12rpx 0;
  line-height: 1.8;
  text-align: justify;
}

.rich-text-content :deep(.rich-text h1),
.rich-text-content :deep(.rich-text h2),
.rich-text-content :deep(.rich-text h3),
.rich-text-content :deep(.rich-text h4),
.rich-text-content :deep(.rich-text h5),
.rich-text-content :deep(.rich-text h6) {
  color: #111827;
  font-weight: 600;
  margin: 24rpx 0 16rpx 0;
}

.rich-text-content :deep(.rich-text h1) {
  font-size: 1.5rem;
}

.rich-text-content :deep(.rich-text h2) {
  font-size: 1.25rem;
}

.rich-text-content :deep(.rich-text h3) {
  font-size: 1.125rem;
}

.rich-text-content :deep(.rich-text ul),
.rich-text-content :deep(.rich-text ol) {
  padding-left: 1.5rem;
  margin: 12rpx 0;
}

.rich-text-content :deep(.rich-text li) {
  color: #374151;
  margin: 8rpx 0;
  line-height: 1.6;
}

.rich-text-content :deep(.rich-text blockquote) {
  border-left: 4px solid #3b82f6;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background-color: #eff6ff;
  border-radius: 0 0.5rem 0.5rem 0;
  color: #4b5563;
  font-style: italic;
}

.rich-text-content :deep(.rich-text strong) {
  color: #111827;
  font-weight: 600;
}

.rich-text-content :deep(.rich-text em) {
  color: #374151;
  font-style: italic;
}

.rich-text-content :deep(.rich-text a) {
  color: #2563eb;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.rich-text-content :deep(.rich-text a:hover) {
  color: #1d4ed8;
}

.rich-text-content :deep(.rich-text code) {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #1f2937;
  font-family: 'Courier New', monospace;
}

.rich-text-content :deep(.rich-text pre) {
  background-color: #111827;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.rich-text-content :deep(.rich-text pre code) {
  background-color: transparent;
  padding: 0;
}

.rich-text-content :deep(.rich-text table) {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #d1d5db;
  margin: 1rem 0;
}

.rich-text-content :deep(.rich-text th),
.rich-text-content :deep(.rich-text td) {
  border: 1px solid #d1d5db;
  padding: 0.75rem;
  text-align: left;
}

.rich-text-content :deep(.rich-text th) {
  background-color: #f3f4f6;
  font-weight: 600;
  color: #111827;
}

/** 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .animate-slide-up {
    animation: none;
  }

  .rich-text-content :deep(.rich-text img) {
    transition: none;
  }

  .rich-text-content :deep(.rich-text img:hover) {
    transform: none;
  }
}

/** 打印样式 */
@media print {
  .rich-text-content {
    max-height: none !important;
    overflow: visible !important;
  }
}
</style>
