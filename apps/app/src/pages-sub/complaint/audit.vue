<!--
  审核投诉单页面
  功能：审核投诉工单，选择处理结果并提交处理意见

  访问地址: http://localhost:3000/#/pages-sub/complaint/audit
  建议携带参数: ?complaintId=COMP_001&taskId=TASK_COMP_001

  完整示例: http://localhost:3000/#/pages-sub/complaint/audit?complaintId=COMP_001&taskId=TASK_COMP_001

  旧代码：gitee-example/pages/auditComplaintOrder/auditComplaintOrder.vue
-->

<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { auditComplaint } from '@/api/complaint'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { ComplaintStateCode } from '@/types/complaint'
import { getCurrentCommunity } from '@/utils/user'

/** 全局 Toast 提示 */
const toast = useGlobalToast()

definePage({
  style: {
    navigationBarTitleText: '审核投诉单',
    enablePullDownRefresh: false,
  },
})

/** 表单实例 */
const formRef = ref<FormInstance>()

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

/** 页面参数 */
const complaintId = ref('')
const taskId = ref('')

/** 处理结果选项 */
const stateOptions = [
  {
    label: '已处理',
    value: ComplaintStateCode.HANDLED,
  },
  {
    label: '无法处理',
    value: ComplaintStateCode.CANNOT_HANDLE,
  },
]

/** 表单数据模型 */
const model = reactive({
  state: '',
  remark: '',
})

/** 表单校验规则 */
const formRules: FormRules = {
  state: [{ required: true, message: '请选择处理结果' }],
  remark: [{ required: true, message: '请填写处理意见' }],
}

/** 获取小区信息 */
const communityInfo = getCurrentCommunity()

/** 提交审核 */
const { loading: submitting, send: submitAudit } = useRequest(
  () =>
    auditComplaint({
      state: model.state,
      remark: model.remark,
      taskId: taskId.value,
      complaintId: complaintId.value,
      communityId: communityInfo.communityId,
      storeId: 'STORE_001', // TODO: 从用户信息获取
      userId: 'USER_001', // TODO: 从用户信息获取
    }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('审核提交成功')
    uni.navigateBack({
      delta: 1,
    })
  })
  .onError((error) => {
    console.error('❌ 审核投诉失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

/** 页面加载 */
onLoad((options) => {
  complaintId.value = (options?.complaintId as string) || ''
  taskId.value = (options?.taskId as string) || ''

  if (!complaintId.value) {
    toast.error('缺少必要参数')
  }
})

/** 提交审核 */
function handleSubmit() {
  // 表单验证
  formRef.value
    ?.validate()
    .then(({ valid }) => {
      if (!valid) {
        return
      }

      submitAudit()
    })
    .catch((error) => {
      console.error('表单校验异常:', error)
    })
}
</script>

<template>
  <view class="audit-page">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 投诉信息提示 -->
      <view class="rounded bg-white p-3">
        <view class="flex items-center text-gray-600">
          <wd-icon name="info" custom-class="mr-2 text-blue-500" />
          <text class="text-sm">投诉编号：{{ complaintId }}</text>
        </view>
      </view>

      <!-- 审核信息表单 -->
      <FormSectionTitle title="审核信息" />
      <wd-cell-group border>
        <!-- 处理结果 -->
        <wd-picker
          v-model="model.state"
          label="处理结果"
          :label-width="LABEL_WIDTH"
          prop="state"
          :columns="stateOptions"
          label-key="label"
          value-key="value"
          :rules="formRules.state"
        />

        <!-- 处理意见 -->
        <wd-textarea
          v-model="model.remark"
          label="处理意见"
          :label-width="LABEL_WIDTH"
          prop="remark"
          placeholder="请输入处理意见"
          :maxlength="200"
          show-word-limit
          :auto-height="true"
          :min-height="100"
          clearable
          :rules="formRules.remark"
        />
      </wd-cell-group>

      <!-- 提交按钮 -->
      <view class="mt-6 px-3 pb-6">
        <wd-button type="success" size="large" :loading="submitting" @click="handleSubmit">
          提交
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style lang="scss" scoped>
.audit-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.section-title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 20px 15px 10px;
}
</style>
