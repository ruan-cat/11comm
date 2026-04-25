<!--
  工作单详情页
  功能：显示工作单详细信息，支持操作

  访问地址: http://localhost:3000/#/pages-sub/work/work-detail
  建议携带参数: ?orderId=xxx

  http://localhost:3000/#/pages-sub/work/work-detail?orderId=WO_001

  旧代码：gitee-example/pages/work/workDetail.vue
-->

<script lang="ts" setup>
import type { WorkOrderDetail } from '@/types/work-order'
import { useRequest } from 'alova/client'
import { computed, onMounted, ref } from 'vue'
import { completeWorkOrder, getWorkOrderDetail, startWorkOrder } from '@/api/work-order'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router/helpers'

/** 路由参数 */
const props = defineProps<{
  orderId?: string
}>()

definePage({
  style: {
    navigationBarTitleText: '工作单详情',
    navigationBarBackgroundColor: '#368bff',
    navigationBarTextStyle: 'white',
  },
})

const toast = useGlobalToast()

/** 工作单详情 */
const orderDetail = ref<WorkOrderDetail | null>(null)

/** 加载详情请求 */
const { loading, send: loadDetail } = useRequest(
  () => getWorkOrderDetail({ orderId: props.orderId || '' }),
  { immediate: false },
)
  .onSuccess(({ data }) => {
    orderDetail.value = data.order || null
  })
  .onError((error) => {
    console.error('加载工作单详情失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

/** 开始处理请求 */
const { loading: startLoading, send: doStart } = useRequest(
  () => startWorkOrder({ orderId: props.orderId || '' }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('开始处理')
    loadDetail()
  })
  .onError((error) => {
    console.error('开始处理失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

/** 完成请求 */
const { loading: completeLoading, send: doComplete } = useRequest(
  () => completeWorkOrder({ orderId: props.orderId || '' }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('已完成')
    loadDetail()
  })
  .onError((error) => {
    console.error('完成失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

/** 进入页面加载数据 */
onMounted(() => {
  if (props.orderId) {
    loadDetail()
  }
})

/** 获取状态标签样式 */
function getStatusType(status: string): 'primary' | 'success' | 'warning' | 'danger' | 'default' {
  const statusMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'default'> = {
    10001: 'warning',
    10002: 'primary',
    10003: 'success',
    10004: 'danger',
    10005: 'default',
  }
  return statusMap[status] || 'default'
}

/** 获取优先级标签样式 */
function getPriorityType(priority: string): 'primary' | 'success' | 'warning' | 'danger' | 'default' {
  const priorityMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'default'> = {
    1: 'default',
    2: 'primary',
    3: 'warning',
    4: 'danger',
  }
  return priorityMap[priority] || 'default'
}

/** 是否显示操作按钮 */
const showActions = computed(() => {
  if (!orderDetail.value)
    return false
  return orderDetail.value.status === '10001' || orderDetail.value.status === '10002'
})

/** 处理开始 */
function handleStart() {
  uni.showModal({
    title: '确认',
    content: '确定开始处理此工作单？',
    success: (res) => {
      if (res.confirm) {
        doStart()
      }
    },
  })
}

/** 处理完成 */
function handleComplete() {
  uni.showModal({
    title: '确认',
    content: '确定完成此工作单？',
    success: (res) => {
      if (res.confirm) {
        doComplete()
      }
    },
  })
}

/** 跳转到审核页 */
function handleAudit() {
  TypedRouter.toWorkAudit(props.orderId || '')
}
</script>

<template>
  <view class="min-h-screen bg-gray-50 pb-safe">
    <!-- 加载状态 -->
    <view v-if="loading" class="h-60 flex items-center justify-center">
      <wd-loading />
    </view>

    <!-- 详情内容 -->
    <view v-else-if="orderDetail" class="pb-20">
      <!-- 基本信息 -->
      <FormSectionTitle title="基本信息" icon="i-carbon-document" />
      <wd-cell-group border>
        <wd-cell title="工作单编号" :value="orderDetail.orderNo" />
        <wd-cell title="工作单标题" :value="orderDetail.title" />
        <wd-cell title="工作单类型" :value="orderDetail.typeName" />
        <wd-cell title="优先级">
          <wd-tag :type="getPriorityType(orderDetail.priority)" size="small">
            {{ orderDetail.priorityName }}
          </wd-tag>
        </wd-cell>
        <wd-cell title="状态">
          <wd-tag :type="getStatusType(orderDetail.status)" size="small">
            {{ orderDetail.statusName }}
          </wd-tag>
        </wd-cell>
      </wd-cell-group>

      <!-- 工作内容 -->
      <FormSectionTitle title="工作内容" icon="i-carbon-text-align-left" />
      <wd-cell-group border>
        <view class="bg-white p-4">
          <text class="text-sm text-gray-700">{{ orderDetail.content }}</text>
        </view>
      </wd-cell-group>

      <!-- 人员信息 -->
      <FormSectionTitle title="人员信息" icon="i-carbon-user-multiple" />
      <wd-cell-group border>
        <wd-cell title="创建人" :value="orderDetail.creatorName" />
        <wd-cell title="执行人" :value="orderDetail.staffName || '未分配'" />
      </wd-cell-group>

      <!-- 时间信息 -->
      <FormSectionTitle title="时间信息" icon="i-carbon-calendar" />
      <wd-cell-group border>
        <wd-cell title="创建时间" :value="orderDetail.createTime" />
        <wd-cell v-if="orderDetail.planStartTime" title="计划开始" :value="orderDetail.planStartTime" />
        <wd-cell v-if="orderDetail.planEndTime" title="计划结束" :value="orderDetail.planEndTime" />
        <wd-cell v-if="orderDetail.actualStartTime" title="实际开始" :value="orderDetail.actualStartTime" />
        <wd-cell v-if="orderDetail.actualEndTime" title="实际结束" :value="orderDetail.actualEndTime" />
      </wd-cell-group>

      <!-- 抄送人 -->
      <template v-if="orderDetail.copyUsers && orderDetail.copyUsers.length > 0">
        <FormSectionTitle title="抄送人" icon="i-carbon-copy" />
        <wd-cell-group border>
          <view class="copy-user-list bg-white p-4">
            <wd-tag v-for="user in orderDetail.copyUsers" :key="user.userId" type="primary" plain class="copy-user-list__item">
              {{ user.userName }}
            </wd-tag>
          </view>
        </wd-cell-group>
      </template>

      <!-- 操作记录 -->
      <template v-if="orderDetail.operationLogs && orderDetail.operationLogs.length > 0">
        <FormSectionTitle title="操作记录" icon="i-carbon-activity" />
        <wd-cell-group border>
          <view
            v-for="log in orderDetail.operationLogs"
            :key="log.logId"
            class="border-b border-gray-100 bg-white p-4 last:border-b-0"
          >
            <view class="flex items-center justify-between">
              <text class="text-gray-800 font-medium">{{ log.operationTypeName }}</text>
              <text class="text-xs text-gray-400">{{ log.operationTime }}</text>
            </view>
            <view class="mt-1 text-sm text-gray-600">
              操作人：{{ log.operatorName }}
            </view>
            <view v-if="log.remark" class="mt-1 text-sm text-gray-500">
              备注：{{ log.remark }}
            </view>
          </view>
        </wd-cell-group>
      </template>
    </view>

    <!-- 空状态 -->
    <view v-else class="h-60 flex items-center justify-center">
      <wd-status-tip image="error" tip="工作单不存在" />
    </view>

    <!-- 底部操作按钮 -->
    <view v-if="showActions" class="shadow-top fixed bottom-0 left-0 right-0 bg-white p-4 pb-safe">
      <view class="action-row flex">
        <wd-button
          v-if="orderDetail?.status === '10001'"
          type="primary"
          block
          :loading="startLoading"
          @click="handleStart"
        >
          开始处理
        </wd-button>
        <wd-button
          v-if="orderDetail?.status === '10002'"
          type="success"
          block
          custom-class="ml-12rpx"
          :loading="completeLoading"
          @click="handleComplete"
        >
          完成工作单
        </wd-button>
        <wd-button type="warning" plain block custom-class="ml-12rpx" @click="handleAudit">
          提交审核
        </wd-button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.shadow-top {
  box-shadow: 0 -2px 10px rgb(0 0 0 / 5%);
}

.copy-user-list {
  display: flex;
  flex-wrap: wrap;
  margin: -8rpx;
}

.copy-user-list__item {
  margin: 8rpx;
}
</style>
