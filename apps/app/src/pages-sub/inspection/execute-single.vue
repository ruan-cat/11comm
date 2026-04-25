<!--
  执行单项巡检页面
  功能：执行单个巡检项，填写巡检结果、上传照片等
  表单页

  访问地址: http://localhost:3000/#/pages-sub/inspection/execute-single
  建议携带参数: ?taskDetailId=xxx&taskId=xxx&inspectionId=xxx&inspectionName=xxx&itemId=xxx

  示例: http://localhost:3000/#/pages-sub/inspection/execute-single?taskDetailId=DETAIL_002&taskId=TASK_001&inspectionId=INSP_002&inspectionName=消防通道检查&itemId=ITEM_002

  旧代码： gitee-example/pages/excuteOneInspection/excuteOneInspection.vue
-->

<!-- TODO: 仅仅是针对代码写法 做了全面的检查 还没有结合到具体业务场景做检查复查 -->

<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import type { UploadFile, UploadRemoveEvent, UploadSuccessEvent } from 'wot-design-uni/components/wd-upload/types'
import type { InspectionItemTitle } from '@/types/inspection'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, reactive, ref } from 'vue'
import { getInspectionItemTitles, submitInspection } from '@/api/inspection'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '执行巡检',
    enablePullDownRefresh: false,
  },
})

/** 全局 Toast */
const toast = useGlobalToast()

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

/** 路由参数 */
const taskDetailId = ref('')
const taskId = ref('')
const inspectionId = ref('')
const inspectionName = ref('')
const itemId = ref('')
const fromPage = ref('') // 来源页面（用于判断是否从二维码扫描进入）

/** 获取路由参数 */
onLoad((options) => {
  taskDetailId.value = options?.taskDetailId as string || ''
  taskId.value = options?.taskId as string || ''
  inspectionId.value = options?.inspectionId as string || ''
  inspectionName.value = options?.inspectionName as string || ''
  itemId.value = options?.itemId as string || ''
  fromPage.value = options?.fromPage as string || ''
})

/** 表单实例 */
const formRef = ref<FormInstance>()

/** 表单数据 */
const formData = reactive({
  /** 巡检情况 (正常/异常) */
  patrolType: '',
  /** 巡检说明 */
  description: '',
  /** 上传的照片 */
  photos: [] as string[],
})

/** 巡检情况选项 */
const patrolTypeOptions = [
  { label: '正常', value: '10001' },
  { label: '异常', value: '10002' },
]

/** 巡检项标题列表（动态表单项） */
const titleList = ref<InspectionItemTitle[]>([])

/** 上传的照片文件列表 */
const uploadFiles = ref<UploadFile[]>([])

/** 当前位置信息 */
const locationInfo = ref({
  /** 纬度 */
  latitude: 0,
  /** 经度 */
  longitude: 0,
  /** 地址 */
  address: '正在获取...',
})

/** 表单校验规则 */
const formRules: FormRules = {
  patrolType: [{ required: true, message: '请选择巡检情况' }],
  description: [{ required: true, message: '请填写巡检说明' }],
  photos: [
    {
      required: true,
      message: '请上传巡检照片',
      validator: (value: any) => Array.isArray(value) && value.length > 0,
    },
  ],
}

/**
 * 获取当前位置
 */
function getCurrentLocation() {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      locationInfo.value.latitude = res.latitude
      locationInfo.value.longitude = res.longitude

      // TODO: 调用地图API进行逆地理编码
      // 这里简化处理，直接显示坐标
      locationInfo.value.address = `${res.latitude.toFixed(6)}, ${res.longitude.toFixed(6)}`
    },
    fail: () => {
      toast.error('获取位置失败')
    },
  })
}

/**
 * 加载巡检项标题
 */
