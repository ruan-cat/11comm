<!--
  车辆出场页
  功能：手工登记车辆出场，支持优惠券抵扣和费用确认

  访问地址: http://localhost:3000/#/pages-sub/parking/car-out
  建议携带参数: ?machineId=xxx&machineCode=xxx&paId=xxx&paNum=xxx&boxId=xxx

  旧代码：gitee-example/pages/car/carOutParkingArea.vue
-->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import type { ParkingCoupon, TempCarInArea } from '@/types/parking'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import {
  customCarInOut,
  getTempCarFeeOrder,
  listCarInParkingArea,
  listParkingCouponCar,
} from '@/api/parking'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'

definePage({
  style: {
    navigationBarTitleText: '车辆出场',
  },
})

const LABEL_WIDTH = '96px'

const formRef = ref<FormInstance>()

const formModel = reactive({
  machineId: '',
  machineCode: '',
  paId: '',
  paNum: '',
  boxId: '',
  carNum: '',
  remark: '',
  payCharge: 0,
  amount: '',
  costMin: '',
  payType: '',
  inoutId: '',
})

const formRules: FormRules = {
  carNum: [{ required: true, message: '请输入车牌号' }],
  payType: [{ required: true, message: '请选择支付方式' }],
}

const payTypeColumns = [
  { label: '现金', value: '1001' },
  { label: '扫码支付', value: '1002' },
  { label: '银行卡', value: '1003' },
]

const coupons = ref<ParkingCoupon[]>([])
const selectedCouponIds = ref<string[]>([])

const { send: loadCoupons } = useRequest(
  () =>
    listParkingCouponCar({
      paId: formModel.paId,
      page: 1,
      row: 30,
      state: '1001',
      carNum: formModel.carNum,
      communityId: 'COMM_001',
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    coupons.value = event.data || []
  })
  .onError((error) => {
    console.error('查询优惠券失败', error)
  })

const { send: queryTempInfo } = useRequest(
  () =>
    listCarInParkingArea({
      page: 1,
      row: 1,
      communityId: 'COMM_001',
      paId: formModel.paId,
      paNum: formModel.paNum,
      carNum: formModel.carNum,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const first = (event.data || [])[0] as TempCarInArea | undefined
    if (!first) {
      uni.showToast({ title: '未查询到在场车辆', icon: 'none' })
      return
    }

    formModel.payCharge = first.payCharge
    formModel.amount = String(first.payCharge)
    formModel.inoutId = first.inoutId
    formModel.paId = first.paId
    formModel.costMin = `${first.hours}时${first.min}分`

    loadCoupons()
  })
  .onError((error) => {
    console.error('查询在场车辆失败', error)
  })

const { send: computeAmount } = useRequest(
  () =>
    getTempCarFeeOrder({
      paId: formModel.paId,
      pccIds: selectedCouponIds.value.join(','),
      carNum: formModel.carNum,
      communityId: 'COMM_001',
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    formModel.amount = String(event.data?.amount || 0)
  })
  .onError((error) => {
    console.error('计算优惠后费用失败', error)
  })

const { loading, send: submitOut } = useRequest(
  () =>
    customCarInOut({
      machineId: formModel.machineId,
      machineCode: formModel.machineCode,
      communityId: 'COMM_001',
      paId: formModel.paId,
      paNum: formModel.paNum,
      boxId: formModel.boxId,
      carNum: formModel.carNum,
      remark: formModel.remark,
      type: '1102',
      payCharge: Number(formModel.payCharge || 0),
      amount: Number(formModel.amount || 0),
      payType: formModel.payType,
      inoutId: formModel.inoutId,
      pccIds: selectedCouponIds.value,
    }),
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({ title: '出场成功', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 800)
  })
  .onError((error) => {
    console.error('车辆出场失败', error)
  })

function handleBlurCarNum() {
  if (!formModel.carNum)
    return

  queryTempInfo()
}

function handleCouponChange(event: { detail: { value: string[] } }) {
  selectedCouponIds.value = event.detail.value
  if (selectedCouponIds.value.length === 0) {
    formModel.amount = String(formModel.payCharge || 0)
    return
  }

  computeAmount()
}

function handleSubmit() {
  formRef.value?.validate().then(({ valid }) => {
    if (!valid)
      return

    submitOut()
  })
}

onLoad((options) => {
  formModel.machineId = options?.machineId || ''
  formModel.machineCode = options?.machineCode || ''
  formModel.paId = options?.paId || ''
  formModel.paNum = options?.paNum || ''
  formModel.boxId = options?.boxId || ''
})
</script>

<template>
  <view class="page">
    <wd-form ref="formRef" :model="formModel" :rules="formRules">
      <FormSectionTitle title="出场信息" icon="i-carbon-car-front" />
      <wd-cell-group border>
        <wd-input
          v-model="formModel.carNum"
          label="车牌号"
          :label-width="LABEL_WIDTH"
          prop="carNum"
          placeholder="请输入车牌号"
          clearable
          @blur="handleBlurCarNum"
        />
        <wd-input
          v-model="formModel.payCharge"
          label="应收金额"
          :label-width="LABEL_WIDTH"
          readonly
        />
        <wd-input
          v-model="formModel.amount"
          label="实收金额"
          :label-width="LABEL_WIDTH"
          placeholder="请输入实收金额"
        />
        <wd-input
          v-model="formModel.costMin"
          label="停车时长"
          :label-width="LABEL_WIDTH"
          readonly
        />
        <wd-picker
          v-model="formModel.payType"
          label="支付方式"
          :label-width="LABEL_WIDTH"
          prop="payType"
          :columns="payTypeColumns"
        />
        <wd-textarea
          v-model="formModel.remark"
          label="说明"
          :label-width="LABEL_WIDTH"
          placeholder="请输入说明"
          :maxlength="200"
          show-word-limit
        />
      </wd-cell-group>

      <view v-if="coupons.length > 0" class="coupon-wrap">
        <FormSectionTitle title="可用优惠券" icon="i-carbon-ticket" :animated="false" />
        <checkbox-group @change="handleCouponChange">
          <label v-for="item in coupons" :key="item.pccId" class="coupon-item">
            <view class="coupon-left">
              <text>{{ item.couponName }} - </text>
              <text v-if="item.typeCd === '1001'">{{ item.value }}分钟</text>
              <text v-else-if="item.typeCd === '2002'">{{ item.value }}元</text>
              <text v-else-if="item.typeCd === '3003'">{{ item.value }}折</text>
              <text v-else>全免</text>
            </view>
            <checkbox :value="item.pccId" />
          </label>
        </checkbox-group>
      </view>
    </wd-form>

    <view class="action-bar">
      <wd-button type="primary" block :loading="loading" @click="handleSubmit">
        出场
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

.coupon-wrap {
  margin-top: 20rpx;
  overflow: hidden;
  border-radius: 12rpx;
  background: #fff;
}

.coupon-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f3f4f6;
  font-size: 24rpx;
}

.coupon-item:last-child {
  border-bottom: none;
}

.action-bar {
  padding: 20rpx;
}
</style>
