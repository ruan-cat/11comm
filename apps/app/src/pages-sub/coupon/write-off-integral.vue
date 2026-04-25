<!--
  核销积分页
  功能：提交积分核销并查看积分核销记录

  访问地址: http://localhost:3000/#/pages-sub/coupon/write-off-integral

  旧代码：gitee-example/pages/coupon/writeOffIntegral.vue
-->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'
import type { IntegralSetting, IntegralWriteOffLog } from '@/types/coupon'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, reactive, ref } from 'vue'
import {
  listIntegralSetting,
  listIntegralUserDetail,
  useIntegral,
} from '@/api/coupon'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'

definePage({
  style: {
    navigationBarTitleText: '核销积分',
  },
})

type ZPagingRef = any

const LABEL_WIDTH = '88px'
const active = ref(0)
const formRef = ref<FormInstance>()
const setting = ref<IntegralSetting | null>(null)
const settingColumns = ref<ColumnItem[]>([])

const logPagingRef = ref<ZPagingRef>()
const logs = ref<IntegralWriteOffLog[]>([])
const searchOwnerTel = ref('')

const formModel = reactive({
  settingId: '',
  ownerName: '',
  ownerTel: '',
  integral: '',
  remark: '',
})

const rules: FormRules = {
  settingId: [{ required: true, message: '请选择积分配置' }],
  ownerName: [{ required: true, message: '请输入姓名' }],
  ownerTel: [{ required: true, message: '请输入手机号' }],
  integral: [
    { required: true, message: '请输入核销积分' },
    {
      required: false,
      message: '',
      validator: (value) => {
        const integral = Number(value)
        if (!Number.isFinite(integral) || integral <= 0)
          return Promise.reject(new Error('请输入大于 0 的积分'))
        return Promise.resolve()
      },
    },
  ],
}

const { send: loadSetting } = useRequest(
  () => listIntegralSetting({ page: 1, row: 10, communityId: 'COMM_001' }),
  { immediate: false },
)
  .onSuccess((event) => {
    setting.value = event.data?.[0] || null
    settingColumns.value = (event.data || []).map(item => ({
      label: item.settingName,
      value: item.settingId,
    }))
    if (setting.value && !formModel.settingId)
      formModel.settingId = setting.value.settingId
  })
  .onError((error) => {
    console.error('加载积分配置失败', error)
  })

const { loading: submitting, send: submitIntegral } = useRequest(
  () =>
    useIntegral({
      communityId: 'COMM_001',
      ownerName: formModel.ownerName.trim(),
      ownerTel: formModel.ownerTel.trim(),
      integral: Number(formModel.integral),
      remark: formModel.remark.trim() || undefined,
    }),
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({
      title: '核销成功',
      icon: 'none',
    })
    formModel.ownerName = ''
    formModel.ownerTel = ''
    formModel.integral = ''
    formModel.remark = ''
    logPagingRef.value?.reload()
  })
  .onError((error) => {
    console.error('积分核销失败', error)
    uni.showToast({
      title: '核销失败，请稍后重试',
      icon: 'none',
    })
  })

