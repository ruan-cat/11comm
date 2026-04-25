<!--
  表单分区标题组件
  用于表单页面的分区标题，提供统一美观的标题样式

  功能：
  - 提供统一的标题样式
  - 支持呼吸动效
  - 支持图标和必填标记
  - 支持 wot-design-uni 内置图标和 UnoCSS Iconify 图标
  - 支持透明背景模式，适配渐变卡片场景
-->

<script setup lang="ts">
import type { FormSectionTitleProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<FormSectionTitleProps>(), {
  background: 'default',
  required: false,
  animated: true,
  icon: '',
  iconClass: '',
  subtitle: '',
})

/** 判断是否为 Iconify 图标 */
const isIconifyIcon = computed(() => props.icon.startsWith('i-'))

/** 组件根样式变量 */
const sectionTitleStyle = computed(() => {
  if (props.background === 'transparent') {
    return {
      '--form-section-title-bg': 'transparent',
      '--form-section-title-overlay': 'transparent',
      'background': 'transparent',
      'backgroundColor': 'transparent',
      'backgroundImage': 'none',
    }
  }

  return {
    '--form-section-title-bg': 'linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%)',
    '--form-section-title-overlay': 'linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)',
  }
})
</script>

<template>
  <wd-cell custom-class="form-section-title-cell" :style="sectionTitleStyle">
    <template #title>
      <view class="form-section-title-content">
        <view
          class="form-section-title-accent h-4 w-1 flex-shrink-0 rounded-full"
          :class="animated ? 'animate-pulse bg-gradient-to-b from-blue-400 to-blue-600' : 'bg-blue-500'"
        />

        <view
          v-if="icon && isIconifyIcon"
          :class="[icon, iconClass || 'text-blue-500']"
          class="form-section-title-icon flex-shrink-0 text-lg"
        />
        <wd-icon
          v-else-if="icon"
          :name="icon"
          :custom-class="`${iconClass || 'text-blue-500'} form-section-title-icon`"
          size="18px"
          custom-style="flex-shrink: 0;"
        />

        <view class="form-section-title-main">
          <text
            class="whitespace-nowrap text-base font-semibold"
            :class="animated ? 'text-gray-800' : 'text-gray-700'"
          >
            {{ title }}
          </text>
          <text v-if="required" class="text-base text-red-500">*</text>
        </view>

        <text v-if="subtitle" class="form-section-title-subtitle overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
          {{ subtitle }}
        </text>
      </view>
    </template>
  </wd-cell>
</template>

<style scoped>
.form-section-title-content {
  display: flex;
  align-items: center;
}

.form-section-title-accent,
.form-section-title-icon {
  margin-right: 8rpx;
}

.form-section-title-main {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.form-section-title-main text + text {
  margin-left: 4rpx;
}

.form-section-title-subtitle {
  flex: 1;
  min-width: 0;
  margin-left: 8rpx;
}

:deep(.form-section-title-cell) {
  background: var(--form-section-title-bg);
  padding: 12px 16px;
  margin-bottom: 2px;
  border-radius: 0;
}

@keyframes breathe {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

:deep(.form-section-title-cell)::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--form-section-title-overlay);
  animation: breathe 3s ease-in-out infinite;
  pointer-events: none;
}
</style>
