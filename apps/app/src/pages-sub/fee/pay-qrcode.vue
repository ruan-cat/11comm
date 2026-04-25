<!--
  二维码缴费页面
  功能：生成二维码，用户扫码支付欠费

  访问地址: http://localhost:3000/#/pages-sub/fee/pay-qrcode
  建议携带参数: ?roomId=xxx&communityId=xxx&feeIds=xxx

  完整示例: http://localhost:3000/#/pages-sub/fee/pay-qrcode?roomId=ROOM_001&communityId=COMM_001&feeIds=FEE_001,FEE_002

  旧代码：gitee-example/pages/fee/payFeeByQrCode.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { toPayOweFee } from '@/api/fee'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '二维码缴费',
    enablePullDownRefresh: false,
  },
})

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

/** 页面参数 */
const pageParams = reactive({
  roomId: '',
  communityId: '',
  feeIds: [] as string[],
  feeIdsText: '',
})

/** 表单标签统一宽度 */
const LABEL_WIDTH = '140rpx'

/** 表单引用 */
const formRef = ref()

/** 表单校验规则 */
const rules: FormRules = {
  roomId: [{ required: true, message: '缺少房间编号' }],
}

/** 二维码 URL */
const qrcodeUrl = ref('')

/** 加载状态 */
const loading = ref(true)

/** 生成二维码支付 */
const { send: generateQrcode, loading: qrcodeLoading } = useRequest(
  (data: { roomId: string, communityId: string, feeIds: string[] }) =>
    toPayOweFee({
      roomId: data.roomId,
      communityId: data.communityId,
      business: 'oweFee',
      feeIds: data.feeIds,
    }),
  { immediate: false },
).onSuccess((event) => {
  const data = event.data as { code: number, msg: string, data: { codeUrl: string } }
  if (data.code !== 0) {
    toast.error(data.msg)
    return
  }
  qrcodeUrl.value = data.data.codeUrl
  loading.value = false
}).onError(() => {
  loading.value = false
  toast.warning('生成二维码失败')
})

/** 页面加载 */
onLoad((options) => {
  pageParams.roomId = options?.roomId || ''
  pageParams.communityId = options?.communityId || communityInfo.communityId
  pageParams.feeIds = (options?.feeIds || '').split(',')
  pageParams.feeIdsText = pageParams.feeIds.filter(Boolean).join(',')

  // 生成二维码
  generateQrcode({
    roomId: pageParams.roomId,
    communityId: pageParams.communityId,
    feeIds: pageParams.feeIds,
  })
})

/** 已支付（返回上一页） */
async function handlePaid() {
  const valid = await formRef.value?.validate()
  if (!valid) {
    return
  }

  uni.navigateBack()
}
</script>

<template>
  <wd-form ref="formRef" :model="pageParams" :rules="rules" class="pay-qrcode-page p-5">
    <FormSectionTitle title="缴费信息" />
    <wd-cell-group border>
      <wd-input v-model="pageParams.roomId" label="房间ID" :label-width="LABEL_WIDTH" prop="roomId" disabled />
      <wd-input v-model="pageParams.communityId" label="小区ID" :label-width="LABEL_WIDTH" disabled />
      <wd-input v-model="pageParams.feeIdsText" label="费用项" :label-width="LABEL_WIDTH" disabled />
    </wd-cell-group>

    <!-- 二维码 -->
    <view class="qrcode-container mb-5 mt-3 rounded-lg bg-white p-5">
      <view v-if="loading || qrcodeLoading" class="flex items-center justify-center">
        <text class="text-gray-400">加载中...</text>
      </view>
      <view v-else-if="qrcodeUrl" class="flex flex-col items-center">
        <!-- 这里使用 canvas 绘制二维码，实际项目中可使用 u-qrcode 等组件 -->
        <image :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrcodeUrl)}`" class="qrcode-image" />
        <text class="mt-3 text-sm text-gray-500">请使用微信扫码支付</text>
      </view>
      <view v-else class="flex items-center justify-center">
        <text class="text-red-500">二维码生成失败</text>
      </view>
    </view>

    <!-- 支付按钮 -->
    <view class="w-full">
      <wd-button type="primary" size="large" block @click="handlePaid">
        已支付
      </wd-button>
    </view>
  </wd-form>
</template>

<style scoped>
.qrcode-container {
  width: 500rpx;
  min-height: 500rpx;
}
.qrcode-image {
  width: 400rpx;
  height: 400rpx;
}
</style>
