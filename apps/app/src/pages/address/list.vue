<!--
  员工通讯录
  功能：搜索和查看员工联系方式

  访问地址: http://localhost:3000/#/pages/address/list

  旧代码：gitee-example/pages/addressList/addressList.vue
-->

<script setup lang="ts">
import type { Staff } from '@/types/staff'
import { computed, getCurrentInstance, nextTick, ref, watch } from 'vue'
import { useAddressList } from '@/hooks/useAddressList'

/** 页面配置 */
definePage({
  style: {
    navigationBarTitleText: '员工通讯录',
    /** 禁止页面容器整体纵向滚动，仅 scroll-view 内滚动，避免稍一滑动搜索栏被整页卷走 */
    disableScroll: true,
    enablePullDownRefresh: true,
    onReachBottomDistance: 50,
  },
})

/** ==================== 使用组合式 API ==================== */

/** 使用员工通讯录 hook，自动处理所有业务逻辑 */
const {
  /** 状态 */
  list,
  searchKeyword: name,
  hidden,
  listCurID,
  listCur,
  isLoading,
  isEmpty,
  totalStaffCount,
  onlineStaffCount,

  /** 方法 */
  loadStaffInfo,
  callPhone,
  searchStaff,

  /** 索引交互方法 */
  getCur,
  setCur,
  tMove,
  tStart,
  tEnd,
} = useAddressList({
  autoInitialize: true, /** 自动初始化所有功能 */
  immediate: true, /** 立即加载数据 */
})

/**
 * 仅当用户在索引条松手选中字母后才传入 id。
 * listCurID 为空时若传入 `indexes-`，H5 上 scroll-into-view 可能触发异常滚动，
 * 把整块页面上推，表现成「导航下留白、搜索栏像丢失了一样」。
 */
const addressScrollIntoViewId = computed((): string | undefined =>
  listCurID.value ? `indexes-${listCurID.value}` : undefined,
)

/** 当前高亮的员工行（点击行或电话图标后保持，直至列表数据变化） */
const selectedStaffKey = ref('')

/** 生成列表行选中判定的稳定键 */
function staffRowKey(staff: Staff) {
  return staff.id || `${staff.tel}:${staff.name}`
}

/** 是否当前选中的员工行 */
function isStaffRowSelected(staff: Staff) {
  return selectedStaffKey.value === staffRowKey(staff)
}

/** 根据列表滚动位置推断的当前分组字母（右侧索引游标） */
const scrollSpyInitials = ref('')

/** 最近一次 scrollTop，与 rAF 合并避免丢尾帧 */
const latestAddressScrollTop = ref(0)
let addressScrollRafId = 0
/** 忽略 SelectorQuery 乱序返回的旧回调，只应用最后一次测量 */
let scrollSpyQueryId = 0

/**
 * 根据 scrollTop 与各分组锚点位置，更新 scrollSpyInitials。
 * 使用 O_i = rect_i.top - scrollViewRect.top + scrollTop，取满足 O_i <= scrollTop 的最后一个分组。
 */
function updateScrollSpyFromScrollTop(scrollTop: number) {
  if (!list.value.length)
    return

  const myId = ++scrollSpyQueryId
  const vm = getCurrentInstance()?.proxy
  const q = vm ? uni.createSelectorQuery().in(vm) : uni.createSelectorQuery()
  q.select('.address-scroll').boundingClientRect()
  for (const g of list.value) {
    q.select(`#indexes-${g.initials}`).boundingClientRect()
  }
  q.exec((raw) => {
    if (myId !== scrollSpyQueryId)
      return
    const res = Array.isArray(raw) ? raw : []
    const sv = res[0] as { top?: number } | undefined
    if (!sv || typeof sv.top !== 'number')
      return

    let activeIdx = 0
    const st = scrollTop
    for (let i = 0; i < list.value.length; i++) {
      const r = res[i + 1] as { top?: number } | undefined
      if (!r || typeof r.top !== 'number')
        continue
      const offsetInContent = r.top - sv.top + st
      if (offsetInContent <= st + 2)
        activeIdx = i
    }
    const next = list.value[activeIdx]?.initials ?? ''
    if (next && scrollSpyInitials.value !== next)
      scrollSpyInitials.value = next
  })
}

