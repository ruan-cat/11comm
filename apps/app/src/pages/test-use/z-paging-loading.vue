<!--
  z-paging-loading 组件测试页面
  功能：展示 z-paging-loading 组件的各种使用场景和配置

  访问地址: http://localhost:3000/#/pages/test-use/z-paging-loading
-->

<script setup lang="ts">
import type { ZPagingLoadingProps } from '@/components/common/z-paging-loading/types'
import { ref } from 'vue'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'

definePage({
  style: {
    navigationBarTitleText: 'z-paging-loading 组件测试',
  },
})

/** 模拟数据列表 */
const dataList = ref<any[]>([])

/** z-paging 引用 */
const pagingRef = ref()

/** 当前展示的场景索引 */
const currentSceneIndex = ref(0)

/** 模拟搜索关键词 */
const searchValue = ref('')

/** 是否显示加载状态(用于演示) */
const showLoading = ref(false)

/**
 * 加载场景配置列表
 * 定义了各种不同的加载场景及其配置
 */
const loadingScenes: Array<{
  title: string
  description: string
  props: ZPagingLoadingProps
}> = [
  {
    title: '场景 1: 默认加载',
    description: '使用默认配置,适用于通用的数据加载场景',
    props: {},
  },
  {
    title: '场景 2: 楼栋加载',
    description: '用于楼栋列表加载,使用建筑图标和蓝色主题',
    props: {
      icon: 'building',
      iconClass: 'i-carbon-building text-blue-400 animate-pulse',
      primaryText: '正在加载楼栋列表...',
      secondaryText: '请稍候片刻',
    },
  },
  {
    title: '场景 3: 单元加载',
    description: '用于单元列表加载,使用网格图标和绿色主题',
    props: {
      icon: 'grid',
      iconClass: 'i-carbon-grid text-green-400 animate-pulse',
      primaryText: '正在加载单元列表...',
      secondaryText: '正在获取数据',
    },
  },
  {
    title: '场景 4: 房屋加载',
    description: '用于房屋列表加载,使用房屋图标和紫色主题',
    props: {
      icon: 'home',
      iconClass: 'i-carbon-home text-purple-400 animate-pulse',
      primaryText: '正在加载房屋列表...',
      secondaryText: '马上就好',
    },
  },
  {
    title: '场景 5: 工单加载',
    description: '用于工单列表加载,使用文档图标和橙色主题',
    props: {
      icon: 'document',
      iconClass: 'i-carbon-document text-orange-400 animate-pulse',
      primaryText: '正在加载工单列表...',
      secondaryText: '数据加载中',
    },
  },
  {
    title: '场景 6: 用户加载',
    description: '用于用户列表加载,使用用户图标和青色主题',
    props: {
      icon: 'user',
      iconClass: 'i-carbon-user text-cyan-400 animate-pulse',
      primaryText: '正在加载用户列表...',
      secondaryText: '请耐心等待',
    },
  },
  {
    title: '场景 7: 自定义加载器类型',
    description: '使用 outline 类型的加载器',
    props: {
      icon: 'settings',
      iconClass: 'i-carbon-settings text-indigo-400 animate-pulse',
      loadingType: 'outline',
      primaryText: '正在处理数据...',
      secondaryText: '即将完成',
    },
  },
  {
    title: '场景 8: 大尺寸加载',
    description: '使用更大的加载器和图标尺寸',
    props: {
      icon: 'data',
      iconClass: 'i-carbon-data-1 text-pink-400 animate-pulse',
      iconSize: '28px',
      loadingSize: '48px',
      primaryText: '正在加载大量数据...',
      secondaryText: '这可能需要一些时间',
    },
  },
]

/** 获取当前场景的配置 */
const currentScene = ref(loadingScenes[currentSceneIndex.value])

/** 切换到上一个场景 */
function prevScene() {
  if (currentSceneIndex.value > 0) {
    currentSceneIndex.value--
    currentScene.value = loadingScenes[currentSceneIndex.value]
  }
}

/** 切换到下一个场景 */
function nextScene() {
  if (currentSceneIndex.value < loadingScenes.length - 1) {
    currentSceneIndex.value++
    currentScene.value = loadingScenes[currentSceneIndex.value]
  }
}

/**
 * z-paging 的 @query 回调
 * @description 模拟数据加载（测试页面不使用真实 API）
 */
function handleQuery(pageNo: number, pageSize: number) {
  // 模拟网络延迟
  setTimeout(() => {
    // 模拟数据
    const mockData = Array.from({ length: 10 }, (_, index) => ({
      id: `${pageNo}-${index}`,
      title: `数据项 ${pageNo}-${index + 1}`,
      content: `这是第 ${pageNo} 页的第 ${index + 1} 条数据`,
    }))

    // 通知 z-paging 数据加载完成
    pagingRef.value?.complete(mockData)
  }, 2000)
}

/** 手动触发显示加载状态 */
function toggleLoading() {
  showLoading.value = !showLoading.value
}

/** 重新加载数据 */
function reloadData() {
  pagingRef.value?.reload()
}
</script>

