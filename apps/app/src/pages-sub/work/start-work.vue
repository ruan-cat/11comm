<!--
  发工作单页面
  功能：创建新的工作单，填写工作单信息

  访问地址: http://localhost:3000/#/pages-sub/work/start-work

  旧代码：gitee-example/pages/work/startWork.vue
  旧代码：gitee-example/components/work/add-work.vue
-->

<script lang="ts" setup>
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import type { CreateWorkOrderParams } from '@/types/work-order'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { createWorkOrder } from '@/api/work-order'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { WorkOrderPriorityName, WorkOrderTypeName } from '@/types/work-order'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '发工作单',
    navigationBarBackgroundColor: '#368bff',
    navigationBarTextStyle: 'white',
  },
})

const toast = useGlobalToast()

/** 表单数据 */
const formData = ref<CreateWorkOrderParams>({
  title: '',
  type: '1',
  priority: '2',
  content: '',
  staffId: '',
  planStartTime: '',
  planEndTime: '',
  communityId: getCurrentCommunity().communityId || 'COMM_001',
})

/** 表单校验规则 */
const rules: FormRules = {
  title: [{ required: true, message: '请输入工作单标题' }],
  type: [{ required: true, message: '请选择工作单类型' }],
  priority: [{ required: true, message: '请选择优先级' }],
  content: [{ required: true, message: '请输入工作内容' }],
}

/** 工作单类型选项 */
const typeColumns = Object.entries(WorkOrderTypeName).map(([value, label]) => ({
  value,
  label,
}))

/** 优先级选项 */
const priorityColumns = Object.entries(WorkOrderPriorityName).map(([value, label]) => ({
  value,
  label,
}))

/** 显示的类型名称 */
const typeDisplayName = ref(WorkOrderTypeName[formData.value.type])

/** 显示的优先级名称 */
const priorityDisplayName = ref(WorkOrderPriorityName[formData.value.priority])

/** 处理类型选择 */
function handleTypeConfirm({ value }: { value: string }) {
  formData.value.type = value
  typeDisplayName.value = WorkOrderTypeName[value]
}

/** 处理优先级选择 */
function handlePriorityConfirm({ value }: { value: string }) {
  formData.value.priority = value
  priorityDisplayName.value = WorkOrderPriorityName[value]
}

/** 提交请求 */
const { loading, send: submitOrder } = useRequest(
  () => createWorkOrder(formData.value),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('创建成功')
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  })
  .onError((error) => {
    console.error('创建工作单失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

/** 表单引用 */
const formRef = ref()

/** 提交表单 */
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    submitOrder()
  }
  catch {
    toast.warning('请完善表单信息')
  }
}
</script>

<template>
  <view class="min-h-screen bg-gray-50 pb-safe">
    <wd-form ref="formRef" :model="formData" :rules="rules">
      <!-- 基本信息 -->
      <FormSectionTitle title="基本信息" icon="i-carbon-document" />
      <wd-cell-group border>
        <wd-input
          v-model="formData.title"
          label="工作单标题"
          label-width="100px"
          prop="title"
          placeholder="请输入工作单标题"
          clearable
        />

        <wd-picker
          v-model="formData.type"
          :columns="typeColumns"
          label="工作单类型"
          label-width="100px"
          prop="type"
          :display-format="() => typeDisplayName"
          @confirm="handleTypeConfirm"
        />

        <wd-picker
          v-model="formData.priority"
          :columns="priorityColumns"
          label="优先级"
          label-width="100px"
          prop="priority"
          :display-format="() => priorityDisplayName"
          @confirm="handlePriorityConfirm"
        />
      </wd-cell-group>

      <!-- 工作内容 -->
      <FormSectionTitle title="工作内容" icon="i-carbon-text-align-left" />
      <wd-cell-group border>
        <wd-textarea
          v-model="formData.content"
          prop="content"
          placeholder="请输入工作内容描述"
          :maxlength="500"
          show-word-limit
          clearable
        />
      </wd-cell-group>

      <!-- 时间安排 -->
      <FormSectionTitle title="时间安排" icon="i-carbon-calendar" />
      <wd-cell-group border>
        <wd-datetime-picker
          v-model="formData.planStartTime"
          type="datetime"
          label="计划开始时间"
          label-width="100px"
          placeholder="请选择开始时间"
        />

        <wd-datetime-picker
          v-model="formData.planEndTime"
          type="datetime"
          label="计划结束时间"
          label-width="100px"
          placeholder="请选择结束时间"
        />
      </wd-cell-group>
    </wd-form>

    <!-- 提交按钮 -->
    <view class="shadow-top fixed bottom-0 left-0 right-0 bg-white p-4 pb-safe">
      <wd-button type="primary" block :loading="loading" @click="handleSubmit">
        提交工作单
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.shadow-top {
  box-shadow: 0 -2px 10px rgb(0 0 0 / 5%);
}
</style>
