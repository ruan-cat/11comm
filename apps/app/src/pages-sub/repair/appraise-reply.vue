<!--
  回复评价
  功能：物业回复用户的维修评价
  表单页

  访问地址: http://localhost:3000/#/pages-sub/repair/appraise-reply
  建议携带参数: ?ruId=RU_001&repairId=REP_001

  完整示例: http://localhost:3000/#/pages-sub/repair/appraise-reply?ruId=RU_001&repairId=REP_001
  上级页面: http://localhost:3000/#/pages-sub/repair/order-detail

  旧代码：gitee-example/pages/repairOrder/replyRepairAppraise.vue
-->

<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { replyAppraise } from '@/api/repair'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '回复评价',
    enablePullDownRefresh: false,
  },
})

const toast = useGlobalToast()

/** 表单实例 */
const formRef = ref<FormInstance>()

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

/** 页面参数 */
const ruId = ref('')
const repairId = ref('')

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 表单数据模型 */
const model = reactive({
  reply: '',
})

/** 表单校验规则 */
const formRules: FormRules = {
  reply: [{ required: true, message: '请输入回复说明' }],
}

/** 提交回复请求 */
const { send: submitReply, onSuccess: onReplySuccess, onError: onReplyError } = useRequest(
  (params: {
    ruId: string
    repairId: string
    reply: string
    communityId: string
  }) => replyAppraise(params),
  { immediate: false },
)

onReplySuccess(() => {
  uni.hideLoading()
  toast.success('回复成功')

  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
})

onReplyError((error) => {
  uni.hideLoading()
  toast.error(error.error || '回复失败')
})

/** 表单提交 */
function handleSubmit() {
  formRef.value
    ?.validate()
    .then(({ valid }) => {
      if (!valid) {
        return
      }

      uni.showLoading({ title: '提交中...' })

      submitReply({
        ruId: ruId.value,
        repairId: repairId.value,
        reply: model.reply,
        communityId: communityInfo.communityId,
      })
    })
    .catch((error) => {
      console.error('表单校验异常:', error)
    })
}

/** 页面加载 */
onLoad((options) => {
  ruId.value = (options?.ruId as string) || ''
  repairId.value = (options?.repairId as string) || ''
})
</script>

<template>
  <view class="reply-appraise-page">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 回复说明 -->
      <FormSectionTitle title="回复说明" />
      <wd-cell-group border>
        <wd-textarea
          v-model="model.reply"
          label="回复说明"
          :label-width="LABEL_WIDTH"
          prop="reply"
          placeholder="请输入回复说明"
          :maxlength="200"
          show-word-limit
          :rows="6"
        />
      </wd-cell-group>

      <!-- 提交按钮 -->
      <view class="mt-6 px-3 pb-6">
        <wd-button
          block
          type="success"
          size="large"
          @click="handleSubmit"
        >
          提交
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style lang="scss" scoped>
.reply-appraise-page {
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
