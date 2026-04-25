<!--
  编辑工作流表单页
  功能：加载已有流程单并编辑后保存

  访问地址: http://localhost:3000/#/pages-sub/oa/workflow-form-edit
  建议携带参数: ?flowId=FLOW_001&id=OA_001&flowName=请假申请

  旧代码：gitee-example/pages/newOaWorkflowFormEdit/newOaWorkflowFormEdit.vue
-->

<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import type { OaWorkflowFormDataRecord, OaWorkflowFormField } from '@/types/oa-workflow'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { queryOaWorkflowForm, queryOaWorkflowFormData, updateOaWorkflowFormData } from '@/api/oa-workflow'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

definePage({
  style: {
    navigationBarTitleText: '编辑工作流表单',
  },
})

/** 表单标签宽度 */
const LABEL_WIDTH = '96px'

/** 流程ID */
const flowId = ref('')
/** 数据ID */
const dataId = ref('')
/** 流程名称 */
const flowName = ref('')
/** 动态字段 */
const fields = ref<OaWorkflowFormField[]>([])
/** 原始记录 */
const sourceRecord = ref<OaWorkflowFormDataRecord | null>(null)
/** 表单引用 */
const formRef = ref<FormInstance>()
/** 表单规则 */
const formRules = ref<FormRules>({})
/** 动态表单数据 */
const formModel = reactive<Record<string, string>>({})
/** 上传文件名 */
const fileName = ref('')
/** 上传真实文件名 */
const realFileName = ref('')

const toast = useGlobalToast()

/** 初始化字段 */
function initFields(schemaFields: OaWorkflowFormField[]) {
  fields.value = schemaFields

  schemaFields.forEach((field) => {
    if (!field.key)
      return

    formModel[field.key] = ''

    if (field.validate?.required) {
      formRules.value[field.key] = [{ required: true, message: `${field.label || '字段'}不能为空` }]
    }
  })

  if (sourceRecord.value?.formData) {
    Object.entries(sourceRecord.value.formData).forEach(([key, value]) => {
      formModel[key] = value
    })
  }

  if (sourceRecord.value?.files?.[0]) {
    fileName.value = sourceRecord.value.files[0].fileName || ''
    realFileName.value = sourceRecord.value.files[0].realFileName || ''
  }
}

/** 校验动态必填 */
function validateDynamicRequired() {
  for (const field of fields.value) {
    if (!field.key || !field.validate?.required)
      continue

    if (!formModel[field.key]) {
      toast.warning(`${field.label || '字段'}不能为空`)
      return false
    }
  }

  return true
}

/** 选择附件（本地模拟） */
function handleChooseFile() {
  uni.chooseFile({
    count: 1,
    extension: ['.zip', '.doc', '.docx', '.xls', '.xlsx', '.pdf'],
    success: (res) => {
      if (res.tempFiles?.[0]?.size && res.tempFiles[0].size / 1024 / 1024 > 20) {
        toast.warning('附件大小不能超过20M')
        return
      }

      fileName.value = res.tempFiles?.[0]?.name || ''
      realFileName.value = res.tempFilePaths?.[0] || ''
      toast.success('附件已选择')
    },
  })
}

/** 重置为原始数据 */
function handleReset() {
  if (!sourceRecord.value?.formData)
    return

  Object.keys(formModel).forEach((key) => {
    formModel[key] = sourceRecord.value?.formData[key] || ''
  })

  fileName.value = sourceRecord.value.files?.[0]?.fileName || ''
  realFileName.value = sourceRecord.value.files?.[0]?.realFileName || ''
}

/** 加载流程模板 */
const { send: loadFormSchema } = useRequest(
  (params: { flowId: string }) => queryOaWorkflowForm({ page: 1, row: 1, flowId: params.flowId }),
  {
    immediate: false,
  },
)
  .onSuccess((event) => {
    const formMeta = event.data?.data?.[0]
    if (!formMeta?.formJson) {
      toast.warning('流程表单模板不存在')
      return
    }

    const schema = JSON.parse(formMeta.formJson) as { components: OaWorkflowFormField[] }
    initFields(schema.components || [])
  })
  .onError((error) => {
    console.error('加载流程模板失败:', error)
  })

/** 加载原始记录 */
const { send: loadSourceData } = useRequest(
  (params: { flowId: string, id: string }) =>
    queryOaWorkflowFormData({
      page: 1,
      row: 1,
      flowId: params.flowId,
      id: params.id,
    }),
  {
    immediate: false,
  },
)
  .onSuccess((event) => {
    sourceRecord.value = event.data?.data?.[0] || null

    if (fields.value.length > 0) {
      initFields(fields.value)
    }
  })
  .onError((error) => {
    console.error('加载流程数据失败:', error)
  })

