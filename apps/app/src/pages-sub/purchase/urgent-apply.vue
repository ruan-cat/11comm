<!--
  紧急采购申请
  功能：提交紧急采购申请，选择多个商品并填写详细信息

  访问地址: http://localhost:3000/#/pages-sub/purchase/urgent-apply

  旧代码：gitee-example/pages/urgentPurchaseApplyStep/urgentPurchaseApplyStep.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { saveUrgentPurchaseApply } from '@/api/purchase'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '紧急采购申请',
    enablePullDownRefresh: false,
  },
})

// ==================== 常量定义 ====================

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

/** 采购订单类型 */
const RES_ORDER_TYPE = '10000'

/** 审核类型 */
const SH_TYPE = '2806'

// ==================== 依赖注入 ====================

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

// ==================== 表单状态 ====================

/** 表单引用 */
const formRef = ref()

/** 防止重复提交 */
const canSubmit = ref(true)

/** 表单数据模型 */
const model = reactive({
  /** 使用人 */
  endUserName: '',
  /** 联系电话 */
  endUserTel: '',
  /** 申请说明 */
  description: '',
})

/** 商品列表 */
const resourceStores = ref<
  Array<{
    resId: string
    resName: string
    resCode: string
    parentRstName?: string
    rstName?: string
    price: number
    stock: number
    description: string
    quantity: number
    urgentPrice: number
    remark: string
  }>
>([])

// ==================== 表单校验规则 ====================

/** 表单校验规则 */
const formRules: FormRules = {
  endUserName: [{ required: true, message: '请输入使用人' }],
  endUserTel: [
    { required: true, message: '请输入联系电话' },
    { required: false, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
  ],
  description: [{ required: true, message: '请输入申请说明' }],
}

// ==================== API 请求 ====================

/** 提交紧急采购申请 */
const { send: submitUrgentPurchase, loading: submitting } = useRequest(
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
    endUserName: string
    endUserTel: string
    communityId: string
  }) => saveUrgentPurchaseApply(data),
  {
    immediate: false,
  },
)
  .onSuccess(() => {
    canSubmit.value = true
    toast.success('提交成功')
    setTimeout(() => {
      uni.navigateBack({
        delta: 1,
      })
    }, 1500)
  })
  .onError(() => {
    canSubmit.value = true
    console.error('提交失败')
  })

// ==================== 生命周期 ====================

onShow(() => {
  // 监听商品选择事件
  uni.$off('urgentPurchaseSelect')
  uni.$on('urgentPurchaseSelect', (list: Array<{
    resId: string
    resName: string
    resCode: string
    parentRstName?: string
    rstName?: string
    price: number
    stock: number
    description: string
    urgentPrice?: number
  }>) => {
    if (list && list.length > 0) {
      // 设置每个商品的默认值
      resourceStores.value = list.map(item => ({
        ...item,
        resCode: item.resCode || '',
        price: item.price || 0,
        stock: item.stock || 0,
        description: item.description || '',
        quantity: 1,
        urgentPrice: item.urgentPrice || item.price || 0,
        remark: '',
      }))
    }
  })
})

// ==================== 方法 ====================

/** 打开选择商品弹窗 */
function handleOpenChooseResource() {
  uni.navigateTo({
    url: `/pages-sub/purchase/list?communityId=${communityInfo.communityId}&urgent=true`,
  })
}

/** 移除商品 */
function handleRemoveItem(index: number, resId: string) {
  resourceStores.value.splice(index, 1)
}

/** 减少数量 */
function handleDecQuantity(resId: string) {
  resourceStores.value.forEach((item) => {
    if (item.resId === resId && item.quantity > 1) {
      item.quantity -= 1
    }
  })
}

/** 增加数量 */
function handleIncQuantity(resId: string) {
  resourceStores.value.forEach((item) => {
    if (item.resId === resId) {
      item.quantity += 1
    }
  })
}

