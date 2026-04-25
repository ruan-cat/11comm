<!--
  投诉处理页面
  功能：物业人员快速处理投诉工单，提交处理意见

  访问地址: http://localhost:3000/#/pages-sub/complaint/handle
  建议携带参数: ?complaintId=COMP_001

  完整示例: http://localhost:3000/#/pages-sub/complaint/handle?complaintId=COMP_001

  旧代码：gitee-example/pages/complaintHandle/complaintHandle.vue
-->

<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { handleComplaint } from '@/api/complaint'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

/** 全局 Toast 提示 */
const toast = useGlobalToast()

definePage({
  style: {
    navigationBarTitleText: '投诉处理',
    enablePullDownRefresh: false,
  },
})

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

/** 表单实例 */
const formRef = ref<FormInstance>()

/** 页面参数 */
const complaintId = ref('')

/** 表单数据模型 */
const model = reactive({
  /** 处理意见 */
  handleContext: '',
})

/** 表单校验规则 */
const formRules: FormRules = {
  handleContext: [{ required: true, message: '请输入处理意见' }],
}

/** 获取小区信息 */
const communityInfo = getCurrentCommunity()

/** 提交处理 */
const { loading: submitting, send: submitHandle } = useRequest(
  () =>
    handleComplaint({
      context: model.handleContext,
      communityId: communityInfo.communityId,
      complaintId: complaintId.value,
    }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('投诉处理成功')
    uni.navigateBack({
      delta: 1,
    })
  })
  .onError((error) => {
    console.error('❌ 投诉处理失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

/** 页面加载 */
onLoad((options) => {
  complaintId.value = (options?.complaintId as string) || ''
  if (!complaintId.value) {
    toast.error('缺少必要参数')
  }
})

/** 提交处理 */
function handleSubmit() {
  formRef.value
    .validate()
    .then(({ valid }) => {
      if (!valid) {
        return
      }
      submitHandle()
    })
    .catch((error) => {
      console.error('表单校验异常:', error)
    })
}
</script>

<template>
  <view class="handle-page">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <view class="p-3">
        <!-- 处理意见输入 -->
        <view class="mb-3 bg-white">
          <wd-cell-group border>
            <wd-textarea
              v-model="model.handleContext"
              label="处理意见"
              :label-width="LABEL_WIDTH"
              prop="handleContext"
              placeholder="请输入处理意见"
              :maxlength="200"
              show-word-limit
              :auto-height="true"
              :min-height="200"
              clearable
            />
          </wd-cell-group>
        </view>

        <!-- 提交按钮 -->
        <wd-button type="success" size="large" :loading="submitting" @click="handleSubmit">
          提交
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style lang="scss" scoped>
.handle-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.section-title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 20px 15px 10px;
}
</style>
