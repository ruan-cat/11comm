<!--
  审核共享抄表页
  功能：审核公摊抄表记录并填写审核说明

  访问地址: http://localhost:3000/#/pages-sub/meter/audit-share-reading
  建议携带参数: ?readingId=FSR_0001

  旧代码：gitee-example/pages/meter/auditShareReading.vue
-->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { auditFloorShareReading } from '@/api/meter'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '审核共享抄表',
  },
})

const LABEL_WIDTH = '88px'

const toast = useGlobalToast()
const communityInfo = getCurrentCommunity()

const formRef = ref<FormInstance>()

const stateOptions: ColumnItem[] = [
  { label: '同意', value: 'C' },
  { label: '拒绝', value: 'F' },
]

const model = reactive({
  readingId: '',
  state: '',
  auditRemark: '',
})

const formRules: FormRules = {
  state: [{ required: true, message: '请选择审核结果' }],
  auditRemark: [{ required: true, message: '请填写审核说明' }],
}

const { loading: submitting, send: submitAudit } = useRequest(
  (params: { state: 'C' | 'F', auditRemark: string, readingId: string, communityId: string }) =>
    auditFloorShareReading(params),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('审核成功')
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 900)
  })
  .onError((error) => {
    console.error('审核共享抄表失败:', error)
  })

function handleStateConfirm(event: { value: string }) {
  model.state = event.value
}

function handleSubmit() {
  formRef.value?.validate()
    .then(({ valid }: { valid: boolean }) => {
      if (!valid)
        return

      if (!model.readingId) {
        toast.warning('缺少抄表记录参数，请返回重试')
        return
      }

      submitAudit({
        state: model.state as 'C' | 'F',
        auditRemark: model.auditRemark,
        readingId: model.readingId,
        communityId: communityInfo.communityId,
      })
    })
    .catch((error: any) => {
      console.error('表单校验异常:', error)
    })
}

onLoad((options) => {
  model.readingId = String(options.readingId || '')
})
</script>

<template>
  <view class="min-h-screen bg-gray-100 p-3">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <wd-cell-group border>
        <FormSectionTitle
          title="审核信息"
          icon="task-approved"
          icon-class="i-carbon-task-approved text-blue-500"
          required
        />

        <wd-picker
          v-model="model.state"
          label="审核结果"
          :label-width="LABEL_WIDTH"
          prop="state"
          :columns="stateOptions"
          :rules="formRules.state"
          @confirm="handleStateConfirm"
        />

        <wd-textarea
          v-model="model.auditRemark"
          label="审核说明"
          :label-width="LABEL_WIDTH"
          prop="auditRemark"
          placeholder="请输入审核说明"
          :maxlength="250"
          show-word-limit
          :rules="formRules.auditRemark"
        />
      </wd-cell-group>

      <view class="mt-6 px-1 pb-6">
        <wd-button
          block
          type="primary"
          size="large"
          :loading="submitting"
          :disabled="submitting"
          @click="handleSubmit"
        >
          提交审核
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style scoped>
</style>