const { send: sendLoadTitles } = useRequest(
  () =>
    getInspectionItemTitles({
      itemId: itemId.value,
      page: 1,
      row: 100,
    }),
  {
    immediate: false,
  },
)
  .onSuccess((event) => {
    const result = event.data
    titleList.value = result?.list || []

    // 初始化 radio 字段
    titleList.value.forEach((item) => {
      if (item.titleType === '1001') {
        // 单选：初始化为空字符串
        item.radio = ''
      }
      else if (item.titleType === '2002') {
        // 多选：初始化为空数组
        item.radio = []
      }
    })
  })
  .onError((error) => {
    console.error('加载巡检项失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

async function loadInspectionItemTitles() {
  await sendLoadTitles()
}

/**
 * 照片上传成功回调
 * @param event 上传成功事件
 */
function handleUploadSuccess(event: UploadSuccessEvent) {
  const files = event.fileList as UploadFile[]
  uploadFiles.value = files
  formData.photos = files.map(file => file.url || '')
}

/**
 * 照片删除回调
 * @param event 删除事件
 */
function handleUploadRemove(event: UploadRemoveEvent) {
  // 从当前文件列表中移除被删除的文件
  const files = uploadFiles.value.filter(file => file !== event.file) as UploadFile[]
  uploadFiles.value = files
  formData.photos = files.map(file => file.url || '')
}

/**
 * 单选 Picker 变更
 * @param value 选中的值
 * @param item 标题项
 */
function handlePickerChange(value: string, item: InspectionItemTitle) {
  item.radio = value
}

/**
 * 多选 Checkbox 变更
 * @param values 选中的值数组
 * @param item 标题项
 */
function handleCheckboxChange(values: string[], item: InspectionItemTitle) {
  item.radio = values
}

/**
 * 构建巡检说明文本
 */
function buildDescription(): string {
  let description = ''

  titleList.value.forEach((item) => {
    if (item.titleType === '2002') {
      // 多选：radio 是字符串数组
      const itemValue = Array.isArray(item.radio) ? item.radio.join(',') : ''
      description += `${item.itemTitle}:${itemValue};`
    }
    else {
      // 单选或文本：radio 是字符串
      description += `${item.itemTitle}:${item.radio};`
    }
  })

  return description
}

/**
 * 提交巡检结果
 */
const {
  loading: submitting,
  send: sendSubmitInspection,
  onSuccess: onSubmitSuccess,
  onError: onSubmitError,
} = useRequest(submitData => submitInspection(submitData), {
  immediate: false,
})

onSubmitSuccess(() => {
  toast.success('提交成功')

  // 返回上一页或跳转到巡检打卡页
  setTimeout(() => {
    if (fromPage.value === 'QrCode') {
      // 从二维码扫描进入，跳转到巡检打卡页
      TypedRouter.toInspectionTaskList()
    }
    else {
      // 正常流程，返回上一页
      uni.navigateBack()
    }
  }, 1500)
})

onSubmitError((error) => {
  console.error('提交失败:', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

async function handleSubmitInspection() {
  // 表单校验
  const valid = await formRef.value?.validate()
  if (!valid)
    return

  // 构建巡检说明
  const description = buildDescription()

  // 校验必填项
  if (!formData.patrolType) {
    toast.warning('巡检情况不能为空')
    return
  }

  if (!description) {
    toast.warning('巡检说明不能为空')
    return
  }

  if (formData.photos.length === 0) {
    toast.warning('请上传巡检图片')
    return
  }

  // 提交数据
  await sendSubmitInspection({
    taskId: taskId.value,
    taskDetailId: taskDetailId.value,
    inspectionId: inspectionId.value,
    inspectionName: inspectionName.value,
    patrolType: formData.patrolType,
    description,
    photos: formData.photos,
    latitude: locationInfo.value.latitude,
    longitude: locationInfo.value.longitude,
  })
}

/**
 * 根据索引获取表单项的 icon 配置
 * @param index 表单项索引
 */
function getFormItemIcon(index: number): { icon: string, iconClass: string } {
  const iconConfigs = [
    { icon: 'task-view', iconClass: 'i-carbon-task-view text-blue-500' },
    { icon: 'view', iconClass: 'i-carbon-view text-purple-500' },
    { icon: 'warning-alt', iconClass: 'i-carbon-warning-alt text-orange-500' },
    { icon: 'edit', iconClass: 'i-carbon-edit text-green-500' },
    { icon: 'checkbox-checked', iconClass: 'i-carbon-checkbox-checked text-cyan-500' },
    { icon: 'data-check', iconClass: 'i-carbon-data-check text-indigo-500' },
    { icon: 'certificate-check', iconClass: 'i-carbon-certificate-check text-pink-500' },
    { icon: 'task-complete', iconClass: 'i-carbon-task-complete text-teal-500' },
  ]

  return iconConfigs[index % iconConfigs.length]
}

onMounted(() => {
  getCurrentLocation()
  loadInspectionItemTitles()
})
</script>

<template>
  <view class="inspection-execute-single">
    <!-- 页面标题 -->
    <view class="page-title">
      {{ inspectionName }}巡检
    </view>

    <!-- 表单 -->
    <wd-form ref="formRef" :model="formData" :rules="formRules">
      <!-- 动态表单项 -->
      <wd-cell-group
        v-for="(item, index) in titleList"
        :key="index"
        border
        :class="index > 0 ? 'mt-3' : ''"
      >
        <FormSectionTitle
          :title="item.itemTitle"
          :icon="getFormItemIcon(index).icon"
          :icon-class="getFormItemIcon(index).iconClass"
        />

        <!-- 单选 -->
        <wd-picker
          v-if="item.titleType === '1001'"
          v-model="item.radio"
          :label="item.itemTitle"
          placeholder="请选择"
          :label-width="LABEL_WIDTH"
          :columns="item.inspectionItemTitleValueDtos.map(v => ({
            label: v.itemValue,
            value: v.itemValue,
          }))"
          label-key="label"
          value-key="value"
          @change="(value: any) => handlePickerChange(value.value, item)"
        />

        <!-- 多选 -->
        <view v-else-if="item.titleType === '2002'" class="p-3">
          <wd-checkbox-group
            :model-value="Array.isArray(item.radio) ? item.radio : []"
            @update:model-value="(value) => { item.radio = value }"
            @change="(event: any) => handleCheckboxChange(event.value, item)"
          >
            <wd-checkbox
              v-for="(valueItem, valueIndex) in item.inspectionItemTitleValueDtos"
              :key="valueIndex"
              :value="valueItem.itemValue"
            >
              {{ valueItem.itemValue }}
            </wd-checkbox>
          </wd-checkbox-group>
        </view>

        <!-- 文本输入 -->
        <wd-textarea
          v-else
          :model-value="typeof item.radio === 'string' ? item.radio : ''"
          placeholder="请回答"
          :maxlength="512"
          show-word-limit
          @update:model-value="(value) => { item.radio = value }"
        />
      </wd-cell-group>

      <!-- 巡检情况 -->
      <wd-cell-group border class="mt-3">
        <FormSectionTitle
          title="巡检情况"
          icon="checkmark"
          icon-class="i-carbon-checkmark text-green-500"
          required
        />
        <wd-picker
          v-model="formData.patrolType"
          label="巡检情况"
          placeholder="请选择"
          :label-width="LABEL_WIDTH"
          :columns="patrolTypeOptions"
          label-key="label"
          value-key="value"
        />
      </wd-cell-group>

      <!-- 巡检说明 -->
      <wd-cell-group border class="mt-3">
        <FormSectionTitle
          title="巡检说明"
          icon="document"
          icon-class="i-carbon-document text-purple-500"
          required
        />
        <wd-textarea
          v-model="formData.description"
          placeholder="请输入巡检说明"
          :maxlength="512"
          show-word-limit
        />
      </wd-cell-group>

      <!-- 巡检照片 -->
      <view class="mt-3">
        <wd-cell-group border>
          <FormSectionTitle
            title="巡检照片"
            icon="image"
            icon-class="i-carbon-image text-orange-500"
            subtitle="最多上传4张"
            required
          />
        </wd-cell-group>
        <view class="mt-2 bg-white p-3">
          <wd-upload
            v-model="uploadFiles"
            :limit="4"
            action="https://ftf.jd.com/api/uploadImg"
            @success="handleUploadSuccess"
            @remove="handleUploadRemove"
          />
        </view>
      </view>

      <!-- 当前位置 -->
      <wd-cell-group border class="mt-3">
        <FormSectionTitle
          title="当前位置"
          icon="location"
          icon-class="i-carbon-location text-red-500"
        />
        <wd-input
          v-model="locationInfo.address"
          label="位置"
          :label-width="LABEL_WIDTH"
          disabled
          readonly
        />
      </wd-cell-group>

      <!-- 提交按钮 -->
      <view class="mt-6 px-3 pb-6">
        <wd-button
          type="success"
          size="large"
          block
          :loading="submitting"
          @click="handleSubmitInspection"
        >
          提交
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style scoped lang="scss">
.inspection-execute-single {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100rpx;

  .page-title {
    margin: 0;
    font-weight: 500;
    font-size: 32rpx;
    color: #455a64;
    padding: 40rpx 30rpx 20rpx;
  }
}
</style>
