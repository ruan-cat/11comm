<!--
  编辑工作单页面
  功能：编辑已有的工作单信息

  访问地址: http://localhost:3000/#/pages-sub/work/edit-work
  建议携带参数: ?orderId=xxx

  http://localhost:3000/#/pages-sub/work/edit-work?orderId=WO_001

  旧代码：gitee-example/pages/work/editWrok.vue
-->

<script lang="ts" setup>
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import type { UpdateWorkOrderParams, WorkOrderDetail } from '@/types/work-order'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getWorkOrderDetail, updateWorkOrder } from '@/api/work-order'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { WorkOrderPriorityName, WorkOrderTypeName } from '@/types/work-order'

/** 路由参数 */
const props = defineProps<{
  orderId?: string
}>()

definePage({
  style: {
    navigationBarTitleText: '编辑工作单',
    navigationBarBackgroundColor: '#368bff',
    navigationBarTextStyle: 'white',
  },
})

const toast = useGlobalToast()

/** 表单引用 */
const formRef = ref()

/** 标签宽度 */
const LABEL_WIDTH = '100px'

/** 表单数据 */
const formData = ref<UpdateWorkOrderParams>({
  orderId: '',
  title: '',
  type: '1',
  priority: '2',
  content: '',
  planEndTime: '',
  staffId: '',
  copyUserIds: [],
})

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

/** 表单校验规则 */
const rules: FormRules = {
  title: [{ required: true, message: '请输入工作单标题' }],
  type: [{ required: true, message: '请选择工作单类型' }],
  content: [{ required: true, message: '请输入工作内容' }],
  planEndTime: [{ required: true, message: '请选择完成日期' }],
}

/** 获取工作单详情 */
const { send: loadDetail, loading: detailLoading } = useRequest(
  () => getWorkOrderDetail({ orderId: props.orderId || '' }),
  { immediate: false },
).onSuccess((event) => {
  const response = event.data
  const detail = response?.order as WorkOrderDetail
  formData.value = {
    orderId: detail.orderId,
    title: detail.title,
    type: detail.type,
    priority: detail.priority,
    content: detail.content,
    planEndTime: detail.endTime || '',
    staffId: detail.staffId || '',
    copyUserIds: detail.copyStaffs?.map(s => s.staffId) || [],
  }
}).onError((error) => {
  console.error('获取工作单详情失败:', error)
})

/** 提交更新 */
const { send: submitUpdate, loading: submitLoading } = useRequest(
  () => updateWorkOrder(formData.value),
  { immediate: false },
).onSuccess(() => {
  toast.success('更新成功')
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}).onError((error) => {
  console.error('更新工作单失败:', error)
})

/** 处理提交 */
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    submitUpdate()
  }
  catch (error) {
    console.error('表单校验失败:', error)
  }
}

/** 处理日期选择 */
function handleDateConfirm(e: { value: Date }) {
  const date = e.value
  formData.value.planEndTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

onLoad(() => {
  if (props.orderId) {
    formData.value.orderId = props.orderId
    loadDetail()
  }
})
</script>

<template>
  <view class="edit-work-page">
    <wd-form ref="formRef" :model="formData" :rules="rules">
      <!-- 基本信息 -->
      <FormSectionTitle title="基本信息" icon="i-carbon-document" />
      <wd-cell-group border>
        <wd-input
          v-model="formData.title"
          :label-width="LABEL_WIDTH"
          label="标题"
          prop="title"
          placeholder="请输入工作单标题"
          clearable
        />

        <wd-picker
          v-model="formData.type"
          :label-width="LABEL_WIDTH"
          :columns="typeColumns"
          label="工作单类型"
          prop="type"
          placeholder="请选择"
        />

        <wd-picker
          v-model="formData.priority"
          :label-width="LABEL_WIDTH"
          :columns="priorityColumns"
          label="优先级"
          prop="priority"
          placeholder="请选择"
        />
      </wd-cell-group>

      <!-- 时间设置 -->
      <FormSectionTitle title="时间设置" icon="i-carbon-calendar" />
      <wd-cell-group border>
        <wd-datetime-picker
          v-model="formData.planEndTime"
          :label-width="LABEL_WIDTH"
          type="date"
          label="完成日期"
          prop="planEndTime"
          placeholder="请选择完成日期"
          @confirm="handleDateConfirm"
        />
      </wd-cell-group>

      <!-- 工作内容 -->
      <FormSectionTitle title="工作内容" icon="i-carbon-text-align-left" />
      <wd-cell-group border>
        <wd-textarea
          v-model="formData.content"
          prop="content"
          placeholder="请输入工作内容"
          :maxlength="500"
          show-word-limit
          clearable
        />
      </wd-cell-group>

      <!-- 提交按钮 -->
      <view class="p-30rpx">
        <wd-button
          type="primary"
          block
          :loading="submitLoading"
          :disabled="detailLoading"
          @click="handleSubmit"
        >
          提交修改
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style scoped>
.edit-work-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
