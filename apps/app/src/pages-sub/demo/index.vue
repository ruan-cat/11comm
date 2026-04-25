<!--
  分包示例页
  功能：展示分包页面与组件示例

  访问地址: http://localhost:3000/#/pages-sub/demo/index

  旧代码：未找到（待补充）
-->

<script lang="ts" setup>
// code here
import RequestComp from './components/request.vue'

definePage({
  style: {
    navigationBarTitleText: '分包页面',
  },
})
</script>

<template>
  <view class="text-center">
    <view class="m-8">
      http://localhost:3000/#/pages-sub/demo/index
    </view>
    <view class="my-4 text-green-500">
      分包页面demo
    </view>
    <view class="text-blue-500">
      分包页面里面的components示例
    </view>
    <view>
      <RequestComp />
    </view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
