<!--
  处理维修工单
  功能：处理维修工单，支持派单/转单/退单/办结
  表单页

  访问地址: http://localhost:3000/#/pages-sub/repair/handle
  建议携带参数: ?action=DISPATCH&repairId=REP_001&repairType=水电维修
  action 传参： DISPATCH-派单, TRANSFER-转单, BACK-回退, RETURN-退单, FINISH-办结

  完整示例: http://localhost:3000/#/pages-sub/repair/handle?action=DISPATCH&repairId=REP_001&repairType=水电维修&repairObjType=001
  上级页面：http://localhost:3000/#/pages-sub/repair/dispatch 从各种待处理的工单列表内，进入页面

  旧代码：gitee-example/pages/repairHandle/repairHandle.vue
-->

<!--
  动态标题测试路径
  - 派单: http://localhost:3000/#/pages-sub/repair/handle?action=DISPATCH&repairId=REP_001
  - 转单: http://localhost:3000/#/pages-sub/repair/handle?action=TRANSFER&repairId=REP_001
  - 退单: http://localhost:3000/#/pages-sub/repair/handle?action=RETURN&repairId=REP_001
  - 办结: http://localhost:3000/#/pages-sub/repair/handle?action=FINISH&repairId=REP_001
-->

<!-- 基本完成检查审核 -->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import type { UploadBeforeUpload, UploadFile } from 'wot-design-uni/components/wd-upload/types'
import type { DispatchAction, MaintenanceType, PaymentType, RepairObjType, RepairResource } from '@/types/repair'
import { onLoad, onReady, onUnload } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, reactive, ref } from 'vue'
import { dispatchRepair, finishRepair, getRepairPayTypes, getRepairStaffs } from '@/api/repair'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { getCurrentCommunity, getUserInfo } from '@/utils/user'

const toast = useGlobalToast()

/** 定义页面配置 */
definePage({
  style: {
    navigationBarTitleText: '处理工单',
    enablePullDownRefresh: false,
  },
})

// ==================== 常量定义 ====================

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

// ==================== 依赖注入 ====================

/** 用户信息 */
const userInfo = getUserInfo()
const communityInfo = getCurrentCommunity()

// ==================== 页面参数 ====================

/** 页面参数类型 */
interface PageParams {
  action: DispatchAction
  repairId: string
  repairType: string
  repairObjType: RepairObjType
  repairChannel: string
  publicArea: string
  preStaffId: string
  preStaffName: string
}

// ==================== 表单状态 ====================

/** 表单引用 */
const formRef = ref()

/** 表单数据模型 */
const model = reactive<PageParams & {
  /** 维修师傅ID */
  staffId: string
  /** 维修师傅名称 */
  staffName: string
  /** 是否用料/维修类型ID */
  feeFlag: MaintenanceType | ''
  /** 支付方式ID */
  payType: PaymentType | ''
  /** 处理意见 */
  context: string
  /** 商品列表 */
  resourceList: RepairResource[]
  /** 总计金额 */
  totalAmount: number
  /** 维修前图片 */
  beforePhotos: UploadFile[]
  /** 维修后图片 */
  afterPhotos: UploadFile[]
}>({
  action: 'DISPATCH',
  repairId: '',
  repairType: '',
  repairObjType: '001',
  repairChannel: '',
  publicArea: '',
  preStaffId: '',
  preStaffName: '',
  staffId: '',
  staffName: '',
  feeFlag: '',
  payType: '',
  context: '',
  resourceList: [],
  totalAmount: 0,
  beforePhotos: [],
  afterPhotos: [],
})

// ==================== 计算属性 ====================

/** 页面标题 */
const pageTitle = computed(() => {
  switch (model.action) {
    case 'DISPATCH':
      return '派单'
    case 'TRANSFER':
      return '转单'
    case 'RETURN':
    case 'BACK':
      return '退单'
    case 'FINISH':
      return '办结'
    default:
      return '处理工单'
  }
})

