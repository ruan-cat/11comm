<!--
  选择维修物资
  功能：选择维修所需的物品/资源，支持标准商品和自定义商品
  表单页

  访问地址: http://localhost:3000/#/pages-sub/repair/select-resource
  建议携带参数: ?feeFlag=1001

  完整示例: http://localhost:3000/#/pages-sub/repair/select-resource?feeFlag=1001
  上级页面: http://localhost:3000/#/pages-sub/repair/handle 处理维修工单页面

  有偿维修（显示价格输入框）
  http://localhost:3000/#/pages-sub/repair/select-resource?feeFlag=1001

  无偿维修（不显示价格输入框）
  http://localhost:3000/#/pages-sub/repair/select-resource?feeFlag=0

  不传参数（默认不显示价格）
  http://localhost:3000/#/pages-sub/repair/select-resource

  旧代码：gitee-example/pages/repairHandle/selectResource.vue
-->

<!-- 自主测试时的覆盖场景
1. ✅ **一级分类加载**：商品类型下拉应显示 4 个选项 + 自定义
2. ✅ **二级分类联动**：选择一级分类后，二级分类应自动加载对应的子分类
3. ✅ **商品列表加载**：选择二级分类后，商品列表应显示该分类下的所有商品
4. ✅ **自定义商品模式**：选择"自定义"后，应切换到自定义商品输入表单
5. ✅ **价格显示控制**：`feeFlag=1001` 时显示价格输入框，其他值时隐藏
6. ✅ **表单验证**：各字段的校验规则（商品名、价格、数量）应正常工作
-->

<!-- 基本完成检查审核 -->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import type { RepairResource } from '@/types/repair'
import { onLoad } from '@dcloudio/uni-app'
import { isConditionsEvery } from '@ruan-cat/utils'
import { useRequest } from 'alova/client'
import { computed, reactive, ref } from 'vue'
import { getRepairResources, getRepairResourceTypes } from '@/api/repair'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '选择物品',
    enablePullDownRefresh: false,
  },
})

interface ResourceType {
  rstId: string
  name: string
  parentId?: string
}

/** 表单引用 */
const formRef = ref()

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

/** Toast 提示 */
const toast = useGlobalToast()

/** 页面参数 */
const feeFlag = ref('')

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 是否自定义 */
const isCustom = ref(false)

/** 商品类型（一级分类） */
const parentTypeOptions = ref<ResourceType[]>([{ rstId: '', name: '请选择商品类型' }])
const selectedParentTypeRstId = ref('')
const selectedParentType = computed(() => parentTypeOptions.value.find(item => item.rstId === selectedParentTypeRstId.value))

/** 商品子类型（二级分类） */
const sonTypeOptions = ref<ResourceType[]>([{ rstId: '', name: '请选择商品类型' }])
const selectedSonTypeRstId = ref('')
const selectedSonType = computed(() => sonTypeOptions.value.find(item => item.rstId === selectedSonTypeRstId.value))

/** 商品列表 */
const resourceOptions = ref<RepairResource[]>([])
const selectedResourceId = ref('')
const selectedResource = computed(() => resourceOptions.value.find(item => item.resId === selectedResourceId.value) || {})

/** 表单数据模型 */
const model = reactive({
  /** 自定义商品名 */
  customGoodsName: '',
  /** 价格 */
  price: 0,
  /** 数量 */
  quantity: 1,
})

/** 价格是否禁用 */
const priceDisabled = ref(false)

/** 是否显示固定价格 */
const showFixedPrice = computed(() => {
  return isConditionsEvery([
    () => feeFlag.value === '1001',
    () => selectedResource.value.outLowPrice !== undefined,
    () => selectedResource.value.outHighPrice === selectedResource.value.outLowPrice,
  ])
})

/** 是否显示价格范围 */
const showPriceRange = computed(() => {
  return isConditionsEvery([
    () => feeFlag.value === '1001',
    () => selectedResource.value.outLowPrice !== undefined,
    () => selectedResource.value.outHighPrice !== selectedResource.value.outLowPrice,
  ])
})

/** 表单校验规则 */
const formRules: FormRules = {
  customGoodsName: [
    {
      required: true,
      message: '请输入商品名',
      validator: (value) => {
        if (!isCustom.value)
          return Promise.resolve()
        return value && String(value).trim()
          ? Promise.resolve()
          : Promise.reject(new Error('请输入商品名'))
      },
    },
  ],
  price: [
    {
      required: true,
      message: '请输入有效金额',
      validator: (value) => {
        if (feeFlag.value !== '1001')
          return Promise.resolve()
        const numValue = Number(value)
        return numValue > 0
          ? Promise.resolve()
          : Promise.reject(new Error('请输入有效金额'))
      },
    },
  ],
  quantity: [
    {
      required: true,
      message: '商品数量不能为零',
      validator: (value) => {
        const numValue = Number(value)
        return numValue >= 1
          ? Promise.resolve()
          : Promise.reject(new Error('商品数量不能为零'))
      },
    },
  ],
}

