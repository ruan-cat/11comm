<!--
  投诉单详情页面
  功能：显示投诉工单详细信息，包括基本信息、流转时间轴和评价

  访问地址: http://localhost:3000/#/pages-sub/complaint/detail
  建议携带参数: ?complaintId=COMP_001

  完整示例: http://localhost:3000/#/pages-sub/complaint/detail?complaintId=COMP_001

  旧代码：gitee-example/pages/complaintOrderDetail/complaintOrderDetail.vue
-->

<script setup lang="ts">
import type { Complaint, ComplaintAppraise, ComplaintEvent } from '@/types/complaint'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getComplaintAppraises, getComplaintEvents } from '@/api/complaint'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { ComplaintAppraiseState, ComplaintEventType } from '@/types/complaint'
import { getCurrentCommunity } from '@/utils/user'

/** 全局 Toast 提示 */
const toast = useGlobalToast()

definePage({
  style: {
    navigationBarTitleText: '投诉单详情',
    enablePullDownRefresh: false,
  },
})

/** 页面参数 */
const complaintId = ref('')

/** 投诉详情（从 Storage 获取，这里简化处理） */
const complaintDetail = ref<Complaint>({
  complaintId: '',
  communityId: '',
  storeId: '',
  userId: '',
  typeCd: '',
  typeName: '',
  complaintName: '',
  tel: '',
  context: '',
  createTime: '',
})

/** 工单流转记录 */
const events = ref<ComplaintEvent[]>([])

/** 评价列表 */
const appraises = ref<ComplaintAppraise[]>([])

/** 获取小区信息 */
const communityInfo = getCurrentCommunity()

