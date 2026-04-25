<!--
  访客详情页
  功能：展示访客详情，待审核状态可执行审核

  访问地址: http://localhost:3000/#/pages-sub/visit/detail
  建议携带参数: ?visitId=xxx

  旧代码：gitee-example/pages/visit/visitDetail.vue
-->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'
import type { VisitDetail } from '@/types/visit'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, reactive, ref } from 'vue'
import { auditVisit, getVisitDetail } from '@/api/visit'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'

definePage({
  style: {
    navigationBarTitleText: '访客详情',
  },
})

const LABEL_WIDTH = '88px'

const formRef = ref<FormInstance>()
const visitId = ref('')
const detail = ref<VisitDetail | null>(null)

const auditModel = reactive({
  state: '1',
  msg: '',
})

const stateOptions: ColumnItem[] = [
  { label: '同意', value: '1' },
  { label: '拒绝', value: '2' },
]

const rules: FormRules = {
  state: [{ required: true, message: '请选择审核结果' }],
  msg: [{ required: true, message: '请输入审核说明' }],
}

const canAudit = computed(() => detail.value?.state === '0')
const isApproved = computed(() => detail.value?.state === '1')

const { send: loadDetail } = useRequest(
  () =>
    getVisitDetail({
      page: 1,
      row: 1,
      visitId: visitId.value,
      communityId: 'COMM_001',
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    detail.value = event.data?.list?.[0] || null
  })
  .onError((error) => {
    console.error('加载访客详情失败', error)
    detail.value = null
  })

const { loading: submitting, send: submitAudit } = useRequest(
  () =>
    auditVisit({
      visitId: visitId.value,
      state: auditModel.state as '1' | '2',
      msg: auditModel.msg.trim(),
    }),
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({
      title: '审核成功',
      icon: 'none',
    })
    loadDetail()
  })
  .onError((error) => {
    console.error('审核访客失败', error)
    uni.showToast({
      title: '审核失败，请稍后重试',
      icon: 'none',
    })
  })

function handleSubmit() {
  formRef.value?.validate()
    .then(({ valid }: { valid: boolean }) => {
      if (!valid)
        return
      submitAudit()
    })
    .catch((error: unknown) => {
      console.error('访客审核表单校验失败', error)
    })
}

function copyVisitId() {
  if (!visitId.value)
    return
  uni.setClipboardData({
    data: visitId.value,
    success: () => {
      uni.showToast({
        title: '访客码已复制',
        icon: 'none',
      })
    },
  })
}

onLoad((options) => {
  visitId.value = options?.visitId || options?.vId || ''
  if (!visitId.value) {
    uni.showToast({
      title: '缺少访客编号',
      icon: 'none',
    })
    return
  }
  loadDetail()
})
</script>

<template>
  <view class="page">
    <wd-cell-group border>
      <FormSectionTitle
        title="基础信息"
        icon="user"
        icon-class="i-carbon-user text-blue-500"
      />
      <wd-cell title="访客" :value="detail ? `${detail.name}（${detail.phoneNumber}）` : '-'" />
      <wd-cell title="业主" :value="detail ? `${detail.ownerName}（${detail.roomName}）` : '-'" />
      <wd-cell title="状态" :value="detail?.stateName || '-'" />
      <wd-cell title="车牌号" :value="detail?.carNum || '-'" />
      <wd-cell title="拜访时间" :value="detail?.visitTime || '-'" />
      <wd-cell title="离开时间" :value="detail?.departureTime || '-'" />
      <wd-cell title="来访说明" :value="detail?.visitCase || '-'" />
    </wd-cell-group>

    <wd-form v-if="canAudit" ref="formRef" :model="auditModel" :rules="rules" class="mt-3">
      <wd-cell-group border>
        <FormSectionTitle
          title="审核信息"
          icon="task-approved"
          icon-class="i-carbon-task-approved text-amber-500"
          required
        />

        <wd-picker
          v-model="auditModel.state"
          label="审核状态"
          :label-width="LABEL_WIDTH"
          prop="state"
          :columns="stateOptions"
          :rules="rules.state"
        />

        <wd-textarea
          v-model="auditModel.msg"
          label="审核说明"
          :label-width="LABEL_WIDTH"
          prop="msg"
          placeholder="请输入审核说明"
          :maxlength="100"
          show-word-limit
          :rules="rules.msg"
        />
      </wd-cell-group>
    </wd-form>

    <view v-if="canAudit" class="action-wrap">
      <wd-button
        block
        type="primary"
        :loading="submitting"
        :disabled="submitting"
        @click="handleSubmit"
      >
        提交审核
      </wd-button>
    </view>

    <wd-cell-group v-if="isApproved" border class="mt-3">
      <FormSectionTitle
        title="访客码"
        icon="qr-code"
        icon-class="i-carbon-qr-code text-green-500"
      />
      <wd-cell title="访客编号" :value="visitId" />
      <view class="copy-wrap">
        <wd-button plain block @click="copyVisitId">
          复制访客编号
        </wd-button>
      </view>
    </wd-cell-group>
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
}

.copy-wrap {
  padding: 20rpx;
}
</style>