/** scroll-view 滚动：驱动右侧字母与可视区分组同步 */
function onAddressScroll(e: { detail?: { scrollTop?: number } }) {
  latestAddressScrollTop.value = Number(e.detail?.scrollTop ?? 0)
  if (addressScrollRafId)
    return
  addressScrollRafId = requestAnimationFrame(() => {
    addressScrollRafId = 0
    updateScrollSpyFromScrollTop(latestAddressScrollTop.value)
  })
}

/**
 * 索引字母高亮：手指在索引条上时以 listCur 为准；否则以滚动推断的 scrollSpy 为准（点击索引跳转后也会随滚动对齐）。
 */
function isIndexLetterActive(initials: string) {
  if (!hidden.value && listCur.value)
    return listCur.value === initials
  return scrollSpyInitials.value === initials
}

/** 点击员工行：先标记选中再拨号 */
function onStaffRowTap(staff: Staff) {
  selectedStaffKey.value = staffRowKey(staff)
  callPhone(staff.tel)
}

/** 点击电话图标：同步选中状态 */
function onStaffPhoneTap(staff: Staff) {
  selectedStaffKey.value = staffRowKey(staff)
  callPhone(staff.tel)
}

watch(list, () => {
  selectedStaffKey.value = ''
  scrollSpyInitials.value = list.value[0]?.initials ?? ''
  void nextTick(() => {
    updateScrollSpyFromScrollTop(0)
  })
})
</script>