const { send: loadLogs } = useRequest(
  (params: { page: number, row: number }) =>
    listIntegralUserDetail({
      page: params.page,
      row: params.row,
      communityId: 'COMM_001',
      ownerTel: searchOwnerTel.value.trim() || undefined,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    logPagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('加载积分核销记录失败', error)
    logPagingRef.value?.complete(false)
  })

function handleTabChange(e: { index: number }) {
  active.value = e.index
  if (active.value === 1)
    logPagingRef.value?.reload()
}

function handleLogQuery(pageNo: number, pageSize: number) {
  loadLogs({
    page: pageNo,
    row: pageSize,
  })
}

function handleLogSearch() {
  logPagingRef.value?.reload()
}

function handleSubmit() {
  formRef.value?.validate()
    .then(({ valid }: { valid: boolean }) => {
      if (!valid)
        return

      const currentSetting = settingColumns.value.find(item => item.value === formModel.settingId)
      if (!currentSetting) {
        uni.showToast({
          title: '请选择积分配置',
          icon: 'none',
        })
        return
      }

      const integral = Number(formModel.integral)
      if (setting.value && integral > setting.value.onceMaxIntegral) {
        uni.showToast({
          title: `单次最多核销 ${setting.value.onceMaxIntegral} 积分`,
          icon: 'none',
        })
        return
      }

      submitIntegral()
    })
    .catch((error: unknown) => {
      console.error('积分核销表单校验失败', error)
    })
}

onLoad(() => {
  loadSetting()
})

onMounted(() => {
  logPagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <wd-tabs :value="active" @change="handleTabChange">
      <wd-tab title="积分核销" />
      <wd-tab title="核销记录" />
    </wd-tabs>

    <view v-if="active === 0" class="tab-content">
      <wd-form ref="formRef" :model="formModel" :rules="rules">
        <wd-cell-group border>
          <FormSectionTitle
            title="核销信息"
            icon="currency"
            icon-class="i-carbon-currency text-blue-500"
            required
          />

          <wd-picker
            v-model="formModel.settingId"
            label="积分配置"
            :label-width="LABEL_WIDTH"
            prop="settingId"
            :columns="settingColumns"
            :rules="rules.settingId"
          />

          <wd-input
            v-model="formModel.ownerName"
            label="姓名"
            :label-width="LABEL_WIDTH"
            prop="ownerName"
            placeholder="请输入姓名"
            :rules="rules.ownerName"
          />

          <wd-input
            v-model="formModel.ownerTel"
            label="手机号"
            :label-width="LABEL_WIDTH"
            prop="ownerTel"
            placeholder="请输入手机号"
            :rules="rules.ownerTel"
          />

          <wd-input
            v-model="formModel.integral"
            label="核销积分"
            :label-width="LABEL_WIDTH"
            prop="integral"
            type="number"
            placeholder="请输入核销积分"
            :rules="rules.integral"
          />

          <wd-textarea
            v-model="formModel.remark"
            label="备注"
            :label-width="LABEL_WIDTH"
            placeholder="请输入核销说明"
            :maxlength="120"
            show-word-limit
          />
        </wd-cell-group>
      </wd-form>

      <view class="tip">
        <text v-if="setting" class="tip-text">
          当前配置：{{ setting.settingName }}，单次最多核销 {{ setting.onceMaxIntegral }} 积分
        </text>
      </view>

      <view class="submit-wrap">
        <wd-button block type="primary" :loading="submitting" @click="handleSubmit">
          提交核销
        </wd-button>
      </view>
    </view>

    <view v-if="active === 1" class="tab-content">
      <view class="search-wrap">
        <wd-input
          v-model="searchOwnerTel"
          placeholder="请输入手机号搜索"
          clearable
        />
        <wd-button type="primary" custom-class="ml-10rpx" @click="handleLogSearch">
          搜索
        </wd-button>
      </view>

      <z-paging ref="logPagingRef" v-model="logs" @query="handleLogQuery">
        <template #loading>
          <ZPagingLoading
            icon="chart-line-data"
            icon-class="i-carbon-chart-line-data text-blue-500 animate-pulse"
            primary-text="正在加载积分核销记录..."
            secondary-text="请稍候"
          />
        </template>

        <view class="list-wrap">
          <view v-for="item in logs" :key="item.logId" class="log-card">
            <view class="log-row">
              <text class="label">姓名</text>
              <text class="value">{{ item.ownerName }}</text>
            </view>
            <view class="log-row">
              <text class="label">手机号</text>
              <text class="value">{{ item.ownerTel }}</text>
            </view>
            <view class="log-row">
              <text class="label">积分</text>
              <text class="value">{{ item.integral }}</text>
            </view>
            <view class="log-row">
              <text class="label">操作人</text>
              <text class="value">{{ item.operatorName }}</text>
            </view>
            <view class="log-row">
              <text class="label">核销时间</text>
              <text class="value">{{ item.createTime }}</text>
            </view>
          </view>
        </view>

        <template #empty>
          <wd-status-tip image="content" tip="暂无积分核销记录" />
        </template>
      </z-paging>
    </view>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

.tab-content {
  padding: 20rpx;
}

.tip {
  margin-top: 20rpx;
  padding: 18rpx;
  border-radius: 12rpx;
  background: #eff6ff;
}

.tip-text {
  color: #1d4ed8;
  font-size: 24rpx;
}

.submit-wrap {
  margin-top: 28rpx;
}

.search-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.list-wrap {
  padding-bottom: 20rpx;
}

.log-card {
  margin-bottom: 14rpx;
  border-radius: 12rpx;
  background: #fff;
  padding: 20rpx;
}

.log-row {
  margin-top: 8rpx;
  display: flex;
  justify-content: space-between;
}

.log-row:first-child {
  margin-top: 0;
}

.label {
  font-size: 24rpx;
  color: #6b7280;
}

.value {
  font-size: 24rpx;
  color: #111827;
}
</style>
