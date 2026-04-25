<!--
  repair-status-tag 组件演示页
  功能：演示维修状态标签组件的各种用法和效果

  访问地址: http://localhost:3000/#/pages/test-use/repair-status-tag
-->
<script setup lang="ts">
import RepairStatusTag from '@/components/common/repair-status-tag/index.vue'

definePage({
  style: {
    navigationBarTitleText: '维修状态标签组件演示',
  },
})

// 测试数据
const statusList = [
  { statusCd: '10001', statusName: '待派单' },
  { statusCd: '10002', statusName: '已派单' },
  { statusCd: '10003', statusName: '处理中' },
  { statusCd: '10004', statusName: '已完成' },
  { statusCd: '10005', statusName: '已取消' },
]
</script>

<template>
  <wd-navbar title="维修状态标签组件演示" placeholder fixed />

  <view class="page-container">
    <!-- 基础用法演示 -->
    <wd-cell-group title="基础用法（带状态名称）">
      <wd-cell title="待派单">
        <repair-status-tag status-cd="10001" status-name="待派单" />
      </wd-cell>
      <wd-cell title="已派单">
        <repair-status-tag status-cd="10002" status-name="已派单" />
      </wd-cell>
      <wd-cell title="处理中（带丝绸动效）">
        <repair-status-tag status-cd="10003" status-name="处理中" />
      </wd-cell>
      <wd-cell title="已完成">
        <repair-status-tag status-cd="10004" status-name="已完成" />
      </wd-cell>
      <wd-cell title="已取消">
        <repair-status-tag status-cd="10005" status-name="已取消" />
      </wd-cell>
    </wd-cell-group>

    <!-- 自动获取状态名称演示 -->
    <wd-cell-group title="自动获取状态名称（不传 statusName）">
      <wd-cell title="待派单">
        <repair-status-tag status-cd="10001" />
      </wd-cell>
      <wd-cell title="已派单">
        <repair-status-tag status-cd="10002" />
      </wd-cell>
      <wd-cell title="处理中">
        <repair-status-tag status-cd="10003" />
      </wd-cell>
      <wd-cell title="已完成">
        <repair-status-tag status-cd="10004" />
      </wd-cell>
      <wd-cell title="已取消">
        <repair-status-tag status-cd="10005" />
      </wd-cell>
    </wd-cell-group>

    <!-- 禁用动效演示 -->
    <wd-cell-group title="禁用动效（animated=false）">
      <wd-cell title="处理中（无动效）">
        <repair-status-tag status-cd="10003" status-name="处理中" :animated="false" />
      </wd-cell>
    </wd-cell-group>

    <!-- 列表场景演示 -->
    <wd-cell-group title="列表场景模拟">
      <wd-cell v-for="item in statusList" :key="item.statusCd" :title="item.statusName">
        <repair-status-tag :status-cd="item.statusCd" :status-name="item.statusName" />
      </wd-cell>
    </wd-cell-group>

    <!-- 居中展示 -->
    <wd-cell-group title="居中展示效果">
      <view class="center-demo">
        <repair-status-tag status-cd="10003" status-name="处理中" />
      </view>
      <view class="center-demo">
        <repair-status-tag status-cd="10004" status-name="已完成" />
      </view>
    </wd-cell-group>
  </view>
</template>

<style lang="scss" scoped>
.page-container {
  padding-bottom: 40px;
}

.center-demo {
  display: flex;
  justify-content: center;
  padding: 20rpx 0;
}
</style>
