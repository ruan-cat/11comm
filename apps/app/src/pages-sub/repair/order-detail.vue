<!--
  维修工单详情
  详情页
  功能：显示维修工单详细信息，包括基本信息、图片和流转时间轴

  访问地址: http://localhost:3000/#/pages-sub/repair/order-detail
  建议携带参数: ?repairId=REP_001&storeId=STORE_001

  完整示例: http://localhost:3000/#/pages-sub/repair/order-detail?repairId=REP_001&storeId=STORE_001

  旧代码：gitee-example/pages/repairDetail/repairDetail.vue
-->

<!-- 基本完成检查审核 -->

<script setup lang="ts">
import type { RepairOrder, RepairPhoto, RepairStaffRecord } from '@/types/repair'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import { getRepairDetail, getRepairStaffRecords } from '@/api/repair'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import RepairStatusTag from '@/components/common/repair-status-tag/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { getCurrentCommunity } from '@/utils/user'

/** 全局 Toast 提示 */
const toast = useGlobalToast()

definePage({
  style: {
    navigationBarTitleText: '维修工单详情',
    enablePullDownRefresh: false,
  },
})

/** 页面参数 */
const repairId = ref('')
const storeId = ref('')

/** 工单详情 */
const repairDetail = ref<RepairOrder>()

/** 工单流转记录 */
const staffRecords = ref<RepairStaffRecord[]>([])

/** 获取小区信息 */
const communityInfo = getCurrentCommunity()

/** 是否有图片 */
const hasImages = computed(() => {
  if (!repairDetail.value)
    return false
  return (
    (repairDetail.value.repairPhotos?.length ?? 0) > 0
    || (repairDetail.value.beforePhotos?.length ?? 0) > 0
    || (repairDetail.value.afterPhotos?.length ?? 0) > 0
  )
})

