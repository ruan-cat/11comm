<!--
  车辆入场页
  功能：手工登记车辆进场

  访问地址: http://localhost:3000/#/pages-sub/parking/car-in
  建议携带参数: ?machineId=xxx&machineCode=xxx&paId=xxx&paNum=xxx&boxId=xxx

  旧代码：gitee-example/pages/car/carInParkingArea.vue
-->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { customCarInOut } from '@/api/parking'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '车辆入场',
  },
})

const communityInfo = getCurrentCommunity()
const toast = useGlobalToast()
const LABEL_WIDTH = '88px'

const formRef = ref<FormInstance>()

const formModel = reactive({
  machineId: '',
  machineCode: '',
  paId: '',
  paNum: '',
  boxId: '',
  carNum: '',
  remark: '',
})

const formRules: FormRules = {
  carNum: [{ required: true, message: '请输入车牌号' }],
}

const { loading, send: submitIn } = useRequest(
  () =>
    customCarInOut({
      ...formModel,
      communityId: communityInfo.communityId,
      type: '1101',
    }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('进场成功')
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 800)
  })
  .onError((error) => {
    console.error('车辆进场失败', error)
  })

function handleSubmit() {
  formRef.value?.validate().then(({ valid }) => {
    if (!valid)
      return

    submitIn()
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
      <FormSectionTitle title="入场信息" icon="i-carbon-car" />
      <wd-cell-group border>
        <wd-input
          v-model="formModel.carNum"
          label="车牌号"
          :label-width="LABEL_WIDTH"
          prop="carNum"
          placeholder="请输入车牌号"
          clearable
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
    </wd-form>

    <view class="action-bar">
      <wd-button type="primary" block :loading="loading" @click="handleSubmit">
        进场
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

.action-bar {
  padding: 20rpx;
}
</style>
