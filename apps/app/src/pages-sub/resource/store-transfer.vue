<!--
  库存调拨（转赠）
  功能：选择物品，填写转赠数量，选择员工

  访问地址: http://localhost:3000/#/pages-sub/resource/store-transfer
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { saveResourceStoreTransfer } from '@/api/resource'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '库存调拨',
    enablePullDownRefresh: false,
  },
})

const LABEL_WIDTH = '80px'

const communityInfo = getCurrentCommunity()
const toast = useGlobalToast()

const formRef = ref()

const model = reactive({
  description: '',
  acceptUserId: '',
  acceptUserName: '',
})

const itemList = ref<
  Array<{
    resId: string
    resName: string
    parentRstName: string
    rstName: string
    miniStock: number
    miniUnitCodeName: string
    giveQuantity: number
  }>
>([])

// 员工列表（模拟数据，实际应从接口获取）
const staffOptions = ref([
  { staffId: 'USER_001', staffName: '张三' },
  { staffId: 'USER_002', staffName: '李四' },
  { staffId: 'USER_003', staffName: '王五' },
  { staffId: 'USER_004', staffName: '赵六' },
])

const staffPickerOptions = computed(() => {
  return staffOptions.value.map(staff => ({
    label: staff.staffName,
    value: staff.staffId,
  }))
})

const hasSelectedItem = computed(() => {
  return itemList.value.length > 0
})

const formRules: FormRules = {
  description: [{ required: true, message: '请输入转赠说明' }],
}

const { send: submitTransfer, loading: submitting } = useRequest(
  (data: {
    resourceStores: Array<{
      resId: string
      resName: string
      resCode: string
      price: number
      quantity: number
    }>
    description: string
    communityId: string
    targetUserId: string
  }) => saveResourceStoreTransfer(data),
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
      }))
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

function handleStaffChange({ value }: { value: string }) {
  const selected = staffOptions.value.find(staff => staff.staffId === value)
  if (selected) {
    model.acceptUserId = selected.staffId
    model.acceptUserName = selected.staffName
  }
}

function removeItem(index: number) {
  itemList.value.splice(index, 1)
}

function handleQuantityChange(index: number, value: string) {
  const num = Number.parseInt(value) || 0
  const max = itemList.value[index].miniStock
  if (num > max) {
    itemList.value[index].giveQuantity = max
  }
  else {
    itemList.value[index].giveQuantity = num
  }
}

async function handleSubmit() {
  if (!hasSelectedItem.value) {
    toast.warning('请选择物品')
    return
  }

  if (!model.acceptUserId) {
    toast.warning('请选择员工')
    return
  }

  // 验证
  let errorMsg = ''
  if (!model.description) {
    errorMsg = '请输入转赠说明'
  }

  itemList.value.forEach((item) => {
    if (item.giveQuantity < 1) {
      errorMsg = '请填写数量'
      return
    }
  })

  if (errorMsg) {
    toast.warning(errorMsg)
    return
  }

  submitTransfer({
    resourceStores: itemList.value.map(item => ({
      resId: item.resId,
      resName: item.resName,
      resCode: '',
      price: 0,
      quantity: item.giveQuantity,
    })),
    description: model.description,
    communityId: communityInfo.communityId,
    targetUserId: model.acceptUserId,
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
              </view>

              <view class="item-row">
                <text>数量({{ item.miniUnitCodeName }}):</text>
                <input
                  class="quantity-input"
                  type="number"
                  :value="String(item.giveQuantity)"
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

      <!-- 选择员工 -->
      <FormSectionTitle title="选择员工" />

      <wd-cell-group border>
        <wd-picker
          v-model="model.acceptUserId"
          label="员工"
          :label-width="LABEL_WIDTH"
          :columns="staffPickerOptions"
          label-key="label"
          value-key="value"
          @confirm="handleStaffChange"
        >
          <template #default>
            <text :class="{ 'text-gray': !model.acceptUserId }">
              {{ model.acceptUserName || '请选择员工' }}
            </text>
          </template>
        </wd-picker>
      </wd-cell-group>

      <!-- 转赠说明 -->
      <FormSectionTitle title="转赠说明" />

      <wd-cell-group border>
        <wd-textarea
          v-model="model.description"
          placeholder="请输入转赠说明"
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
    width: 160rpx;
  }
}

.quantity-input {
  flex: 1;
  height: 56rpx;
  padding: 0 16rpx;
  background-color: #fff;
  border-radius: 8rpx;
  margin-left: auto;
}
</style>
