<!--
  采购申请编辑
  功能：编辑采购申请信息

  访问地址: http://localhost:3000/#/pages-sub/resource/edit-purchase-apply
  建议携带参数: ?applyOrderId=xxx&resOrderType=xxx

  旧代码：gitee-example/pages/resource/editPurchaseApply.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, onMounted, reactive, ref } from 'vue'
import { listStoreHouses, queryPurchaseApplyList, updatePurchaseApply } from '@/api/resource'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '编辑采购申请',
    enablePullDownRefresh: false,
  },
})

const LABEL_WIDTH = '80px'

const communityInfo = getCurrentCommunity()
const toast = useGlobalToast()

const applyOrderId = ref('')
const resOrderType = ref('')
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
  shId: '',
  shName: '请选择仓库',
  endUserName: '',
  endUserTel: '',
  description: '',
  resOrderType: '10000',
})

const hasSelectedItem = computed(() => {
  return itemList.value.length > 0
})

const formRules: FormRules = {
  shId: [{ required: true, message: '请选择仓库' }],
  endUserName: [{ required: true, message: '请输入联系人' }],
  endUserTel: [
    { required: true, message: '请输入手机号' },
    { required: false, pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
  ],
  description: [{ required: true, message: '请输入申请说明' }],
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

const { send: loadDetail } = useRequest(
  (params: { page: number, row: number, applyOrderId: string, resOrderType: string }) =>
    queryPurchaseApplyList(params),
  { immediate: false },
).onSuccess((event) => {
  const response = event.data
  const applyInfo = response?.list?.[0]
  if (applyInfo) {
    model.shId = applyInfo.shId || ''
    model.shName = applyInfo.shName || '请选择仓库'
    model.endUserName = applyInfo.endUserName || ''
    model.endUserTel = applyInfo.endUserTel || ''
    model.description = applyInfo.description || ''
    resOrderType.value = applyInfo.resOrderType || '10000'
    model.resOrderType = resOrderType.value
    // 加载商品列表
    itemList.value = (applyInfo.purchaseApplyDetailVo || []).map((item: any) => ({
      resId: item.resId,
      resName: item.resName,
      resCode: item.resCode,
      price: item.price || 0,
      quantity: item.quantity || 0,
    }))
  }
}).onError((error) => {
  console.error('加载采购申请详情失败:', error)
})

const { send: submitUpdate, loading: submitting } = useRequest(
  (data: {
    applyOrderId: string
    resourceStores: Array<{
      resId: string
      resName: string
      resCode: string
      price: number
      quantity: number
    }>
    description: string
    resOrderType: string
  }) => updatePurchaseApply(data),
  { immediate: false },
).onSuccess(() => {
  toast.success('修改成功')
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}).onError((error) => {
  console.error('修改采购申请失败:', error)
})

onMounted(() => {
  loadStoreHouses()
})

onLoad((options) => {
  applyOrderId.value = options?.applyOrderId || ''
  resOrderType.value = options?.resOrderType || '10000'
  model.resOrderType = resOrderType.value
  loadDetail({
    page: 1,
    row: 1,
    applyOrderId: applyOrderId.value,
    resOrderType: resOrderType.value,
  })
})

function handleStoreHouseChange({ value }: { value: string }) {
  const selected = storeHouseOptions.value.find(item => item.value === value)
  if (selected) {
    model.shName = selected.label
  }
}

function goToSelectResource() {
  uni.navigateTo({ url: `/pages-sub/selector/select-resource?shId=${model.shId}` })
}

function removeItem(index: number) {
  itemList.value.splice(index, 1)
}

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

      submitUpdate({
        applyOrderId: applyOrderId.value,
        resourceStores: itemList.value,
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
      <FormSectionTitle title="采购信息" />

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

      <FormSectionTitle title="采购商品" />

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

      <view class="mt-6 px-3 pb-6">
        <wd-button block type="success" size="large" :loading="submitting" @click="handleSubmit">
          提交修改
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