/** 加载工单流转记录 */
const { loading: eventsLoading, send: loadEvents } = useRequest(
  () =>
    getComplaintEvents({
      complaintId: complaintId.value,
      communityId: communityInfo.communityId,
      page: 1,
      row: 100,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const result = event.data
    events.value = result?.list || []
  })
  .onError((error) => {
    console.error('❌ 加载流转记录失败:', error)
    events.value = []
  })

/** 加载评价列表 */
const { loading: appraisesLoading, send: loadAppraises } = useRequest(
  () =>
    getComplaintAppraises({
      complaintId: complaintId.value,
      communityId: communityInfo.communityId,
      page: 1,
      row: 100,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const result = event.data
    appraises.value = result?.list || []
  })
  .onError((error) => {
    console.error('❌ 加载评价列表失败:', error)
    appraises.value = []
  })

/** 加载页面数据 */
function loadPageData() {
  if (!complaintId.value) {
    toast.error('缺少必要参数')
    return
  }

  // 简化处理：从 storage 获取投诉详情
  try {
    const stored = uni.getStorageSync(`_complaintOrderDetail_${complaintId.value}`)
    if (stored) {
      complaintDetail.value = stored
    }
  }
  catch (error) {
    console.warn('无法从 storage 获取投诉详情，使用默认值')
  }

  loadEvents()
  loadAppraises()
}

/** 页面加载 */
onLoad((options) => {
  complaintId.value = (options?.complaintId as string) || ''
  loadPageData()
})

/** 页面显示时刷新数据 */
onShow(() => {
  if (complaintId.value) {
    loadPageData()
  }
})

/**
 * 回复评价
 * @example handleReplyAppraise(appraise)
 */
function handleReplyAppraise(appraise: ComplaintAppraise) {
  if (!appraise.appraiseId) {
    toast.error('缺少评价ID')
    return
  }
  TypedRouter.toComplaintAppraiseReply(appraise.appraiseId, communityInfo.communityId)
}

/**
 * 获取事件类型对应的颜色
 * @example getEventColor('1000')
 */
function getEventColor(eventType: string): string {
  const colorMap: Record<string, string> = {
    [ComplaintEventType.CREATE]: 'bg-blue-500', // 创建
    [ComplaintEventType.HANDLE]: 'bg-green-500', // 处理
    [ComplaintEventType.APPRAISE]: 'bg-orange-500', // 评价
    [ComplaintEventType.REPLY]: 'bg-purple-500', // 回复
  }
  return colorMap[eventType] || 'bg-gray-400'
}
</script>

<template>
  <view class="complaint-detail-page">
    <view class="p-3">
      <!-- 投诉基本信息 -->
      <view class="mb-3 bg-white">
        <view class="px-3 pb-2 pt-3 text-gray-700 font-medium">
          投诉信息
        </view>

        <wd-cell-group border>
          <wd-cell title="投诉编码" :value="complaintDetail.complaintId">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-edit text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>

          <wd-cell title="房屋编码" :value="complaintDetail.roomName || '未知'">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-home text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>

          <wd-cell title="投诉类型" :value="complaintDetail.typeName">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-ticket text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>

          <wd-cell title="投诉人" :value="complaintDetail.complaintName">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-user-avatar text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>

          <wd-cell title="投诉电话" :value="complaintDetail.tel">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-phone text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>

          <wd-cell title="投诉时间" :value="complaintDetail.createTime">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-time text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>

          <wd-cell title="投诉内容" :value="complaintDetail.context">
            <template #icon>
              <wd-icon name="" custom-class="i-carbon-document text-colorui-green mr-8rpx w-36rpx h-36rpx flex items-center justify-center" />
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>

      <!-- 工单流转时间轴 -->
      <view v-if="events.length > 0" class="mb-3 bg-white p-3">
        <view class="timeline-title mb-3 text-gray-700 font-medium">
          工单流转记录
        </view>

        <view class="relative">
          <view
            v-for="(event, index) in events"
            :key="index"
            class="timeline-item relative mb-4 flex"
            :class="{ 'last-timeline-item': index === events.length - 1 }"
          >
            <!-- 时间轴节点 -->
            <view class="timeline-node">
              <view class="node-dot" :class="getEventColor(event.eventType)" />
              <view v-if="index !== events.length - 1" class="node-line" />
            </view>

            <!-- 时间轴内容 -->
            <view class="timeline-body flex-1 pb-2">
              <!-- 标题 -->
              <view class="timeline-record-title mb-1 font-medium">
                <text v-if="event.eventType === ComplaintEventType.CREATE">
                  {{ event.createTime }} {{ event.createUserName }} 投诉
                </text>
                <text v-else-if="event.eventType === ComplaintEventType.HANDLE">
                  {{ event.createTime }} {{ event.createUserName }} 处理
                </text>
                <text v-else-if="event.eventType === ComplaintEventType.APPRAISE">
                  {{ event.createTime }} {{ event.createUserName }} 评价
                </text>
                <text v-else-if="event.eventType === ComplaintEventType.REPLY">
                  {{ event.createTime }} {{ event.createUserName }} 回复
                </text>
                <text v-else>
                  {{ event.createTime }} {{ event.eventTypeName }}
                </text>
              </view>

              <!-- 内容 -->
              <view v-if="event.remark" class="timeline-record-content text-gray-600">
                <text v-if="event.eventType === ComplaintEventType.HANDLE">处理意见：{{ event.remark }}</text>
                <text v-else-if="event.eventType === ComplaintEventType.APPRAISE">评价内容：{{ event.remark }}</text>
                <text v-else-if="event.eventType === ComplaintEventType.REPLY">回复内容：{{ event.remark }}</text>
                <text v-else>{{ event.remark }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 投诉评价 -->
      <view v-if="appraises.length > 0" class="mb-3">
        <view
          v-for="(appraise, index) in appraises"
          :key="index"
          class="mb-3 rounded bg-white p-3"
        >
          <view class="mb-2 flex items-center justify-between">
            <text class="text-gray-700 font-medium">工单评价</text>
            <wd-button
              v-if="appraise.state === ComplaintAppraiseState.WAITING"
              size="small"
              type="success"
              @click="handleReplyAppraise(appraise)"
            >
              回复
            </wd-button>
          </view>

          <view class="text-sm">
            <view class="appraise-row flex items-start">
              <text class="appraise-label flex-shrink-0 text-gray-500">评价内容：</text>
              <text class="flex-1 text-gray-700">{{ appraise.context }}</text>
            </view>

            <view class="appraise-row flex items-center">
              <text class="appraise-label text-gray-500">评价分数：</text>
              <text class="text-gray-700">{{ appraise.score }}</text>
            </view>

            <view v-if="appraise.state === ComplaintAppraiseState.COMPLETED && appraise.replyContext" class="appraise-row flex items-start">
              <text class="appraise-label flex-shrink-0 text-gray-500">回复内容：</text>
              <text class="flex-1 text-gray-700">{{ appraise.replyContext }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.complaint-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
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

/** 确保 wd-cell 的 icon 区域垂直居中 */
:deep(.wd-cell__icon) {
  display: flex !important;
  align-items: center !important;
}

/** 时间轴标题 */
.timeline-title {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
}

/** 时间轴记录标题 */
.timeline-record-title {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
}

/** 时间轴记录内容 */
.timeline-record-content {
  font-size: 28rpx !important;
  line-height: 36rpx !important;
}

.timeline-body {
  margin-left: 12rpx;
}

/** 时间轴最后一项隐藏连接线 */
.last-timeline-item {
  .node-line {
    display: none;
  }
}

/** 时间轴节点 */
.timeline-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2px;

  .node-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgb(66, 153, 225);
    z-index: 1;
  }

  .node-line {
    flex: 1;
    width: 2px;
    background-color: rgb(226, 232, 240);
    margin-top: 4px;
    min-height: 40px;
  }
}

/* 评价行间距 - 兼容微信小程序 */
.appraise-row + .appraise-row {
  margin-top: 0.5rem;
}

.appraise-label {
  margin-right: 8rpx;
}
</style>
