<!--
  z-paging 加载等待组件
  专用于 z-paging 组件的 #loading 插槽，提供统一的加载样式

  功能：
  - 展示加载动画
  - 支持自定义图标和颜色
  - 支持自定义文案
  - 支持动画效果
-->

<script setup lang="ts">
import type { ZPagingLoadingProps } from './types'

const props = withDefaults(defineProps<ZPagingLoadingProps>(), {
  icon: 'loading',
  iconClass: 'i-carbon-circle-dash text-blue-400 animate-pulse',
  iconSize: '20px',
  loadingSize: '32px',
  loadingType: 'ring',
  primaryText: '正在加载数据...',
  secondaryText: '请稍候片刻',
})
</script>

<template>
  <view class="flex items-center justify-center p-6">
    <view class="flex flex-col items-center">
      <!-- 增强的加载动画 -->
      <view class="relative mb-3">
        <wd-loading :type="loadingType" :size="loadingSize" />
        <!-- 装饰性图标元素 -->
        <view class="absolute inset-0 flex items-center justify-center">
          <wd-icon :name="icon" :custom-class="iconClass" :size="iconSize" />
        </view>
      </view>

      <!-- 动态加载文案 -->
      <text class="animate-pulse text-sm text-gray-600 font-medium">
        {{ primaryText }}
      </text>

      <!-- 加载提示 -->
      <text class="mt-1 text-xs text-gray-400">
        {{ secondaryText }}
      </text>
    </view>
  </view>
</template>
