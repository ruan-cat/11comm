<!--
  维修列表搜索栏组件
  用于维修列表页面的搜索和筛选工具栏

  功能：
  - 提供搜索输入框
  - 支持状态筛选（可配置是否启用）
  - 内部封装状态字典加载逻辑
  - 显示总记录数
-->

<script setup lang="ts">
import type { RepairListSearchBarProps, StateOption } from './types'
import { useRequest } from 'alova/client'
import { computed, ref, watch } from 'vue'
import { getRepairStates } from '@/api/repair'
import { REPAIR_STATUSES } from '@/constants/repair'

const props = withDefaults(defineProps<RepairListSearchBarProps>(), {
  modelValue: '',
  selectedState: '',
  isUseStateOptions: true,
  placeholder: '输入报修人',
  maxlength: 20,
  total: 0,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:selectedState', value: string): void
  (e: 'search'): void
  (e: 'clear'): void
  (e: 'state-change', value: string): void
}>()

/** 默认状态选项（从常量生成） */
const defaultStateOptions: StateOption[] = [
  { label: '全部状态', value: '' },
  ...REPAIR_STATUSES.map(item => ({
    label: item.label,
    value: item.value as string,
  })),
]

/** 状态选项列表 */
const stateOptions = ref<StateOption[]>([...defaultStateOptions])

/** 内部搜索关键词 */
const internalSearchName = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

/** 内部选中状态 */
const internalSelectedState = computed({
  get: () => props.selectedState,
  set: (value) => {
    emit('update:selectedState', value)
  },
})

/** 加载维修状态字典 */
const { send: loadStates } = useRequest(() => getRepairStates(), {
  immediate: false,
})
  .onSuccess((event) => {
    const result = event.data
    if (result && result.length > 0) {
      stateOptions.value = [
        { label: '全部状态', value: '' },
        ...result.map(item => ({
          label: item.name || '',
          value: item.statusCd || '',
        })),
      ]
    }
    else {
      stateOptions.value = [...defaultStateOptions]
    }
  })
  .onError((error) => {
    console.error('加载状态字典失败:', error)
    stateOptions.value = [...defaultStateOptions]
  })

/** 监听 isUseStateOptions 变化，决定是否加载状态字典 */
watch(
  () => props.isUseStateOptions,
  (newValue) => {
    if (newValue) {
      loadStates()
    }
  },
  { immediate: true },
)

/** 搜索处理 */
function handleSearch() {
  emit('search')
}

/** 清空处理 */
function handleClear() {
  emit('clear')
}

/** 状态选择器改变 */
function handleStateChange({ value }: { value: string }) {
  internalSelectedState.value = value
  emit('state-change', value)
}

/** 当前选中状态的显示标签 */
const currentStateLabel = computed(() => {
  const found = stateOptions.value.find(item => item.value === props.selectedState)
  return found?.label || '状态'
})
</script>

<template>
  <view class="search-header">
    <view class="search-bar-row">
      <!-- 搜索输入框主体 (包含筛选器) -->
      <view class="search-input-box">
        <!-- 筛选器 (嵌入在输入框左侧) -->
        <wd-picker
          v-if="isUseStateOptions"
          v-model="internalSelectedState"
          :columns="stateOptions"
          label-key="label"
          value-key="value"
          @confirm="handleStateChange"
        >
          <view class="filter-trigger">
            <text class="filter-label">{{ currentStateLabel }}</text>
            <wd-icon name="" custom-class="i-carbon-chevron-down text-gray-400 text-28rpx ml-4rpx" />
            <!-- 垂直分割线 -->
            <view class="filter-divider" />
          </view>
        </wd-picker>

        <!-- 实际输入框 -->
        <wd-search
          v-model="internalSearchName"
          :placeholder="placeholder"
          :maxlength="maxlength"
          hide-cancel
          clearable
          shape="round"
          class="search-input flex-1"
          @search="handleSearch"
          @clear="handleClear"
        />

        <!-- 搜索按钮 (嵌入式) -->
        <view class="search-btn" @click="handleSearch">
          <view class="i-carbon-search text-white mr-8rpx text-32rpx" />
          <text class="search-btn-text">搜索</text>
        </view>
      </view>
    </view>

    <!-- 底部辅助信息 (总记录数) - 极简风格 -->
    <view v-if="total > 0" class="total-info text-gray-400">
      <text>共 {{ total }} 条记录</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/** 1. 容器：纯白，底部细边框，吸顶 */
.search-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #ffffff;
  padding: 12rpx 24rpx;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
}

/** 2. 主行：Flex布局，对齐 */
.search-bar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72rpx;
}

/** 3. 搜索输入框主体：统一胶囊外壳 */
.search-input-box {
  flex: 1;
  margin-right: 16rpx;
  display: flex;
  align-items: center;
  height: 88rpx;
  background-color: #ffffff;
  border: 1px solid #f3f4f6;
  border-radius: 999px;
  padding: 8rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  overflow: hidden;
}

/** 4. 筛选器触发区 */
.filter-trigger {
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 24rpx;
  padding-right: 16rpx;
  background-color: transparent;
  border: none;
  margin-right: 0;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;

  &:active {
    opacity: 0.6;
  }
}

.filter-label {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  max-width: 140rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-divider {
  display: block;
  width: 1px;
  height: 32rpx;
  background-color: #e5e7eb;
  margin-left: 20rpx;
}

/** 5. 搜索输入框样式 */
.search-input {
  flex: 1;
  height: 100%;
}

.search-input :deep(.wd-search) {
  background-color: transparent;
  height: 100%;
}

.search-input :deep(.wd-search__content) {
  background-color: transparent;
  padding-left: 0;
  height: 100%;
}

.search-input :deep(.wd-search__input) {
  font-size: 28rpx;
}

.search-input :deep(.wd-search__placeholder) {
  font-size: 28rpx;
}

.search-input :deep(.wd-icon-search) {
  color: #9ca3af;
}

/** 6. 嵌入式搜索按钮 */
.search-btn {
  height: 72rpx;
  padding: 0 36rpx;
  margin-left: 4rpx;
  background-color: var(--wot-color-theme, #0957de);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;
  flex-shrink: 0;
  line-height: 1;

  &:active {
    opacity: 0.9;
  }
}

.search-btn-text {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 1;
}

/** 7. 底部信息：极小字体，右对齐，灰色 */
.total-info {
  font-size: 22rpx;
  text-align: right;
  margin-top: 12rpx;
  padding: 0 8rpx;
  font-variant-numeric: tabular-nums;
}
</style>
