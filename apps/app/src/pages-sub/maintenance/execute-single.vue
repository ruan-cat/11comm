<!--
  单项保养页
  功能：执行单项保养，填写保养结果和上传照片

  访问地址: http://localhost:3000/#/pages-sub/maintenance/execute-single
  建议携带参数: ?taskDetailId=xxx&taskId=xxx&itemName=xxx

  示例: http://localhost:3000/#/pages-sub/maintenance/execute-single?taskDetailId=MTD_MT_001_01&taskId=MT_001&itemName=外观检查

  旧代码：gitee-example/pages/maintainance/excuteOneMaintainance.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { submitMaintenanceSingle } from '@/api/maintenance'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

definePage({
  style: {
    navigationBarTitleText: '执行保养',
    enablePullDownRefresh: false,
  },
})

const toast = useGlobalToast()

/** 路由参数 */
const taskDetailId = ref('')
const taskId = ref('')
const itemName = ref('')

/** 获取路由参数 */
onLoad((options) => {
  taskDetailId.value = options?.taskDetailId as string || ''
  taskId.value = options?.taskId as string || ''
  itemName.value = options?.itemName as string || ''
})

/** 表单数据 */
const formData = ref({
  result: '',
  remark: '',
  photos: [] as string[],
})

/** 表单引用 */
const formRef = ref()

/** 表单校验规则 */
const rules: FormRules = {
  result: [
    { required: true, message: '请选择执行结果' },
  ],
}

/** 执行结果选项 */
const resultOptions = [
  { label: '正常', value: '正常' },
  { label: '异常', value: '异常' },
  { label: '需维修', value: '需维修' },
]

/** 选中的结果值 */
const selectedResult = ref('')

/** 结果选择器显示状态 */
const showResultPicker = ref(false)

/** 处理结果选择 */
function handleResultConfirm({ value }: { value: string }) {
  formData.value.result = value
  showResultPicker.value = false
}

/** 获取结果显示文本 */
function getResultLabel(value: string): string {
  const option = resultOptions.find(item => item.value === value)
  return option?.label || ''
}

/** 图片上传前处理 */
function beforeUpload() {
  // 模拟上传，实际项目中需要调用上传接口
  return true
}

/** 图片上传成功 */
function handleUploadSuccess(file: { url: string }) {
  formData.value.photos.push(file.url)
}

/** 删除图片 */
function handleRemovePhoto(index: number) {
  formData.value.photos.splice(index, 1)
}

/** 选择图片 */
function chooseImage() {
  uni.chooseImage({
    count: 9 - formData.value.photos.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 模拟上传，实际项目中需要调用上传接口
      const paths = res.tempFilePaths as string[]
      paths.forEach((path) => {
        formData.value.photos.push(path)
      })
    },
  })
}

/** 预览图片 */
function previewImage(index: number) {
  uni.previewImage({
    urls: formData.value.photos,
    current: index,
  })
}

/** 提交保养结果 */
const { loading: submitting, send: submitResult } = useRequest(
  () => submitMaintenanceSingle({
    taskDetailId: taskDetailId.value,
    taskId: taskId.value,
    result: formData.value.result,
    remark: formData.value.remark || undefined,
    photos: formData.value.photos.length > 0 ? formData.value.photos : undefined,
  }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('提交成功')
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  })
  .onError((error) => {
    console.error('提交失败:', error)
    toast.error('提交失败')
  })

/** 处理提交 */
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    await submitResult()
  }
  catch (error) {
    console.error('表单校验失败:', error)
  }
}
</script>

<template>
  <view class="execute-single-page">
    <!-- 保养项信息 -->
    <view class="item-info">
      <view class="info-header">
        <wd-icon name="" custom-class="i-carbon-task text-colorui-blue text-24px" />
        <text class="info-title">{{ itemName }}</text>
      </view>
    </view>

    <!-- 表单区域 -->
    <view class="form-section">
      <wd-form ref="formRef" :model="formData" :rules="rules">
        <!-- 执行结果 -->
        <FormSectionTitle title="执行结果" icon="i-carbon-checkmark-outline" required />
        <wd-cell-group>
          <wd-cell
            title="执行结果"
            is-link
            :value="getResultLabel(formData.result) || '请选择'"
            @click="showResultPicker = true"
          />
        </wd-cell-group>

        <!-- 备注说明 -->
        <FormSectionTitle title="备注说明" icon="i-carbon-document" class="mt-4" />
        <wd-cell-group>
          <wd-textarea
            v-model="formData.remark"
            placeholder="请输入备注说明（选填）"
            :maxlength="200"
            show-word-limit
            clearable
          />
        </wd-cell-group>

        <!-- 现场照片 -->
        <FormSectionTitle title="现场照片" icon="i-carbon-camera" class="mt-4" />
        <view class="photo-section">
          <view class="photo-grid">
            <view
              v-for="(photo, index) in formData.photos"
              :key="index"
              class="photo-item"
            >
              <wd-img :src="photo" mode="aspectFill" class="photo-image" @click="previewImage(index)" />
              <view class="photo-delete" @click.stop="handleRemovePhoto(index)">
                <wd-icon name="close" size="12px" color="#ffffff" />
              </view>
            </view>
            <view v-if="formData.photos.length < 9" class="photo-add" @click="chooseImage">
              <wd-icon name="" custom-class="i-carbon-add text-32px text-gray-400" />
              <text class="add-text">添加照片</text>
            </view>
          </view>
          <view class="photo-tip">
            最多上传9张照片
          </view>
        </view>
      </wd-form>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <wd-button
        type="primary"
        size="large"
        block
        :loading="submitting"
        @click="handleSubmit"
      >
        提交保养结果
      </wd-button>
    </view>

    <!-- 结果选择器 -->
    <wd-picker
      v-model="formData.result"
      :columns="resultOptions"
      label-key="label"
      value-key="value"
      title="选择执行结果"
      :visible="showResultPicker"
      @confirm="handleResultConfirm"
      @close="showResultPicker = false"
    />
  </view>
</template>

<style scoped lang="scss">
.execute-single-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.item-info {
  margin: 20rpx;
  padding: 32rpx;
  background: #ffffff;
  border-radius: 16rpx;

  .info-header {
    display: flex;
    align-items: center;

    .wd-icon {
      margin-right: 12rpx;
    }

    .info-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }
  }
}

.form-section {
  padding: 0 20rpx;
}

.photo-section {
  background: #ffffff;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-top: 12rpx;

  .photo-grid {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -8rpx;

    .photo-item {
      position: relative;
      width: calc(33.3333% - 16rpx);
      height: 0;
      padding-bottom: 100%;
      margin: 0 8rpx 16rpx;
      border-radius: 8rpx;
      overflow: hidden;
      background: #f5f5f5;

      .photo-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .photo-delete {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        width: 36rpx;
        height: 36rpx;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .photo-add {
      width: calc(33.3333% - 16rpx);
      padding-bottom: 100%;
      margin: 0 8rpx 16rpx;
      position: relative;
      border: 2rpx dashed #d9d9d9;
      border-radius: 8rpx;
      background: #fafafa;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .add-text {
        position: absolute;
        top: 60%;
        font-size: 24rpx;
        color: #999999;
      }

      :deep(.wd-icon) {
        position: absolute;
        top: 35%;
      }
    }
  }

  .photo-tip {
    margin-top: 16rpx;
    font-size: 24rpx;
    color: #999999;
    text-align: center;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + var(--window-bottom, 0px));
  background: #ffffff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.mt-4 {
  margin-top: 32rpx;
}
</style>
