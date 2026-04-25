<!--
  投诉录单页面
  功能：业主发起投诉工单，查看投诉历史记录

  访问地址: http://localhost:3000/#/pages-sub/complaint/order

  完整示例: http://localhost:3000/#/pages-sub/complaint/order

  旧代码：gitee-example/pages/complaintOrder/complaintOrder.vue
-->

<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import type { Complaint } from '@/types/complaint'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { computed, reactive, ref } from 'vue'
import { getUserComplaintHistory, saveComplaint } from '@/api/complaint'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { navigateToTyped, TypedRouter } from '@/router'
import { ComplaintTypeCode } from '@/types/complaint'
import { getCurrentCommunity } from '@/utils/user'

/** 全局 Toast 提示 */
const toast = useGlobalToast()

definePage({
  style: {
    navigationBarTitleText: '投诉录单',
    enablePullDownRefresh: false,
  },
})

/** 表单实例 */
const formRef = ref<FormInstance>()

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

/** Tab 状态：'submit' = 发起投诉，'history' = 投诉历史 */
const activeTab = ref<'submit' | 'history'>('submit')

/** 获取小区信息 */
const communityInfo = getCurrentCommunity()

// ==================== 房屋信息 ====================
/** 楼栋信息 */
const floorId = ref('')
const floorNum = ref('')

/** 单元信息 */
const unitId = ref('')
const unitNum = ref('')

/** 房屋信息 */
const roomId = ref('')
const roomNum = ref('')

/** 房屋选择显示文本 */
const floorDisplay = computed(() => (floorNum.value ? `${floorNum.value}号楼` : '请选择'))
const unitDisplay = computed(() => (unitNum.value ? `${unitNum.value}单元` : '请选择'))
const roomDisplay = computed(() => (roomNum.value ? `${roomNum.value}室` : '请选择'))

// ==================== 投诉信息 ====================
/** 投诉类型选项 */
const typeOptions = [
  { label: '投诉', value: ComplaintTypeCode.COMPLAINT },
  { label: '建议', value: ComplaintTypeCode.SUGGESTION },
]

/** 表单数据模型 */
const model = reactive({
  typeCd: '',
  complaintName: '',
  tel: '',
  context: '',
})

