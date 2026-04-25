<!--
  添加维修记录
  功能：新增维修工单，支持选择楼栋/单元/房屋
  表单页

  访问地址: http://localhost:3000/#/pages-sub/repair/add-order
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/repair/add-order?communityId=COMM_001

  旧代码：gitee-example/pages/repairAdd/repairAdd.vue
-->

<!-- 基本完成检查审核 -->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'
import type { UploadBeforeUpload, UploadFile } from 'wot-design-uni/components/wd-upload/types'
import type { CreateRepairReq, RepairObjType } from '@/types/repair'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { computed, reactive, ref } from 'vue'
import { createRepairOrder, getRepairSettings } from '@/api/repair'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { useSelectorStore } from '@/stores/useSelectorStore'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '添加维修记录',
    enablePullDownRefresh: false,
  },
})

// ==================== 常量定义 ====================

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

/** 位置类型选项 */
const REPAIR_SCOPES: ColumnItem[] = [
  { value: '001' as RepairObjType, label: '小区' },
  { value: '002' as RepairObjType, label: '楼栋' },
  { value: '003' as RepairObjType, label: '单元' },
  { value: '004' as RepairObjType, label: '房屋' },
]

// ==================== 依赖注入 ====================

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 选择器状态管理 */
const selectorStore = useSelectorStore()

/** 全局 Toast */
const toast = useGlobalToast()

// ==================== 表单状态 ====================

/** 表单引用 */
const formRef = ref()

/** 报修类型列表 */
const repairTypes = ref<Array<{
  repairType: string
  repairTypeName: string
  payFeeFlag: 'T' | 'F'
  priceScope?: string
}>>([])

/** 表单数据模型 */
const model = reactive({
  /** 位置类型 */
  scopeId: '001' as string,
  /** 维修标题 */
  title: '',
  /** 楼栋ID */
  floorId: '',
  /** 楼栋名称 */
  floorNum: '',
  /** 单元ID */
  unitId: '',
  /** 单元名称 */
  unitNum: '',
  /** 房屋ID */
  roomId: '',
  /** 房屋名称 */
  roomNum: '',
  /** 维修地址 */
  address: '',
  /** 报修类型 */
  repairType: '',
  /** 报修人 */
  repairName: '',
  /** 手机号 */
  tel: '',
  /** 预约日期 */
  appointmentDate: '' as number | '',
  /** 预约时间 */
  appointmentTime: '',
  /** 报修内容 */
  context: '',
  /** 图片列表 */
  photos: [] as UploadFile[],
})

// ==================== 计算属性 ====================

/** 报修对象类型 */
const repairObjType = computed(() => model.scopeId as RepairObjType)

/** 是否公共区域 */
const publicArea = computed(() => repairObjType.value === '004' ? 'F' : 'T')

/** 选中的报修类型详情 */
const selectedRepairType = computed(() =>
  repairTypes.value.find(item => item.repairType === model.repairType),
)

/** 收费标准 */
const priceScope = computed(() => {
  if (selectedRepairType.value?.payFeeFlag === 'T') {
    return selectedRepairType.value.priceScope || ''
  }
  return ''
})

/** 是否显示楼栋选择（楼栋/单元/房屋） */
const showFloorSelector = computed(() =>
  repairObjType.value === '002' || repairObjType.value === '003' || repairObjType.value === '004',
)

/** 是否显示单元选择（单元/房屋） */
const showUnitSelector = computed(() =>
  repairObjType.value === '003' || repairObjType.value === '004',
)

/** 是否显示房屋选择（仅房屋） */
const showRoomSelector = computed(() => repairObjType.value === '004')

// ==================== 表单校验规则 ====================