/** 加载商品类型（一级分类） */
const { send: loadParentTypes } = useRequest(
  () =>
    getRepairResourceTypes({
      communityId: communityInfo.communityId,
      parentId: '0',
    }),
  { immediate: false },
)
  .onSuccess((result) => {
    parentTypeOptions.value = [
      { rstId: '', name: '请选择商品类型' },
      ...result.data,
      { rstId: 'custom', name: '自定义' },
    ]
  })
  .onError((error) => {
    console.error('加载商品类型失败:', error)
  })

/** 加载商品子类型（二级分类） */
const { send: loadSonTypes } = useRequest(
  (parentId: string) =>
    getRepairResourceTypes({
      communityId: communityInfo.communityId,
      parentId,
    }),
)
  .onSuccess((result) => {
    sonTypeOptions.value = [{ rstId: '', name: '请选择商品类型' }, ...result.data]
    selectedSonTypeRstId.value = ''
  })
  .onError((error) => {
    console.error('加载商品子类型失败:', error)
  })

/** 加载商品列表 */
const { send: loadResources } = useRequest(
  (typeId: string) =>
    getRepairResources({
      rstId: typeId,
      communityId: communityInfo.communityId,
    }),
)
  .onSuccess((result) => {
    if (result.data.resources && result.data.resources.length > 0) {
      resourceOptions.value = result.data.resources
      selectedResourceId.value = ''
    }
    else {
      toast.warning('暂无商品')
      resourceOptions.value = []
      selectedResourceId.value = ''
    }
  })
  .onError((error) => {
    console.error('加载商品列表失败:', error)
  })

/** 页面加载 */
onLoad((options) => {
  // 接收页面参数
  feeFlag.value = (options?.feeFlag as string) || ''

  // 加载商品类型
  loadParentTypes()
})

/** 一级分类改变 */
function handleParentTypeChange({ value }: { value: string }) {
  selectedParentTypeRstId.value = value

  // 清空二级分类和商品
  sonTypeOptions.value = [{ rstId: '', name: '请选择商品类型' }]
  selectedSonTypeRstId.value = ''
  resourceOptions.value = []
  selectedResourceId.value = ''
  model.price = 0
  priceDisabled.value = false

  if (value === '') {
    isCustom.value = false
    return
  }

  if (value === 'custom') {
    // 选择自定义
    isCustom.value = true
  }
  else {
    // 选择标准类型，加载二级分类
    isCustom.value = false
    loadSonTypes(value)
  }
}

/** 二级分类改变 */
function handleSonTypeChange({ value }: { value: string }) {
  selectedSonTypeRstId.value = value

  // 清空商品
  resourceOptions.value = []
  selectedResourceId.value = ''
  model.price = 0
  priceDisabled.value = false

  if (value === '')
    return

  loadResources(value)
}

/** 商品选择改变 */
function handleResourceChange({ value }: { value: string }) {
  selectedResourceId.value = value

  if (value === '') {
    model.price = 0
    priceDisabled.value = false
    return
  }

  const selected = resourceOptions.value.find(item => item.resId === value)
  if (!selected)
    return

  // 如果价格固定，自动填充价格
  if (selected.outLowPrice === selected.outHighPrice) {
    model.price = selected.outLowPrice || 0
    priceDisabled.value = true
  }
  else {
    model.price = 0
    priceDisabled.value = false
  }
}

/** 数量变化处理 */
function handleQuantityChange({ value }: { value: number }) {
  model.quantity = value
}

/** 确认选择 */
async function handleConfirm() {
  // 非自定义商品的额外校验
  if (!isCustom.value) {
    if (!selectedSonTypeRstId.value) {
      toast.warning('请选择商品类型')
      return
    }
    if (!selectedResourceId.value) {
      toast.warning('请选择商品')
      return
    }
  }

  // 表单校验
  try {
    const { valid } = await formRef.value.validate()
    if (!valid) {
      return
    }
  }
  catch (error) {
    console.error('表单校验异常:', error)
    return
  }

  // 构建选择的商品数据
  const chooseResource: RepairResource = {
    ...selectedResource.value,
    price: model.price,
    useNumber: model.quantity,
    isCustom: isCustom.value,
    customGoodsName: model.customGoodsName,
  }

  if (isCustom.value) {
    chooseResource.resName = model.customGoodsName
    chooseResource.resTypeName = '自定义'
  }

  // 通过 uni.$emit 传递数据（兼容旧项目方式）
  uni.$emit('getResourceInfo', JSON.stringify(chooseResource))

  // 返回上一页
  uni.navigateBack({
    delta: 1,
  })
}

/** 取消 */
function handleCancel() {
  uni.navigateBack({
    delta: 1,
  })
}
</script>

