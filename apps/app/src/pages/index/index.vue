<!--
  首页
  功能：作为物业业务首页，聚合重点待办与常用业务入口

  访问地址: http://localhost:3000/#/pages/index/index

  旧代码：gitee-example/pages/index/index.vue
-->

<script setup lang="ts">
import type { HomeMenuEntry } from './home-menu-config'
import type { MenuSurfaceTheme } from '@/pages/work-dashboard/menu-surface-theme'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getSurfaceThemeVars, resolveSurfaceTheme } from '@/pages/work-dashboard/menu-surface-theme'
import { createWorkbenchMenuNavigators } from '@/pages/work-dashboard/navigation'
import { TypedRouter } from '@/router'
import { getCurrentCommunity, getUserInfo } from '@/utils/user'
import { homeFeaturedEntries, homeHeaderSubtitle, homeSections } from './home-menu-config'

definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
    backgroundColor: '#F5F7FB',
  },
})

const toast = useGlobalToast()
const currentCommunity = getCurrentCommunity()
const currentUser = getUserInfo()

/** 构建首页 iconify 图标类名 */
function getEntryIconClass(entry: HomeMenuEntry, size: 'feature' | 'grid') {
  const sizeClass = size === 'feature'
    ? 'w-44rpx h-44rpx text-44rpx'
    : 'w-36rpx h-36rpx text-36rpx'

  return `${entry.icon} ${entry.iconClass} ${sizeClass} flex items-center justify-center flex-shrink-0`
}

/** 构建首页静态图标尺寸类名 */
function getEntryImageClass(size: 'feature' | 'grid') {
  return size === 'feature'
    ? 'w-52rpx h-52rpx flex-shrink-0'
    : 'w-42rpx h-42rpx flex-shrink-0'
}

/** 构建首页图标容器背景类名 */
function getEntryShellClass(entry: HomeMenuEntry) {
  return entry.iconImage ? '' : entry.bgClass
}

/** 获取当前小区 ID */
function getCurrentCommunityId() {
  return currentCommunity.communityId
}

/** 首页入口导航映射 */
const homeMenuNavigators = createWorkbenchMenuNavigators({
  toActivityList: () => TypedRouter.toActivityList(),
  toAllocationAudit: () => TypedRouter.toAllocationAudit(),
  toAllocationManage: () => TypedRouter.toAllocationManage(),
  toAppointment: () => TypedRouter.toAppointment(),
  toApplyRoomList: () => TypedRouter.toApplyRoomList(),
  toBarrierGate: () => TypedRouter.toBarrierGate(),
  toChargeMachineOrder: () => TypedRouter.toChargeMachineOrder(),
  toComplaintFinish: () => TypedRouter.toComplaintFinish(),
  toComplaintList: () => TypedRouter.toComplaintList(),
  toComplaintOrder: () => TypedRouter.toComplaintOrder(),
  toDataReport: () => TypedRouter.toDataReport(),
  toFeeRoomPay: () => TypedRouter.toFeeRoomPay({ communityId: getCurrentCommunityId() }),
  toFeeSummary: () => TypedRouter.toFeeSummary(),
  toInspectionTaskList: () => TypedRouter.toInspectionTaskList(),
  toItemOutAudit: () => TypedRouter.toItemOutAudit(),
  toItemOutManage: () => TypedRouter.toItemOutManage(),
  toItemRelease: () => TypedRouter.toItemRelease(),
  toMaintenanceTaskList: () => TypedRouter.toMaintenanceTaskList(),
  toMeterReading: () => TypedRouter.toMeterReading(),
  toNoticeList: () => TypedRouter.toNoticeList(),
  toOaWorkflow: () => TypedRouter.toOaWorkflow(),
  toOpenDoorLog: () => TypedRouter.toOpenDoorLog(),
  toOwnerCar: () => TypedRouter.toOwnerCar(),
  toOwnerList: () => TypedRouter.toOwnerList(),
  toPayFeeDetail: () => TypedRouter.toPayFeeDetail(),
  toPropertyRenovation: () => TypedRouter.toPropertyRenovation(),
  toPurchaseApplyAudit: () => TypedRouter.toPurchaseApplyAudit(),
  toPurchaseApplyManage: () => TypedRouter.toPurchaseApplyManage(),
  toRepairDispatch: () => TypedRouter.toRepairDispatch(),
  toRepairFinish: () => TypedRouter.toRepairFinish(),
  toRepairList: () => TypedRouter.toRepairList(),
  toResourceStoreManage: () => TypedRouter.toResourceStoreManage(),
  toRoomFeeReport: () => TypedRouter.toRoomFeeReport(),
  toVisitList: () => TypedRouter.toVisitList(),
  toWorkCopy: () => TypedRouter.toWorkCopy(),
  toWorkDo: () => TypedRouter.toWorkDo(),
  toWorkStart: () => TypedRouter.toWorkStart(),
  toWriteOffCoupon: () => TypedRouter.toWriteOffCoupon(),
  toWriteOffReserve: () => TypedRouter.toWriteOffReserve(),
  toAddRepair: () => TypedRouter.toAddRepair(getCurrentCommunityId()),
})

