<!--
  结束维修工单
  功能：输入结束原因并结束工单
  表单页

  访问地址: http://localhost:3000/#/pages-sub/repair/end-order
  建议携带参数: ?repairId=REP_001&communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/repair/end-order?repairId=REP_001&communityId=COMM_001
  上级页面: http://localhost:3000/#/pages-sub/repair/order-list

  旧代码：gitee-example/pages/repairOrder/repairEnd.vue
-->

<!-- 基本完成检查审核 -->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { endRepair } from '@/api/repair'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

definePage({
  style: {
    navigationBarTitleText: '结束工单',
    enablePullDownRefresh: false,
  },
})

// ==================== 常量定义 ====================

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

// ==================== 依赖注入 ====================

const toast = useGlobalToast()

// ==================== 表单状态 ====================

/** 表单引用 */
const formRef = ref()

/** 页面参数 */
const repairId = ref('')
const communityId = ref('')

/** 表单数据模型 */
const model = reactive({
  /** 结束原因 */
  context: '',
})

// ==================== 表单校验规则 ====================

/** 表单校验规则 */
const formRules: FormRules = {
  context: [
    { required: true, message: '请填写结束原因' },
  ],
}

// ==================== 数据提交 ====================

/**
 * 结束工单请求管理
 * 🔴 强制规范：必须设置 immediate: false
 * 🔴 强制规范：使用链式回调写法
 */
const {
  loading: submitting,
  send: submitEndRepair,
} = useRequest(
  (params: { repairId: string, communityId: string, context: string }) => endRepair(params),
  { immediate: false },
)
  .onSuccess(() => {
    console.log('工单结束成功')
    toast.success({ msg: '工单已结束', duration: 1500 })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  })
  .onError((error) => {
    console.error('结束工单失败:', error)
    // 错误提示已在 Alova 响应拦截器中自动处理
  })

// ==================== 表单校验与提交 ====================

/**
 * 提交表单
 * @description 执行表单校验，校验通过后提交结束工单请求
 * 🔴 强制规范：不使用 await，直接调用 send 函数
 */
function handleSubmit() {
  // 表单校验
  formRef.value
    .validate()
    .then(({ valid, errors }: { valid: boolean, errors: any[] }) => {
      if (!valid) {
        console.error('表单校验失败:', errors)
        return
      }

      // 提交请求
      // 🔴 强制规范：不使用 await，直接调用 send 函数
      submitEndRepair({
        repairId: repairId.value,
        communityId: communityId.value,
        context: model.context.trim(),
      })
    })
    .catch((error: any) => {
      console.error('表单校验异常:', error)
    })
}

// ==================== 生命周期钩子 ====================

/** 页面加载 */
onLoad((options) => {
  repairId.value = (options?.repairId as string) || ''
  communityId.value = (options?.communityId as string) || ''
})
</script>

<template>
  <view class="min-h-screen bg-gray-100 pt-3">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 结束原因 -->
      <wd-cell-group border>
        <FormSectionTitle
          title="结束原因"
          icon="edit"
          icon-class="i-carbon-edit text-blue-500"
          required
        />
        <wd-textarea
          v-model="model.context"
          label="结束原因"
          :label-width="LABEL_WIDTH"
          prop="context"
          placeholder="请输入结束原因，比如缺材料"
          :maxlength="500"
          show-word-limit
          :rows="6"
          :disabled="submitting"
          :rules="formRules.context"
        />
      </wd-cell-group>

      <!-- 提交按钮 -->
      <view class="mt-6 px-3 pb-6">
        <wd-button
          block
          type="primary"
          size="large"
          :loading="submitting"
          :disabled="submitting"
          @click="handleSubmit"
        >
          {{ submitting ? '处理中...' : '结束工单' }}
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style lang="scss" scoped>
/**
 * 样式迁移说明：
 * - .end-repair-page: 已迁移到模板为原子类 `min-h-screen bg-gray-100 pt-3`
 * - .section-title: 已使用 FormSectionTitle 组件替代，不再需要自定义样式
 */
</style>
