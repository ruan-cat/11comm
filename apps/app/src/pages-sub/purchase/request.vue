<!--
  采购申请
  功能：提交采购申请，选择商品并填写采购数量和说明

  访问地址: http://localhost:3000/#/pages-sub/purchase/request
  建议携带参数: ?communityId=COMM_001

  旧代码：gitee-example/pages/purchaseRequest/purchaseRequest.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, reactive, ref } from 'vue'
import { savePurchaseApply } from '@/api/purchase'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '采购申请',
    enablePullDownRefresh: false,
  },
})

// ==================== 常量定义 ====================

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

// ==================== 依赖注入 ====================

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

// ==================== 页面状态 ====================

/** 商品列表（从选择页面返回） */
const purchaseList = ref<
  Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    stock: number
    description: string
  }>
>([])

/** 当前选中的商品索引 */
const selectedIndex = ref<number>(-1)

// ==================== 表单状态 ====================

/** 表单引用 */
const formRef = ref()

/** 表单数据模型 */
const model = reactive({
  /** 采购类型名称 */
  typeName: '请选择',
  /** 采购类型ID */
  resId: '',
  /** 资源编码 */
  resCode: '',
  /** 单价 */
  price: 0,
  /** 库存 */
  stock: 0,
  /** 商品备注 */
  description: '',
  /** 采购数量 */
  numberPuchase: 1,
  /** 申请说明 */
  explainPuchase: '',
})

// ==================== 计算属性 ====================

/** 总计价格 */
const totalPrice = computed(() => {
  return model.price * model.numberPuchase
})

/** 是否已选择商品 */
const hasSelectedItem = computed(() => {
  return selectedIndex.value >= 0
})

// ==================== 表单校验规则 ====================

/** 表单校验规则 */
const formRules: FormRules = {
  numberPuchase: [
    { required: true, message: '请输入采购数量' },
    { required: false, pattern: /^[1-9]\d*$/, message: '采购数量必须为正整数' },
  ],
  explainPuchase: [{ required: true, message: '请输入申请说明' }],
}

// ==================== API 请求 ====================

/** 提交采购申请 */
const { send: submitPurchase, loading: submitting } = useRequest(
  (data: {
    resourceStores: Array<{
      resId: string
      resName: string
      resCode: string
      price: number
      stock: number
      description: string
      quantity: number
    }>
    description: string
    resOrderType: string
  }) => savePurchaseApply(data),
  {
    immediate: false,
  },
)
  .onSuccess(() => {
    toast.success('提交成功')
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index',
      })
    }, 1500)
  })
  .onError((error) => {
    console.error('提交失败:', error)
  })

// ==================== 生命周期 ====================

onLoad(() => {
  // 从选择页面返回时会触发 onShow
})

onShow(() => {
  // 监听商品选择事件
  uni.$off('purchaseSelect')
  uni.$on('purchaseSelect', (info: {
    resId: string
    resName: string
    resCode: string
    price: number
    stock: number
    description: string
  }) => {
    if (info) {
      model.resId = info.resId || ''
      model.resCode = info.resCode || ''
      model.typeName = info.resName || '请选择'
      model.price = Number(info.price) || 0
      model.stock = Number(info.stock) || 0
      model.description = info.description || ''
      selectedIndex.value = 0
    }
  })
})

// ==================== 方法 ====================

/** 选择商品 */
function handleSelectFloor() {
  uni.navigateTo({
    url: `/pages-sub/purchase/list?communityId=${communityInfo.communityId}`,
  })
}

/** 采购数量变化 */
function handleNumberChange(e: number) {
  model.numberPuchase = e
}

/** 申请说明变化 */
function handleExplainChange(e: Event) {
  const target = e.target as HTMLInputElement
  model.explainPuchase = target.value
}

/** 提交采购申请 */
function handleSubmit() {
  if (!hasSelectedItem.value) {
    toast.show('请先选择商品')
    return
  }

  formRef.value.validate()
    .then(() => {
      if (submitting.value)
        return

      const data = {
        resourceStores: [
          {
            resId: model.resId,
            resName: model.typeName,
            resCode: model.resCode,
            price: model.price,
            stock: model.stock,
            description: model.explainPuchase,
            quantity: model.numberPuchase,
          },
        ],
        description: model.description,
        resOrderType: '10000',
      }

      submitPurchase(data)
    })
    .catch(() => {
      // 表单校验失败，不做处理
    })
}
</script>

<template>
  <view class="page-container">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 采购信息 -->
      <FormSectionTitle title="采购信息" />
      <wd-cell-group border>
        <wd-cell title="采购类型" :value="model.typeName" is-link @click="handleSelectFloor" />
        <wd-cell title="单价">
          <text :class="{ 'text-grey': !hasSelectedItem }">
            {{ hasSelectedItem ? `¥${model.price}` : '待选择' }}
          </text>
        </wd-cell>
        <wd-cell title="库存">
          <text :class="{ 'text-grey': !hasSelectedItem }">
            {{ hasSelectedItem ? model.stock : '待选择' }}
          </text>
        </wd-cell>
        <wd-cell title="商品备注">
          <text :class="{ 'text-grey': !hasSelectedItem }">
            {{ model.description || '暂无备注' }}
          </text>
        </wd-cell>
      </wd-cell-group>

      <!-- 采购参数 -->
      <FormSectionTitle title="采购参数" />
      <wd-cell-group border>
        <wd-input
          v-model="model.numberPuchase"
          label="采购数量"
          :label-width="LABEL_WIDTH"
          type="number"
          placeholder="请输入采购数量"
          :rules="formRules.numberPuchase"
        />
        <wd-textarea
          v-model="model.explainPuchase"
          label="申请说明"
          :label-width="LABEL_WIDTH"
          placeholder="请输入申请说明"
          :maxlength="500"
          show-word-limit
          :rules="formRules.explainPuchase"
        />
      </wd-cell-group>

      <!-- 提交按钮 -->
      <view class="footer-bar">
        <view class="total-price">
          总计: ¥{{ totalPrice }}
        </view>
        <wd-button
          type="success"
          :loading="submitting"
          block
          size="large"
          @click="handleSubmit"
        >
          提交申请
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.text-grey {
  color: #999;
}

.footer-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.total-price {
  font-size: 32rpx;
  font-weight: 600;
  color: #e6a23c;
  flex-shrink: 0;
}
</style>
