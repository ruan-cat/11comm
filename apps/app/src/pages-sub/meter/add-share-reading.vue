<!--
  新增共享抄表页
  功能：对指定公摊表录入本期抄表数据

  访问地址: http://localhost:3000/#/pages-sub/meter/add-share-reading
  建议携带参数: ?fsmId=FSM_0001

  旧代码：gitee-example/pages/meter/addShareReading.vue
-->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { reactive, ref } from 'vue'
import { listFloorShareMeters, saveFloorShareReading } from '@/api/meter'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '新增共享抄表',
  },
})

const LABEL_WIDTH = '88px'

const toast = useGlobalToast()
const communityInfo = getCurrentCommunity()

const formRef = ref<FormInstance>()

const model = reactive({
  fsmId: '',
  meterName: '',
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
  curReadingTime: [{ required: true, message: '请选择本期时间' }],
}

const { send: loadShareMeter } = useRequest(
  () =>
    listFloorShareMeters({
      page: 1,
      row: 1,
      communityId: communityInfo.communityId,
      fsmId: model.fsmId,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const meter = event.data?.list?.[0]
    if (!meter)
      return

    model.meterName = `${meter.floorNum}栋-${meter.meterTypeName}(${meter.meterNum})`
    model.preDegrees = Number(meter.curDegree || 0)
    model.preReadingTime = String(meter.curReadingTime || dayjs().format('YYYY-MM-DD HH:mm:ss'))
  })
  .onError((error) => {
    console.error('加载公摊表信息失败:', error)
  })

const { loading: submitting, send: submitShareReading } = useRequest(
  (params: {
    communityId: string
    fsmId: string
    preDegrees: number
    curDegrees: number
    preReadingTime: string
    curReadingTime: string
    remark?: string
  }) => saveFloorShareReading(params),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('提交成功')
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 1200)
  })
  .onError((error) => {
    console.error('提交共享抄表失败:', error)
  })

function handleSubmit() {
  formRef.value?.validate()
    .then(({ valid }: { valid: boolean }) => {
      if (!valid)
        return

      if (!model.fsmId) {
        toast.warning('缺少公摊表参数，请返回重试')
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
        toast.warning('本期时间必须大于上期时间')
        return
      }

      submitShareReading({
        communityId: communityInfo.communityId,
        fsmId: model.fsmId,
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
  model.fsmId = String(options.fsmId || '')
  if (model.fsmId)
    loadShareMeter()
})
</script>

<template>
  <view class="min-h-screen bg-gray-100 p-3">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <wd-cell-group border>
        <FormSectionTitle
          title="公摊信息"
          icon="meter"
          icon-class="i-carbon-meter text-blue-500"
        />

        <wd-input
          v-model="model.meterName"
          label="公摊表"
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