/** 表单校验规则 */
const formRules: FormRules = {
  typeCd: [{ required: true, message: '请选择投诉类型' }],
  complaintName: [{ required: true, message: '请填写投诉人' }],
  tel: [
    { required: true, message: '请填写手机号' },
    { required: false as boolean, pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
  ],
  context: [{ required: true, message: '请填写投诉内容' }],
}

/** 图片列表（用于显示） */
const imgList = ref<string[]>([])

/** Base64 图片列表（用于提交） */
const photos = ref<string[]>([])

// ==================== 投诉历史 ====================
/** 投诉历史列表 */
const historyList = ref<Complaint[]>([])

/** 是否无历史数据 */
const noHistory = ref(false)

/** 加载投诉历史 */
const { loading: historyLoading, send: loadHistory } = useRequest(
  () =>
    getUserComplaintHistory({
      page: 1,
      row: 15,
      userId: 'USER_001', // TODO: 从用户信息获取
      storeId: 'STORE_001', // TODO: 从用户信息获取
      process: 'START',
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const list = event.data.complaints || []
    if (list.length < 1) {
      noHistory.value = true
      historyList.value = []
      return
    }

    // 格式化日期为 MM-DD
    historyList.value = list.map((item) => {
      const date = dayjs(item.createTime)
      return {
        ...item,
        createTime: `${date.month() + 1}-${date.date()}`,
      }
    })
    noHistory.value = false
  })
  .onError((error) => {
    console.error('❌ 加载投诉历史失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
    noHistory.value = true
  })

/** 提交投诉 */
const { loading: submitting, send: submitComplaint } = useRequest(
  () => {
    const photoList: Array<{ photo: string }> = photos.value.map(photo => ({ photo }))

    return saveComplaint({
      typeCd: model.typeCd,
      complaintName: model.complaintName,
      tel: model.tel,
      roomId: roomId.value,
      photos: photoList,
      context: model.context,
      userId: 'USER_001', // TODO: 从用户信息获取
      storeId: 'STORE_001', // TODO: 从用户信息获取
      communityId: communityInfo.communityId,
    })
  },
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('投诉提交成功')
    // 清空表单
    resetForm()
    // 切换到历史记录
    activeTab.value = 'history'
    loadHistory()
  })
  .onError((error) => {
    console.error('❌ 提交投诉失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

/** 页面加载 */
onLoad(() => {
  // 初始化时不加载历史记录，等用户切换到历史 tab 时再加载
})

/** 页面显示时处理选择器返回的数据 */
onShow(() => {
  // 从 storage 获取选择器返回的数据
  try {
    const floorInfo = uni.getStorageSync('_selected_floor')
    if (floorInfo) {
      floorId.value = floorInfo.floorId || ''
      floorNum.value = floorInfo.floorNum || ''
      uni.removeStorageSync('_selected_floor')
    }

    const unitInfo = uni.getStorageSync('_selected_unit')
    if (unitInfo) {
      unitId.value = unitInfo.unitId || ''
      unitNum.value = unitInfo.unitNum || ''
      uni.removeStorageSync('_selected_unit')
    }

    const roomInfo = uni.getStorageSync('_selected_room')
    if (roomInfo) {
      roomId.value = roomInfo.roomId || ''
      roomNum.value = roomInfo.roomNum || ''
      uni.removeStorageSync('_selected_room')
    }
  }
  catch (error) {
    console.warn('获取选择器数据失败:', error)
  }
})

/**
 * Tab 切换
 * @example handleTabChange('history')
 */
function handleTabChange(tab: 'submit' | 'history') {
  activeTab.value = tab
  if (tab === 'history' && historyList.value.length === 0) {
    loadHistory()
  }
}

/**
 * 选择楼栋
 * @example handleSelectFloor()
 */
function handleSelectFloor() {
  navigateToTyped('/pages-sub/selector/select-floor', {})
}

/**
 * 选择单元
 * @example handleSelectUnit()
 */
function handleSelectUnit() {
  if (!floorId.value) {
    toast.error('请先选择楼栋')
    return
  }

  navigateToTyped('/pages-sub/selector/select-unit', {
    floorId: floorId.value,
  })
}

/**
 * 选择房屋
 * @example handleSelectRoom()
 */
function handleSelectRoom() {
  if (!floorId.value) {
    toast.error('请先选择楼栋')
    return
  }

  if (!unitId.value) {
    toast.error('请先选择单元')
    return
  }

  navigateToTyped('/pages-sub/selector/select-room', {
    floorId: floorId.value,
    unitId: unitId.value,
  })
}

/**
 * 选择图片
 * @example handleChooseImage()
 */
function handleChooseImage() {
  if (imgList.value.length >= 4) {
    toast.error('最多只能上传4张图片')
    return
  }

  uni.chooseImage({
    count: 4 - imgList.value.length,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFiles = res.tempFilePaths
      const files = Array.isArray(tempFiles) ? tempFiles : [tempFiles]

      // 添加到显示列表
      imgList.value = [...imgList.value, ...files]

      // 转换为 Base64
      files.forEach((filePath) => {
        uni.getFileSystemManager().readFile({
          filePath,
          encoding: 'base64',
          success: (fileRes) => {
            const base64 = fileRes.data as string
            photos.value.push(base64)
          },
          fail: (error) => {
            console.error('读取图片失败:', error)
            toast.error('图片读取失败')
          },
        })
      })
    },
  })
}

/**
 * 删除图片
 * @example handleDeleteImage(0)
 */
function handleDeleteImage(index: number) {
  imgList.value.splice(index, 1)
  photos.value.splice(index, 1)
}

/**
 * 预览图片
 * @example handlePreviewImage(0)
 */
function handlePreviewImage(index: number) {
  uni.previewImage({
    urls: imgList.value,
    current: index,
  })
}

/**
 * 提交表单
 * @example handleSubmit()
 */
function handleSubmit() {
  // 先验证房屋信息
  if (!roomId.value) {
    toast.error('请选择房屋信息')
    return
  }

  // 表单验证
  formRef.value
    ?.validate()
    .then(({ valid }) => {
      if (!valid) {
        return
      }

      submitComplaint()
    })
    .catch((error) => {
      console.error('表单校验异常:', error)
    })
}

/**
 * 重置表单
 * @example resetForm()
 */
function resetForm() {
  model.typeCd = ''
  model.complaintName = ''
  model.tel = ''
  model.context = ''
  imgList.value = []
  photos.value = []
  floorId.value = ''
  floorNum.value = ''
  unitId.value = ''
  unitNum.value = ''
  roomId.value = ''
  roomNum.value = ''
}

/**
 * 查看投诉详情
 * @example handleViewDetail(complaint)
 */
function handleViewDetail(complaint: Complaint) {
  // 存储到 storage 供详情页读取
  uni.setStorageSync(`_complaintOrderDetail_${complaint.complaintId}`, complaint)

  TypedRouter.toComplaintDetail(complaint.complaintId)
}
</script>

<template>
  <view class="complaint-order-page">
    <!-- Tab 切换 -->
    <view class="tabs-wrapper bg-white">
      <view class="flex text-center">
        <view
          class="tab-item flex-1 py-3"
          :class="activeTab === 'submit' ? 'active' : ''"
          @tap="handleTabChange('submit')"
        >
          <text>发起投诉</text>
        </view>
        <view
          class="tab-item flex-1 py-3"
          :class="activeTab === 'history' ? 'active' : ''"
          @tap="handleTabChange('history')"
        >
          <text>投诉历史</text>
        </view>
      </view>
    </view>

    <!-- 投诉历史列表 -->
    <view v-if="activeTab === 'history'" class="history-content">
      <!-- 加载状态 -->
      <view v-if="historyLoading" class="flex items-center justify-center p-8">
        <wd-loading />
      </view>

      <!-- 历史列表 -->
      <view v-else-if="!noHistory && historyList.length > 0" class="p-3">
        <view
          v-for="(item, index) in historyList"
          :key="index"
          class="history-card mb-3 flex items-center justify-between rounded bg-white p-3"
          @tap="handleViewDetail(item)"
        >
          <view class="history-card-main flex flex-1 items-center">
            <wd-icon name="document" custom-class="history-card-icon text-blue-500" size="40px" />
            <view class="flex-1">
              <view class="mb-1 text-gray-700 font-medium">
                {{ item.complaintId }}
              </view>
              <view class="text-sm text-gray-500">
                {{ item.complaintName }}
              </view>
            </view>
          </view>
          <view class="history-card-meta flex flex-col items-end">
            <view class="history-card-time text-xs text-gray-400">
              {{ item.createTime }}
            </view>
            <wd-icon name="arrow-right" custom-class="text-gray-400" />
          </view>
        </view>
      </view>

      <!-- 空数据状态 -->
      <view v-else class="flex flex-col items-center justify-center" style="min-height: 60vh;">
        <wd-icon name="inbox" custom-class="text-gray-300" size="80px" />
        <text class="mt-4 text-gray-400">暂无投诉历史</text>
      </view>
    </view>

    <!-- 发起投诉表单 -->
    <view v-if="activeTab === 'submit'" class="submit-content">
      <wd-form ref="formRef" :model="model" :rules="formRules">
        <!-- 房屋信息 -->
        <FormSectionTitle title="房屋信息" />
        <wd-cell-group border>
          <wd-cell title="楼栋" :value="floorDisplay" is-link @click="handleSelectFloor">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-building text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>

          <wd-cell title="单元" :value="unitDisplay" is-link @click="handleSelectUnit">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-layers text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>

          <wd-cell title="房屋" :value="roomDisplay" is-link @click="handleSelectRoom">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-home text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>
        </wd-cell-group>

        <!-- 投诉信息 -->
        <FormSectionTitle title="投诉信息" />
        <wd-cell-group border>
          <!-- 投诉类型 -->
          <wd-picker
            v-model="model.typeCd"
            label="投诉类型"
            :label-width="LABEL_WIDTH"
            prop="typeCd"
            :columns="typeOptions"
            label-key="label"
            value-key="value"
            :rules="formRules.typeCd"
          />

          <!-- 投诉人 -->
          <wd-input
            v-model="model.complaintName"
            label="投诉人"
            :label-width="LABEL_WIDTH"
            prop="complaintName"
            placeholder="请输入投诉人"
            clearable
            :rules="formRules.complaintName"
          />

          <!-- 手机号码 -->
          <wd-input
            v-model="model.tel"
            label="手机号码"
            :label-width="LABEL_WIDTH"
            prop="tel"
            type="number"
            placeholder="请输入手机号码"
            clearable
            :rules="formRules.tel"
          />

          <!-- 投诉内容 -->
          <wd-textarea
            v-model="model.context"
            label="投诉内容"
            :label-width="LABEL_WIDTH"
            prop="context"
            placeholder="请输入投诉内容"
            :maxlength="500"
            show-word-limit
            :auto-height="true"
            :min-height="100"
            clearable
            :rules="formRules.context"
          />
        </wd-cell-group>

        <!-- 图片上传 -->
        <FormSectionTitle title="图片上传" />
        <view class="bg-white p-3">
          <view class="mb-3 flex items-center justify-between">
            <text class="text-sm text-gray-500">{{ imgList.length }}/4</text>
          </view>

          <view class="image-grid">
            <!-- 已选图片 -->
            <view
              v-for="(img, index) in imgList"
              :key="index"
              class="image-item relative"
              @tap="handlePreviewImage(index)"
            >
              <image :src="img" mode="aspectFill" class="h-full w-full" />
              <view class="delete-btn" @tap.stop="handleDeleteImage(index)">
                <wd-icon name="close" custom-class="text-white" size="16px" />
              </view>
            </view>

            <!-- 添加按钮 -->
            <view
              v-if="imgList.length < 4"
              class="image-item add-btn flex items-center justify-center"
              @tap="handleChooseImage"
            >
              <wd-icon name="camera" custom-class="text-gray-400" size="40px" />
            </view>
          </view>
        </view>

        <!-- 提交按钮 -->
        <view class="mt-6 px-3 pb-6">
          <wd-button type="success" size="large" :loading="submitting" @click="handleSubmit">
            提交
          </wd-button>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.complaint-order-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.section-title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 20px 15px 10px;
}

/** Tab 样式 */
.tabs-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .tab-item {
    position: relative;
    font-size: 28rpx;
    color: #666;
    transition: all 0.3s;

    &.active {
      color: #07c160;
      font-weight: 500;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 3px;
        background-color: #07c160;
        border-radius: 2px;
      }
    }
  }
}

/** 历史列表样式 */
.history-content {
  min-height: calc(100vh - 100rpx);
}

.history-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}

.history-card-icon {
  margin-right: 12rpx;
}

.history-card-time {
  margin-bottom: 4rpx;
}

/** 图片网格 */
.image-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -6rpx;
}

.image-item {
  width: calc(25% - 12rpx);
  height: 160rpx;
  margin: 0 6rpx 12rpx;
  border-radius: 8rpx;
  overflow: hidden;
  background-color: #f5f5f5;

  .delete-btn {
    position: absolute;
    top: 4rpx;
    right: 4rpx;
    width: 40rpx;
    height: 40rpx;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.add-btn {
  border: 2px dashed #d9d9d9;
  cursor: pointer;
  transition: all 0.3s;

  &:active {
    border-color: #07c160;
    background-color: rgba(7, 193, 96, 0.05);
  }
}

/** 强制设置 wd-cell 的文本大小 */
:deep(.wd-cell__title) {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
}

:deep(.wd-cell__value) {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
}

:deep(.wd-cell__icon) {
  display: flex !important;
  align-items: center !important;
}

/** input 样式 */
input {
  width: 100%;
  color: #333;
}
</style>