/** 提交表单 */
function handleSubmit() {
  // 验证商品
  if (resourceStores.value.length === 0) {
    toast.error('请选择商品')
    return
  }

  // 验证每个商品
  for (const item of resourceStores.value) {
    if (!item.quantity || item.quantity < 1) {
      toast.error('请完善数量信息')
      return
    }
    if (!item.urgentPrice || item.urgentPrice <= 0) {
      toast.error('请完善价格信息')
      return
    }
  }

  // 验证表单
  formRef.value.validate()
    .then(() => {
      if (!canSubmit.value || submitting.value)
        return
      canSubmit.value = false

      const data = {
        resourceStores: resourceStores.value.map(item => ({
          resId: item.resId,
          resName: item.resName,
          resCode: item.resCode,
          price: item.urgentPrice,
          stock: item.stock,
          description: item.remark,
          quantity: item.quantity,
        })),
        description: model.description,
        resOrderType: RES_ORDER_TYPE,
        endUserName: model.endUserName,
        endUserTel: model.endUserTel,
        communityId: communityInfo.communityId,
      }

      submitUrgentPurchase(data)
    })
    .catch(() => {
      // 表单校验失败，不做处理
    })
}
</script>

<template>
  <view class="page-container">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 选择商品按钮 -->
      <view class="header-bar">
        <wd-button type="success" @click="handleOpenChooseResource">
          选择物品
        </wd-button>
      </view>

      <!-- 商品列表 -->
      <view v-if="resourceStores.length > 0" class="goods-list">
        <wd-cell-group border>
          <view v-for="(item, index) in resourceStores" :key="item.resId" class="goods-item">
            <wd-cell>
              <template #title>
                <view class="goods-title">
                  <text>{{ item.resName }}</text>
                  <text class="text-grey text-sm">
                    ({{ item.parentRstName }}>{{ item.rstName }})
                  </text>
                </view>
              </template>
              <view class="remove-btn" @click="handleRemoveItem(index, item.resId)">
                移除
              </view>
            </wd-cell>

            <view class="goods-form">
              <view class="form-row">
                <text class="label">申请数量:</text>
                <view class="quantity-control">
                  <text class="icon-minus" @click="handleDecQuantity(item.resId)">-</text>
                  <input
                    v-model="item.quantity"
                    type="number"
                    class="quantity-input"
                  >
                  <text class="icon-plus" @click="handleIncQuantity(item.resId)">+</text>
                </view>
              </view>

              <view class="form-row">
                <text class="label">采购单价:</text>
                <input
                  v-model="item.urgentPrice"
                  type="number"
                  class="price-input"
                  placeholder="请输入单价"
                >
              </view>

              <view class="form-row">
                <text class="label">备注:</text>
                <input
                  v-model="item.remark"
                  type="text"
                  class="remark-input"
                  placeholder="请输入备注"
                >
              </view>
            </view>
          </view>
        </wd-cell-group>
      </view>

      <!-- 基本信息 -->
      <FormSectionTitle title="基本信息" />
      <wd-cell-group border>
        <wd-input
          v-model="model.endUserName"
          label="使用人"
          :label-width="LABEL_WIDTH"
          placeholder="请输入使用人"
          :rules="formRules.endUserName"
        />
        <wd-input
          v-model="model.endUserTel"
          label="联系电话"
          :label-width="LABEL_WIDTH"
          type="number"
          placeholder="请输入联系电话"
          :rules="formRules.endUserTel"
        />
        <wd-textarea
          v-model="model.description"
          label="申请说明"
          :label-width="LABEL_WIDTH"
          placeholder="请输入申请说明"
          :maxlength="500"
          show-word-limit
          :rules="formRules.description"
        />
      </wd-cell-group>

      <!-- 提交按钮 -->
      <view class="footer-bar">
        <wd-button
          type="success"
          :loading="submitting"
          block
          size="large"
          @click="handleSubmit"
        >
          提交
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

.header-bar {
  padding: 20rpx 30rpx;
  background-color: #fff;
}

.goods-list {
  margin-top: 20rpx;
}

.goods-item {
  margin-bottom: 20rpx;
  background-color: #fff;
}

.goods-title {
  display: flex;
  flex-direction: column;
}

.goods-title text + text {
  margin-top: 8rpx;
}

.remove-btn {
  color: #fa5151;
  font-size: 26rpx;
}

.text-grey {
  color: #999;
}

.text-sm {
  font-size: 24rpx;
}

.goods-form {
  padding: 20rpx 30rpx;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .label {
    width: 150rpx;
    font-size: 28rpx;
    color: #333;
  }
}

.quantity-control {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8rpx;

  .icon-minus,
  .icon-plus {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    color: #666;
  }

  .quantity-input {
    width: 120rpx;
    height: 60rpx;
    text-align: center;
    background-color: #f5f5f5;
  }
}

.price-input,
.remark-input {
  flex: 1;
  height: 60rpx;
  padding: 0 20rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
}

.footer-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}
</style>