<template>
  <!--
    使用单滚动源：页面根节点锁定为 uni 可视区域高度（扣导航与 tabbar），仅 scroll-view 内部滚动，
    避免出现 H5/自定义 tabbar 下「页面滚动 + scroll-view」双滚动条及搜索栏被卷走的问题。
  -->
  <view class="address-page bg-gray-50">
    <!-- 搜索栏：文档流首块；勿用 sticky+top-0（在 overflow:hidden 祖先下易与导航错位、被裁切或像被盖住） -->
    <view class="address-search shrink-0 bg-white shadow-sm">
      <view class="address-search-row flex items-center justify-between px-4 py-3">
        <!-- 搜索表单：min-w-0 防止 flex 子项把输入框挤成 0 宽 -->
        <view class="mr-3 min-w-0 flex-1">
          <view class="address-search-field min-h-72rpx flex items-center rounded-full bg-gray-100 px-4 py-2">
            <wd-input
              v-model="name"
              type="text"
              confirm-type="search"
              inputmode="search"
              prefix-icon="search"
              placeholder="输入姓名或部门搜索"
              clearable
              clear-trigger="always"
              no-border
              custom-class="address-search-input min-w-0 flex-1 bg-transparent"
              custom-input-class="address-search-input-inner text-sm text-gray-800"
              @confirm="searchStaff"
            />
          </view>
        </view>
        <!-- 搜索按钮 -->
        <view class="action flex-shrink-0">
          <wd-button
            type="primary"
            size="small"
            class="rounded-full shadow-md"
            :loading="isLoading"
            @click="searchStaff"
          >
            搜索
          </wd-button>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="isLoading" class="address-loading flex shrink-0 items-center justify-center py-8">
      <wd-loading type="ring" color="#0081FF" size="20" />
      <text class="ml-2 text-gray-500">加载中...</text>
    </view>

    <!-- 主内容区域：flex-1 + min-h-0 保证子级 scroll-view 获得确定高度 -->
    <view v-else class="address-body relative min-h-0 flex flex-1 flex-col">
      <!-- 空状态 -->
      <view v-if="isEmpty" class="flex flex-col items-center justify-center py-16">
        <wd-icon name="user" size="48" color="#ccc" />
        <text class="mt-4 text-gray-400">暂无员工数据</text>
        <wd-button
          type="primary"
          size="small"
          class="mt-4"
          @click="loadStaffInfo"
        >
          重新加载
        </wd-button>
      </view>

      <!-- 滚动列表 -->
      <scroll-view
        v-else
        scroll-y
        class="address-scroll relative z-0"
        :scroll-into-view="addressScrollIntoViewId"
        :scroll-with-animation="true"
        :enable-back-to-top="true"
        @scroll="onAddressScroll"
      >
        <block v-for="(item, index) in list" :key="index">
          <view
            :id="`indexes-${item.initials}`"
            :class="`indexItem-${item.initials}`"
            :data-index="item.initials"
          >
            <!-- 字母标题 -->
            <view class="sticky top-0 z-10 bg-gray-50 px-4 py-3 text-sm text-gray-600 font-semibold">
              {{ item.initials }}
              <text class="ml-2 text-xs text-gray-400">({{ item.staffs.length }}人)</text>
            </view>
            <!-- 员工列表：默认浅底 + 选中块，避免通篇纯白无边沁 -->
            <view class="overflow-hidden rounded-none bg-gray-50">
              <!-- 单个员工项 -->
              <view
                v-for="(staff, staffIndex) in item.staffs"
                :key="staffIndex"
                class="address-staff-row flex items-center border-b border-gray-200/80 px-4 py-3 transition-colors active:opacity-90"
                :class="
                  isStaffRowSelected(staff)
                    ? 'address-staff-row--selected'
                    : 'address-staff-row--idle'
                "
                @click="onStaffRowTap(staff)"
              >
                <!-- 头像 -->
                <view class="mr-3 h-12 w-12 flex items-center justify-center rounded-full from-slate-500 to-slate-600 bg-gradient-to-br text-lg text-white font-semibold shadow-sm">
                  {{ staff.name[0] }}
                </view>
                <!-- 员工信息 -->
                <view class="flex-1">
                  <!-- 姓名 -->
                  <view class="mb-1 flex items-center text-base text-gray-800 font-medium">
                    {{ staff.name }}
                    <view
                      v-if="staff.isOnline"
                      class="ml-2 rounded-full bg-green-100 px-1.5 py-0.5 text-xs text-green-600"
                    >
                      在线
                    </view>
                  </view>
                  <!-- 部门和电话 -->
                  <view class="text-sm text-gray-500">
                    <text>{{ staff.orgName }}</text>
                    <text class="mx-1">·</text>
                    <text>{{ staff.tel }}</text>
                  </view>
                  <!-- 职位信息 -->
                  <view v-if="staff.position" class="mt-0.5 text-xs text-gray-400">
                    {{ staff.position }}
                  </view>
                </view>
                <!-- 电话按钮 -->
                <view class="action ml-4">
                  <wd-icon
                    name="phone-filled"
                    size="20"
                    color="var(--wot-color-theme, #1890ff)"
                    class="cursor-pointer text-2xl transition-transform active:scale-90"
                    @click.stop="onStaffPhoneTap(staff)"
                  />
                </view>
              </view>
            </view>
          </view>
        </block>
      </scroll-view>

      <!-- 字母索引栏：相对 address-body 绝对定位，仅占列表区域，避免 fixed+window-top 估算盖住搜索栏 -->
      <view
        v-if="list.length > 3"
        class="address-index-bar pointer-events-none absolute inset-y-0 right-0 z-20 flex items-center"
      >
        <view
          class="indexBar indexBar-box pointer-events-auto mr-2.5 w-10 border border-gray-100 rounded-xl bg-white/90 shadow-md"
          @touchstart="tStart"
          @touchend="tEnd"
          @touchmove.stop="tMove"
        >
          <view
            v-for="(item, index) in list"
            :id="index"
            :key="index"
            class="indexBar-item h-10 w-10 flex cursor-pointer items-center justify-center rounded-lg text-xs text-gray-600 font-medium transition-all duration-200"
            :class="isIndexLetterActive(item.initials) ? 'indexBar-item--active' : 'indexBar-item--idle'"
            @touchstart="getCur"
            @touchend="setCur"
          >
            {{ item.initials }}
          </view>
        </view>
      </view>

      <!-- 索引提示 -->
      <view
        v-show="!hidden"
        class="indexToast fixed left-1/2 top-1/2 z-50 h-20 w-20 transform rounded-2xl bg-black/80 text-center text-2xl text-white font-bold leading-20 shadow-2xl -translate-x-1/2 -translate-y-1/2"
      >
        {{ listCur }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/*
  员工通讯录页面样式 - Vue3 + TypeScript 版
  从 Vue2 ColorUI 架构迁移到 UnoCSS + wot-design-uni
*/

/**
 * 页面根：fixed 钉在导航栏下沿与自定义 tabBar 上沿之间，高度不依赖父级 flex/100% 是否传下去。
 * 列表只在内部 scroll-view 滚，搜索栏始终在固定层顶部，不会因整页滚动消失。
 */
.address-page {
  position: fixed;
  z-index: 1;
  box-sizing: border-box;
  left: 0;
  right: 0;
  top: var(--window-top, 0px);
  bottom: calc(50px + var(--window-bottom, 0px));
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  overflow: hidden;
  overscroll-behavior: contain;
}

.address-search {
  flex-shrink: 0;
}

/** 保证搜索行、输入框有可读高度（避免 H5/小程序上被压成一条细线） */
.address-search-row {
  min-height: 88rpx;
}

.address-search-field {
  box-sizing: border-box;
}

.address-search-input {
  display: block;
  height: 64rpx;
  line-height: 64rpx;
}

.address-body {
  position: relative;
  min-height: 0;
}

/** scroll-view 在 flex 列内占满剩余高度（单滚动源） */
.address-scroll {
  flex: 1 1 0%;
  min-height: 0;
}

/** 员工行：默认浅灰底，选中后浅主题色底，避免整列表粘在白板上 */
.address-staff-row--idle {
  background-color: rgb(249 250 251);
}

.address-staff-row--selected {
  background-color: rgb(239 246 255);
  box-shadow: inset 3px 0 0 0 var(--wot-color-theme, #1890ff);
}

/** 索引条布局由模板 inset-y-0 + flex items-center 约束，不再使用 fixed + 手写 top/高度 */

// ==================== 交互效果增强 ====================

// 索引栏项目交互（去掉强蓝 hover，去掉装饰性竖条后靠 active 类表达当前字母）
.indexBar-item {
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
}

.indexBar-item--idle {
  &:hover {
    background-color: rgb(243 244 246);
    color: rgb(55 65 81);
  }
}

.indexBar-item--active {
  background-color: rgb(239 246 255);
  color: var(--wot-color-theme, #1890ff);
  font-weight: 600;
}

// 电话按钮点击效果
.phone-button {
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.85);
  }
}

// 员工列表项交互
.staff-item {
  transition: all 0.2s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(90deg, rgba(9, 87, 222, 0.05) 0%, transparent 100%);
    transition: width 0.3s ease;
  }

  &:hover {
    background-color: rgba(249, 250, 251, 0.9);

    &::before {
      width: 4px;
    }
  }

  &:active {
    background-color: rgba(219, 234, 254, 0.8);
  }
}

