<!--
  工作流审核页
  功能：处理 OA 工作流待办单据，支持办理、退回、转单、结束等动作

  访问地址: http://localhost:3000/#/pages-sub/oa/workflow-audit
  建议携带参数: ?flowId=FLOW_001&id=OA_001&taskId=TASK_001

  旧代码：gitee-example/pages/newOaWorkflowUndoAudit/newOaWorkflowUndoAudit.vue
-->

<script setup lang="ts">
import type { OaWorkflowAuditAction, OaWorkflowNextTask } from '@/types/oa-workflow'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import { auditOaWorkflow, getNextTask } from '@/api/oa-workflow'
import { useGlobalToast } from '@/hooks/useGlobalToast'

definePage({
  style: {
    navigationBarTitleText: '工作流审核',
  },
})

/** 流程ID */
const flowId = ref('')
/** 单据ID */
const id = ref('')
/** 任务ID */
const taskId = ref('')
/** 下一任务配置 */
const nextTask = ref<OaWorkflowNextTask | null>(null)
/** 动作列表 */
const actions = ref<OaWorkflowAuditAction[]>([])
/** 审核动作 */
const auditCode = ref<OaWorkflowAuditAction['value']>('1100')
/** 审核意见 */
const auditMessage = ref('')
/** 下一处理人ID */
const staffId = ref('')
/** 下一处理人名称（可选） */
const staffName = ref('')

const toast = useGlobalToast()

/** 动作选项（用于 wd-picker） */
const actionColumns = computed(() => {
  return actions.value.map(item => ({
    label: item.label,
    value: item.value,
  }))
})

/** 是否需要填写下一处理人 */
const requiresStaff = computed(() => {
  if (!nextTask.value) {
    return false
  }

  if (auditCode.value === '1300') {
    return true
  }

  return auditCode.value === '1100' && nextTask.value.assignee === '-2'
})

/** 加载下一任务动作 */
const { send: loadNextTask } = useRequest(
  (params: { taskId: string, flowId: string, id: string }) => getNextTask(params),
  { immediate: false },
)
  .onSuccess((event) => {
    const next = event.data?.data?.[0] || null
    nextTask.value = next

    const nextActions: OaWorkflowAuditAction[] = []

    if (next?.next) {
      nextActions.push({ label: '办理', value: '1100' })
    }
    if (next?.back) {
      nextActions.push({ label: '退回', value: '1200' })
    }
    if (next?.backIndex) {
      nextActions.push({ label: '退回至提交者', value: '1400' })
    }
    if (next?.exit) {
      nextActions.push({ label: '结束', value: '1500' })
    }

    nextActions.push({ label: '转单', value: '1300' })

    actions.value = nextActions
    auditCode.value = nextActions[0]?.value || '1100'
  })
  .onError((error) => {
    console.error('加载审核动作失败:', error)
    toast.error('加载审核动作失败')
  })

/** 提交审核 */
const { loading: submitting, send: submitAudit } = useRequest(
  () =>
    auditOaWorkflow({
      flowId: flowId.value,
      id: id.value,
      taskId: taskId.value,
      auditCode: auditCode.value,
      auditMessage: auditMessage.value,
      staffId: staffId.value,
    }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('提交成功')
    setTimeout(() => {
      uni.navigateBack({ delta: 2 })
    }, 800)
  })
  .onError((error) => {
    console.error('提交审核失败:', error)
    toast.error('提交审核失败')
  })

/** 执行提交 */
function handleSubmit() {
  if (!flowId.value || !id.value || !taskId.value) {
    toast.warning('参数缺失')
    return
  }

  if (!auditCode.value) {
    toast.warning('请选择动作')
    return
  }

  if (!auditMessage.value.trim()) {
    toast.warning('请填写处理意见')
    return
  }

  const fixedAssignee = nextTask.value?.assignee
  if (fixedAssignee && fixedAssignee !== '-2') {
    staffId.value = fixedAssignee
  }

  if (requiresStaff.value && !staffId.value.trim()) {
    toast.warning('请填写下一处理人')
    return
  }

  submitAudit()
}

onLoad((options) => {
  flowId.value = options?.flowId || ''
  id.value = options?.id || ''
  taskId.value = options?.taskId || ''

  if (!flowId.value || !id.value || !taskId.value) {
    toast.warning('flowId、id、taskId 不能为空')
    return
  }

  loadNextTask({
    flowId: flowId.value,
    id: id.value,
    taskId: taskId.value,
  })
})
</script>

<template>
  <view class="audit-page">
    <wd-cell-group border>
      <wd-picker
        v-model="auditCode"
        label="动作"
        label-width="96px"
        :columns="actionColumns"
        label-key="label"
        value-key="value"
      />

      <wd-textarea
        v-model="auditMessage"
        label="处理意见"
        label-width="96px"
        placeholder="请输入处理意见"
        :maxlength="500"
        show-word-limit
      />

      <wd-input
        v-if="requiresStaff"
        v-model="staffId"
        label="下一处理人ID"
        label-width="96px"
        placeholder="请输入下一处理人ID"
        clearable
      />

      <wd-input
        v-if="requiresStaff"
        v-model="staffName"
        label="下一处理人"
        label-width="96px"
        placeholder="请输入下一处理人姓名（可选）"
        clearable
      />
    </wd-cell-group>

    <view class="action-bar">
      <wd-button type="success" block :loading="submitting" @click="handleSubmit">
        提交
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.audit-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.action-bar {
  margin-top: 24rpx;
}
</style>