<template>
  <view class="loading-demo-page min-h-screen flex flex-col bg-gray-50">
    <!-- 顶部说明卡片 -->
    <view class="border-b border-gray-100 bg-white p-4 shadow-sm">
      <view class="mb-3">
        <text class="text-lg text-gray-800 font-semibold">z-paging-loading 组件测试</text>
      </view>
      <view class="text-sm text-gray-600 leading-relaxed">
        <text>本页面展示了 z-paging-loading 组件的各种使用场景。</text>
        <text class="mt-1 block">您可以通过切换不同的场景,查看不同配置下的加载效果。</text>
      </view>
    </view>

    <!-- 场景选择器 -->
    <view class="border-b border-gray-100 bg-white p-4">
      <view class="mb-3 flex items-center justify-between">
        <text class="text-base text-gray-700 font-medium">当前场景</text>
        <text class="text-sm text-gray-500">{{ currentSceneIndex + 1 }} / {{ loadingScenes.length }}</text>
      </view>

      <!-- 场景信息 -->
      <view class="mb-4 border border-blue-100 rounded-lg bg-blue-50 p-3">
        <text class="block text-sm text-blue-900 font-medium">{{ currentScene.title }}</text>
        <text class="mt-1 block text-xs text-blue-700">{{ currentScene.description }}</text>
      </view>

      <!-- 场景切换按钮 -->
      <view class="button-row">
        <wd-button
          :disabled="currentSceneIndex === 0"
          type="default"
          size="small"
          class="button-row__button flex-1"
          @click="prevScene"
        >
          上一个场景
        </wd-button>
        <wd-button
          :disabled="currentSceneIndex === loadingScenes.length - 1"
          type="primary"
          size="small"
          class="button-row__button flex-1"
          @click="nextScene"
        >
          下一个场景
        </wd-button>
      </view>
    </view>

    <!-- 操作按钮组 -->
    <view class="border-b border-gray-100 bg-white p-4">
      <view class="mb-2">
        <text class="text-sm text-gray-600 font-medium">测试操作</text>
      </view>
      <view class="button-row">
        <wd-button type="success" size="small" class="button-row__button flex-1" @click="reloadData">
          重新加载数据
        </wd-button>
        <wd-button type="warning" size="small" class="button-row__button flex-1" @click="toggleLoading">
          {{ showLoading ? '隐藏加载' : '显示加载' }}
        </wd-button>
      </view>
    </view>

    <!-- 动态文案演示 -->
    <view class="border-b border-gray-100 bg-white p-4">
      <view class="mb-2">
        <text class="text-sm text-gray-600 font-medium">动态文案演示</text>
      </view>
      <wd-search
        v-model="searchValue"
        placeholder="输入关键词,观察加载文案变化"
        class="mb-2"
      />
      <view class="border border-gray-200 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
        <text class="block">当前文案: {{ searchValue ? '正在搜索数据...' : '正在加载数据...' }}</text>
      </view>
    </view>

    <!-- z-paging 列表演示 -->
    <view class="flex-1">
      <!-- 手动控制的加载演示 -->
      <view v-if="showLoading" class="border-b border-gray-100 bg-white">
        <view class="border-b border-gray-100 px-4 py-2">
          <text class="text-sm text-gray-700 font-medium">手动控制的加载状态</text>
        </view>
        <ZPagingLoading v-bind="currentScene.props" />
      </view>

      <!-- z-paging 集成演示 -->
      <view class="flex flex-1 flex-col">
        <view class="border-b border-gray-100 bg-white px-4 py-2">
          <text class="text-sm text-gray-700 font-medium">z-paging 集成演示</text>
          <text class="mt-1 block text-xs text-gray-500">下拉刷新或滚动加载更多,观察加载效果</text>
        </view>

        <z-paging
          ref="pagingRef"
          v-model="dataList"
          :fixed="false"
          :safe-area-config="{ bottom: 0 }"
          class="flex-1"
          @query="handleQuery"
        >
          <!-- 加载状态 - 使用当前场景配置 -->
          <template #loading>
            <ZPagingLoading
              v-bind="currentScene.props"
              :primary-text="searchValue ? '正在搜索数据...' : currentScene.props.primaryText"
            />
          </template>

          <!-- 列表内容 -->
          <view class="p-4">
            <wd-cell-group>
              <wd-cell
                v-for="item in dataList"
                :key="item.id"
                :title="item.title"
                :label="item.content"
              />
            </wd-cell-group>
          </view>

          <!-- 空状态 -->
          <template #empty>
            <view class="flex items-center justify-center p-8">
              <view class="text-center">
                <wd-icon name="data-table" custom-class="i-carbon-no-image text-6xl text-gray-300" />
                <text class="mt-3 block text-sm text-gray-500">暂无数据</text>
                <text class="mt-1 block text-xs text-gray-400">下拉刷新加载数据</text>
              </view>
            </view>
          </template>
        </z-paging>
      </view>
    </view>

    <!-- 底部配置信息 -->
    <view class="border-t border-gray-200 bg-white p-4">
      <view class="mb-2">
        <text class="text-sm text-gray-600 font-medium">当前场景配置</text>
      </view>
      <view class="border border-gray-200 rounded-lg bg-gray-50 p-3 text-xs text-gray-700 font-mono">
        <text class="block">icon: {{ currentScene.props.icon || 'loading' }}</text>
        <text class="mt-1 block">iconClass: {{ currentScene.props.iconClass || 'i-carbon-circle-dash...' }}</text>
        <text class="mt-1 block">iconSize: {{ currentScene.props.iconSize || '20px' }}</text>
        <text class="mt-1 block">loadingSize: {{ currentScene.props.loadingSize || '32px' }}</text>
        <text class="mt-1 block">loadingType: {{ currentScene.props.loadingType || 'ring' }}</text>
        <text class="mt-1 block">primaryText: {{ currentScene.props.primaryText || '正在加载数据...' }}</text>
        <text class="mt-1 block">secondaryText: {{ currentScene.props.secondaryText || '请稍候片刻' }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.loading-demo-page {
  padding-top: var(--status-bar-height, 0px);
  padding-bottom: var(--window-bottom, 0px);
}

.button-row {
  display: flex;
  margin: 0 -8rpx;
}

.button-row__button {
  margin: 0 8rpx;
}
</style>