// 搜索栏聚焦效果
.search-input {
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(9, 87, 222, 0.1);
    background-color: rgba(255, 255, 255, 0.95);
  }
}

// ==================== 动画效果 ====================

// 索引提示框动画
.indexToast {
  animation: indexToastAnimation 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes indexToastAnimation {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.6) rotate(-10deg);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }
}

// 列表项进入动画
.staff-item {
  animation: slideInUp 0.4s ease-out;
  animation-fill-mode: both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ==================== 特殊效果 ====================

// 在线状态徽章
.online-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

// 头像渐变背景
.avatar-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

// 加载状态呼吸效果
.loading-breath {
  animation: breath 1.5s ease-in-out infinite;
}

@keyframes breath {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

// ==================== 响应式适配 ====================

// 小屏幕适配
@media (max-width: 750rpx) {
  .indexBar-box {
    width: 28px;
    margin-right: 6px;
  }

  .indexBar-item {
    width: 28px;
    height: 28px;
    font-size: 10px;
    border-radius: 6px;
  }

  .indexToast {
    width: 56px;
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    border-radius: 12px;
  }

  .avatar-gradient {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}

// 大屏幕适配
@media (min-width: 1200rpx) {
  .indexBar-box {
    width: 48px;
    margin-right: 12px;
  }

  .indexBar-item {
    width: 48px;
    height: 48px;
    font-size: 14px;
    border-radius: 12px;
  }

  .indexToast {
    width: 80px;
    height: 80px;
    line-height: 80px;
    font-size: 24px;
  }
}

// ==================== 深色模式支持 ====================

@media (prefers-color-scheme: dark) {
  .indexBar-box {
    background-color: rgba(37, 37, 37, 0.9);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .indexBar-item--idle {
    color: rgba(255, 255, 255, 0.8);

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }
  }

  .indexBar-item--active {
    background-color: rgba(59, 130, 246, 0.22);
    color: rgb(191 219 254);
  }

  .address-staff-row--idle {
    background-color: rgba(255, 255, 255, 0.06);
  }

  .address-staff-row--selected {
    background-color: rgba(59, 130, 246, 0.18);
    box-shadow: inset 3px 0 0 0 rgb(96 165 250);
  }

  .staff-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

// ==================== 可访问性优化 ====================

// 高对比度模式
@media (prefers-contrast: high) {
  .indexBar-item {
    border: 1px solid currentColor;
  }

  .staff-item {
    border-bottom-width: 2px;
  }
}

// 减少动画偏好 - 使用具体选择器替代 * 以兼容微信小程序
@media (prefers-reduced-motion: reduce) {
  view,
  text,
  image,
  button,
  navigator {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
