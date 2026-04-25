<!--
  选择楼栋页面
  功能：选择楼栋，支持搜索和分页加载

  访问方式: TypedRouter.toSelectFloor()
  访问地址: http://localhost:3000/#/pages-sub/selector/select-floor
  参数: 无

  完整示例: http://localhost:3000/#/pages-sub/selector/select-floor

  级联选择流程:
    1. 选择楼栋 (当前页面) → 无参数
    2. 选择单元 → 需要 floorId
    3. 选择房屋 → 需要 floorId + unitId

  旧代码：gitee-example/pages/selectFloor/selectFloor.vue
-->

<!-- 基本完成检查审核 -->

<script setup lang="ts">
import type { Floor } from '@/types/selector'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, ref, watch } from 'vue'
import { getFloorList } from '@/api/floor'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { useSelectorStore } from '@/stores/useSelectorStore'

definePage({
  name: 'select-floor',
  style: {
    navigationBarTitleText: '选择楼栋',
  },
})

const selectorStore = useSelectorStore()
const toast = useGlobalToast()

// z-paging ref
const pagingRef = ref()

// 搜索关键词
const searchValue = ref('')

// 搜索历史记录
const searchHistory = ref<string[]>([])

// 是否显示搜索历史
const showSearchHistory = ref(false)

// 是否正在搜索
const isSearching = ref(false)

// 搜索防抖定时器
const searchTimer = ref<NodeJS.Timeout>()

// 楼栋列表
const floorList = ref<Floor[]>([])

// 选中项
const selectedFloorId = ref<string>('')

// 社区ID（实际应从登录信息获取）
const communityId = ref('COMM_001')

// 分页参数
const currentPage = ref(1)
const pageSize = ref(50)

/**
 * 使用 useRequest 管理楼栋列表请求
 * 🔴 强制规范：必须设置 immediate: false，由 z-paging 控制请求时机
 * 🔴 强制规范：使用链式回调写法
 */
const {
  loading,
  send: loadFloorData,
} = useRequest(
  (params: { page: number, row: number, floorNum?: string }) =>
    getFloorList({
      communityId: communityId.value,
      ...params,
    }),
  {
    immediate: false,
  },
)
  .onSuccess((event) => {
    const result = event.data
    pagingRef.value?.complete(result?.list || [])
  })
  .onError((error) => {
    console.error('获取楼栋列表失败:', error)
    pagingRef.value?.complete(false)
  })

/**
 * z-paging 的 @query 回调
 * @description 接收分页参数，触发请求（不使用 await/try-catch）
 */
function handleQuery(pageNo: number, pageSizeValue: number) {
  currentPage.value = pageNo
  pageSize.value = pageSizeValue

  loadFloorData({
    page: pageNo,
    row: pageSizeValue,
    floorNum: searchValue.value?.trim() || undefined,
  })
}

/** 选择楼栋 */
function handleSelectFloor(floor: Floor) {
  if (!floor.floorId || !floor.floorNum) {
    toast.error('楼栋信息不完整')
    return
  }

  // 设置选中状态
  selectedFloorId.value = floor.floorId

  // 添加触觉反馈
  uni.vibrateShort({
    type: 'light',
    fail: () => {}, // 忽略振动失败
  })

  selectorStore.selectFloor(floor)

  toast.success({
    msg: `已选择 ${floor.floorNum}栋`,
    duration: 1200,
  })

  // 延迟返回以便用户看到成功提示
  setTimeout(() => {
    uni.navigateBack({
      fail: () => {
        toast.error('返回失败')
      },
    })
  }, 1200)
}

/** 实时搜索处理 */
function handleRealTimeSearch() {
  // 清除之前的定时器
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }

  // 如果搜索内容为空，隐藏搜索历史
  if (!searchValue.value?.trim()) {
    showSearchHistory.value = false
    isSearching.value = false
    return
  }

  isSearching.value = true

  // 防抖处理，500ms后执行搜索
  searchTimer.value = setTimeout(() => {
    executeSearch()
  }, 500)
}

/** 执行搜索 */
function executeSearch() {
  // 清理搜索关键词
  const trimmedSearch = searchValue.value?.trim() || ''

  if (!trimmedSearch) {
    return
  }

  // 添加到搜索历史
  addToSearchHistory(trimmedSearch)

  // 重置到第一页
  currentPage.value = 1
  isSearching.value = false

  // 触发 z-paging 重新加载数据
  pagingRef.value?.reload()
}

/** 搜索处理（点击搜索按钮） */
function handleSearch() {
  executeSearch()
}

/** 添加到搜索历史 */
function addToSearchHistory(keyword: string) {
  // 去除重复项
  const history = searchHistory.value.filter(item => item !== keyword)

  // 添加到最前面
  history.unshift(keyword)

  // 限制历史记录数量
  if (history.length > 10) {
    history.splice(10)
  }

  searchHistory.value = history

  // 保存到本地存储
  uni.setStorageSync('floor_search_history', history)
}

