<!--
  库存报废
  功能：选择物品，填写损耗数量，选择损耗类型

  访问地址: http://localhost:3000/#/pages-sub/resource/store-scrap
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onBeforeUnmount, ref } from 'vue'
import { saveResourceScrap } from '@/api/resource'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '库存报废',
    enablePullDownRefresh: false,
  },
})

const communityInfo = getCurrentCommunity()
const toast = useGlobalToast()

const formRef = ref()
const formRules: FormRules = {}

const scrapTypes = ref([
  { state: '', stateName: '请选择' },
  { state: '1001', stateName: '报废回收' },
  { state: '3003', stateName: '公用损耗' },
])

const itemList = ref<
  Array<{
    resId: string
    resName: string
    parentRstName: string
    rstName: string
    miniStock: number
    miniUnitCodeName: string
    giveQuantity: number
    state: string
    stateName: string
    purchaseRemark: string
  }>
>([])

const hasSelectedItem = ref(false)

const { send: submitScrap, loading: submitting } = useRequest(
  (data: {
    resourceStores: Array<{
      resId: string
      resName: string
      giveQuantity: number
      state: string
      purchaseRemark: string
    }>
    flag: number
    communityId: string
  }) => saveResourceScrap(data),
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
        ...item,
        giveQuantity: 0,
        state: '',
        stateName: '请选择',
        purchaseRemark: '',
      }))
      hasSelectedItem.value = true
    }
  }
  catch (error) {
    console.error('解析选择的资源数据失败:', error)
  }
}

onShow(() => {
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

function handleScrapTypeChange(index: number, { value }: { value: string }) {
  const selected = scrapTypes.value.find(item => item.state === value)
  if (selected) {
    itemList.value[index].stateName = selected.stateName
  }
}

function removeItem(index: number) {
  itemList.value.splice(index, 1)
  hasSelectedItem.value = itemList.value.length > 0
}

function decQuantity(index: number) {
  if (itemList.value[index].giveQuantity > 0) {
    itemList.value[index].giveQuantity--
  }
}

function incQuantity(index: number) {
  if (itemList.value[index].giveQuantity < itemList.value[index].miniStock) {
    itemList.value[index].giveQuantity++
  }
}

async function handleSubmit() {
  if (!hasSelectedItem.value) {
    toast.warning('请选择物品')
    return
  }

  // 验证
  let errorMsg = ''
  itemList.value.forEach((item) => {
    if (item.giveQuantity < 1) {
      errorMsg = '请填写数量'
      return
    }
    if (!item.state) {
      errorMsg = '请选择损耗类型'
      return
    }
    if (!item.purchaseRemark) {
      errorMsg = '请填写备注'
      return
    }
  })

  if (errorMsg) {
    toast.warning(errorMsg)
    return
  }

  submitScrap({
    resourceStores: itemList.value.map(item => ({
      resId: item.resId,
      resName: item.resName,
      giveQuantity: item.giveQuantity,
      state: item.state,
      purchaseRemark: item.purchaseRemark,
    })),
    flag: 1,
    communityId: communityInfo.communityId,
  })
}
</script>

<template>
  <view class="page-container">
    <wd-form ref="formRef" :model="itemList" :rules="formRules">
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
              </view>

              <view class="item-row">
                <text>损耗类型:</text>
                <wd-picker
                  v-model="item.state"
                  :columns="scrapTypes"
                  value-key="state"
                  label-key="stateName"
                >
                  <template #default>
                    <text>{{ item.stateName }}</text>
                  </template>
                </wd-picker>
              </view>

              <view class="item-row">
                <text>损耗数量({{ item.miniUnitCodeName }}):</text>
                <view class="stepper">
                  <text class="stepper-btn" @click="decQuantity(index)">-</text>
                  <input v-model="item.giveQuantity" class="stepper-input" type="number">
                  <text class="stepper-btn" @click="incQuantity(index)">+</text>
                </view>
              </view>

              <view class="item-row">
                <text>备注:</text>
                <input v-model="item.purchaseRemark" class="remark-input" type="text" placeholder="请输入备注">
              </view>
            </view>

            <wd-button type="primary" size="small" class="mt-2" @click="goToSelectResource">
              继续添加
            </wd-button>
          </view>
        </view>
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
  background-color: #fff;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.stepper-input {
  width: 100rpx;
  height: 56rpx;
  margin: 0 8rpx;
  text-align: center;
  background-color: #fff;
  border-radius: 8rpx;
}

.remark-input {
  flex: 1;
  height: 56rpx;
  padding: 0 16rpx;
  background-color: #fff;
  border-radius: 8rpx;
  margin-left: auto;
}
</style>
