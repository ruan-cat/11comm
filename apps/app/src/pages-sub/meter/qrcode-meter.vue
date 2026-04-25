<!--
  二维码水表页
  功能：基于房屋/费用项快速录入抄表数据，适用于扫码后补录

  访问地址: http://localhost:3000/#/pages-sub/meter/qrcode-meter
  建议携带参数: ?roomId=ROOM_0001&configId=CFG_WATER_001&meterType=2020&roomName=1-1-101

  旧代码：gitee-example/pages/meter/qrcodeMeter.vue
-->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { reactive, ref } from 'vue'
import { queryPreMeterWater, saveMeterWater } from '@/api/meter'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '二维码水表',
  },
})

const LABEL_WIDTH = '88px'

const toast = useGlobalToast()
const communityInfo = getCurrentCommunity()

const formRef = ref<FormInstance>()

const model = reactive({
  roomId: '',
  roomName: '',
  configId: '',
  meterType: '',
  preDegrees: 0,
  preReadingTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  curDegrees: '',
  curReadingTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  remark: '',
})

const formRules: FormRules = {
  curDegrees: [
    { required: true, message: '请填写本期度数' },
    {
      required: false,
      message: '',
      validator: (value) => {
        const parsed = Number(value)
        if (!Number.isFinite(parsed) || parsed < 0)
          return Promise.reject(new Error('本期度数格式不正确'))
        return Promise.resolve()
      },
    },
  ],
  curReadingTime: [{ required: true, message: '请选择本期读表时间' }],
}

const { send: loadPreMeter } = useRequest(
  () =>
    queryPreMeterWater({
      communityId: communityInfo.communityId,
      objId: model.roomId,
      meterType: model.meterType,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    model.preDegrees = Number(event.data?.curDegrees || 0)
    model.preReadingTime = String(event.data?.curReadingTime || dayjs().format('YYYY-MM-DD HH:mm:ss'))
  })
  .onError((error) => {
    console.error('加载上期读数失败:', error)
  })

const { loading: submitting, send: submitMeter } = useRequest(
  (params: {
    communityId: string
    configId: string
    objId: string
    objName: string
    meterType: string
    preDegrees: number
    curDegrees: number
    preReadingTime: string
    curReadingTime: string
    remark?: string
  }) => saveMeterWater(params),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('提交成功')
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 1200)
  })
  .onError((error) => {
    console.error('提交抄表失败:', error)
  })

function handleSubmit() {
  formRef.value?.validate()
    .then(({ valid }: { valid: boolean }) => {
      if (!valid)
        return

      if (!model.roomId || !model.configId || !model.meterType) {
        toast.warning('缺少必要参数，请返回抄表列表重新进入')
        return
      }

      const curDegrees = Number(model.curDegrees)
      if (curDegrees < model.preDegrees) {
        toast.warning('本期度数不能小于上期度数')
        return
      }

      const preTime = dayjs(model.preReadingTime)
      const curTime = dayjs(model.curReadingTime)
      if (!curTime.isValid() || !preTime.isValid() || !curTime.isAfter(preTime)) {
        toast.warning('本期读表时间必须大于上期读表时间')
        return
      }

      submitMeter({
        communityId: communityInfo.communityId,
        configId: model.configId,
        objId: model.roomId,
        objName: model.roomName || model.roomId,
        meterType: model.meterType,
        preDegrees: model.preDegrees,
        curDegrees,
        preReadingTime: model.preReadingTime,
        curReadingTime: model.curReadingTime,
        remark: model.remark || undefined,
      })
    })
    .catch((error: any) => {
      console.error('表单校验异常:', error)
    })
}

onLoad((options) => {
  model.roomId = String(options.roomId || '')
  model.roomName = String(options.roomName || options.roomNum || options.roomId || '')
  model.configId = String(options.configId || '')
  model.meterType = String(options.meterType || '')

  if (model.roomName) {
    uni.setNavigationBarTitle({ title: `${model.roomName} 抄表` })
  }

  if (model.roomId && model.meterType)
    loadPreMeter()
})
</script>

<template>
  <view class="min-h-screen bg-gray-100 p-3">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <wd-cell-group border>
        <FormSectionTitle
          title="上期抄表"
          icon="history"
          icon-class="i-carbon-history text-blue-500"
        />

        <wd-input
          v-model="model.roomName"
          label="房屋"
          :label-width="LABEL_WIDTH"
          readonly
        />

        <wd-input
          v-model="model.preDegrees"
          label="上期度数"
          :label-width="LABEL_WIDTH"
          readonly
        />

        <wd-input
          v-model="model.preReadingTime"
          label="上期时间"
          :label-width="LABEL_WIDTH"
          readonly
        />
      </wd-cell-group>

      <wd-cell-group border class="mt-3">
        <FormSectionTitle
          title="本期抄表"
          icon="chart-line-data"
          icon-class="i-carbon-chart-line-data text-green-500"
          required
        />

        <wd-input
          v-model="model.curDegrees"
          label="本期度数"
          :label-width="LABEL_WIDTH"
          prop="curDegrees"
          type="digit"
          placeholder="请输入本期度数"
          :rules="formRules.curDegrees"
        />

        <wd-datetime-picker
          v-model="model.curReadingTime"
          type="datetime"
          label="本期时间"
          :label-width="LABEL_WIDTH"
          prop="curReadingTime"
          :rules="formRules.curReadingTime"
        />

        <wd-textarea
          v-model="model.remark"
          label="备注"
          :label-width="LABEL_WIDTH"
          placeholder="请输入备注信息"
          :maxlength="250"
          show-word-limit
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
          提交抄表
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style scoped>
</style>