/** 清空搜索历史 */
function clearSearchHistory() {
  searchHistory.value = []
  uni.removeStorageSync('floor_search_history')
  toast.info('搜索历史已清空')
}

/** 从搜索历史选择 */
function selectHistoryItem(keyword: string) {
  searchValue.value = keyword
  executeSearch()
}

/** 清空搜索 */
function handleClearSearch() {
  searchValue.value = ''
  showSearchHistory.value = false
  isSearching.value = false
  currentPage.value = 1
  pagingRef.value?.reload()
}

/** 聚焦搜索框 */
function handleSearchFocus() {
  if (searchHistory.value.length > 0) {
    showSearchHistory.value = true
  }
}

/** 失焦搜索框 */
function handleSearchBlur() {
  // 延迟隐藏搜索历史，以便用户可以点击历史项
  setTimeout(() => {
    showSearchHistory.value = false
  }, 200)
}

/** 下拉刷新 */
function handleRefresh() {
  currentPage.value = 1
  pagingRef.value?.refresh()
}

/** 重试加载数据 */
function handleRetry() {
  currentPage.value = 1
  pagingRef.value?.reload()
}

// 页面加载时获取数据
onLoad(() => {
  // 加载搜索历史
  try {
    const history = uni.getStorageSync('floor_search_history')
    if (Array.isArray(history)) {
      searchHistory.value = history
    }
  }
  catch (error) {
    console.error('加载搜索历史失败:', error)
  }
})

// 监听搜索输入变化，实现实时搜索
watch(searchValue, handleRealTimeSearch)

// 页面挂载时的额外处理
onMounted(() => {
  pagingRef.value?.reload()

  // 监听网络状态变化
  uni.onNetworkStatusChange((res) => {
    if (!res.isConnected) {
      toast.error('网络连接已断开')
    }
  })
})
</script>

