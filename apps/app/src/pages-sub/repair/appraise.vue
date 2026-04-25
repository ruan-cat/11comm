<!--
  维修工单评价页
  功能：业主对维修服务进行评分和评价
  表单页

  访问地址: http://localhost:3000/#/pages-sub/repair/appraise
  建议携带参数: ?repairId=REP_001&repairType=水电维修&communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/repair/appraise?repairId=REP_001&repairType=水电维修&communityId=COMM_001
  上级页面: http://localhost:3000/#/pages-sub/repair/dispatch

  旧代码：gitee-example/pages/appraiseRepair/appraiseRepair.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { appraiseRepair } from '@/api/repair'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

definePage({
  style: {
    navigationBarTitleText: '评价维修',
    enablePullDownRefresh: false,
  },
})

// ==================== 常量定义 ====================

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

// ==================== 依赖注入 ====================

/** 全局 Toast */
const toast = useGlobalToast()

// ==================== 页面参数 ====================

/** 页面参数 */
const pageParams = reactive({
  repairId: '',
  repairType: '',
  repairChannel: '',
  publicArea: '',
  communityId: '',
})

// ==================== 表单状态 ====================

/** 表单引用 */
const formRef = ref()

/** 表单数据模型 */
const model = reactive({
  /** 服务评分（1-5星） */
  rating: 5,
  /** 回访建议内容 */
  content: '',
})

// ==================== 表单校验规则 ====================

/** 表单校验规则 */
const formRules: FormRules = {
  content: [
    { required: true, message: '请填写回访建议' },
  ],
}

// ==================== 接口请求 ====================

/**
 * 提交评价请求
 * @description 提交维修工单评价信息
 * 🔴 强制规范：必须设置 immediate: false，使用链式回调写法
 */
const {
  loading: submitting,
  send: submitAppraise,
} = useRequest(
  (params: {
    repairId: string
    repairType: string
    repairChannel: string
    publicArea: string
    communityId: string
    context: string
  }) => appraiseRepair(params),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('评价成功')

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  })
  .onError((error) => {
    console.error('提交评价失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

// ==================== 生命周期钩子 ====================

/** 页面加载 */
onLoad((options) => {
  pageParams.repairId = (options?.repairId as string) || ''
  pageParams.repairType = (options?.repairType as string) || ''
  pageParams.repairChannel = (options?.repairChannel as string) || ''
  pageParams.publicArea = (options?.publicArea as string) || ''
  pageParams.communityId = (options?.communityId as string) || ''
})

// ==================== 表单提交 ====================

/**
 * 提交评价
 * @description 执行表单校验，校验通过后提交评价信息
 * 🔴 强制规范：不使用 await，直接调用 send 函数
 */
function handleSubmit() {
  formRef.value
    .validate()
    .then(({ valid, errors }: { valid: boolean, errors: any[] }) => {
      if (!valid) {
        console.error('表单校验失败:', errors)
        return
      }

      // 🔴 强制规范：不使用 await，直接调用 send 函数
      submitAppraise({
        repairId: pageParams.repairId,
        repairType: pageParams.repairType,
        repairChannel: pageParams.repairChannel,
        publicArea: pageParams.publicArea,
        communityId: pageParams.communityId,
        context: model.content,
      })
    })
    .catch((error: any) => {
      console.error('表单校验异常:', error)
    })
}
</script>

<template>
  <view class="min-h-screen bg-gray-100">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 服务评分 -->
      <wd-cell-group border>
        <FormSectionTitle
          title="服务评分"
          icon="star"
          icon-class="i-carbon-star text-yellow-500"
        />
        <wd-cell title="评分" :title-width="LABEL_WIDTH" center>
          <wd-rate v-model="model.rating" />
        </wd-cell>
      </wd-cell-group>

      <!-- 回访建议 -->
      <wd-cell-group border class="mt-3">
        <FormSectionTitle
          title="回访建议"
          icon="chat"
          icon-class="i-carbon-chat text-blue-500"
          required
        />
        <wd-textarea
          v-model="model.content"
          :label-width="LABEL_WIDTH"
          prop="content"
          placeholder="请填写您的回访建议"
          :maxlength="200"
          show-word-limit
          :rows="6"
          :rules="formRules.content"
        />
      </wd-cell-group>

      <!-- 提交按钮 -->
      <view class="mt-6 px-3 pb-6">
        <wd-button
          block
          type="success"
          size="large"
          :loading="submitting"
          :disabled="submitting || !model.content.trim()"
          @click="handleSubmit"
        >
          提交
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style lang="scss" scoped>
/**
 * 样式说明：
 * - 页面容器样式已迁移到模板的原子类 `min-h-screen bg-gray-100`
 * - 分区标题已替换为 FormSectionTitle 组件
 * - 无需额外的 scoped 样式
 */
</style>
