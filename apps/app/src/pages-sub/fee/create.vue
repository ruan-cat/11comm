<!--
  创建费用
  功能：创建新的费用记录，支持选择收费类型、收费项目、计费时间等

  访问地址: http://localhost:3000/#/pages-sub/fee/create
  建议携带参数: ?payerObjId=xxx&payerObjName=xxx&communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/fee/create?payerObjId=ROOM_001&payerObjName=1栋101室&communityId=COMM_001

  旧代码：gitee-example/pages/fee/createFee.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, reactive, ref } from 'vue'
import { queryDictInfo, queryFeeConfigs, saveRoomCreateFee } from '@/api/fee'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '创建费用',
    enablePullDownRefresh: false,
  },
})

// ==================== 常量定义 ====================

/** 表单标签统一宽度 */
const LABEL_WIDTH = '140rpx'

// ==================== 依赖注入 ====================

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

// ==================== 页面状态 ====================

/** 页面参数 */
const pageParams = reactive({
  payerObjId: '',
  payerObjName: '',
})

/** 收费类型列表 */
const feeTypeCds = ref<ColumnItem[]>([])

/** 收费项目列表 */
const feeConfigs = ref<ColumnItem[]>([])

/** 表单数据模型 */
const model = reactive({
  /** 收费范围（只读） */
  payerObjName: '',
  /** 收费类型 */
  feeTypeCd: '',
  /** 收费项目 */
  configId: '',
  /** 计费起始时间 */
  startTime: '',
  /** 计费结束时间 */
  endTime: '',
  /** 收费金额（固定金额时需要） */
  amount: '',
  /** 递增周期（递增公式时需要） */
  rateCycle: '',
  /** 计费递增率（递增公式时需要） */
  rate: '',
  /** 递增开始时间（递增公式时需要） */
  rateStartTime: '',
  /** 费用标识 */
  feeFlag: '',
  /** 计算公式 */
  computingFormula: '',
})

/** 收费类型选中索引 */
const feeTypeCdIndex = ref(-1)

/** 收费项目选中索引 */
const configIndex = ref(-1)

// ==================== 计算属性 ====================

/** 是否显示收费金额（固定金额公式 4004） */
const showAmount = computed(() => model.computingFormula === '4004')

/** 是否显示递增相关字段（递增公式 1102） */
const showRate = computed(() => model.computingFormula === '1102')

/** 是否显示结束时间（非周期性费用 1003006） */
const showEndTime = computed(() => model.feeFlag !== '1003006')

// ==================== 数据请求 ====================

/** 加载收费类型列表 */
const { send: loadFeeTypeCds, loading: feeTypeLoading } = useRequest(
  () =>
    queryDictInfo({
      name: 'pay_fee_config',
      type: 'fee_type_cd',
    }),
  {
    immediate: false,
  },
).onSuccess((event) => {
  // 过滤掉无效的状态码
  const validTypes = (event.data as Array<{ statusCd: string, name: string }>).filter(
    item => item.statusCd !== '888800010015' && item.statusCd !== '888800010016',
  )
  feeTypeCds.value = validTypes.map(item => ({
    value: item.statusCd,
    label: item.name,
  }))
}).onError((error) => {
  console.error('加载收费类型失败:', error)
})

/** 加载收费项目列表 */
const { send: loadConfigs, loading: configsLoading } = useRequest(
  (feeTypeCd: string) =>
    queryFeeConfigs({
      page: 1,
      row: 500,
      communityId: communityInfo.communityId,
      feeTypeCd,
      isDefault: 'F',
      valid: 1,
    }),
  {
    immediate: false,
  },
).onSuccess((event) => {
  feeConfigs.value = (event.data as Array<{ configId: string, feeName: string }>).map(item => ({
    value: item.configId,
    label: item.feeName,
  }))
}).onError((error) => {
  console.error('加载收费项目失败:', error)
})

/** 提交创建费用 */
const { send: submitCreateFee, loading: submitLoading } = useRequest(
  (data: typeof model) =>
    saveRoomCreateFee({
      locationTypeCd: '3000',
      locationObjId: pageParams.payerObjId,
      feeTypeCd: data.feeTypeCd,
      configId: data.configId,
      startTime: data.startTime,
      feeFlag: data.feeFlag,
      endTime: data.endTime,
      computingFormula: data.computingFormula,
      amount: data.amount,
      rateCycle: data.rateCycle,
      rate: data.rate,
      rateStartTime: data.rateStartTime,
      communityId: communityInfo.communityId,
    }),
  {
    immediate: false,
  },
).onSuccess((event) => {
  const data = event.data as { totalRoom: number, successRoom: number, errorRoom: number }
  toast.success(`创建收费成功，总共[${data.totalRoom}]房屋，成功[${data.successRoom}],失败[${data.errorRoom}]`)
  uni.navigateBack()
}).onError((error) => {
  console.error('创建费用失败:', error)
})

// ==================== 生命周期 ====================

/** 页面加载 */
onLoad((options) => {
  pageParams.payerObjId = options?.payerObjId || ''
  pageParams.payerObjName = options?.payerObjName || ''
  model.payerObjName = pageParams.payerObjName

  // 加载收费类型
  loadFeeTypeCds()
})

// ==================== 表单事件 ====================

