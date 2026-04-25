<!--
  物品入库
  功能：采购入库，填写采购价格和数量

  访问地址: http://localhost:3000/#/pages-sub/resource/item-enter
  建议携带参数: ?applyOrderId=xxx&resOrderType=xxx&taskId=xxx

  旧代码：gitee-example/pages/resource/itemEnterDo.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { queryPurchaseApplyList, saveResourceEnter } from '@/api/resource'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '物品入库',
    enablePullDownRefresh: false,
  },
})

const communityInfo = getCurrentCommunity()
const toast = useGlobalToast()

const applyOrderId = ref('')
const resOrderType = ref('')
const taskId = ref('')

interface ItemInfo {
  resId: string
  resName: string
  rstName?: string
  stock: number
  quantity: number
  price: string
  purchaseQuantity: string
  remark: string
  rsId?: string
}

const itemList = ref<ItemInfo[]>([])

const formRef = ref()
const formRules: FormRules = {}

const { send: loadDetail, loading } = useRequest(
  (params: { page: number, row: number, applyOrderId: string, resOrderType: string }) =>
    queryPurchaseApplyList(params),
  { immediate: false },
).onSuccess((event) => {
  const response = event.data
  const info = response?.list?.[0]
  if (info && info.purchaseApplyDetailVo) {
    itemList.value = info.purchaseApplyDetailVo.map((item: any) => ({
      resId: item.resId,
      resName: item.resName,
      rstName: item.rstName,
      stock: item.stock || 0,
      quantity: item.quantity,
      price: '',
      purchaseQuantity: '',
      remark: '',
      rsId: '',
    }))
  }
}).onError((error) => {
  console.error('加载入库详情失败:', error)
})

const { send: submitEnter, loading: submitting } = useRequest(
  (data: {
    resourceStores: Array<{
      resId: string
      resName: string
      resCode: string
      price: number
      quantity: number
    }>
    description: string
    applyOrderId: string
    taskId: string
  }) => saveResourceEnter(data),
  { immediate: false },
).onSuccess(() => {
  toast.success('入库成功')
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}).onError((error) => {
  console.error('入库失败:', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

onLoad((options) => {
  applyOrderId.value = options?.applyOrderId || ''
  resOrderType.value = options?.resOrderType || '10000'
  taskId.value = options?.taskId || ''
  loadDetail({
    page: 1,
    row: 100,
    applyOrderId: applyOrderId.value,
    resOrderType: resOrderType.value,
  })
})

async function handleSubmit() {
  // 验证填写
  let errorMsg = ''
  itemList.value.forEach((item) => {
    if (!item.purchaseQuantity || Number.parseInt(item.purchaseQuantity) < 1) {
      errorMsg = '请填写采购数量'
    }
    if (!item.price || Number.parseFloat(item.price) <= 0) {
      errorMsg = '请填写单价'
    }
  })

  if (errorMsg) {
    toast.warning(errorMsg)
    return
  }

  submitEnter({
    resourceStores: itemList.value.map(item => ({
      resId: item.resId,
      resName: item.resName,
      resCode: '',
      price: Number.parseFloat(item.price),
      quantity: Number.parseInt(item.purchaseQuantity),
    })),
    description: '',
    applyOrderId: applyOrderId.value,
    taskId: taskId.value,
  })
}
</script>

<template>
  <view class="page-container">
    <wd-loading v-if="loading" />
    <wd-form v-else ref="formRef" :model="itemList" :rules="formRules">
      <FormSectionTitle title="采购物品" />

      <wd-cell-group border>
        <view v-for="(item, index) in itemList" :key="index" class="resource-item">
          <view class="item-header">
            <text class="item-name">{{ item.resName }}</text>
            <text v-if="item.rstName" class="item-type">- {{ item.rstName }}</text>
          </view>

          <view class="item-row">
            <text class="label">库存:</text>
            <text>{{ item.stock }}</text>
          </view>

          <view class="item-row">
            <text class="label">申请数量:</text>
            <text>{{ item.quantity }}</text>
          </view>

          <view class="item-row">
            <text class="label">价格:</text>
            <wd-input
              v-model="item.price"
              type="digit"
              placeholder="请输入价格"
              :border="false"
              class="flex-1"
            />
          </view>

          <view class="item-row">
            <text class="label">采购数量:</text>
            <wd-input
              v-model="item.purchaseQuantity"
              type="number"
              placeholder="请输入数量"
              :border="false"
              class="flex-1"
            />
          </view>

          <view class="item-row">
            <text class="label">备注:</text>
            <wd-input
              v-model="item.remark"
              placeholder="选填"
              :border="false"
              class="flex-1"
            />
          </view>
        </view>
      </wd-cell-group>

      <view class="mt-6 px-3 pb-6">
        <wd-button block type="primary" size="large" :loading="submitting" @click="handleSubmit">
          提交入库
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
  padding: 24rpx;
  border-bottom: 1rpx solid #eee;

  &:last-child {
    border-bottom: none;
  }
}

.item-header {
  margin-bottom: 16rpx;
}

.item-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.item-type {
  font-size: 24rpx;
  color: #999;
  margin-left: 8rpx;
}

.item-row {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  font-size: 26rpx;

  .label {
    width: 140rpx;
    color: #666;
  }
}

.flex-1 {
  flex: 1;
}
</style>
