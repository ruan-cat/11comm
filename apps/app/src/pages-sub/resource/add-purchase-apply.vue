<!--
  采购申请
  功能：提交采购申请，选择商品并填写采购数量和说明

  访问地址: http://localhost:3000/#/pages-sub/resource/add-purchase-apply

  旧代码：gitee-example/pages/resource/addPurchaseApply.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, reactive, ref } from 'vue'
import { listStoreHouses, savePurchaseApply } from '@/api/resource'
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

// ==================== 表单状态 ====================

/** 表单引用 */
const formRef = ref()

/** 表单数据模型 */
const model = reactive({
  /** 仓库ID */
  shId: '',
  /** 仓库名称 */
  shName: '请选择仓库',
  /** 联系人 */
  endUserName: '',
  /** 手机号 */
  endUserTel: '',
  /** 申请说明 */
  description: '',
  /** 订单类型 */
  resOrderType: '10000',
})

// ==================== 计算属性 ====================

/** 是否已选择商品 */
const hasSelectedItem = computed(() => {
  return purchaseList.value.length > 0
})

// ==================== 表单校验规则 ====================

/** 表单校验规则 */
const formRules: FormRules = {
  shId: [{ required: true, message: '请选择仓库' }],
  endUserName: [{ required: true, message: '请输入联系人' }],
  endUserTel: [
    { required: true, message: '请输入手机号' },
    { required: false, pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
  ],
  description: [{ required: true, message: '请输入申请说明' }],
}

// ==================== 仓库选择 ====================

/** 仓库选项 */
const storeHouseOptions = ref<Array<{ label: string, value: string }>>([])

/** 加载仓库列表 */
const { send: loadStoreHouses } = useRequest(
  () =>
    listStoreHouses({
      page: 1,
      row: 100,
      communityId: communityInfo.communityId,
      allowPurchase: 'ON',
    }),
  { immediate: false },
).onSuccess((event) => {
  const response = event.data
  const list = response?.list || []
  storeHouseOptions.value = list.map((item: any) => ({
    label: item.shName,
    value: item.shId,
  }))
}).onError((error) => {
  console.error('加载仓库列表失败:', error)
})

/** 仓库变更 */
function handleStoreHouseChange({ value }: { value: string }) {
  const selected = storeHouseOptions.value.find(item => item.value === value)
  if (selected) {
    model.shName = selected.label
  }
}

// ==================== 提交接口 ====================

/** 提交采购申请 */
const { send: submitPurchase, loading: submitting } = useRequest(
  (data: {
    resourceStores: Array<{
      resId: string
      resName: string
      resCode: string
      price: number
      quantity: number
    }>
    description: string
    resOrderType: string
  }) => savePurchaseApply(data),
  { immediate: false },
).onSuccess(() => {
  toast.success('提交成功')
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}).onError((error) => {
  console.error('提交采购申请失败:', error)
})

// ==================== 生命周期 ====================

onShow(() => {
  // 加载仓库列表
  loadStoreHouses()

  // 监听商品选择事件
  uni.$off('purchaseSelect')
  uni.$on('purchaseSelect', (info: any) => {
    if (info && Array.isArray(info)) {
      purchaseList.value = info
    }
  })
})

// ==================== 方法 ====================

/** 跳转到选择商品页面 */
function goToSelectResource() {
  const url = `/pages-sub/selector/select-resource?shId=${model.shId}`
  uni.navigateTo({ url })
}

/** 删除商品 */
function removeItem(index: number) {
  purchaseList.value.splice(index, 1)
}

/** 提交表单 */
async function handleSubmit() {
  if (!hasSelectedItem.value) {
    toast.warning('请选择商品')
    return
  }

  formRef.value
    .validate()
    .then(async ({ valid, errors }: { valid: boolean, errors: any[] }) => {
      if (!valid) {
        console.error('表单校验失败:', errors)
        return
      }

      // 构建提交数据
      const resourceStores = purchaseList.value.map(item => ({
        resId: item.resId,
        resName: item.resName,
        resCode: item.resCode,
        price: item.price,
        quantity: 1,
      }))

      submitPurchase({
        resourceStores,
        description: model.description,
        resOrderType: model.resOrderType,
      })
    })
    .catch((error: any) => {
      console.error('表单校验异常:', error)
    })
}
</script>

<template>
  <view class="page-container">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 基本信息 -->
      <FormSectionTitle title="基本信息" />

      <wd-cell-group border>
        <wd-picker
          v-model="model.shId"
          label="仓库"
          :label-width="LABEL_WIDTH"
          :columns="storeHouseOptions"
          label-key="label"
          value-key="value"
          prop="shId"
          @confirm="handleStoreHouseChange"
        />

        <wd-input
          v-model="model.endUserName"
          label="联系人"
          :label-width="LABEL_WIDTH"
          prop="endUserName"
          placeholder="请输入联系人"
          clearable
        />

        <wd-input
          v-model="model.endUserTel"
          label="手机号"
          :label-width="LABEL_WIDTH"
          prop="endUserTel"
          placeholder="请输入手机号"
          clearable
          type="number"
          :maxlength="11"
        />
      </wd-cell-group>

      <!-- 商品选择 -->
      <FormSectionTitle title="采购商品" />

      <wd-cell-group border>
        <view class="p-3">
          <wd-button v-if="!hasSelectedItem" type="primary" size="small" @click="goToSelectResource">
            选择商品
          </wd-button>

          <view v-else>
            <view v-for="(item, index) in purchaseList" :key="index" class="resource-item">
              <view class="flex items-center justify-between">
                <view class="flex-1">
                  <view class="text-base font-medium">
                    {{ item.resName }}
                  </view>
                  <view class="text-sm text-gray-500">
                    单价: ¥{{ item.price }}
                  </view>
                </view>
                <wd-button type="error" size="small" plain @click="removeItem(index)">
                  删除
                </wd-button>
              </view>
            </view>

            <wd-button type="primary" size="small" class="mt-2" @click="goToSelectResource">
              继续添加
            </wd-button>
          </view>
        </view>
      </wd-cell-group>

      <!-- 申请说明 -->
      <FormSectionTitle title="申请说明" />

      <wd-cell-group border>
        <wd-textarea
          v-model="model.description"
          prop="description"
          placeholder="请输入申请说明"
          :maxlength="500"
          show-word-limit
        />
      </wd-cell-group>

      <!-- 提交按钮 -->
      <view class="mt-6 px-3 pb-6">
        <wd-button block type="success" size="large" :loading="submitting" @click="handleSubmit">
          提交申请
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.resource-item {
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