/** 是否显示维修师傅选择（派单/转单/退单时） */
const showStaffSelector = computed(() => model.action !== 'FINISH')

/** 是否显示商品选择按钮 */
const showResourceSelector = computed(() => model.feeFlag === '1001' || model.feeFlag === '1003')

/** 是否显示商品列表 */
const showResourceList = computed(() => (model.feeFlag === '1001' || model.feeFlag === '1003') && model.resourceList.length > 0)

/** 是否显示支付方式 */
const showPayType = computed(() => model.feeFlag === '1001')

/** 是否显示图片上传（仅办结时） */
const showImages = computed(() => model.action === 'FINISH')

/** 是否显示总计金额 */
const showTotalAmount = computed(() => model.feeFlag === '1001')

/** 维修师傅选择器选项 */
const staffOptions = ref<Array<{ staffId: string, staffName: string }>>([
  { staffId: '', staffName: '请选择员工' },
])

/** 选中的维修师傅（用于显示） */
const selectedStaff = computed(() => {
  if (!model.staffId) {
    return { staffId: '', staffName: '请选择员工' }
  }
  return staffOptions.value.find(staff => staff.staffId === model.staffId) || { staffId: '', staffName: '请选择员工' }
})

/** 是否用料/维修类型选项 */
const feeOptions = computed(() => {
  if (model.repairObjType === '004') {
    // 公共区域：有偿服务/无偿服务
    return [
      { id: '' as const, name: '请选择' },
      { id: '1001' as const, name: '有偿服务' },
      { id: '1002' as const, name: '无偿服务' },
    ]
  }
  // 非公共区域：需要用料/无需用料
  return [
    { id: '' as const, name: '请选择' },
    { id: '1003' as const, name: '需要用料' },
    { id: '1004' as const, name: '无需用料' },
  ]
})

/** 支付方式选项 */
const payTypeOptions = ref<Array<{ statusCd: PaymentType | '', name: string }>>([
  { statusCd: '', name: '请选择' },
])

// ==================== 表单校验规则 ====================

/** 表单校验规则 */
const formRules: FormRules = {
  staffId: [
    {
      required: true,
      message: '请选择维修师傅',
      validator: (value) => {
        return value ? Promise.resolve() : Promise.reject(new Error('请选择维修师傅'))
      },
    },
  ],
  feeFlag: [
    {
      required: true,
      message: '请选择是否用料',
      validator: (value) => {
        return value ? Promise.resolve() : Promise.reject(new Error('请选择是否用料'))
      },
    },
  ],
  payType: [
    {
      required: true,
      message: '请选择支付方式',
      validator: (value) => {
        return value ? Promise.resolve() : Promise.reject(new Error('请选择支付方式'))
      },
    },
  ],
  context: [
    { required: true, message: '请填写处理意见' },
  ],
}

// ==================== 数据加载 ====================

/**
 * 加载维修师傅列表
 * 🔴 强制规范：必须设置 immediate: false
 * 🔴 强制规范：使用链式回调写法
 */
