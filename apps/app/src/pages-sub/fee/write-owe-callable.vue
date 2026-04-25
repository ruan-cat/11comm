<!--
  填写欠费催缴页面
  功能：登记欠费催缴信息，选择要催缴的费用项目

  访问地址: http://localhost:3000/#/pages-sub/fee/write-owe-callable
  建议携带参数: ?roomId=xxx&roomName=xxx&communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/fee/write-owe-callable?roomId=ROOM_001&roomName=1栋101室&communityId=COMM_001

  旧代码：gitee-example/pages/fee/writeOweFeeCallable.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import type { FeeListResponse } from '@/types/fee'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { getFeeList, writeOweFeeCallable } from '@/api/fee'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '填写欠费催缴',
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
  roomId: '',
  roomName: '',
})

/** 费用列表 */
const fees = ref<
  Array<{
    feeId: string
    feeName: string
  }>
>([])

/** 已选中的费用ID */
const selectedFeeIds = ref<string[]>([])

/** 表单数据模型 */
const model = reactive({
  /** 房屋名称（只读） */
  roomName: '',
  /** 催缴说明 */
  remark: '',
})

// ==================== 数据请求 ====================

/** 加载费用列表 */
const { send: loadFees, loading: feesLoading } = useRequest(
  () =>
    getFeeList({
      page: 1,
      row: 50,
      communityId: communityInfo.communityId,
      payerObjId: pageParams.roomId,
      state: '2008001', // 待缴费状态
    }),
  { immediate: false },
).onSuccess((event) => {
  const data = event.data as FeeListResponse
  fees.value = data.list || []
}).onError((error) => {
  console.error('加载费用列表失败:', error)
})

/** 提交欠费催缴 */
const { send: submitWriteCallable, loading: submitLoading } = useRequest(
  (data: { feeIds: string[], remark: string }) =>
    writeOweFeeCallable({
      communityId: communityInfo.communityId,
      feeIds: data.feeIds,
      remark: data.remark,
      roomId: pageParams.roomId,
      roomName: pageParams.roomName,
    }),
  { immediate: false },
).onSuccess((event) => {
  const data = event.data as { code: number, msg: string }
  if (data.code !== 0) {
    toast.error(data.msg)
    return
  }
  toast.success(data.msg)
  uni.navigateBack()
}).onError((error) => {
  console.error('登记欠费催缴失败:', error)
})

// ==================== 生命周期 ====================

/** 页面加载 */
onLoad((options) => {
  pageParams.roomId = options?.roomId || ''
  pageParams.roomName = options?.roomName || ''
  model.roomName = pageParams.roomName

  // 加载费用列表
  loadFees()
})

// ==================== 表单事件 ====================

/** 费用选择变更 */
function handleFeeChange(values: string[]) {
  selectedFeeIds.value = values
}

/** 提交表单 */
async function handleSubmit() {
  if (selectedFeeIds.value.length === 0) {
    toast.error('请选择要催缴的费用')
    return
  }

  await submitWriteCallable({
    feeIds: selectedFeeIds.value,
    remark: model.remark,
  })
}

/** 表单引用 */
const formRef = ref()

/** 表单校验规则 */
const rules: FormRules = {
  remark: [
    {
      required: true,
      message: '请输入催缴说明',
      trigger: 'blur',
    },
  ],
}
</script>

<template>
  <wd-form ref="formRef" :model="model" :rules="rules" :label-width="LABEL_WIDTH">
    <FormSectionTitle title="催缴登记" />

    <wd-cell-group>
      <!-- 房屋信息 -->
      <wd-cell title="房屋">
        <wd-input v-model="model.roomName" disabled placeholder="请输入房屋" />
      </wd-cell>
    </wd-cell-group>

    <FormSectionTitle title="选择费用" />

    <!-- 费用列表（复选框） -->
    <wd-checkbox-group v-model="selectedFeeIds" class="fee-checkbox-group" @change="handleFeeChange">
      <view class="fee-list bg-white">
        <view
          v-for="(item, index) in fees"
          :key="index"
          class="fee-item flex items-center justify-between border-b border-gray-100 px-3 py-2"
        >
          <view class="flex-1 text-gray-700">
            {{ item.feeName }}
          </view>
          <wd-checkbox :value="item.feeId" shape="square" />
        </view>
      </view>
    </wd-checkbox-group>

    <!-- 催缴说明 -->
    <view class="px-3 py-2">
      <wd-textarea v-model="model.remark" placeholder="请输入催缴说明" :maxlength="200" show-word-limit />
    </view>

    <!-- 提交按钮 -->
    <view class="p-30rpx">
      <wd-button type="primary" size="large" block :loading="submitLoading" @click="handleSubmit">
        登记
      </wd-button>
    </view>
  </wd-form>
</template>

<style scoped>
.fee-checkbox-group {
  display: block;
}
.fee-list {
  background-color: #fff;
}
.fee-item:last-child {
  border-bottom: none;
}
</style>
