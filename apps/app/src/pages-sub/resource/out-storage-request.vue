<!--
  出库申请
  功能：填写出库申请，选择物品和数量

  访问地址: http://localhost:3000/#/pages-sub/resource/out-storage-request
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { listStoreHouses, saveItemOutApply } from '@/api/resource'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '出库申请',
    enablePullDownRefresh: false,
  },
})

const LABEL_WIDTH = '100px'

const communityInfo = getCurrentCommunity()
const toast = useGlobalToast()

const formRef = ref()

const model = reactive({
  description: '',
  resOrderType: '20000',
  endUserName: '',
  endUserTel: '',
  shId: '',
  shName: '请选择仓库',
})

const storeHouseOptions = ref<Array<{ label: string, value: string }>>([])

const itemList = ref<
  Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    quantity: number
  }>
>([])

const hasSelectedItem = computed(() => {
  return itemList.value.length > 0
})

const formRules: FormRules = {
  endUserName: [{ required: true, message: '请输入使用人' }],
}

const { send: loadStoreHouses } = useRequest(
  () =>
    listStoreHouses({
      page: 1,
      row: 100,
      communityId: communityInfo.communityId,
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

const { send: submitApply, loading: submitting } = useRequest(
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
    endUserName?: string
    endUserTel?: string
    communityId: string
    shId?: string
  }) => saveItemOutApply(data),
  { immediate: false },
).onSuccess(() => {
  toast.success('提交成功')
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}).onError((error) => {
  console.error('提交失败:', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

/** 监听资源选择事件 */
function handleResourceSelected(data: string) {
  try {
    const selectedItems = JSON.parse(data)
    if (Array.isArray(selectedItems) && selectedItems.length > 0) {
      itemList.value = selectedItems.map((item: any) => ({
        resId: item.resId,
        resName: item.resName,
        resCode: item.resCode || '',
        price: item.price || 0,
        quantity: 1,
      }))
    }
  }
  catch (error) {
    console.error('解析选择的资源数据失败:', error)
  }
}

onShow(() => {
  loadStoreHouses()
  // 监听资源选择事件
  uni.$on('getResourceListInfo', handleResourceSelected)
})

onBeforeUnmount(() => {
  // 移除事件监听
  uni.$off('getResourceListInfo', handleResourceSelected)
})

function goToSelectResource() {
  uni.navigateTo({
    url: `/pages-sub/repair/select-resource?shId=${model.shId}`,
  })
}

function handleStoreChange({ value }: { value: string }) {
  const selected = storeHouseOptions.value.find(item => item.value === value)
  if (selected) {
    model.shName = selected.label
  }
}

function removeItem(index: number) {
  itemList.value.splice(index, 1)
}

function handleQuantityChange(index: number, value: string) {
  itemList.value[index].quantity = Number(value) || 1
}

async function handleSubmit() {
  if (!hasSelectedItem.value) {
    toast.warning('请选择物品')
    return
  }

  formRef.value?.validate()
    .then(() => {
      submitApply({
        resourceStores: itemList.value.map(item => ({
          resId: item.resId,
          resName: item.resName,
          resCode: item.resCode,
          price: item.price,
          quantity: item.quantity || 1,
        })),
        description: model.description,
        resOrderType: model.resOrderType,
        endUserName: model.endUserName,
        endUserTel: model.endUserTel,
        communityId: communityInfo.communityId,
        shId: model.shId,
      })
    })
    .catch(() => {
      // 表单校验未通过
    })
}
</script>

<template>
  <view class="page-container">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 仓库选择 -->
      <FormSectionTitle title="仓库信息" />

      <wd-cell-group border>
        <wd-picker
          v-model="model.shId"
          label="仓库"
          :label-width="LABEL_WIDTH"
          :columns="storeHouseOptions"
          label-key="label"
          value-key="value"
          @confirm="handleStoreChange"
        >
          <template #default>
            <text :class="{ 'text-gray': !model.shId }">{{ model.shName }}</text>
          </template>
        </wd-picker>
      </wd-cell-group>

      <!-- 出库物品 -->
      <FormSectionTitle title="出库物品" />

      <wd-cell-group border>
        <view class="p-3">
          <wd-button v-if="!hasSelectedItem" type="primary" size="small" @click="goToSelectResource">
            选择物品
          </wd-button>

          <view v-else>
            <view v-for="(item, index) in itemList" :key="index" class="resource-item">
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

              <view class="item-quantity">
                <text>数量:</text>
                <input
                  class="quantity-input"
                  type="number"
                  :value="String(item.quantity)"
                  placeholder="请输入数量"
                  @input="handleQuantityChange(index, ($event as any).detail.value)"
                >
              </view>
            </view>

            <wd-button type="primary" size="small" class="mt-2" @click="goToSelectResource">
              继续添加
            </wd-button>
          </view>
        </view>
      </wd-cell-group>

      <!-- 使用人信息 -->
      <FormSectionTitle title="使用人信息" />

      <wd-cell-group border>
        <wd-input
          v-model="model.endUserName"
          label="使用人"
          :label-width="LABEL_WIDTH"
          prop="endUserName"
          placeholder="请输入使用人"
        />
        <wd-input
          v-model="model.endUserTel"
          label="联系电话"
          :label-width="LABEL_WIDTH"
          type="number"
          placeholder="请输入联系电话"
        />
      </wd-cell-group>

      <!-- 出库说明 -->
      <FormSectionTitle title="出库说明" />

      <wd-cell-group border>
        <wd-textarea
          v-model="model.description"
          placeholder="请输入出库说明"
          :maxlength="500"
          show-word-limit
        />
      </wd-cell-group>

      <view class="mt-6 px-3 pb-6">
        <wd-button block type="primary" size="large" :loading="submitting" @click="handleSubmit">
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

.p-3 {
  padding: 24rpx;
}

.mt-2 {
  margin-top: 16rpx;
}

.text-gray {
  color: #999;
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

.item-quantity {
  display: flex;
  align-items: center;
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #666;

  text {
    width: 100rpx;
  }
}

.quantity-input {
  flex: 1;
  height: 56rpx;
  padding: 0 16rpx;
  background-color: #fff;
  border-radius: 8rpx;
}
</style>