<template>
  <view class="selector-page min-h-screen flex flex-col bg-gray-50">
    <!-- 搜索栏 -->
    <view class="relative border-b border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <wd-search
        v-model="searchValue"
        placeholder="搜索楼栋编号"
        :disabled="loading"
        @search="handleSearch"
        @clear="handleClearSearch"
        @focus="handleSearchFocus"
        @blur="handleSearchBlur"
      />

      <!-- 搜索中状态指示器 -->
      <view v-if="isSearching" class="absolute right-16 top-1/2 -translate-y-1/2">
        <wd-loading size="16px" />
      </view>

      <!-- 搜索历史弹层 -->
      <view
        v-if="showSearchHistory && searchHistory.length > 0"
        class="absolute left-0 right-0 top-full z-50 border border-gray-100 rounded-b-lg bg-white shadow-lg"
        role="list"
        aria-label="搜索历史"
      >
        <view class="flex items-center justify-between border-b border-gray-100 p-3">
          <text class="text-sm text-gray-600 font-medium">搜索历史</text>
          <wd-button
            type="text"
            size="small"
            @click="clearSearchHistory"
          >
            <template #icon>
              <wd-icon name="delete" custom-class="i-carbon-trash-can text-gray-400" />
            </template>
          </wd-button>
        </view>

        <view class="max-h-64 overflow-y-auto">
          <view
            v-for="(item, index) in searchHistory"
            :key="index"
            class="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50"
            role="listitem"
            @click="selectHistoryItem(item)"
          >
            <view class="flex items-center">
              <wd-icon name="time" custom-class="i-carbon-time text-gray-400 mr-3" />
              <text class="text-gray-700">{{ item }}</text>
            </view>
            <wd-icon name="arrow-up" custom-class="i-carbon-arrow-up text-gray-300 text-sm" />
          </view>
        </view>
      </view>
    </view>

    <!-- z-paging 列表 -->
    <z-paging
      ref="pagingRef"
      v-model="floorList"
      :default-page-size="50"
      :loading-more-threshold="50"
      :fixed="false"
      :safe-area-config="{ bottom: 0 }"
      class="flex-1"
      role="main"
      aria-label="楼栋列表"
      @query="handleQuery"
    >
      <!-- 加载状态提示 -->
      <template #loading>
        <ZPagingLoading
          icon="building"
          icon-class="i-carbon-building text-blue-400 animate-pulse"
          :primary-text="searchValue ? '正在搜索楼栋...' : '正在加载楼栋列表...'"
          secondary-text="请稍候片刻"
        />
      </template>

      <!-- 列表内容 -->
      <wd-cell-group
        role="list"
        aria-label="楼栋选择列表"
      >
        <wd-cell
          v-for="(floor, index) in floorList"
          :key="floor.floorId"
          :title="`${floor.floorNum}栋`"
          :label="floor.floorName || `楼栋编号: ${floor.floorNum}`"
          :value="selectedFloorId === floor.floorId ? '已选择' : ''"
          is-link
          :disabled="loading"
          role="listitem"
          :aria-label="`楼栋 ${floor.floorNum}栋${floor.floorName ? `, ${floor.floorName}` : ''}${selectedFloorId === floor.floorId ? ', 已选择' : ''}`"
          :aria-setsize="floorList.length"
          :aria-posinset="index + 1"
          :aria-selected="selectedFloorId === floor.floorId"
          tabindex="0"
          class="transition-all duration-200 active:bg-gray-100 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50" :class="[
            selectedFloorId === floor.floorId && 'bg-blue-50 border-blue-200 shadow-sm',
          ]"
          :title-class="[
            'font-medium',
            selectedFloorId === floor.floorId ? 'text-blue-600' : 'text-gray-900',
          ]"
          :label-class="[
            'text-sm',
            selectedFloorId === floor.floorId ? 'text-blue-500' : 'text-gray-500',
          ]"
          :value-class="[
            'text-sm font-medium',
            selectedFloorId === floor.floorId ? 'text-blue-600' : 'text-transparent',
          ]"
          @click="handleSelectFloor(floor)"
          @keydown.enter="handleSelectFloor(floor)"
          @keydown.space.prevent="handleSelectFloor(floor)"
        >
          <template #icon>
            <view class="relative">
              <wd-icon
                name="building"
                :custom-class="`mr-3 transition-all duration-200 ${
                  selectedFloorId === floor.floorId
                    ? 'i-carbon-building text-blue-500 scale-110'
                    : 'i-carbon-building text-blue-400'
                }`"
              />
              <!-- 选中指示器 -->
              <view
                v-if="selectedFloorId === floor.floorId"
                class="absolute h-4 w-4 flex items-center justify-center rounded-full bg-blue-500 -right-1 -top-1"
                role="img"
                aria-label="已选择"
              >
                <wd-icon name="check" custom-class="i-carbon-checkmark text-white text-xs" />
              </view>
            </view>
          </template>

          <template #right-icon>
            <wd-icon
              :name="selectedFloorId === floor.floorId ? 'check-circle' : 'arrow-right'"
              :custom-class="`transition-all duration-200 ${
                selectedFloorId === floor.floorId
                  ? 'i-carbon-checkmark-filled text-blue-500 scale-110'
                  : 'i-carbon-chevron-right text-gray-400'
              }`"
            />
          </template>
        </wd-cell>
      </wd-cell-group>

      <!-- 自定义空状态 -->
      <template #empty>
        <view class="flex items-center justify-center p-6 sm:p-8">
          <view class="max-w-xs text-center">
            <!-- 插画图标 -->
            <view class="relative mb-6">
              <wd-icon
                :name="searchValue ? 'search' : 'building'"
                :custom-class="`text-8xl transition-all duration-300 ${
                  searchValue ? 'i-carbon-search text-orange-400 animate-pulse' : 'i-carbon-building text-gray-300'
                }`"
              />
              <!-- 装饰性元素 -->
              <view
                v-if="!searchValue"
                class="absolute h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 animate-bounce-in -bottom-2 -right-2"
              >
                <wd-icon name="add" custom-class="i-carbon-add text-blue-500 text-sm" />
              </view>
            </view>

            <!-- 主要文案 -->
            <view class="mb-3">
              <text class="text-lg text-gray-700 font-medium">
                {{ searchValue ? '未找到匹配的楼栋' : '还没有楼栋信息' }}
              </text>
            </view>

            <!-- 次要文案 -->
            <view class="mb-4 text-sm text-gray-500">
              {{ searchValue ? '可以尝试其他关键词或清空搜索条件' : '请联系管理员添加楼栋信息' }}
            </view>

            <!-- 操作按钮 -->
            <view v-if="searchValue" class="search-empty-actions justify-center">
              <wd-button
                type="primary"
                size="small"
                class="search-empty-actions__button transition-all duration-200 sm:flex-none hover:scale-105"
                @click="handleClearSearch"
              >
                清空搜索
              </wd-button>
              <wd-button
                type="text"
                size="small"
                class="search-empty-actions__button transition-all duration-200 sm:flex-none hover:scale-105"
                @click="handleRefresh"
              >
                刷新数据
              </wd-button>
            </view>
          </view>
        </view>
      </template>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.selector-page {
  padding-top: var(--status-bar-height, 0px);
  padding-bottom: var(--window-bottom, 0px);
}

.search-empty-actions {
  display: flex;
  flex-direction: column;
  margin: -8rpx;
}

.search-empty-actions__button {
  flex: 1;
  margin: 8rpx;
}

@media (min-width: 640px) {
  .search-empty-actions {
    flex-direction: row;
  }

  .search-empty-actions__button {
    flex: none;
    min-width: 160rpx;
  }
}
</style>