/** 加载工单详情 */
const { loading: detailLoading, send: loadDetail } = useRequest(
  () =>
    getRepairDetail({
      repairId: repairId.value,
      storeId: storeId.value,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((result) => {
    const repair = result.data?.ownerRepair
    if (repair) {
      repairDetail.value = repair
    }
    else {
      toast.error('未找到工单信息')
    }
  })
  .onError((error) => {
    console.error('❌ 加载工单详情失败:', error)
  })

/** 加载工单流转记录 */
const { loading: recordsLoading, send: loadRecords } = useRequest(
  () =>
    getRepairStaffRecords({
      repairId: repairId.value,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((result) => {
    const records = result.data?.staffRecords ?? []
    staffRecords.value = records.map(record => ({
      ...record,
      staffName: record.staffName ?? '',
      startTime: record.startTime ?? '',
      endTime: record.endTime ?? '',
      statusCd: record.statusCd ?? '',
      statusName: record.statusName ?? '',
    }))
  })
  .onError((error) => {
    console.error('❌ 加载流转记录失败:', error)
    // 流转记录加载失败时不弹框提示，仅记录日志
    staffRecords.value = []
  })

/** 加载页面数据 */
function loadPageData() {
  if (!repairId.value) {
    toast.error('缺少必要参数')
    return
  }
  loadDetail()
  loadRecords()
}

/** 页面加载 */
onLoad((options) => {
  repairId.value = (options?.repairId as string) || ''
  storeId.value = (options?.storeId as string) || ''
  loadPageData()
})

/** 页面显示时刷新数据 */
onShow(() => {
  if (repairId.value) {
    loadPageData()
  }
})

/**
 * 获取图片 URL 列表
 * @param images - 图片数组
 * @example getImageUrls(repairDetail.repairPhotos)
 */
function getImageUrls(images: RepairPhoto[]) {
  return images
    .map(img => img.url || img.photo || '')
    .filter(Boolean)
}

/**
 * 回复评价
 * @param record - 工单流转记录
 * @example handleReplyAppraise(staffRecord)
 */
function handleReplyAppraise(record: RepairStaffRecord) {
  if (!record.ruId) {
    toast.error('缺少评价记录ID')
    return
  }
  TypedRouter.toReplyAppraise(record.ruId, repairId.value)
}

/**
 * 拨打电话
 * @param phone - 电话号码
 * @example handleCall('18259941587')
 */
function handleCall(phone?: string) {
  if (!phone) {
    toast.error('电话号码不存在')
    return
  }
  uni.makePhoneCall({ phoneNumber: phone })
}

// ==================== 流转记录显示状态判断 ====================

/**
 * 是否显示处理意见（已结束或待支付）
 * @param record - 工单流转记录
 * @example shouldShowProcessOpinion(staffRecord)
 */
function shouldShowProcessOpinion(record: RepairStaffRecord): boolean {
  return !!record.endTime || record.statusCd === '10009' || record.statusCd === '10004'
}
</script>

<template>
  <view class="repair-detail-page">
    <!-- 加载状态 -->
    <view v-if="detailLoading" class="flex flex-col items-center justify-center p-10 py-20">
      <wd-loading size="30px" />
      <text class="mt-4 text-sm text-gray-400">加载工单详情...</text>
    </view>

    <!-- 工单详情内容 -->
    <view v-else-if="repairDetail" class="p-3 pb-safe">
      <!-- 1. 头部核心状态卡片（小圆角） -->
      <view class="relative mb-3 overflow-hidden rounded-sm bg-white p-4 shadow-sm">
        <view class="flex items-start justify-between">
          <view>
            <text class="mb-1 block text-xs text-gray-500">工单编号</text>
            <view class="mb-2 text-xl text-gray-900 font-bold leading-none">
              {{ repairDetail.repairId }}
            </view>
            <view class="flex items-center text-sm text-gray-500">
              <wd-icon name="" custom-class="i-carbon-time mr-8rpx w-28rpx h-28rpx" />
              <text>{{ repairDetail.appointmentTime }}</text>
            </view>
          </view>
          <!-- 使用新优化的状态组件 -->
          <RepairStatusTag
            :status-cd="repairDetail.statusCd || ''"
            :status-name="repairDetail.statusName"
            :animated="true"
          />
        </view>
      </view>

      <!-- 2. 报修内容卡片（应用 FormSectionTitle - 蓝色系） -->
      <view class="mb-3 overflow-hidden rounded-sm bg-white shadow-sm">
        <!-- 标题栏：蓝色系，静态 -->
        <FormSectionTitle
          title="报修内容"
          icon="document"
          icon-class="i-carbon-document text-blue-500"
          :animated="true"
        />

        <!-- 内容区：补回 padding -->
        <view class="p-4">
          <view class="mb-4 text-sm text-gray-600 leading-relaxed">
            {{ repairDetail.context }}
          </view>

          <!-- 基础信息列表（嵌入式） -->
          <view class="repair-detail-info-list border-t border-gray-100 pt-4">
            <view class="repair-detail-info-row flex items-center justify-between">
              <text class="text-sm text-gray-500">报修人</text>
              <text class="text-sm text-gray-800 font-medium">{{ repairDetail.repairName }}</text>
            </view>
            <view class="repair-detail-info-row flex items-center justify-between">
              <text class="text-sm text-gray-500">联系方式</text>
              <text class="text-sm text-blue-500 font-medium" @click="handleCall(repairDetail.tel)">
                {{ repairDetail.tel }}
              </text>
            </view>
            <view class="repair-detail-info-row flex items-center justify-between">
              <text class="text-sm text-gray-500">报修位置</text>
              <text class="text-sm text-gray-800 font-medium">{{ repairDetail.repairObjName }}</text>
            </view>
            <view class="repair-detail-info-row flex items-center justify-between">
              <text class="text-sm text-gray-500">报修类型</text>
              <text class="text-sm text-gray-800 font-medium">{{ repairDetail.repairTypeName }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 3. 工单附件卡片（应用 FormSectionTitle - 橙色系） -->
      <template v-if="hasImages">
        <view class="mb-3 overflow-hidden rounded-sm bg-white shadow-sm">
          <!-- 标题栏：橙色系，静态 -->
          <FormSectionTitle
            title="工单附件"
            icon="image"
            icon-class="i-carbon-image text-orange-500"
            :animated="true"
          />

          <!-- 内容区：补回 padding -->
          <view class="p-4">
            <!-- 业主报修图片 -->
            <view v-if="repairDetail.repairPhotos?.length" class="mb-4 last:mb-0">
              <text class="mb-2 block text-xs text-gray-400">报修图片</text>
              <view class="repair-photo-grid">
                <wd-img
                  v-for="(photo, index) in repairDetail.repairPhotos"
                  :key="index"
                  :src="photo.url || photo.photo"
                  :image-urls="getImageUrls(repairDetail.repairPhotos)"
                  :current-index="index"
                  mode="aspectFill"
                  class="repair-photo-grid__item aspect-square w-full rounded-sm bg-gray-100"
                  :enable-preview="true"
                />
              </view>
            </view>

            <!-- 维修前图片 -->
            <view v-if="repairDetail.beforePhotos?.length" class="mb-4 last:mb-0">
              <text class="mb-2 block text-xs text-gray-400">维修前图片</text>
              <view class="repair-photo-grid">
                <wd-img
                  v-for="(photo, index) in repairDetail.beforePhotos"
                  :key="index"
                  :src="photo.url || photo.photo"
                  :image-urls="getImageUrls(repairDetail.beforePhotos)"
                  :current-index="index"
                  mode="aspectFill"
                  class="repair-photo-grid__item aspect-square w-full rounded-sm bg-gray-100"
                  :enable-preview="true"
                />
              </view>
            </view>

            <!-- 维修后图片 -->
            <view v-if="repairDetail.afterPhotos?.length" class="mb-0">
              <text class="mb-2 block text-xs text-gray-400">维修完成图片</text>
              <view class="repair-photo-grid">
                <wd-img
                  v-for="(photo, index) in repairDetail.afterPhotos"
                  :key="index"
                  :src="photo.url || photo.photo"
                  :image-urls="getImageUrls(repairDetail.afterPhotos)"
                  :current-index="index"
                  mode="aspectFill"
                  class="repair-photo-grid__item aspect-square w-full rounded-sm bg-gray-100"
                  :enable-preview="true"
                />
              </view>
            </view>
          </view>
        </view>
      </template>

      <!-- 4. 流转记录卡片（应用 FormSectionTitle - 青色系 + 呼吸动效） -->
      <view v-if="staffRecords.length > 0" class="mb-3 overflow-hidden rounded-sm bg-white shadow-sm">
        <!-- 标题栏：青色系，启用呼吸动效 -->
        <FormSectionTitle
          title="流转记录"
          icon="time"
          icon-class="i-carbon-time text-cyan-500"
          :animated="true"
        />

        <!-- 内容区：补回 padding -->
        <view class="p-4">
          <view class="relative pl-2">
            <view
              v-for="(record, index) in staffRecords"
              :key="index"
              class="repair-timeline-item relative flex pb-6 last:pb-0"
            >
              <!-- 时间轴线与节点 -->
              <view class="repair-timeline-axis flex flex-col items-center">
                <!-- 节点圆点：最新的为蓝色，历史为灰色 -->
                <view
                  class="z-10 h-3 w-3 border-2 rounded-full bg-white"
                  :class="index === 0 ? 'border-blue-500 shadow-md' : 'border-gray-300'"
                />
                <!-- 垂直连接线 -->
                <view
                  v-if="index !== staffRecords.length - 1"
                  class="my-1 w-[1px] flex-1 bg-gray-200"
                />
              </view>

              <!-- 内容区域 -->
              <view class="flex-1 -mt-1">
                <!-- 时间 -->
                <text class="mb-1 block text-xs text-gray-400 font-mono">{{ record.startTime }}</text>

                <!-- 状态与人员 -->
                <view class="repair-timeline-meta mb-2 flex flex-wrap items-center">
                  <!-- 在时间轴中使用 StatusTag -->
                  <RepairStatusTag
                    :status-cd="record.statusCd"
                    :status-name="record.statusName"
                    :plain="true"
                    :animated="false"
                    class="repair-timeline-status origin-left scale-90"
                  />
                  <text class="repair-timeline-staff text-sm text-gray-800 font-bold">{{ record.staffName }}</text>
                </view>

                <!-- 处理意见/备注 -->
                <view v-if="shouldShowProcessOpinion(record) && record.context" class="rounded-sm bg-gray-50 p-2 text-xs text-gray-600">
                  <text>{{ record.context }}</text>
                  <text v-if="record.payTypeName" class="ml-1 text-blue-500">({{ record.payTypeName }})</text>
                </view>

                <!-- 操作按钮 -->
                <view v-if="record.statusCd === '10007'" class="mt-2">
                  <wd-button size="small" type="success" plain @click="handleReplyAppraise(record)">
                    回复评价
                  </wd-button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.repair-detail-page {
  min-height: 100vh;
  background-color: #f5f5f7;
}

/** 底部安全区适配 */
.pb-safe {
  padding-bottom: calc(24rpx + var(--window-bottom, 0px));
}

/** 解决 UnoCSS transform 缩放后的对齐问题 */
.origin-left {
  transform-origin: left center;
}

.repair-detail-info-row + .repair-detail-info-row {
  margin-top: 12rpx;
}

.repair-photo-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -8rpx;
}

.repair-photo-grid__item {
  width: calc(33.333% - 16rpx);
  margin: 8rpx;
}

.repair-timeline-axis {
  margin-right: 16rpx;
}

.repair-timeline-status {
  margin-right: 8rpx;
}
</style>
