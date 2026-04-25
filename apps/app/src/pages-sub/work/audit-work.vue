<!--
  工作单审核页
  功能：审核工作单，支持通过和驳回

  访问地址: http://localhost:3000/#/pages-sub/work/audit-work
  建议携带参数: ?taskId=xxx

  http://localhost:3000/#/pages-sub/work/audit-work?taskId=WT_001

  旧代码：gitee-example/pages/work/doWorkAudit.vue
-->

<script lang="ts" setup>
import type { WorkOrderDetail } from '@/types/work-order'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { auditWorkOrder, getWorkOrderDetail } from '@/api/work-order'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

/** 路由参数 */
const props = defineProps<{
  orderId?: string
}>()

definePage({
  style: {
    navigationBarTitleText: '工作单审核',
    navigationBarBackgroundColor: '#368bff',
    navigationBarTextStyle: 'white',
  },
})

const toast = useGlobalToast()

/** 工作单详情 */
const orderDetail = ref<WorkOrderDetail | null>(null)

/** 审核意见 */
const opinion = ref('')

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

/** 当前审核结果 */
let currentResult: 'pass' | 'reject' = 'pass'

/** 审核请求 */
const { loading: auditLoading, send: doAudit } = useRequest(
  (result: 'pass' | 'reject') => {
    currentResult = result
    return auditWorkOrder({
      orderId: props.orderId || '',
      result,
      opinion: opinion.value,
    })
  },
  { immediate: false },
)
  .onSuccess(() => {
    toast.success(currentResult === 'pass' ? '审核通过' : '已驳回')
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  })
  .onError((error) => {
    console.error('审核失败:', error)
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

/** 处理通过 */
function handlePass() {
  uni.showModal({
    title: '确认通过',
    content: '确定审核通过此工作单？',
    success: (res) => {
      if (res.confirm) {
        doAudit('pass')
      }
    },
  })
}

/** 处理驳回 */
function handleReject() {
  if (!opinion.value.trim()) {
    toast.warning('请填写驳回原因')
    return
  }
  uni.showModal({
    title: '确认驳回',
    content: '确定驳回此工作单？',
    success: (res) => {
      if (res.confirm) {
        doAudit('reject')
      }
    },
  })
}

/** 预览图片 */
function handlePreviewImage(photo: string) {
  uni.previewImage({
    urls: orderDetail.value?.completePhotos || [],
    current: photo,
  })
}
</script>

<template>
  <view class="min-h-screen bg-gray-50 pb-safe">
    <!-- 加载状态 -->
    <view v-if="loading" class="h-60 flex items-center justify-center">
      <wd-loading />
    </view>

    <!-- 审核内容 -->
    <view v-else-if="orderDetail" class="pb-24">
      <!-- 工作单信息 -->
      <FormSectionTitle title="工作单信息" icon="i-carbon-document" />
      <wd-cell-group border>
        <wd-cell title="工作单编号" :value="orderDetail.orderNo" />
        <wd-cell title="工作单标题" :value="orderDetail.title" />
        <wd-cell title="工作单类型" :value="orderDetail.typeName" />
        <wd-cell title="当前状态">
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

      <!-- 完成情况 -->
      <template v-if="orderDetail.completeRemark || (orderDetail.completePhotos && orderDetail.completePhotos.length > 0)">
        <FormSectionTitle title="完成情况" icon="i-carbon-checkmark-filled" />
        <wd-cell-group border>
          <view v-if="orderDetail.completeRemark" class="bg-white p-4">
            <text class="text-sm text-gray-700">{{ orderDetail.completeRemark }}</text>
          </view>
          <view v-if="orderDetail.completePhotos && orderDetail.completePhotos.length > 0" class="bg-white p-4">
            <view class="complete-photo-list">
              <image
                v-for="(photo, index) in orderDetail.completePhotos"
                :key="index"
                :src="photo"
                mode="aspectFill"
                class="complete-photo-list__item h-20 w-20 rounded"
                @click="handlePreviewImage(photo)"
              />
            </view>
          </view>
        </wd-cell-group>
      </template>

      <!-- 审核意见 -->
      <FormSectionTitle title="审核意见" icon="i-carbon-edit" />
      <wd-cell-group border>
        <wd-textarea
          v-model="opinion"
          placeholder="请输入审核意见（驳回时必填）"
          :maxlength="200"
          show-word-limit
          clearable
        />
      </wd-cell-group>
    </view>

    <!-- 空状态 -->
    <view v-else class="h-60 flex items-center justify-center">
      <wd-status-tip image="error" tip="工作单不存在" />
    </view>

    <!-- 底部操作按钮 -->
    <view v-if="orderDetail" class="shadow-top fixed bottom-0 left-0 right-0 bg-white p-4 pb-safe">
      <view class="flex">
        <wd-button
          type="error"

          plain block
          :loading="auditLoading"
          @click="handleReject"
        >
          驳回
        </wd-button>
        <wd-button
          type="success"
          custom-class="ml-12rpx"
          block
          :loading="auditLoading"
          @click="handlePass"
        >
          通过
        </wd-button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.shadow-top {
  box-shadow: 0 -2px 10px rgb(0 0 0 / 5%);
}

.complete-photo-list {
  display: flex;
  flex-wrap: wrap;
  margin: -8rpx;
}

.complete-photo-list__item {
  margin: 8rpx;
}
</style>
