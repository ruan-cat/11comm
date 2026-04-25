<!--
  物资调拨申请
  功能：提交物资调拨申请

  访问地址: http://localhost:3000/#/pages-sub/resource/allocation-apply

  旧代码：gitee-example/pages/resource/allocationStorehouseApply.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, reactive, ref } from 'vue'
import { listStoreHouses, saveAllocationStorehouse } from '@/api/resource'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '物资调拨申请',
    enablePullDownRefresh: false,
  },
})

const LABEL_WIDTH = '80px'

const communityInfo = getCurrentCommunity()
const toast = useGlobalToast()

const itemList = ref<
  Array<{
    resId: string
    resName: string
    resCode: string
    price: number
    quantity: number
  }>
>([])

const formRef = ref()

const model = reactive({
  fromShId: '',
  fromShName: '请选择源仓库',
  toShId: '',
  toShName: '请选择目标仓库',
  description: '',
})

const hasSelectedItem = computed(() => {
  return itemList.value.length > 0
})

const formRules: FormRules = {
  fromShId: [{ required: true, message: '请选择源仓库' }],
  toShId: [{ required: true, message: '请选择目标仓库' }],
  description: [{ required: true, message: '请输入调拨说明' }],
}

const storeHouseOptions = ref<Array<{ label: string, value: string }>>([])

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

const { send: submitAllocation, loading: submitting } = useRequest(
  (data: {
    resourceStores: Array<{
      resId: string
      resName: string
      resCode: string
      price: number
      quantity: number
    }>
    description: string
    fromShId: string
    toShId: string
  }) => saveAllocationStorehouse(data),
  { immediate: false },
).onSuccess(() => {
  toast.success('提交成功')
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}).onError((error) => {
  console.error('提交调拨申请失败:', error)
})

onShow(() => {
  loadStoreHouses()
})

function handleFromShChange({ value }: { value: string }) {
  const selected = storeHouseOptions.value.find(item => item.value === value)
  if (selected) {
    model.fromShName = selected.label
  }
}

function handleToShChange({ value }: { value: string }) {
  const selected = storeHouseOptions.value.find(item => item.value === value)
  if (selected) {
    model.toShName = selected.label
  }
}

function goToSelectResource() {
  uni.navigateTo({ url: `/pages-sub/selector/select-resource?shId=${model.fromShId}` })
}

function removeItem(index: number) {
  itemList.value.splice(index, 1)
}

async function handleSubmit() {
  if (!hasSelectedItem.value) {
    toast.warning('请选择商品')
    return
  }

  if (model.fromShId === model.toShId) {
    toast.warning('源仓库和目标仓库不能相同')
    return
  }

  formRef.value
    .validate()
    .then(async ({ valid, errors }: { valid: boolean, errors: any[] }) => {
      if (!valid) {
        console.error('表单校验失败:', errors)
        return
      }

      submitAllocation({
        resourceStores: itemList.value,
        description: model.description,
        fromShId: model.fromShId,
        toShId: model.toShId,
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
      <FormSectionTitle title="调拨信息" />

      <wd-cell-group border>
        <wd-picker
          v-model="model.fromShId"
          label="源仓库"
          :label-width="LABEL_WIDTH"
          :columns="storeHouseOptions"
          label-key="label"
          value-key="value"
          prop="fromShId"
          @confirm="handleFromShChange"
        />

        <wd-picker
          v-model="model.toShId"
          label="目标仓库"
          :label-width="LABEL_WIDTH"
          :columns="storeHouseOptions"
          label-key="label"
          value-key="value"
          prop="toShId"
          @confirm="handleToShChange"
        />
      </wd-cell-group>

      <FormSectionTitle title="调拨商品" />

      <wd-cell-group border>
        <view class="p-3">
          <wd-button v-if="!hasSelectedItem" type="primary" size="small" @click="goToSelectResource">
            选择商品
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
            </view>

            <wd-button type="primary" size="small" class="mt-2" @click="goToSelectResource">
              继续添加
            </wd-button>
          </view>
        </view>
      </wd-cell-group>

      <FormSectionTitle title="调拨说明" />

      <wd-cell-group border>
        <wd-textarea
          v-model="model.description"
          prop="description"
          placeholder="请输入调拨说明"
          :maxlength="500"
          show-word-limit
        />
      </wd-cell-group>

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
