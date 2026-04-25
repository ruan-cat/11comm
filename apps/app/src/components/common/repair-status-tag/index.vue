<!--
  维修状态标签组件
  功能：显示维修工单状态标签，支持状态样式和丝绸呼吸动效

  功能点：
  - 统一管理维修状态标签的样式
  - 支持 5 种状态：待派单、已派单、处理中、已完成、已取消
  - 处理中状态支持丝绸呼吸动效
  - 做好向后的抽象扩展，可随时为其他状态增加动效
-->
<script setup lang="ts">
import type { RepairStatusTagProps } from './types'
import { computed } from 'vue'
import { REPAIR_STATUS_CONFIG_MAP } from './types'

const props = withDefaults(defineProps<RepairStatusTagProps>(), {
  statusName: '',
  animated: true,
  plain: true,
})

/** 当前状态配置 */
const config = computed(() => REPAIR_STATUS_CONFIG_MAP[props.statusCd] || REPAIR_STATUS_CONFIG_MAP['10001'])

/** 显示文本 */
const displayText = computed(() => {
  if (props.statusName?.trim())
    return props.statusName
  return config.value.statusName
})

/** 是否显示动效 */
const shouldAnimate = computed(() => {
  if (!props.animated)
    return false
  return config.value.animated || false
})

/** 状态样式类 */
const statusClass = computed(() => {
  switch (config.value.tagType) {
    case 'warning':
      return 'status-warning'
    case 'success':
      return 'status-success'
    case 'danger':
      return 'status-danger'
    case 'info':
      return 'status-info'
    default:
      return 'status-primary'
  }
})
</script>

<template>
  <view class="status-tag" :class="[statusClass]">
    <!-- 处理中状态：丝绸动效 -->
    <template v-if="shouldAnimate">
      <!-- 丝绸褶皱层：深浅蓝色交替流动 -->
      <view class="silk-folds" />
      <!-- 丝绸高光层：白色光带流转 -->
      <view class="silk-sheen" />
    </template>

    <text class="tag-text">{{ displayText }}</text>
  </view>
</template>

<style lang="scss" scoped>
// 统一尺寸
.status-tag {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 128rpx;
  height: 48rpx;
  border-radius: 8rpx;
  overflow: hidden;
  vertical-align: middle;
  box-sizing: border-box;
}

.tag-text {
  position: relative;
  z-index: 10;
  font-size: 28rpx;
  line-height: 1;
  font-weight: 500;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

// 待派单 - 暖橙色（警示色，代表等待关注）
.status-warning {
  background-color: #ff9900;
  color: #ffffff;
}

// 已派单 - 青蓝色（清新独立，区别于处理中）
.status-info {
  background-color: #06b6d4;
  color: #ffffff;
}

// 处理中 - 纯正蓝色（去除紫色调，更有活力）
.status-primary {
  background-color: #3b82f6;
  color: #ffffff;
}

// 已完成 - 鲜绿色（代表成功完成）
.status-success {
  background-color: #52c41a;
  color: #ffffff;
}

// 已取消 - 中灰色（实心高对比度，低调但清晰）
.status-danger {
  background-color: #9ca3af;
  color: #ffffff;
}

// ==================== 丝绸动效 ====================

// 丝绸褶皱层：纯蓝色深浅交替，模拟布料纹理（基于 #3b82f6 调整）
.silk-folds {
  position: absolute;
  inset: 0;
  width: 200%;
  height: 100%;
  z-index: 1;
  background: repeating-linear-gradient(115deg, #3b82f6 0%, #60a5fa 15%, #3b82f6 30%, #2563eb 45%, #3b82f6 60%);
  background-size: 50% 100%;
  animation: folds-flow 4s linear infinite;
}

// 丝绸高光层：半透明白色光带
.silk-sheen {
  position: absolute;
  inset: 0;
  width: 200%;
  height: 100%;
  z-index: 2;
  background: linear-gradient(
    115deg,
    transparent 20%,
    rgba(255, 255, 255, 0.12) 35%,
    rgba(255, 255, 255, 0.35) 50%,
    rgba(255, 255, 255, 0.12) 65%,
    transparent 80%
  );
  opacity: 0.9;
  animation: sheen-flow 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

// 褶皱层匀速流动
@keyframes folds-flow {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0%);
  }
}

// 高光层变速流动，产生丝绸飘动感
@keyframes sheen-flow {
  0% {
    transform: translateX(-100%) skewX(-10deg);
  }
  50% {
    transform: translateX(-20%) skewX(-20deg);
  }
  100% {
    transform: translateX(50%) skewX(-10deg);
  }
}
</style>
