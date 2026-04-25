<!--
  物品详情页
  功能：展示物品放行详情、物品明细和审批流，支持待办任务审核

  访问地址: http://localhost:3000/#/pages-sub/item/release-detail
  建议携带参数: ?irId=xxx&flowId=xxx&action=Audit&taskId=xxx

  旧代码：gitee-example/pages/itemRelease/itemReleaseDetail.vue
-->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'
import type {
  ItemReleaseComment,
  ItemReleaseDetail,
  ItemReleaseResource,
} from '@/types/item-release'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, reactive, ref } from 'vue'
import {
  auditItemRelease,
  getItemRelease,
  getItemReleaseRes,
  queryItemReleaseComment,
} from '@/api/item-release'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'

definePage({
  style: {
    navigationBarTitleText: '物品详情',
  },
})

const LABEL_WIDTH = '88px'

const formRef = ref<FormInstance>()
const irId = ref('')
const flowId = ref('')
const taskId = ref('')
const action = ref<'Audit' | 'View'>('View')

const detail = ref<ItemReleaseDetail | null>(null)
const resources = ref<ItemReleaseResource[]>([])
const comments = ref<ItemReleaseComment[]>([])

const auditModel = reactive({
  auditCode: '1100',
  auditMessage: '同意',
})

const auditCodeOptions: ColumnItem[] = [
  { label: '同意', value: '1100' },
  { label: '拒绝', value: '1200' },
]

const auditRules: FormRules = {
  auditCode: [{ required: true, message: '请选择审核结果' }],
  auditMessage: [{ required: true, message: '请填写审核说明' }],
}

const canAudit = computed(() => action.value === 'Audit' && Boolean(taskId.value))

const { send: loadDetail } = useRequest(
  () =>
    getItemRelease({
      page: 1,
      row: 1,
      irId: irId.value,
      communityId: 'COMM_001',
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    detail.value = event.data?.list?.[0] || null
  })
  .onError((error) => {
    console.error('加载放行详情失败', error)
    detail.value = null
  })

const { send: loadResources } = useRequest(
  () =>
    getItemReleaseRes({
      page: 1,
      row: 100,
      irId: irId.value,
      communityId: 'COMM_001',
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    resources.value = event.data?.list || []
  })
  .onError((error) => {
    console.error('加载物品明细失败', error)
    resources.value = []
  })

const { send: loadComments } = useRequest(
  () =>
    queryItemReleaseComment({
      page: 1,
      row: 100,
      id: irId.value,
      flowId: flowId.value,
      communityId: 'COMM_001',
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    comments.value = event.data?.list || []
  })
  .onError((error) => {
    console.error('加载审批记录失败', error)
    comments.value = []
  })

const { loading: submitting, send: submitAudit } = useRequest(
  () =>
    auditItemRelease({
      irId: irId.value,
      flowId: flowId.value,
      taskId: taskId.value,
      auditCode: auditModel.auditCode as '1100' | '1200',
      auditMessage: auditModel.auditMessage.trim(),
    }),
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({
      title: '审核成功',
      icon: 'none',
    })
    action.value = 'View'
    Promise.all([loadDetail(), loadResources(), loadComments()])
  })
  .onError((error) => {
    console.error('审核物品放行失败', error)
    uni.showToast({
      title: '审核失败，请稍后重试',
      icon: 'none',
    })
  })

function handleSubmitAudit() {
  formRef.value?.validate()
    .then(({ valid }: { valid: boolean }) => {
      if (!valid)
        return
      submitAudit()
    })
    .catch((error: unknown) => {
      console.error('审核表单校验失败', error)
    })
}

onLoad((options) => {
  irId.value = options?.irId || ''
  flowId.value = options?.flowId || ''
  taskId.value = options?.taskId || ''
  action.value = options?.action === 'Audit' ? 'Audit' : 'View'

  if (!irId.value) {
    uni.showToast({
      title: '缺少放行编号',
      icon: 'none',
    })
    return
  }

  Promise.all([loadDetail(), loadResources(), loadComments()])
})
</script>

<template>
  <view class="page">
    <wd-cell-group border>
      <FormSectionTitle
        title="基础信息"
        icon="document"
        icon-class="i-carbon-document text-blue-500"
      />
      <wd-cell title="放行类型" :value="detail?.typeName || '-'" />
      <wd-cell title="申请单位" :value="detail?.applyCompany || '-'" />
      <wd-cell title="申请人" :value="detail ? `${detail.applyPerson}（${detail.applyTel}）` : '-'" />
      <wd-cell title="身份证" :value="detail?.idCard || '-'" />
      <wd-cell title="车牌号" :value="detail?.carNum || '-'" />
      <wd-cell title="通行时间" :value="detail?.passTime || '-'" />
      <wd-cell title="备注" :value="detail?.remark || '-'" />
    </wd-cell-group>

    <wd-cell-group border class="mt-3">
      <FormSectionTitle
        title="物品信息"
        icon="cube"
        icon-class="i-carbon-cube text-green-500"
      />
      <wd-cell
        v-for="item in resources"
        :key="item.resId"
        :title="item.resName"
        :value="`数量：${item.amount}`"
      />
      <wd-status-tip v-if="resources.length === 0" image="content" tip="暂无物品信息" />
    </wd-cell-group>

    <wd-cell-group border class="mt-3">
      <FormSectionTitle
        title="审批流转"
        icon="flow"
        icon-class="i-carbon-flow text-purple-500"
      />
      <wd-cell
        v-for="(item, index) in comments"
        :key="`${item.staffName}-${index}`"
        :title="item.staffName"
        :label="item.context"
        :value="item.endTime ? '处理完成' : '处理中'"
      />
      <wd-status-tip v-if="comments.length === 0" image="content" tip="暂无审批记录" />
    </wd-cell-group>

    <wd-form v-if="canAudit" ref="formRef" :model="auditModel" :rules="auditRules" class="mt-3">
      <wd-cell-group border>
        <FormSectionTitle
          title="审核信息"
          icon="task-approved"
          icon-class="i-carbon-task-approved text-amber-500"
          required
        />

        <wd-picker
          v-model="auditModel.auditCode"
          label="审核结果"
          :label-width="LABEL_WIDTH"
          prop="auditCode"
          :columns="auditCodeOptions"
          :rules="auditRules.auditCode"
        />

        <wd-textarea
          v-model="auditModel.auditMessage"
          label="审核说明"
          :label-width="LABEL_WIDTH"
          prop="auditMessage"
          placeholder="请输入审核说明"
          :maxlength="100"
          show-word-limit
          :rules="auditRules.auditMessage"
        />
      </wd-cell-group>
    </wd-form>

    <view v-if="canAudit" class="action-wrap">
      <wd-button
        block
        type="primary"
        :loading="submitting"
        :disabled="submitting"
        @click="handleSubmitAudit"
      >
        提交审核
      </wd-button>
    </view>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.action-wrap {
  margin-top: 24rpx;
  padding-bottom: 20rpx;
}
</style>
