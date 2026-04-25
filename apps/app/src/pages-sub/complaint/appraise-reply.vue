<!--
  回复投诉评价页面
  功能：物业人员回复业主的投诉评价

  访问地址: http://localhost:3000/#/pages-sub/complaint/appraise-reply
  建议携带参数: ?appraiseId=APPR_COMP_001_1&communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/complaint/appraise-reply?appraiseId=APPR_COMP_001_1&communityId=COMM_001

  旧代码：gitee-example/pages/complaintOrderDetail/replyComplainAppraise.vue
-->

<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { replyComplaintAppraise } from '@/api/complaint'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

/** 全局 Toast 提示 */
const toast = useGlobalToast()

definePage({
  style: {
    navigationBarTitleText: '回复评价',
    enablePullDownRefresh: false,
  },
})

/** 表单实例 */
const formRef = ref<FormInstance>()

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

/** 页面参数 */
const appraiseId = ref('')
const communityId = ref('')

/** 表单数据模型 */
const model = reactive({
  replyContext: '',
})

/** 表单校验规则 */
const formRules: FormRules = {
  replyContext: [{ required: true, message: '请输入回复内容' }],
}

/** 提交回复 */
const { loading: submitting, send: submitReply } = useRequest(
  () =>
    replyComplaintAppraise({
      replyContext: model.replyContext,
      communityId: communityId.value,
      appraiseId: appraiseId.value,
    }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('回复评价成功')
    uni.navigateBack({
      delta: 1,
    })
  })
  .onError((error) => {
    console.error('❌ 回复评价失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

/** 页面加载 */
onLoad((options) => {
  appraiseId.value = (options?.appraiseId as string) || ''
  communityId.value = (options?.communityId as string) || ''

  if (!appraiseId.value) {
    toast.error('缺少必要参数')
  }
})

/** 提交回复 */
function handleSubmit() {
  formRef.value
    ?.validate()
    .then(({ valid }) => {
      if (!valid) {
        return
      }

      submitReply()
    })
    .catch((error) => {
      console.error('表单校验异常:', error)
    })
}
</script>

<template>
  <view class="appraise-reply-page">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 回复内容输入 -->
      <FormSectionTitle title="回复说明" />
      <wd-cell-group border>
        <wd-textarea
          v-model="model.replyContext"
          label="回复说明"
          :label-width="LABEL_WIDTH"
          prop="replyContext"
          placeholder="请输入回复说明"
          :maxlength="200"
          show-word-limit
          :auto-height="true"
          :min-height="200"
          clearable
        />
      </wd-cell-group>

      <!-- 提交按钮 -->
      <view class="mt-6 px-3 pb-6">
        <wd-button type="success" size="large" :loading="submitting" @click="handleSubmit">
          提交
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style lang="scss" scoped>
.appraise-reply-page {
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