/** 处理首页入口点击 */
function handleEntryClick(entry: HomeMenuEntry) {
  const navigate = homeMenuNavigators[entry.navigationKey]

  if (!navigate) {
    toast.warning('暂未配置对应入口')
    return
  }

  navigate()
}

/** 获取重点待办卡片的渐变底色 */
function getFeaturedCardStyle(entry: HomeMenuEntry) {
  return getSurfaceThemeVars(resolveSurfaceTheme(entry.iconClass))
}

/** 获取分区卡片的渐变底色 */
function getSectionCardStyle(sectionId: string) {
  const sectionThemeMap: Record<string, MenuSurfaceTheme> = {
    quick: 'blue',
    repair: 'cyan',
    work: 'green',
  }

  return getSurfaceThemeVars(sectionThemeMap[sectionId] ?? 'blue')
}

/** 获取首页分区标题图标 */
function getSectionTitleIcon(sectionId: string) {
  const sectionIconMap: Record<string, string> = {
    quick: 'i-carbon-grid',
    repair: 'i-carbon-tools',
    work: 'i-carbon-flow-data',
  }

  return sectionIconMap[sectionId] ?? 'i-carbon-grid'
}

/** 获取首页分区标题图标颜色 */
function getSectionTitleIconClass(sectionId: string) {
  const sectionIconClassMap: Record<string, string> = {
    quick: 'text-colorui-blue',
    repair: 'text-colorui-cyan',
    work: 'text-colorui-green',
  }

  return sectionIconClassMap[sectionId] ?? 'text-colorui-blue'
}
</script>

<template>
  <view class="home-page">
    <view class="home-header">
      <view class="home-shell">
        <view class="header-panel">
          <view class="header-bar">
            <view class="brand-block">
              <view class="brand-icon-shell">
                <view class="i-carbon-building text-white text-36rpx" />
              </view>

              <view class="brand-copy">
                <text class="brand-title">{{ currentCommunity.communityName || homeHeaderSubtitle }}</text>
                <text class="brand-subtitle">{{ currentUser.userName }}</text>
              </view>
            </view>

            <view class="user-chip">
              <view class="i-carbon-user-avatar text-white text-24rpx" />
              <text class="user-chip-text">{{ currentUser.userName }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="home-content">
      <view class="home-shell">
        <view class="section-card priority-card" :style="getSectionCardStyle('quick')">
          <FormSectionTitle
            title="重点待办"
            icon="i-carbon-flash"
            icon-class="text-colorui-blue"
            background="transparent"
          />

          <view class="featured-grid">
            <view
              v-for="entry in homeFeaturedEntries"
              :key="entry.id"
              class="featured-card"
              :style="getFeaturedCardStyle(entry)"
              @click="handleEntryClick(entry)"
            >
              <view class="featured-card-top">
                <view class="featured-icon-shell" :class="getEntryShellClass(entry)">
                  <image
                    v-if="entry.iconImage"
                    :src="entry.iconImage"
                    mode="aspectFit"
                    :class="getEntryImageClass('feature')"
                  />
                  <view v-else :class="getEntryIconClass(entry, 'feature')" />
                </view>

                <view class="featured-arrow">
                  <view class="i-carbon-arrow-up-right text-blue-500 text-20rpx" />
                </view>
              </view>

              <view class="featured-copy">
                <text class="featured-title">{{ entry.name }}</text>
                <text v-if="entry.meta" class="featured-meta">{{ entry.meta }}</text>
              </view>
            </view>
          </view>
        </view>

        <view
          v-for="section in homeSections"
          :key="section.id"
          class="section-card"
          :style="getSectionCardStyle(section.id)"
        >
          <FormSectionTitle
            :title="section.title"
            :icon="getSectionTitleIcon(section.id)"
            :icon-class="getSectionTitleIconClass(section.id)"
            background="transparent"
          />

          <view class="section-body">
            <view class="entry-grid" :class="`entry-grid-${section.columns}`">
              <view
                v-for="entry in section.entries"
                :key="entry.id"
                class="entry-item"
                @click="handleEntryClick(entry)"
              >
                <view class="entry-icon-shell" :class="getEntryShellClass(entry)">
                  <image
                    v-if="entry.iconImage"
                    :src="entry.iconImage"
                    mode="aspectFit"
                    :class="getEntryImageClass('grid')"
                  />
                  <view v-else :class="getEntryIconClass(entry, 'grid')" />
                </view>
                <text class="entry-name">{{ entry.name }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.home-page {
  min-height: 100%;
  padding-bottom: calc(28rpx + var(--window-bottom, 0px));
  background: linear-gradient(180deg, #eef4ff 0%, #f6f8fc 42%, #f8fafc 100%);
}

.home-shell {
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
}

.home-header {
  padding: calc(18rpx + var(--status-bar-height, 0px)) 24rpx 92rpx;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.14), transparent 30%),
    linear-gradient(135deg, #2576f8 0%, #40a2ff 52%, #4fc3c8 100%);
}

.header-panel {
  position: relative;
  overflow: hidden;
  padding: 26rpx 28rpx 30rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.14);
  border-radius: 34rpx;
  background: linear-gradient(145deg, rgba(18, 78, 179, 0.2), rgba(255, 255, 255, 0.12));
  box-shadow: 0 24rpx 50rpx rgba(16, 54, 125, 0.18);
}

.header-panel::after {
  content: '';
  position: absolute;
  top: -60rpx;
  right: -10rpx;
  width: 220rpx;
  height: 220rpx;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent 68%);
  pointer-events: none;
}

