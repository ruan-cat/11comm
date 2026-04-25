<!--
  活动详情页头部图片组件
  包含渐变遮罩、图片显示、加载状态和错误处理
-->
<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  /** 图片地址 */
  src: string
  /** 图片高度 */
  height?: string
  /** 是否显示渐变遮罩 */
  showGradient?: boolean
  /** 占位文字 */
  placeholder?: string
}

interface Emits {
  (e: 'error'): void
  (e: 'load'): void
}

const props = withDefaults(defineProps<Props>(), {
  height: '240px',
  showGradient: true,
  placeholder: '暂无活动图片',
})

const emit = defineEmits<Emits>()

/** 响应式数据 */
const showImage = ref<boolean>(true)
const isLoading = ref<boolean>(true)

/** 方法 */
function handleImageError() {
  showImage.value = false
  isLoading.value = false
  emit('error')
}

/** 预览图片 */
function handlePreviewImage() {
  // #ifdef H5
  uni.previewImage({ urls: [props.src] })
  // #endif
  // #ifndef H5
  uni.previewImage({ urls: [props.src] })
  // #endif
}

function handleImageLoad() {
  isLoading.value = false
  emit('load')
}
</script>

<template>
  <view class="hero-container relative w-full overflow-hidden" :style="{ height: props.height }">
    <!-- 渐变遮罩层 -->
    <view
      v-if="props.showGradient"
      class="pointer-events-none absolute inset-0 z-10 from-transparent via-transparent to-black/30 bg-gradient-to-b"
    />

    <!-- 加载状态 -->
    <view
      v-if="isLoading && showImage"
      class="absolute inset-0 z-20 flex items-center justify-center bg-gray-100"
    >
      <view class="text-center">
        <wd-loading size="24" />
        <text class="mt-3 text-sm text-gray-500 tracking-[0.2rpx]">加载中...</text>
      </view>
    </view>

    <!-- 活动图片 -->
    <wd-img
      v-if="showImage"
      :src="props.src"
      width="100%"
      :height="props.height"
      fit="cover"
      loading-type="skeleton"
      error-type="image"
      class="hero-image h-full w-full object-cover transition-all duration-500 ease-out sm:hover:scale-102"
      :class="{ 'opacity-0': isLoading, 'opacity-100': !isLoading }"
      @error="handleImageError"
      @load="handleImageLoad"
    />

    <!-- 图片加载失败的占位符 -->
    <view
      v-else
      class="h-full w-full flex items-center justify-center from-blue-50 to-purple-50 bg-gradient-to-br"
    >
      <view class="text-center">
        <wd-icon name="image" size="48" custom-class="i-carbon-image text-gray-400 mb-3" />
        <text class="text-sm text-gray-500 tracking-[0.2rpx]">{{ props.placeholder }}</text>
      </view>
    </view>

    <!-- 图片预览功能 -->
    <wd-icon
      v-if="showImage && !isLoading"
      name="search"
      size="20"
      custom-class="i-carbon-zoom-in absolute top-4 right-4 z-30 text-white bg-black/20 rounded-full p-2 cursor-pointer hover:bg-black/30 transition-colors"
      @click="handlePreviewImage"
    />
  </view>
</template>

<style scoped>
/** 入场动画 - 淡入缩放效果 */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(1.05);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.hero-container {
  animation: fadeInScale 0.6s ease-out;
}

/** 悬停缩放效果 - 仅在桌面端生效 */
.hero-image:hover {
  transform: scale(1.02);
}

/** 无障碍支持 - 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .hero-container {
    animation: none;
  }

  .hero-image:hover {
    transform: none;
  }
}
</style>
