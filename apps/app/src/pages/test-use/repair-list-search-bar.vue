<!--
  repair-list-search-bar 组件演示页
  功能：演示 repair-list-search-bar 组件的各种用法和效果

  访问地址: http://localhost:3000/#/pages/test-use/repair-list-search-bar
-->

<script setup lang="ts">
import { ref } from 'vue'
import RepairListSearchBar from '@/components/common/repair-list-search-bar/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

definePage({
  style: {
    navigationBarTitleText: 'repair-list-search-bar 组件演示',
  },
})

const toast = useGlobalToast()

/** 场景 1：完整功能（带状态筛选） */
const searchName1 = ref('')
const selectedState1 = ref('')
const total1 = ref(100)

function handleSearch1() {
  console.log('场景1 - 搜索:', {
    searchName: searchName1.value,
    selectedState: selectedState1.value,
  })
  toast.info(`搜索: ${searchName1.value || '全部'}, 状态: ${selectedState1.value || '全部'}`)
}

function handleClear1() {
  console.log('场景1 - 清空搜索')
  toast.info('已清空搜索')
}

function handleStateChange1(value: string) {
  console.log('场景1 - 状态改变:', value)
  toast.info(`状态改变: ${value || '全部'}`)
}

/** 场景 2：仅搜索（不带状态筛选） */
const searchName2 = ref('')
const total2 = ref(50)

function handleSearch2() {
  console.log('场景2 - 搜索:', {
    searchName: searchName2.value,
  })
  toast.info(`搜索: ${searchName2.value || '全部'}`)
}

/** 场景 3：自定义占位符 */
const searchName3 = ref('')
const selectedState3 = ref('')
const total3 = ref(0)

function handleSearch3() {
  console.log('场景3 - 搜索:', {
    searchName: searchName3.value,
    selectedState: selectedState3.value,
  })
  toast.info(`搜索: ${searchName3.value || '全部'}`)
}
</script>

<template>
  <view class="page-container">
    <wd-navbar title="repair-list-search-bar 组件演示" placeholder fixed />

    <!-- 场景 1：完整功能（带状态筛选） -->
    <wd-cell-group title="场景 1：完整功能（带状态筛选）">
      <view class="demo-section">
        <repair-list-search-bar
          v-model="searchName1"
          v-model:selected-state="selectedState1"
          :total="total1"
          :is-use-state-options="true"
          @search="handleSearch1"
          @clear="handleClear1"
          @state-change="handleStateChange1"
        />

        <view class="demo-info">
          <view class="info-item">
            <text class="info-label">搜索关键词：</text>
            <text class="info-value">{{ searchName1 || '（空）' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">选中状态：</text>
            <text class="info-value">{{ selectedState1 || '（空）' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">总记录数：</text>
            <text class="info-value">{{ total1 }}</text>
          </view>
        </view>
      </view>
    </wd-cell-group>

    <!-- 场景 2：仅搜索（不带状态筛选） -->
    <wd-cell-group title="场景 2：仅搜索（不带状态筛选）">
      <view class="demo-section">
        <repair-list-search-bar
          v-model="searchName2"
          :total="total2"
          :is-use-state-options="false"
          @search="handleSearch2"
        />

        <view class="demo-info">
          <view class="info-item">
            <text class="info-label">搜索关键词：</text>
            <text class="info-value">{{ searchName2 || '（空）' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">总记录数：</text>
            <text class="info-value">{{ total2 }}</text>
          </view>
        </view>
      </view>
    </wd-cell-group>

    <!-- 场景 3：自定义占位符 + 无记录数 -->
    <wd-cell-group title="场景 3：自定义占位符 + 无记录数">
      <view class="demo-section">
        <repair-list-search-bar
          v-model="searchName3"
          v-model:selected-state="selectedState3"
          placeholder="输入工单编号或报修人"
          :maxlength="30"
          :total="total3"
          :is-use-state-options="true"
          @search="handleSearch3"
        />

        <view class="demo-info">
          <view class="info-item">
            <text class="info-label">搜索关键词：</text>
            <text class="info-value">{{ searchName3 || '（空）' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">选中状态：</text>
            <text class="info-value">{{ selectedState3 || '（空）' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">总记录数：</text>
            <text class="info-value">{{ total3 }}（不显示记录数）</text>
          </view>
        </view>
      </view>
    </wd-cell-group>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  padding-bottom: 40px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.demo-section {
  background-color: #fff;
}

.demo-info {
  padding: 16px;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
  min-width: 100px;
}

.info-value {
  color: #333;
  font-weight: 500;
}
</style>