.header-bar,
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-block {
  display: flex;
  align-items: center;
  min-width: 0;
}

.brand-icon-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 22rpx;
  flex-shrink: 0;
  margin-right: 18rpx;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-title {
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.2;
}

.brand-subtitle {
  display: block;
  margin-top: 6rpx;
  color: rgba(255, 255, 255, 0.74);
  font-size: 22rpx;
  line-height: 1.2;
}

.user-chip {
  display: inline-flex;
  align-items: center;
  padding: 12rpx 18rpx;
  color: #fff;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 9999rpx;
  flex-shrink: 0;
}

.user-chip .i-carbon-user-avatar {
  margin-right: 8rpx;
}

.user-chip-text {
  max-width: 160rpx;
  font-size: 22rpx;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-content {
  margin-top: -54rpx;
  padding: 0 24rpx 24rpx;
}

.featured-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 9rpx;
}

.section-card {
  position: relative;
  overflow: hidden;
  border-radius: 28rpx;
  background: linear-gradient(135deg, var(--surface-start) 0%, var(--surface-end) 100%);
  border: 2rpx solid var(--surface-border);
  box-shadow: 0 18rpx 44rpx var(--surface-shadow);
}

.section-card::after {
  content: '';
  position: absolute;
  inset: auto -80rpx -120rpx auto;
  width: 260rpx;
  height: 260rpx;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.18), transparent 70%);
  pointer-events: none;
}

.priority-card {
  margin-bottom: 20rpx;
}

.section-card + .section-card {
  margin-top: 18rpx;
}

.featured-card,
.entry-item {
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}

.featured-card:active,
.entry-item:active {
  opacity: 0.86;
  transform: scale(0.985);
}

.featured-card {
  position: relative;
  width: calc(50% - 18rpx);
  min-height: 188rpx;
  margin: 9rpx;
  padding: 22rpx 22rpx 18rpx;
  background: linear-gradient(180deg, var(--tile-start) 0%, var(--tile-end) 100%);
  border: 2rpx solid var(--tile-border);
  border-radius: 24rpx;
  box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.06);
}

.featured-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.featured-icon-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 84rpx;
  height: 84rpx;
  border-radius: 24rpx;
}

.featured-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44rpx;
  height: 44rpx;
  margin-left: 10rpx;
  background: rgba(255, 255, 255, 0.82);
  border-radius: 14rpx;
}

.featured-copy {
  display: flex;
  flex-direction: column;
  margin-top: 10rpx;
}

.featured-title {
  color: #16233b;
  font-size: 32rpx;
  font-weight: 800;
  line-height: 1.28;
}

.featured-meta {
  display: block;
  margin-top: 4rpx;
  color: #72819a;
  font-size: 22rpx;
  line-height: 1.3;
}

.section-body {
  padding: 18rpx;
}

.entry-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -5rpx;
}

.entry-grid-4 .entry-item {
  width: calc(25% - 10rpx);
  margin: 5rpx;
}

.entry-grid-3 .entry-item {
  width: calc(33.3333% - 10rpx);
  margin: 5rpx;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18rpx 10rpx 16rpx;
  background: linear-gradient(180deg, var(--tile-start) 0%, var(--tile-end) 100%);
  border: 2rpx solid var(--tile-border);
  box-shadow: 0 8rpx 18rpx rgba(15, 23, 42, 0.05);
  border-radius: 22rpx;
}

.entry-icon-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 74rpx;
  height: 74rpx;
  margin-bottom: 10rpx;
  border-radius: 22rpx;
}

.entry-name {
  color: #42506a;
  font-size: 22rpx;
  font-weight: 500;
  line-height: 1.35;
  text-align: center;
}
</style>
