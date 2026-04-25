<!--
  采购审核
  功能：显示采购申请审核列表，包含待处理、接单中、已完成三个Tab

  访问地址: http://localhost:3000/#/pages-sub/purchase/review

  旧代码：gitee-example/pages/purchaseReview/purchaseReview.vue
-->

<script setup lang="ts">
import { ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: '采购审核',
    enablePullDownRefresh: false,
  },
})

// ==================== Tab 状态 ====================

/** 当前 Tab */
const active = ref(0)

/** Tab 列表 */
const tabs = [
  { label: '待处理', value: 0 },
  { label: '接单中', value: 1 },
  { label: '已完成', value: 2 },
]

// ==================== 方法 ====================

/** Tab 切换 */
function handleTabChange(e: { index: number }) {
  active.value = e.index
}
</script>

<template>
  <view class="page-container">
    <!-- Tab 导航 -->
    <wd-tabs :value="active" @change="handleTabChange">
      <wd-tab :title="tabs[0].label" />
      <wd-tab :title="tabs[1].label" />
      <wd-tab :title="tabs[2].label" />
    </wd-tabs>

    <!-- 待处理 -->
    <view v-if="active === 0" class="tab-content">
      <view class="empty-tip">
        暂无待处理采购单
      </view>
    </view>

    <!-- 接单中 -->
    <view v-if="active === 1" class="tab-content">
      <view class="empty-tip">
        暂无接单中采购单
      </view>
    </view>

    <!-- 已完成 -->
    <view v-if="active === 2" class="tab-content">
      <view class="empty-tip">
        暂无已完成采购单
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.tab-content {
  padding: 20rpx;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 100rpx 0;
}
</style>