const {
  send: loadStaffs,
} = useRequest(
  () =>
    getRepairStaffs({
      repairType: model.repairType,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((result) => {
    staffOptions.value = [
      { staffId: '', staffName: '请选择员工' },
      ...result.data.staffs,
    ]
  })
  .onError((error) => {
    console.error('加载师傅列表失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

/**
 * 加载支付方式列表
 * 🔴 强制规范：必须设置 immediate: false
 * 🔴 强制规范：使用链式回调写法
 */
const {
  send: loadPayTypes,
} = useRequest(() => getRepairPayTypes(), { immediate: false })
  .onSuccess((result) => {
    payTypeOptions.value = [
      { statusCd: '', name: '请选择' },
      ...result.data.map(item => ({
        statusCd: item.statusCd as PaymentType,
        name: item.name || '',
      })),
    ]
  })
  .onError((error) => {
    console.error('加载支付方式失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

// ==================== 事件处理 ====================

/**
 * 维修师傅选择改变
 */
function handleStaffChange({ value }: { value: string }) {
  model.staffId = value
  const staff = staffOptions.value.find(s => s.staffId === value)
  model.staffName = staff?.staffName || ''
}

/**
 * 是否用料/维修类型选择改变
 */
function handleFeeChange({ value }: { value: MaintenanceType | '' }) {
  model.feeFlag = value
}

/**
 * 支付方式选择改变
 */
function handlePayTypeChange({ value }: { value: PaymentType | '' }) {
  model.payType = value
}

/**
 * 打开选择商品页面
 */
function handleSelectResource() {
  TypedRouter.toSelectResource(model.feeFlag)
}

/**
 * 增加商品数量
 */
function handleIncreaseQuantity(index: number) {
  model.resourceList[index].useNumber = (model.resourceList[index].useNumber || 0) + 1
  updateTotalAmount()
}

/**
 * 减少商品数量
 */
function handleDecreaseQuantity(index: number) {
  if ((model.resourceList[index].useNumber || 0) <= 1) {
    toast.warning('不能再减少啦')
    return
  }
  model.resourceList[index].useNumber = (model.resourceList[index].useNumber || 1) - 1
  updateTotalAmount()
}

/**
 * 价格改变
 */
function handlePriceChange(index: number, price: string) {
  const numericPrice = Number(price)
  if (!Number.isNaN(numericPrice) && numericPrice >= 0) {
    model.resourceList[index].price = numericPrice
    updateTotalAmount()
  }
}

/**
 * 数量改变
 */
function handleQuantityChange(index: number, quantity: string) {
  const numericQuantity = Number(quantity)
  if (!Number.isNaN(numericQuantity) && numericQuantity > 0) {
    model.resourceList[index].useNumber = numericQuantity
    updateTotalAmount()
  }
}

/**
 * 移除商品
 */
function handleRemoveResource(index: number) {
  model.resourceList.splice(index, 1)
  updateTotalAmount()
}

/**
 * 更新总价
 */
function updateTotalAmount() {
  model.totalAmount = model.resourceList.reduce((sum, item) => {
    const num = item.useNumber || 0
    const price = item.price || 0
    return sum + num * price
  }, 0)
}

/**
 * 获取商品显示名称
 * @param item 商品项
 * @returns 格式化后的商品名称
 */
function getResourceDisplayName(item: RepairResource): string {
  if (item.isCustom) {
    return item.customGoodsName || '自定义商品'
  }
  const specName = item.specName || '-'
  return `${item.resName}(${specName})`
}

// ==================== 图片上传相关 ====================

/**
 * 图片上传前校验
 * @description 检查文件大小，限制最大 10MB
 */
const handleBeforeUpload: UploadBeforeUpload = ({ files, resolve }) => {
  const file = files[0]
  const maxSize = 10 * 1024 * 1024

  if (file.size && file.size > maxSize) {
    toast.warning('图片大小不能超过10MB')
    resolve(false)
    return
  }
  resolve(true)
}

/**
 * 图片上传成功回调
 */
function handleUploadSuccess(response: any) {
  console.log('图片上传成功:', response)
}

/**
 * 图片上传失败回调
 */
function handleUploadFail(error: any) {
  toast.error('图片上传失败')
  console.error('图片上传失败:', error)
}

// ==================== 提交处理 ====================

/**
 * 提交派单/转单/退单请求
 * 🔴 强制规范：必须设置 immediate: false
 * 🔴 强制规范：使用链式回调写法
 */
const {
  send: submitDispatch,
  loading: isDispatchSubmitting,
} = useRequest(
  (params: {
    repairId: string
    staffId: string
    staffName: string
    action: DispatchAction
    context: string
    repairType: string
    communityId: string
    userId: string
    userName: string
  }) => dispatchRepair(params),
  { immediate: false },
)
  .onSuccess(() => {
    const actionTextMap: Record<DispatchAction, string> = {
      DISPATCH: '派单',
      TRANSFER: '转单',
      BACK: '回退',
      RETURN: '退单',
      FINISH: '办结',
    }
    const actionText = actionTextMap[model.action] || '操作'
    toast.success(`${actionText}成功`)

    // 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      if (model.action === 'DISPATCH') {
        TypedRouter.toRepairList()
      }
      else {
        TypedRouter.toRepairDispatch()
      }
    }, 1500)
  })
  .onError((error) => {
    console.error('派单/转单/退单失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

/**
 * 提交办结请求
 * 🔴 强制规范：必须设置 immediate: false
 * 🔴 强制规范：使用链式回调写法
 */
const {
  send: submitFinish,
  loading: isFinishSubmitting,
} = useRequest(
  (params: {
    repairId: string
    feeFlag: string
    context: string
    repairType: string
    communityId: string
    userId: string
    userName: string
    choosedGoodsList: RepairResource[]
    totalPrice: number
    payType: string
    beforeRepairPhotos: any[]
    afterRepairPhotos: any[]
    publicArea: string
    repairChannel: string
  }) => finishRepair(params),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('办结成功')

    setTimeout(() => {
      TypedRouter.toRepairDispatch()
    }, 1500)
  })
  .onError((error) => {
    console.error('办结失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

/** 当前操作是否正在提交 */
const isSubmitting = computed(() => {
  return model.action === 'FINISH' ? isFinishSubmitting.value : isDispatchSubmitting.value
})

/**
 * 派单/转单/退单校验
 * @returns 返回错误信息，如果验证通过则返回空字符串
 */
function validateDispatch(): string {
  // 退单操作不需要选择维修师傅
  if (model.action !== 'RETURN' && !model.staffId) {
    return '请选择维修师傅'
  }

  if (!model.context.trim()) {
    return '请填写处理意见'
  }

  return ''
}

/**
 * 办结校验
 * @returns 返回错误信息，如果验证通过则返回空字符串
 */
function validateFinish(): string {
  // 1. 检查是否用料/维修类型
  if (!model.feeFlag) {
    return model.repairObjType === '004' ? '请选择维修类型' : '请选择是否用料'
  }

  // 2. 如果选择有偿服务或需要用料，必须选择商品
  if ((model.feeFlag === '1001' || model.feeFlag === '1003') && model.resourceList.length === 0) {
    return '请选择商品'
  }

  // 3. 如果选择有偿服务，必须选择支付方式
  if (model.feeFlag === '1001' && !model.payType) {
    return '请选择支付方式'
  }

  // 4. 处理意见必填
  if (!model.context.trim()) {
    return '请填写处理意见'
  }

  return ''
}

/**
 * 提交派单/转单/退单
 */
function handleSubmitDispatch() {
  // 1. 表单校验
  const error = validateDispatch()
  if (error) {
    toast.warning(error)
    return
  }

  // 2. 防止重复提交
  if (isDispatchSubmitting.value) {
    return
  }

  // 3. 提交请求
  submitDispatch({
    repairId: model.repairId,
    staffId: selectedStaff.value.staffId,
    staffName: selectedStaff.value.staffName || '',
    action: model.action,
    context: model.context,
    repairType: model.repairType,
    communityId: communityInfo.communityId,
    userId: userInfo.userId,
    userName: userInfo.userName,
  })
}

/**
 * 提交办结
 */
function handleSubmitFinish() {
  // 1. 表单校验
  const error = validateFinish()
  if (error) {
    toast.warning(error)
    return
  }

  // 2. 防止重复提交
  if (isFinishSubmitting.value) {
    return
  }

  // 3. 提交请求
  submitFinish({
    repairId: model.repairId,
    feeFlag: model.feeFlag,
    context: model.context,
    repairType: model.repairType,
    communityId: communityInfo.communityId,
    userId: userInfo.userId,
    userName: userInfo.userName,
    choosedGoodsList: model.resourceList,
    totalPrice: model.totalAmount,
    payType: model.payType,
    beforeRepairPhotos: model.beforePhotos.map(file => ({ photo: file.url || '' })),
    afterRepairPhotos: model.afterPhotos.map(file => ({ photo: file.url || '' })),
    publicArea: model.publicArea,
    repairChannel: model.repairChannel,
  })
}

/**
 * 提交表单
 * @description 根据操作类型调用对应的提交方法
 */
function handleSubmit() {
  if (model.action === 'FINISH') {
    handleSubmitFinish()
  }
  else {
    handleSubmitDispatch()
  }
}

// ==================== 页面间通信 ====================

/**
 * 监听商品选择页面返回的数据
 */
uni.$on('getResourceInfo', (data: string) => {
  try {
    const resourceData = JSON.parse(data)
    model.resourceList.push(resourceData)
    updateTotalAmount()
  }
  catch (error) {
    console.error('解析商品数据失败:', error)
  }
})

// ==================== 生命周期钩子 ====================

/**
 * 页面加载
 */
onLoad((options) => {
  // 1. 解析页面参数
  model.action = (options?.action as DispatchAction) || 'DISPATCH'
  model.repairId = (options?.repairId as string) || ''
  model.repairType = (options?.repairType as string) || ''
  model.repairObjType = (options?.repairObjType as RepairObjType) || '001'
  model.repairChannel = (options?.repairChannel as string) || ''
  model.publicArea = (options?.publicArea as string) || ''
  model.preStaffId = (options?.preStaffId as string) || ''
  model.preStaffName = (options?.preStaffName as string) || ''

  // 2. 参数验证
  if (!model.repairId) {
    toast.error('缺少必要参数：工单ID')
    return
  }

  // 3. 加载维修师傅列表（派单/转单/退单时需要）
  if (showStaffSelector.value) {
    loadStaffs()
  }

  // 4. 加载支付方式列表
  loadPayTypes()
})

/**
 * 页面渲染完成，设置动态标题
 */
onReady(() => {
  uni.setNavigationBarTitle({ title: pageTitle.value })
})

/**
 * 页面卸载，移除事件监听
 */
onUnload(() => {
  uni.$off('getResourceInfo')
})
</script>

<template>
  <view class="min-h-screen bg-gray-100">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 维修师傅选择 (派单/转单/退单) -->
      <view v-if="showStaffSelector" class="bg-white">
        <wd-cell-group border>
          <FormSectionTitle
            title="维修师傅"
            icon="user"
            icon-class="i-carbon-user text-blue-500"
            required
          />
          <!-- 退单时显示只读信息 -->
          <template v-if="model.action === 'RETURN'">
            <wd-cell title="退回至" :value="model.preStaffName || '暂无'" />
          </template>
          <!-- 派单/转单时显示选择器 -->
          <template v-else>
            <wd-picker
              v-model="model.staffId"
              :columns="staffOptions"
              label="维修师傅"
              :label-width="LABEL_WIDTH"
              label-key="staffName"
              value-key="staffId"
              @confirm="handleStaffChange"
            />
          </template>
        </wd-cell-group>
      </view>

      <!-- 是否用料/维修类型 (办结) -->
      <view v-else class="bg-white">
        <wd-cell-group border>
          <FormSectionTitle
            :title="model.repairObjType === '004' ? '维修类型' : '是否用料'"
            icon="settings"
            icon-class="i-carbon-settings text-green-500"
            required
          />
          <wd-picker
            v-model="model.feeFlag"
            :columns="feeOptions"
            label-key="name"
            value-key="id"
            @confirm="handleFeeChange"
          >
            <wd-cell
              :title="model.repairObjType === '004' ? '维修类型' : '是否用料'"
              :title-width="LABEL_WIDTH"
              is-link
              center
              custom-value-class="cell-value-left"
            >
              <text :class="model.feeFlag ? 'text-gray-900' : 'text-gray-400'">
                {{ feeOptions.find(item => item.id === model.feeFlag)?.name || '请选择' }}
              </text>
            </wd-cell>
          </wd-picker>
        </wd-cell-group>

        <!-- 选择商品按钮 -->
        <view v-if="showResourceSelector" class="p-3">
          <wd-button block type="primary" @click="handleSelectResource">
            <wd-icon name="" custom-class="i-carbon-add text-white mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            选择商品
          </wd-button>
        </view>

        <!-- 商品列表 -->
        <view v-if="showResourceList" class="p-3">
          <wd-cell-group border>
            <FormSectionTitle
              title="商品清单"
              icon="list"
              icon-class="i-carbon-list text-orange-500"
            />
          </wd-cell-group>

          <view class="mt-2 overflow-hidden bg-white rounded-16rpx">
            <!-- 表头 -->
            <view class="resource-table-header flex items-center border-gray-200 bg-gray-50 p-3 text-sm font-bold border-b-2rpx">
              <view class="flex-1">
                商品
              </view>
              <view v-if="model.feeFlag === '1001'" class="w-20 text-center">
                价格
              </view>
              <view class="w-24 text-center">
                数量
              </view>
              <view class="w-16 text-center">
                操作
              </view>
            </view>

            <!-- 商品项 -->
            <view
              v-for="(item, index) in model.resourceList"
              :key="index"
              class="border-t border-gray-100 py-2 last:border-b-0"
            >
              <view class="resource-table-row flex items-center px-3">
                <!-- 商品名称 -->
                <view class="flex-1 text-sm">
                  <text>{{ getResourceDisplayName(item) }}</text>
                </view>

                <!-- 价格 -->
                <view v-if="model.feeFlag === '1001'" class="w-20">
                  <wd-input
                    v-model="item.price"
                    type="digit"
                    clearable
                    :disabled="!item.isCustom && item.outHighPrice === item.outLowPrice"
                    @change="handlePriceChange(index, item.price?.toString() || '0')"
                  />
                </view>

                <!-- 数量 -->
                <view class="resource-quantity-box w-24 flex items-center justify-center">
                  <view class="resource-quantity-btn flex cursor-pointer items-center justify-center w-56rpx h-56rpx transition-opacity-200 active:opacity-60" @click="handleDecreaseQuantity(index)">
                    <wd-icon name="" custom-class="i-carbon-subtract text-gray-600 w-32rpx h-32rpx" />
                  </view>
                  <wd-input
                    v-model="item.useNumber"
                    class="resource-quantity-input"
                    type="number"
                    @change="handleQuantityChange(index, item.useNumber?.toString() || '1')"
                  />
                  <view class="resource-quantity-btn flex cursor-pointer items-center justify-center w-56rpx h-56rpx transition-opacity-200 active:opacity-60" @click="handleIncreaseQuantity(index)">
                    <wd-icon name="" custom-class="i-carbon-add text-gray-600 w-32rpx h-32rpx" />
                  </view>
                </view>

                <!-- 操作 -->
                <view class="w-16 text-center">
                  <view class="inline-flex cursor-pointer items-center justify-center p-8rpx transition-opacity-200 active:opacity-60" @click="handleRemoveResource(index)">
                    <wd-icon name="" custom-class="i-carbon-trash-can text-red-500 w-36rpx h-36rpx" />
                  </view>
                </view>
              </view>

              <!-- 价格范围提示 -->
              <view
                v-if="model.feeFlag === '1001' && !item.isCustom && item.outHighPrice !== item.outLowPrice"
                class="mt-1 px-3 pb-2 text-xs text-gray-500"
              >
                价格范围({{ item.outLowPrice }} - {{ item.outHighPrice }})
              </view>
            </view>
          </view>

          <!-- 总计 -->
          <view v-if="showTotalAmount" class="mt-3 rounded bg-white p-3">
            <view class="flex items-center justify-between">
              <text class="text-gray-700 font-medium">总计</text>
              <text class="text-lg text-colorui-green font-bold">¥{{ model.totalAmount.toFixed(2) }}</text>
            </view>
          </view>
        </view>

        <!-- 支付方式 -->
        <view v-if="showPayType" class="bg-white">
          <wd-cell-group border>
            <FormSectionTitle
              title="支付方式"
              icon="currency"
              icon-class="i-carbon-currency text-green-500"
              required
            />
            <wd-picker
              v-model="model.payType"
              :columns="payTypeOptions"
              label-key="name"
              value-key="statusCd"
              @confirm="handlePayTypeChange"
            >
              <wd-cell
                title="支付方式"
                :title-width="LABEL_WIDTH"
                is-link
                center
                custom-value-class="cell-value-left"
              >
                <text :class="model.payType ? 'text-gray-900' : 'text-gray-400'">
                  {{ payTypeOptions.find(item => item.statusCd === model.payType)?.name || '请选择' }}
                </text>
              </wd-cell>
            </wd-picker>
          </wd-cell-group>
        </view>
      </view>

      <!-- 处理意见 -->
      <view class="mt-3 bg-white">
        <wd-cell-group border>
          <FormSectionTitle
            title="处理意见"
            icon="document"
            icon-class="i-carbon-document text-purple-500"
            required
          />
          <wd-textarea
            v-model="model.context"
            placeholder="请输入处理意见"
            :maxlength="500"
            show-word-limit
            :rows="4"
            :rules="formRules.context"
          />
        </wd-cell-group>
      </view>

      <!-- 图片上传 (办结时) -->
      <view v-if="showImages" class="mt-3">
        <!-- 维修前图片 -->
        <wd-cell-group border>
          <FormSectionTitle
            title="维修前图片"
            icon="image"
            icon-class="i-carbon-image text-blue-500"
            subtitle="最多上传9张"
          />
        </wd-cell-group>
        <view class="mt-2 rounded bg-white p-3">
          <wd-upload
            v-model:file-list="model.beforePhotos"
            :limit="9"
            :max-size="10 * 1024 * 1024"
            :before-upload="handleBeforeUpload"
            @success="handleUploadSuccess"
            @fail="handleUploadFail"
          />
        </view>

        <!-- 维修后图片 -->
        <view class="mt-3">
          <wd-cell-group border>
            <FormSectionTitle
              title="维修后图片"
              icon="image"
              icon-class="i-carbon-image text-purple-500"
              subtitle="最多上传9张"
            />
          </wd-cell-group>
        </view>
        <view class="mt-2 rounded bg-white p-3">
          <wd-upload
            v-model:file-list="model.afterPhotos"
            :limit="9"
            :max-size="10 * 1024 * 1024"
            :before-upload="handleBeforeUpload"
            @success="handleUploadSuccess"
            @fail="handleUploadFail"
          />
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="p-3">
        <wd-button
          block
          type="success"
          size="large"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          @click="handleSubmit"
        >
          {{ model.action === 'FINISH' ? '办结' : '提交' }}
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style lang="scss" scoped>
/**
 * 商品输入框/步进器输入框样式
 * 保留原因：深度选择器修改 wot-design-uni 组件内部样式
 */
:deep(.wd-input__inner) {
  text-align: center;
  font-size: 28rpx;
  padding: 0;
}

/**
 * wd-cell 组件文本大小强制覆盖
 * 保留原因：需要 !important 覆盖组件库默认样式
 */
:deep(.wd-cell__title),
:deep(.wd-cell__value) {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
}

/**
 * wd-cell 组件图标区域垂直居中
 * 保留原因：修复组件库默认对齐问题
 */
:deep(.wd-cell__icon) {
  display: flex !important;
  align-items: center !important;
}

/**
 * wd-cell 值靠左对齐 - wot-design-uni 组件必需样式
 * 保留原因：确保选择器选中值与其他表单项对齐
 */
:deep(.cell-value-left) {
  flex: 1;
  text-align: left !important;
}

.resource-table-header > view + view,
.resource-table-row > view + view {
  margin-left: 8rpx;
}

.resource-quantity-input {
  margin: 0 4rpx;
}
</style>
