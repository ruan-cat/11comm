<!--
  表单分区标题组件演示页
  功能：演示 form-section-title 组件的各种用法和效果

  访问地址: http://localhost:3000/#/pages/test-use/form-section-title
-->

<script setup lang="ts">
import FormSectionTitle from '@/components/common/form-section-title/index.vue'

definePage({
  style: {
    navigationBarTitleText: '表单分区标题组件演示',
  },
})

const formData = ref({
  name: '',
  phone: '',
  type: '',
  amount: '',
})
</script>

<template>
  <wd-navbar title="表单标题组件演示" placeholder fixed />

  <view class="page-container">
    <!-- 基础用法 -->
    <wd-cell-group title="基础用法">
      <FormSectionTitle title="基础标题" />
      <wd-input v-model="formData.name" label="姓名" placeholder="请输入姓名" />
      <wd-input v-model="formData.phone" label="手机号" placeholder="请输入手机号" />
    </wd-cell-group>

    <!-- 必填标记 -->
    <wd-cell-group title="必填标记">
      <FormSectionTitle title="必填信息" required />
      <wd-input v-model="formData.name" label="姓名" placeholder="请输入姓名" required />
      <wd-input v-model="formData.phone" label="手机号" placeholder="请输入手机号" required />
    </wd-cell-group>

    <!-- 带图标 -->
    <wd-cell-group title="带图标">
      <FormSectionTitle
        title="商品类型"
        icon="shopping-cart"
        icon-class="i-carbon-shopping-cart text-blue-500"
      />
      <wd-input v-model="formData.type" label="类型" placeholder="请选择商品类型" />

      <FormSectionTitle
        title="购买数量"
        icon="chart-line"
        icon-class="i-carbon-chart-line text-green-500"
      />
      <wd-input v-model="formData.amount" label="数量" placeholder="请输入数量" />
    </wd-cell-group>

    <!-- 带副标题 -->
    <wd-cell-group title="带副标题">
      <FormSectionTitle title="相关图片" subtitle="最多上传9张" />
      <wd-cell title="点击上传" is-link />

      <FormSectionTitle title="报修信息" subtitle="详细描述问题" required />
      <wd-textarea v-model="formData.name" placeholder="请输入报修详情" />
    </wd-cell-group>

    <!-- 禁用动效 -->
    <wd-cell-group title="禁用动效">
      <FormSectionTitle title="静态标题（无动效）" :animated="false" />
      <wd-input label="内容" placeholder="此标题没有呼吸动效" />
    </wd-cell-group>

    <!-- 综合示例：模拟维修工单 -->
    <wd-cell-group title="综合示例 - 维修工单">
      <FormSectionTitle
        title="房屋信息"
        icon="home"
        icon-class="i-carbon-home text-purple-500"
        required
      />
      <wd-input label="小区名称" placeholder="请选择小区" />
      <wd-input label="楼栋" placeholder="请选择楼栋" />
      <wd-input label="单元" placeholder="请选择单元" />
      <wd-input label="房号" placeholder="请选择房号" />

      <FormSectionTitle
        title="报修信息"
        icon="tools"
        icon-class="i-carbon-tools text-orange-500"
        required
      />
      <wd-input label="报修类型" placeholder="请选择报修类型" />
      <wd-textarea placeholder="请详细描述问题" />

      <FormSectionTitle title="相关图片" subtitle="最多上传9张" />
      <wd-cell title="点击上传图片" is-link />
    </wd-cell-group>

    <!-- 多个标题连续使用 -->
    <wd-cell-group title="连续多个标题">
      <FormSectionTitle title="第一部分" />
      <wd-input label="字段1" placeholder="输入内容" />

      <FormSectionTitle title="第二部分" />
      <wd-input label="字段2" placeholder="输入内容" />

      <FormSectionTitle title="第三部分" />
      <wd-input label="字段3" placeholder="输入内容" />
    </wd-cell-group>
  </view>
</template>

<style scoped>
.page-container {
  padding-bottom: 40px;
}
</style>