/** 提交编辑 */
const { loading: submitting, send: submitUpdate } = useRequest(
  () => updateOaWorkflowFormData({
    id: dataId.value,
    flowId: flowId.value,
    fileName: fileName.value,
    realFileName: realFileName.value,
    formData: { ...formModel },
  }),
  {
    immediate: false,
  },
)
  .onSuccess(() => {
    toast.success('保存成功')
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 1000)
  })
  .onError((error) => {
    console.error('保存失败:', error)
  })

/** 保存 */
function handleSubmit() {
  if (!flowId.value || !dataId.value) {
    toast.warning('参数缺失')
    return
  }

  if (!validateDynamicRequired()) {
    return
  }

  submitUpdate()
}

onLoad((options) => {
  flowId.value = options?.flowId || ''
  dataId.value = options?.id || ''
  flowName.value = decodeURIComponent(options?.flowName || '')

  if (flowName.value) {
    uni.setNavigationBarTitle({
      title: `${flowName.value} - 编辑`,
    })
  }

  if (!flowId.value || !dataId.value) {
    toast.warning('flowId 或 id 参数不能为空')
    return
  }

  loadSourceData({ flowId: flowId.value, id: dataId.value })
  loadFormSchema({ flowId: flowId.value })
})
</script>

<template>
  <view class="page-container">
    <wd-form ref="formRef" :model="formModel" :rules="formRules">
      <template v-for="(field, index) in fields" :key="`${field.key || field.text}-${index}`">
        <FormSectionTitle v-if="field.type === 'text'" :title="field.text || '表单信息'" icon="i-carbon-document" />

        <wd-cell-group v-else border>
          <wd-input
            v-if="field.type === 'textfield'"
            v-model="formModel[field.key as string]"
            :label="field.label || ''"
            :label-width="LABEL_WIDTH"
            :placeholder="field.description || '请输入'"
            clearable
            :rules="field.key ? formRules[field.key] : []"
          />

          <wd-input
            v-else-if="field.type === 'number'"
            v-model="formModel[field.key as string]"
            :label="field.label || ''"
            :label-width="LABEL_WIDTH"
            type="number"
            :placeholder="field.description || '请输入'"
            clearable
            :rules="field.key ? formRules[field.key] : []"
          />

          <wd-textarea
            v-else-if="field.type === 'textarea'"
            v-model="formModel[field.key as string]"
            :label="field.label || ''"
            :label-width="LABEL_WIDTH"
            :placeholder="field.description || '请输入'"
            :maxlength="500"
            show-word-limit
            :rules="field.key ? formRules[field.key] : []"
          />

          <wd-datetime-picker
            v-else-if="field.type === 'textdate'"
            v-model="formModel[field.key as string]"
            type="date"
            :label="field.label || ''"
            :label-width="LABEL_WIDTH"
            :placeholder="field.description || '请选择日期'"
            :rules="field.key ? formRules[field.key] : []"
          />

          <wd-datetime-picker
            v-else-if="field.type === 'textdatetime'"
            v-model="formModel[field.key as string]"
            type="time"
            :label="field.label || ''"
            :label-width="LABEL_WIDTH"
            :placeholder="field.description || '请选择时间'"
            :rules="field.key ? formRules[field.key] : []"
          />

          <wd-picker
            v-else-if="field.type === 'radio' || field.type === 'select' || field.type === 'checkbox'"
            v-model="formModel[field.key as string]"
            :label="field.label || ''"
            :label-width="LABEL_WIDTH"
            :columns="field.values || []"
            label-key="label"
            value-key="value"
            :rules="field.key ? formRules[field.key] : []"
          />
        </wd-cell-group>
      </template>
    </wd-form>

    <view class="file-card">
      <wd-cell-group border>
        <wd-cell title="附件" :value="fileName || '未选择'" />
      </wd-cell-group>
      <wd-button plain block @click="handleChooseFile">
        上传附件
      </wd-button>
    </view>

    <view class="action-bar">
      <wd-button plain @click="handleReset">
        重置
      </wd-button>
      <wd-button type="success" custom-class="ml-20rpx" :loading="submitting" @click="handleSubmit">
        保存
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 160rpx;
}

.file-card {
  margin: 20rpx;

  :deep(.wd-button) {
    margin-top: 20rpx;
  }
}

.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgb(0 0 0 / 6%);
}
</style>