/** 收费类型变更 */
function handleFeeTypeChange({ value }: { value: number }) {
  feeTypeCdIndex.value = value
  if (value >= 0 && feeTypeCds.value[value]) {
    model.feeTypeCd = feeTypeCds.value[value].value as string
    // 重新加载收费项目
    loadConfigs(model.feeTypeCd)
  }
}

/** 收费项目变更 */
function handleConfigChange({ value }: { value: number }) {
  configIndex.value = value
  if (value >= 0 && feeConfigs.value[value]) {
    model.configId = feeConfigs.value[value].value as string
    // 获取选中项目的配置信息
    // 清空结束时间（特定条件下）
    if (
      model.feeTypeCd !== '888800010006'
      && model.feeTypeCd !== '888800010014'
      && model.feeFlag === '1003006'
    ) {
      model.endTime = ''
    }
  }
}

/** 计费起始时间变更 */
function handleStartTimeChange({ value }: { value: string }) {
  model.startTime = value
}

/** 计费结束时间变更 */
function handleEndTimeChange({ value }: { value: string }) {
  model.endTime = value
}

/** 递增开始时间变更 */
function handleRateStartTimeChange({ value }: { value: string }) {
  model.rateStartTime = value
}

/** 表单引用 */
const formRef = ref()

/** 提交表单 */
async function handleSubmit() {
  // 表单校验
  const valid = await formRef.value?.validate()
  if (!valid)
    return

  // 提交创建费用
  await submitCreateFee(model)
}

/** 表单校验规则 */
const rules: FormRules = {
  feeTypeCd: [
    {
      required: true,
      message: '请选择收费类型',
      trigger: 'change',
    },
  ],
  configId: [
    {
      required: true,
      message: '请选择收费项目',
      trigger: 'change',
    },
  ],
  startTime: [
    {
      required: true,
      message: '请选择计费起始时间',
      trigger: 'change',
    },
  ],
}
</script>

<template>
  <wd-form ref="formRef" :model="model" :rules="rules" :label-width="LABEL_WIDTH">
    <FormSectionTitle title="基本信息" />

    <!-- 收费范围（只读） -->
    <wd-cell-group>
      <wd-cell prop="payerObjName" title="收费范围">
        <wd-input v-model="model.payerObjName" disabled placeholder="请输入收费范围" />
      </wd-cell>
    </wd-cell-group>

    <FormSectionTitle title="收费设置" />

    <wd-cell-group>
      <!-- 收费类型选择 -->
      <wd-cell prop="feeTypeCd" title="收费类型">
        <wd-picker
          v-model="model.feeTypeCd"
          :columns="feeTypeCds"
          placeholder="请选择收费类型"
          :loading="feeTypeLoading"
          @change="handleFeeTypeChange"
        />
      </wd-cell>

      <!-- 收费项目选择 -->
      <wd-cell prop="configId" title="收费项目">
        <wd-picker
          v-model="model.configId"
          :columns="feeConfigs"
          placeholder="请选择收费项目"
          :loading="configsLoading"
          @change="handleConfigChange"
        />
      </wd-cell>

      <!-- 收费金额（固定金额时显示） -->
      <wd-cell v-if="showAmount" prop="amount" title="收费金额">
        <wd-input v-model="model.amount" type="number" placeholder="请输入收费金额" />
      </wd-cell>

      <!-- 计费起始时间 -->
      <wd-cell prop="startTime" title="计费起始时间">
        <wd-datetime-picker
          v-model="model.startTime"
          type="date"
          placeholder="请选择计费起始时间"
          :min-date="new Date('2020-09-01').getTime()"
          :max-date="new Date('2050-09-01').getTime()"
          @change="handleStartTimeChange"
        />
      </wd-cell>

      <!-- 计费结束时间 -->
      <wd-cell v-if="showEndTime" prop="endTime" title="计费结束时间">
        <wd-datetime-picker
          v-model="model.endTime"
          type="date"
          placeholder="请选择计费结束时间"
          :min-date="new Date('2020-09-01').getTime()"
          :max-date="new Date('2050-09-01').getTime()"
          @change="handleEndTimeChange"
        />
      </wd-cell>

      <!-- 递增周期（递增公式时显示） -->
      <wd-cell v-if="showRate" prop="rateCycle" title="递增周期">
        <wd-input v-model="model.rateCycle" type="number" placeholder="请输入递增周期" />
      </wd-cell>

      <!-- 计费递增率（递增公式时显示） -->
      <wd-cell v-if="showRate" prop="rate" title="计费递增率">
        <wd-input v-model="model.rate" type="number" placeholder="请输入计费递增率" />
      </wd-cell>

      <!-- 递增开始时间（递增公式时显示） -->
      <wd-cell v-if="showRate" prop="rateStartTime" title="递增开始时间">
        <wd-datetime-picker
          v-model="model.rateStartTime"
          type="date"
          placeholder="请选择递增开始时间"
          :min-date="new Date('2020-09-01').getTime()"
          :max-date="new Date('2050-09-01').getTime()"
          @change="handleRateStartTimeChange"
        />
      </wd-cell>
    </wd-cell-group>

    <!-- 提交按钮 -->
    <view class="p-30rpx">
      <wd-button type="primary" size="large" block :loading="submitLoading" @click="handleSubmit">
        提交
      </wd-button>
    </view>
  </wd-form>
</template>