<template>
  <view class="min-h-screen bg-#f5f5f5 pt-3">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 商品类型（一级分类） -->
      <wd-cell-group border>
        <FormSectionTitle
          title="商品类型"
          icon="grid"
          icon-class="i-carbon-grid text-blue-500"
        />
        <wd-picker
          v-model="selectedParentTypeRstId"
          label="商品类型"
          placeholder="请选择商品类型"
          :label-width="LABEL_WIDTH"
          :columns="parentTypeOptions"
          label-key="name"
          value-key="rstId"
          @confirm="handleParentTypeChange"
        />
      </wd-cell-group>

      <!-- 自定义商品 -->
      <view v-if="isCustom" class="mt-3">
        <wd-cell-group border>
          <FormSectionTitle
            title="商品信息"
            icon="information"
            icon-class="i-carbon-information text-green-500"
            required
          />
          <wd-input
            v-model="model.customGoodsName"
            label="商品名"
            :label-width="LABEL_WIDTH"
            prop="customGoodsName"
            placeholder="请输入商品名"
            clearable
            :rules="formRules.customGoodsName"
          />
          <wd-input
            v-if="feeFlag === '1001'"
            v-model="model.price"
            type="digit"
            label="自定义价格"
            :label-width="LABEL_WIDTH"
            prop="price"
            placeholder="请输入自定义价格"
            clearable
            :rules="formRules.price"
          />
        </wd-cell-group>
      </view>

      <!-- 标准商品 -->
      <view v-else class="mt-3">
        <wd-cell-group border>
          <FormSectionTitle
            title="商品选择"
            icon="shopping-cart"
            icon-class="i-carbon-shopping-cart text-blue-500"
            required
          />
          <!-- 二级分类 -->
          <wd-picker
            v-model="selectedSonTypeRstId"
            label="二级分类"
            :label-width="LABEL_WIDTH"
            :columns="sonTypeOptions"
            label-key="name"
            value-key="rstId"
            @confirm="handleSonTypeChange"
          />

          <!-- 商品选择 -->
          <wd-picker
            v-if="selectedSonTypeRstId"
            v-model="selectedResourceId"
            label="商品"
            :label-width="LABEL_WIDTH"
            :columns="resourceOptions"
            label-key="resName"
            value-key="resId"
            @confirm="handleResourceChange"
          />
        </wd-cell-group>

        <!-- 商品详情 -->
        <view v-if="selectedResourceId" class="mt-3">
          <wd-cell-group border>
            <FormSectionTitle
              title="商品详情"
              icon="catalog"
              icon-class="i-carbon-catalog text-purple-500"
            />
            <!-- 价格 -->
            <wd-input
              v-if="feeFlag === '1001'"
              v-model="model.price"
              type="digit"
              label="单价"
              :label-width="LABEL_WIDTH"
              prop="price"
              :disabled="priceDisabled"
              placeholder="请输入单价"
              clearable
              :rules="formRules.price"
            />

            <!-- 价格（固定价格） -->
            <wd-cell
              v-if="showFixedPrice"
              title="价格"
              :title-width="LABEL_WIDTH"
              center
            >
              <text class="text-gray-400">{{ selectedResource.outLowPrice }}</text>
            </wd-cell>

            <!-- 价格范围（区间价格） -->
            <wd-cell
              v-if="showPriceRange"
              title="价格范围"
              :title-width="LABEL_WIDTH"
              center
            >
              <text class="text-gray-400">
                {{ selectedResource.outLowPrice }} - {{ selectedResource.outHighPrice }}
              </text>
            </wd-cell>

            <!-- 规格 -->
            <wd-cell title="规格" :title-width="LABEL_WIDTH" center>
              <text class="text-gray-400">{{ selectedResource.specName || '-' }}</text>
            </wd-cell>
          </wd-cell-group>
        </view>
      </view>

      <!-- 数量 -->
      <view class="mt-3">
        <wd-cell-group border>
          <FormSectionTitle
            title="购买数量"
            icon="number"
            icon-class="i-carbon-hashtag text-orange-500"
            required
          />
          <wd-cell title="数量" :title-width="LABEL_WIDTH" center>
            <wd-input-number
              v-model="model.quantity"
              :min="1"
              :max="9999"
              :step="1"
              @change="handleQuantityChange"
            />
          </wd-cell>
        </wd-cell-group>
      </view>

      <!-- 操作按钮 -->
      <view class="mt-6 px-3 pb-6">
        <wd-button block type="success" size="large" @click="handleConfirm">
          确定
        </wd-button>
        <wd-button block size="large" class="mt-3" @click="handleCancel">
          取消
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style lang="scss" scoped>
/** wd-cell 值靠左对齐 - wot-design-uni 组件必需样式，必须保留 */
:deep(.cell-value-left) {
  flex: 1;
  text-align: left !important;
}
</style>
