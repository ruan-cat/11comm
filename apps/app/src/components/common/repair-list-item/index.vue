<!--
  维修列表项组件
  功能：展示维修工单的列表项信息，包含状态、基本信息和操作按钮插槽

  功能点：
  - 展示工单基础信息（单号、类型、报修人、位置、时间）
  - 集成状态标签显示
  - 提供操作按钮插槽
  - 美观的卡片式设计
-->

<script setup lang="ts">
import type { RepairListItemProps } from './types'
import RepairStatusTag from '@/components/common/repair-status-tag/index.vue'

const props = defineProps<RepairListItemProps>()

/** 格式化预约时间 */
function formatAppointmentTime(timeStr?: string): string {
  if (!timeStr)
    return '未填写'
  try {
    const date = new Date(timeStr.replace(/-/g, '/'))
    return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  catch {
    return timeStr
  }
}

/** 显示位置信息 */
function displayLocation(item: { repairObjName?: string, address?: string }): string {
  return item.repairObjName || item.address || '未填写位置'
}

/** 显示报修人信息 */
function displayReporter(item: { repairName?: string, tel?: string }): string {
  const name = item.repairName || '未填写报修人'
  const phone = (item.tel || '').trim()
  return phone ? `${name} ${phone}` : name
}
</script>

<template>
  <view class="repair-card">
    <!-- 头部：标题与状态 -->
    <view class="card-header">
      <view class="header-left">
        <text class="title">{{ props.item.title || props.item.repairId }}</text>
        <text class="order-id">工单号：{{ props.item.repairId }}</text>
      </view>
      <RepairStatusTag :status-cd="props.item.statusCd || ''" :status-name="props.item.statusName" />
    </view>

    <!-- 内容区域 -->
    <view class="card-body">
      <!-- 报修类型 -->
      <view class="info-row">
        <view class="label-wrap">
          <wd-icon name="tools" custom-class="i-carbon-tools icon" />
          <text class="label">报修类型</text>
        </view>
        <text class="value">{{ props.item.repairTypeName || '其他维修' }}</text>
      </view>

      <!-- 报修人 -->
      <view class="info-row">
        <view class="label-wrap">
          <wd-icon name="user" custom-class="i-carbon-user icon" />
          <text class="label">报修人</text>
        </view>
        <text class="value">{{ displayReporter(props.item) }}</text>
      </view>

      <!-- 位置 -->
      <view class="info-row">
        <view class="label-wrap">
          <wd-icon name="location" custom-class="i-carbon-location icon" />
          <text class="label">位置</text>
        </view>
        <text class="value">{{ displayLocation(props.item) }}</text>
      </view>

      <!-- 预约时间 -->
      <view class="info-row">
        <view class="label-wrap">
          <wd-icon name="time" custom-class="i-carbon-time icon" />
          <text class="label">预约时间</text>
        </view>
        <text class="value">{{ formatAppointmentTime(props.item.appointmentTime || props.item.createTime) }}</text>
      </view>

      <!-- 报修内容 -->
      <view class="info-row content-row">
        <view class="label-wrap">
          <wd-icon name="document" custom-class="i-carbon-document icon" />
          <text class="label">报修内容</text>
        </view>
        <text class="value multiline">{{ props.item.context || '暂无报修内容' }}</text>
      </view>
    </view>

    <!-- 操作按钮插槽 -->
    <view v-if="$slots.action" class="card-footer">
      <slot name="action" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.repair-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
}

.order-id {
  font-size: 24rpx;
  color: #909399;
  margin-top: 6rpx;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.info-row + .info-row {
  margin-top: 16rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  line-height: 1.4;
}

.content-row {
  align-items: flex-start;
}

.label-wrap {
  display: flex;
  align-items: center;
  color: #909399;
  flex-shrink: 0;
  width: 180rpx;
}

.icon {
  font-size: 32rpx;
  color: #909399;
  margin-right: 8rpx;
}

.label {
  font-size: 28rpx;
}

.value {
  color: #303133;
  text-align: right;
  flex: 1;
  font-weight: 500;
}

.multiline {
  text-align: right;
  word-break: break-all;
  white-space: pre-wrap;
  color: #606266;
  font-weight: normal;
}

.card-footer {
  margin-top: 24rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
