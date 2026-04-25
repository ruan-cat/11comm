<!--
  库存退货
  功能：选择物品，填写退还数量，选择退还仓库

  访问地址: http://localhost:3000/#/pages-sub/resource/store-return
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { listStoreHouses, saveResourceReturn } from '@/api/resource'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '库存退货',
    enablePullDownRefresh: false,
  },
})

const LABEL_WIDTH = '140px'

const communityInfo = getCurrentCommunity()
const toast = useGlobalToast()

const formRef = ref()

const model = reactive({
  remark: '',
})

const itemList = ref<
  Array<{
    resId: string
    resName: string
    parentRstName: string
    rstName: string
    miniStock: number
    miniUnitCodeName: string
    curStock: number
    shzId: string
    shzName: string
  }>
>([])

const storeHouseOptions = ref<Array<{ label: string, value: string }>>([])

const hasSelectedItem = computed(() => {
  return itemList.value.length > 0
})

const formRules: FormRules = {
  remark: [{ required: true, message: '请输入退还说明' }],
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

const { send: submitReturn, loading: submitting } = useRequest(
  (data: {
    resourceStores: Array<{
      resId: string
      resName: string
      shzId: string
      curStock: number
    }>
    remark: string
    applyType: string
    communityId: string
  }) => saveResourceReturn(data),
  { immediate: false },
).onSuccess(() => {
  toast.success('退还成功')
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}).onError((error) => {
  console.error('退还失败:', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

/** 监听资源选择事件 */
function handleResourceSelected(data: string) {
  try {
    const selectedItems = JSON.parse(data)
    if (Array.isArray(selectedItems) && selectedItems.length > 0) {
      itemList.value = selectedItems.map((item: any) => ({
        ...item,
        curStock: 0,
        shzId: '',
        shzName: '请选择仓库',
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
    url: '/pages-sub/repair/select-resource',
  })
}

function handleStoreChange(index: number, { value }: { value: string }) {
  const selected = storeHouseOptions.value.find(item => item.value === value)
  if (selected) {
    itemList.value[index].shzName = selected.label
  }
}

function removeItem(index: number) {
  itemList.value.splice(index, 1)
}

function decCurStock(index: number) {
  if (itemList.value[index].curStock > 0) {
    itemList.value[index].curStock--
  }
}

function incCurStock(index: number) {
  if (itemList.value[index].curStock < itemList.value[index].miniStock) {
    itemList.value[index].curStock++
  }
}

function returnAll(index: number) {
  itemList.value[index].curStock = itemList.value[index].miniStock
}

async function handleSubmit() {
  if (!hasSelectedItem.value) {
    toast.warning('请选择物品')
    return
  }

  // 验证
  let errorMsg = ''
  itemList.value.forEach((item) => {
    if (item.curStock < 1) {
      errorMsg = '请填写数量'
      return
    }
    if (!item.shzId) {
      errorMsg = '请选择仓库'
      return
    }
  })

  if (errorMsg) {
    toast.warning(errorMsg)
    return
  }

  submitReturn({
    resourceStores: itemList.value.map(item => ({
      resId: item.resId,
      resName: item.resName,
      shzId: item.shzId,
      curStock: item.curStock,
    })),
    remark: model.remark,
    applyType: '20000',
    communityId: communityInfo.communityId,
  })
}
</script>

<template>
  <view class="page-container">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 选择物品 -->
      <FormSectionTitle title="选择物品" />

      <wd-cell-group border>
        <view class="p-3">
          <wd-button v-if="!hasSelectedItem" type="primary" size="small" @click="goToSelectResource">
            选择物品
          </wd-button>

          <view v-else>
            <view v-for="(item, index) in itemList" :key="index" class="resource-item">
              <view class="item-header">
                <text class="item-name">{{ item.resName }}({{ item.parentRstName }}>{{ item.rstName }})</text>
                <text class="remove-btn" @click="removeItem(index)">移除</text>
              </view>

              <view class="item-row">
                <text>当前库存:</text>
                <text>{{ item.miniStock }}{{ item.miniUnitCodeName }}</text>
                <text class="return-all-btn" @click="returnAll(index)">全部退还</text>
              </view>

              <view class="item-row">
                <text>退还数量({{ item.miniUnitCodeName }}):</text>
                <view class="stepper">
                  <text class="stepper-btn" @click="decCurStock(index)">-</text>
                  <input v-model="item.curStock" class="stepper-input" type="number">
                  <text class="stepper-btn" @click="incCurStock(index)">+</text>
                </view>
              </view>

              <view class="item-row">
                <text>退还仓库:</text>
                <wd-picker
                  v-model="item.shzId"
                  :columns="storeHouseOptions"
                  label-key="label"
                  value-key="value"
                  :label-width="LABEL_WIDTH"
                  @confirm="handleStoreChange(index, $event)"
                >
                  <template #default>
                    <text>{{ item.shzName || '请选择仓库' }}</text>
                  </template>
                </wd-picker>
              </view>
            </view>

            <wd-button type="primary" size="small" class="mt-2" @click="goToSelectResource">
              继续添加
            </wd-button>
          </view>
        </view>
      </wd-cell-group>

      <!-- 退还说明 -->
      <FormSectionTitle title="退还说明" />

      <wd-cell-group border>
        <wd-textarea
          v-model="model.remark"
          placeholder="请输入退还说明"
          :maxlength="500"
          show-word-limit
        />
      </wd-cell-group>

      <view class="mt-6 px-3 pb-6">
        <wd-button block type="primary" size="large" :loading="submitting" @click="handleSubmit">
          提交
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

.resource-item {
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.item-name {
  font-size: 28rpx;
  color: #333;
}

.remove-btn {
  padding: 8rpx 16rpx;
  background-color: #fa5151;
  color: #fff;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.item-row {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  font-size: 26rpx;
  color: #666;

  text:first-child {
    width: 180rpx;
  }
}

.return-all-btn {
  margin-left: auto;
  padding: 8rpx 16rpx;
  background-color: #1989fa;
  color: #fff;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.stepper {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.stepper-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.stepper-input {
  width: 100rpx;
  height: 56rpx;
  margin: 0 8rpx;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 8rpx;
}
</style>