/** 表单校验规则 */
const formRules: FormRules = {
  title: [
    { required: true, message: '请填写维修标题' },
  ],
  repairType: [
    { required: true, message: '请选择报修类型' },
  ],
  repairName: [
    { required: true, message: '请填写报修人' },
  ],
  tel: [
    { required: true, message: '请填写手机号' },
    { required: false, pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
  ],
  appointmentDate: [
    {
      required: true,
      message: '请选择预约日期',
      validator: (value) => {
        return value && typeof value === 'number' ? Promise.resolve() : Promise.reject(new Error('请选择预约日期'))
      },
    },
  ],
  appointmentTime: [
    { required: true, message: '请选择预约时间' },
  ],
  context: [
    { required: true, message: '请填写报修内容' },
  ],
}

// ==================== 数据加载 ====================

/**
 * 加载报修类型
 * 🔴 强制规范：必须设置 immediate: false
 */
const {
  send: loadRepairTypes,
  onSuccess: onLoadTypesSuccess,
  onError: onLoadTypesError,
} = useRequest(
  () =>
    getRepairSettings({
      communityId: communityInfo.communityId,
      publicArea: publicArea.value,
      page: 1,
      row: 50,
    }),
  { immediate: false },
)

/**
 * 加载报修类型成功回调
 * @description 设置报修类型列表，并默认选择第一个
 */
onLoadTypesSuccess((result) => {
  repairTypes.value = result.data
  if (result.data.length > 0) {
    model.repairType = result.data[0].repairType
  }
})

/**
 * 加载报修类型失败回调
 * @description 错误提示已由全局拦截器自动处理，这里只需记录日志
 */
onLoadTypesError((error) => {
  console.error('加载报修类型失败:', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

// ==================== 位置选择相关 ====================

/**
 * 从 Store 或 LocalStorage 读取选择的位置信息
 * @description 优先从 Store 读取，兼容 LocalStorage 旧方式
 */
function loadSelectedLocationFromStorage() {
  // 读取楼栋信息
  if (selectorStore.selectedFloor) {
    model.floorNum = `${selectorStore.selectedFloor.floorNum}栋`
    model.floorId = selectorStore.selectedFloor.floorId
  }
  else {
    const selectFloor = uni.getStorageSync('_selectFloor')
    if (selectFloor) {
      model.floorNum = `${selectFloor.floorNum}栋`
      model.floorId = selectFloor.floorId
    }
  }

  // 读取单元信息
  if (selectorStore.selectedUnit) {
    model.unitNum = `${selectorStore.selectedUnit.unitNum}单元`
    model.unitId = selectorStore.selectedUnit.unitId
  }
  else {
    const selectUnit = uni.getStorageSync('_selectUnit')
    if (selectUnit) {
      model.unitNum = `${selectUnit.unitNum}单元`
      model.unitId = selectUnit.unitId
    }
  }

  // 读取房屋信息
  if (selectorStore.selectedRoom) {
    model.roomNum = `${selectorStore.selectedRoom.roomNum}室`
    model.roomId = selectorStore.selectedRoom.roomId
  }
  else {
    const selectRoom = uni.getStorageSync('_selectRoom')
    if (selectRoom) {
      model.roomNum = `${selectRoom.roomNum}室`
      model.roomId = selectRoom.roomId
    }
  }
}

/**
 * 清空位置信息（表单数据）
 * @description 清空楼栋、单元、房屋的 ID 和名称
 */
function clearLocationInfo() {
  model.floorNum = ''
  model.floorId = ''
  model.unitNum = ''
  model.unitId = ''
  model.roomNum = ''
  model.roomId = ''
}

/**
 * 清空位置缓存（Store 和 LocalStorage）
 * @param {'all' | 'unit-room' | 'room'} scope - 清空范围
 */
function clearLocationCache(scope: 'all' | 'unit-room' | 'room' = 'all') {
  if (scope === 'all') {
    // 清空所有位置信息
    uni.removeStorageSync('_selectFloor')
    uni.removeStorageSync('_selectUnit')
    uni.removeStorageSync('_selectRoom')
    selectorStore.clearSelection()
  }
  else if (scope === 'unit-room') {
    // 清空单元和房屋信息
    uni.removeStorageSync('_selectUnit')
    uni.removeStorageSync('_selectRoom')
    selectorStore.clearUnit()
    selectorStore.clearRoom()
  }
  else if (scope === 'room') {
    // 仅清空房屋信息
    uni.removeStorageSync('_selectRoom')
    selectorStore.clearRoom()
  }
}

/**
 * 位置类型改变事件处理
 * @param event - Picker 确认事件对象
 */
function handleScopeChange({ value }: { value: string }) {
  model.scopeId = value
  loadRepairTypes()
  clearLocationInfo()
  clearLocationCache('all')
}

/**
 * 选择楼栋
 * @description 清空所有位置信息后跳转到楼栋选择页
 */
function handleChooseFloor() {
  clearLocationCache('all')
  clearLocationInfo()
  TypedRouter.toSelectFloor()
}

/**
 * 选择单元
 * @description 检查楼栋是否已选择，清空单元和房屋信息后跳转
 */
function handleChooseUnit() {
  if (!model.floorId) {
    toast.warning('请先选择楼栋')
    return
  }
  clearLocationCache('unit-room')
  model.unitNum = ''
  model.unitId = ''
  model.roomNum = ''
  model.roomId = ''
  TypedRouter.toSelectUnit(model.floorId)
}

/**
 * 选择房屋
 * @description 检查单元是否已选择，清空房屋信息后跳转
 */
function handleChooseRoom() {
  if (!model.unitId) {
    toast.warning('请先选择单元')
    return
  }
  clearLocationCache('room')
  model.roomNum = ''
  model.roomId = ''
  TypedRouter.toSelectRoom(model.floorId, model.unitId)
}

// ==================== 文件上传相关 ====================

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
 * @param response - 上传响应数据
 */
function handleUploadSuccess(response: any) {
  console.log('图片上传成功:', response)
}

/**
 * 图片上传失败回调
 * @param error - 错误信息
 */
function handleUploadFail(error: any) {
  toast.error('图片上传失败')
  console.error('图片上传失败:', error)
}

// ==================== 表单校验与提交 ====================

/**
 * 位置信息校验
 * @description 根据位置类型校验对应的位置字段是否已填写
 * @returns 返回错误信息，如果验证通过则返回空字符串
 */
function validateLocation(): string {
  if (repairObjType.value === '002' && !model.floorId) {
    return '请选择楼栋'
  }
  if (repairObjType.value === '003' && (!model.floorId || !model.unitId)) {
    return '请选择完整的楼栋和单元'
  }
  if (repairObjType.value === '004' && (!model.floorId || !model.unitId || !model.roomId)) {
    return '请选择完整的楼栋、单元和房屋'
  }
  return ''
}

/**
 * 构建报修对象信息
 * @description 根据位置类型返回对应的报修对象 ID 和名称
 * @returns 报修对象信息
 */
function buildRepairObjInfo(): { repairObjId: string, repairObjName: string } {
  let repairObjId = ''
  let repairObjName = ''

  if (repairObjType.value === '001') {
    // 小区级别
    repairObjId = communityInfo.communityId
    repairObjName = communityInfo.communityName
  }
  else if (repairObjType.value === '002') {
    // 楼栋级别
    repairObjId = model.floorId
    repairObjName = model.floorNum
  }
  else if (repairObjType.value === '003') {
    // 单元级别
    repairObjId = model.unitId
    repairObjName = model.floorNum + model.unitNum
  }
  else {
    // 房屋级别
    repairObjId = model.roomId
    repairObjName = model.floorNum + model.unitNum + model.roomNum
  }

  return { repairObjId, repairObjName }
}

/**
 * 提交维修工单请求
 * 🔴 强制规范：必须设置 immediate: false
 */
const {
  loading: submitting,
  send: submitRepairOrder,
  onSuccess: onSubmitSuccess,
  onError: onSubmitError,
} = useRequest((data: CreateRepairReq) => createRepairOrder(data), {
  immediate: false,
})

/**
 * 提交成功回调
 * @description 显示成功提示并延迟跳转到工单列表页
 */
onSubmitSuccess(() => {
  toast.success('提交成功')
  setTimeout(() => {
    TypedRouter.toRepairList()
  }, 1500)
})

/**
 * 提交失败回调
 * @description 错误提示已由全局拦截器自动处理，这里只需记录日志
 */
onSubmitError((error) => {
  console.error('提交维修工单失败:', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

/**
 * 提交表单
 * @description 执行位置校验和表单校验，校验通过后提交维修工单
 * 🔴 强制规范：不使用 await，直接调用 send 函数
 */
function handleSubmit() {
  // 1. 位置信息校验（表单组件不支持动态校验）
  const locationError = validateLocation()
  if (locationError) {
    toast.warning(locationError)
    return
  }

  // 2. 表单校验
  formRef.value
    .validate()
    .then(({ valid, errors }: { valid: boolean, errors: any[] }) => {
      if (!valid) {
        console.error('表单校验失败:', errors)
        return
      }

      // 3. 构建报修对象信息
      const { repairObjId, repairObjName } = buildRepairObjInfo()

      // 4. 构建请求参数
      const requestData: CreateRepairReq = {
        title: model.title,
        repairName: model.repairName,
        repairType: selectedRepairType.value!.repairType,
        repairTypeName: selectedRepairType.value!.repairTypeName,
        appointmentTime: `${model.appointmentDate ? dayjs(model.appointmentDate).format('YYYY-MM-DD') : ''} ${model.appointmentTime}:00`,
        tel: model.tel,
        context: model.context,
        address: repairObjName,
        communityId: communityInfo.communityId,
        repairObjType: repairObjType.value,
        repairObjId,
        repairChannel: 'STAFF',
        roomId: model.roomId || undefined,
        photos: model.photos?.map(item => item.url).filter(Boolean),
      }

      // 5. 提交请求
      // 🔴 强制规范：不使用 await，直接调用 send 函数
      submitRepairOrder(requestData)
    })
    .catch((error: any) => {
      console.error('表单校验异常:', error)
    })
}

// ==================== 生命周期钩子 ====================

/** 页面加载 */
onLoad(() => {
  loadRepairTypes()
})

/** 页面显示（从楼栋/单元/房屋选择页返回） */
onShow(() => {
  loadSelectedLocationFromStorage()
})

/** 页面卸载 */
onUnload(() => {
  clearLocationCache('all')
})
</script>

<template>
  <view class="min-h-screen bg-gray-100">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 房屋信息 -->
      <wd-cell-group border>
        <FormSectionTitle
          title="房屋信息"
          icon="home"
          icon-class="i-carbon-home text-blue-500"
          required
        />
        <!-- 位置类型 -->
        <wd-picker
          v-model="model.scopeId"
          label="位置"
          :label-width="LABEL_WIDTH"
          :columns="REPAIR_SCOPES"
          @confirm="handleScopeChange"
        />

        <!-- 楼栋选择 -->
        <wd-cell
          v-if="showFloorSelector"
          title="楼栋"
          :title-width="LABEL_WIDTH"
          is-link
          center
          custom-value-class="cell-value-left"
          @click="handleChooseFloor"
        >
          <text :class="model.floorNum ? '' : 'text-gray-400'">
            {{ model.floorNum || '请选择楼栋' }}
          </text>
        </wd-cell>

        <!-- 单元选择 -->
        <wd-cell
          v-if="showUnitSelector"
          title="单元"
          :title-width="LABEL_WIDTH"
          is-link
          center
          custom-value-class="cell-value-left"
          @click="handleChooseUnit"
        >
          <text :class="model.unitNum ? '' : 'text-gray-400'">
            {{ model.unitNum || '请选择单元' }}
          </text>
        </wd-cell>

        <!-- 房屋选择 -->
        <wd-cell
          v-if="showRoomSelector"
          title="房屋信息"
          :title-width="LABEL_WIDTH"
          is-link
          center
          custom-value-class="cell-value-left"
          @click="handleChooseRoom"
        >
          <text :class="model.roomNum ? '' : 'text-gray-400'">
            {{ model.roomNum || '请选择房屋' }}
          </text>
        </wd-cell>
      </wd-cell-group>

      <!-- 报修信息 -->
      <wd-cell-group border class="mt-3">
        <FormSectionTitle
          title="报修信息"
          icon="information"
          icon-class="i-carbon-information text-green-500"
          required
        />
        <!-- 维修标题 -->
        <wd-input
          v-model="model.title"
          label="维修标题"
          :label-width="LABEL_WIDTH"
          prop="title"
          placeholder="请输入维修标题"
          clearable
          :rules="formRules.title"
        />

        <!-- 报修类型 -->
        <wd-picker
          v-model="model.repairType"
          label="报修类型"
          :label-width="LABEL_WIDTH"
          prop="repairType"
          :columns="repairTypes"
          label-key="repairTypeName"
          value-key="repairType"
          :rules="formRules.repairType"
        />

        <!-- 收费标准 -->
        <wd-cell
          v-if="priceScope"
          title="收费标准"
          :title-width="LABEL_WIDTH"
          :value="priceScope"
          center
        />

        <!-- 报修人 -->
        <wd-input
          v-model="model.repairName"
          label="报修人"
          :label-width="LABEL_WIDTH"
          prop="repairName"
          placeholder="请输入报修人"
          clearable
          :rules="formRules.repairName"
        />

        <!-- 手机号 -->
        <wd-input
          v-model="model.tel"
          label="手机号"
          :label-width="LABEL_WIDTH"
          prop="tel"
          placeholder="请输入手机号"
          type="digit"
          clearable
          :rules="formRules.tel"
        />

        <!-- 预约日期 -->
        <wd-datetime-picker
          v-model="model.appointmentDate"
          type="date"
          label="预约日期"
          :label-width="LABEL_WIDTH"
          prop="appointmentDate"
          :min-date="Date.now()"
          :rules="formRules.appointmentDate"
        />

        <!-- 预约时间 -->
        <wd-datetime-picker
          v-model="model.appointmentTime"
          type="time"
          label="预约时间"
          :label-width="LABEL_WIDTH"
          prop="appointmentTime"
          :rules="formRules.appointmentTime"
        />
      </wd-cell-group>

      <!-- 报修内容 -->
      <wd-cell-group border class="mt-3">
        <FormSectionTitle
          title="报修内容"
          icon="document"
          icon-class="i-carbon-document text-purple-500"
          required
        />
        <wd-textarea
          v-model="model.context"
          label="报修内容"
          :label-width="LABEL_WIDTH"
          prop="context"
          placeholder="请输入报修内容"
          :maxlength="500"
          show-word-limit
          :rules="formRules.context"
        />
      </wd-cell-group>

      <!-- 相关图片 -->
      <view class="mt-3">
        <wd-cell-group border>
          <FormSectionTitle
            title="相关图片"
            icon="image"
            icon-class="i-carbon-image text-orange-500"
            subtitle="最多上传9张"
          />
        </wd-cell-group>
      </view>
      <view class="mt-2 bg-white p-3">
        <wd-upload
          v-model:file-list="model.photos"
          :limit="9"
          :max-size="10 * 1024 * 1024"
          :before-upload="handleBeforeUpload"
          @success="handleUploadSuccess"
          @fail="handleUploadFail"
        />
      </view>

      <!-- 提交按钮 -->
      <view class="mt-6 px-3 pb-6">
        <wd-button
          block
          type="success"
          size="large"
          :loading="submitting"
          :disabled="submitting"
          @click="handleSubmit"
        >
          提交
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style lang="scss" scoped>
/**
 * 样式迁移说明：
 * - .add-order-page: 已迁移到模板为原子类 `min-h-screen bg-gray-100`
 * - .section-title: 已替换为 form-section-title 组件
 * - :deep(.cell-value-left): wot-design-uni 组件必需样式，符合保留条件
 */

/** wd-cell 值靠左对齐 - wot-design-uni 组件必需样式，必须保留 */
:deep(.cell-value-left) {
  flex: 1;
  text-align: left !important;
}
</style>
