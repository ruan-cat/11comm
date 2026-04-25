<!--
  活动详情页骨架屏组件
  使用 wot-design-uni 的 wd-skeleton 组件
  精确模拟活动详情页的结构和布局
-->
<script setup lang="ts">
interface Props {
  /** 是否显示 */
  show: boolean
}

defineProps<Props>()
</script>

<template>
  <view v-if="show" class="min-h-screen bg-gray-50 animate-fade-in">
    <view class="relative mx-auto">
      <!-- 头部图片骨架 -->
      <view class="h-60 w-full">
        <wd-skeleton :row-num="1" row-height="240px" animation="flashed" />
      </view>

      <!-- 活动信息卡片骨架 -->
      <view class="relative z-20 mx-4 rounded-2xl bg-white p-6 shadow-lg -mt-8 max-sm:p-4">
        <!-- 标题和状态标签 -->
        <view class="mb-4">
          <wd-skeleton :row-num="1" row-width="80%" row-height="32px" animation="flashed" />
          <view class="mt-2">
            <wd-skeleton :row-num="1" row-width="80px" row-height="24px" animation="flashed" />
          </view>
        </view>

        <!-- 发布者信息 -->
        <view class="flex items-center border-b border-gray-50 py-3">
          <wd-skeleton avatar animation="flashed" />
          <view class="ml-3 flex-1">
            <wd-skeleton :row-num="2" :row-width="['60%', '40%']" animation="flashed" />
          </view>
          <wd-skeleton :row-num="1" row-width="16px" row-height="16px" animation="flashed" />
        </view>

        <!-- 时间信息 -->
        <view class="flex items-center border-b border-gray-50 py-3">
          <wd-skeleton avatar animation="flashed" />
          <view class="ml-3 flex-1">
            <wd-skeleton :row-num="2" :row-width="['60%', '40%']" animation="flashed" />
          </view>
          <wd-skeleton :row-num="1" row-width="16px" row-height="16px" animation="flashed" />
        </view>

        <!-- 统计信息 -->
        <view class="flex items-center py-3">
          <wd-skeleton avatar animation="flashed" />
          <view class="activity-skeleton-stats ml-3 flex flex-1 items-center max-sm:flex-col max-sm:items-start">
            <wd-skeleton class="activity-skeleton-stat-item" :row-num="1" row-width="80px" animation="flashed" />
            <wd-skeleton class="activity-skeleton-stat-item" :row-num="1" row-width="80px" animation="flashed" />
          </view>
        </view>
      </view>

      <!-- 内容卡片骨架 -->
      <view class="relative z-10 mx-4 mt-4 rounded-2xl bg-white shadow-sm">
        <!-- 内容标题栏 -->
        <view class="border-b border-gray-100 bg-gray-50 p-6 pb-4 max-sm:p-4 max-sm:pb-3">
          <view class="flex items-center justify-between">
            <view class="flex items-center">
              <wd-skeleton avatar avatar-size="24px" animation="flashed" />
              <view class="ml-3">
                <wd-skeleton :row-num="1" row-width="80px" animation="flashed" />
              </view>
            </view>
            <view class="activity-skeleton-actions flex items-center">
              <wd-skeleton class="activity-skeleton-action-item" :row-num="1" row-width="18px" row-height="18px" animation="flashed" />
              <wd-skeleton class="activity-skeleton-action-item" :row-num="1" row-width="18px" row-height="18px" animation="flashed" />
            </view>
          </view>
        </view>

        <!-- 内容主体 -->
        <view class="p-6 pt-4 max-sm:p-4 max-sm:pt-3">
          <wd-skeleton :row-num="6" :row-width="['100%', '95%', '80%', '100%', '90%', '60%']" animation="flashed" />
        </view>
      </view>

      <!-- 操作按钮骨架 -->
      <view class="mt-4">
        <view class="mx-4">
          <wd-skeleton :row-num="1" row-height="48px" animation="flashed" />
        </view>
      </view>

      <!-- 底部间距 -->
      <view class="h-20" />
    </view>
  </view>
</template>

<style scoped>
.activity-skeleton-stats {
  flex-wrap: wrap;
  margin: -12rpx -24rpx;
}

.activity-skeleton-stat-item {
  margin: 12rpx 24rpx;
}

.activity-skeleton-action-item + .activity-skeleton-action-item {
  margin-left: 12rpx;
}

@media (max-width: 640px) {
  .activity-skeleton-stats {
    margin: -8rpx 0;
  }

  .activity-skeleton-stat-item {
    margin: 8rpx 0;
  }
}
</style>
