<!--
  采购审核
  功能：显示采购待审核列表，支持审核操作

  访问地址: http://localhost:3000/#/pages-sub/resource/purchase-apply-audit

  旧代码：gitee-example/pages/resource/purchaseApplyAuditOrders.vue
-->

<script setup lang="ts">
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { listMyAuditOrders, saveAuditOrders } from '@/api/resource'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '采购审核',
    enablePullDownRefresh: false,
  },
})

// ==================== 依赖注入 ====================

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** Toast 提示 */
const toast = useGlobalToast()

// ==================== 列表状态 ====================

/** 列表数据 */
const list = ref<any[]>([])

type ZPagingRef = any

const pagingRef = ref<ZPagingRef>()

// ==================== 分页请求 ====================

/** 查询采购待办列表 */
const { send: loadList } = useRequest(
  (params: { page: number, row: number }) =>
    listMyAuditOrders({
      ...params,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
).onSuccess((event) => {
  const response = event.data
  pagingRef.value?.complete(response?.list || [])
}).onError((error) => {
  console.error('加载采购审核待办列表失败:', error)
  pagingRef.value?.complete(false)
})

/** 审核操作 */
const { send: auditApply } = useRequest(
  (data: { taskId: string, status: string, remark?: string }) => saveAuditOrders(data),
  { immediate: false },
).onSuccess(() => {
  toast.success('审核成功')
  loadList({ page: 1, row: 10 })
}).onError((error) => {
  console.error('采购审核操作失败:', error)
})

// ==================== 方法 ====================

/** 跳转到详情 */
function goToDetail(item: any) {
  uni.navigateTo({
    url: `/pages-sub/resource/purchase-apply-detail?applyOrderId=${item.businessId}`,
  })
}

/** 审核通过 */
function handleAuditPass(item: any) {
  uni.showModal({
    title: '审核确认',
    content: '确认通过该采购申请？',
    success: (res) => {
      if (res.confirm) {
        auditApply({
          taskId: item.taskId,
          status: '1200',
          remark: '审核通过',
        })
      }
    },
  })
}

/** 审核拒绝 */
function handleAuditReject(item: any) {
  uni.showModal({
    title: '审核确认',
    content: '确认拒绝该采购申请？',
    success: (res) => {
      if (res.confirm) {
        auditApply({
          taskId: item.taskId,
          status: '1400',
          remark: '审核拒绝',
        })
      }
    },
  })
}

/** 下拉刷新 */
function handleQuery(pageNo: number, pageSize: number) {
  loadList({
    page: pageNo,
    row: pageSize,
  })
}

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page-container">
    <z-paging ref="pagingRef" v-model="list" @query="handleQuery">
      <view class="list-container">
        <view v-for="(item, index) in list" :key="index" class="list-item">
          <view class="item-header" @click="goToDetail(item)">
            <view class="item-title">
              <wd-icon name="" custom-class="i-carbon-shopping-cart text-green-500 mr-2" />
              <text class="font-medium">{{ item.resourceNames }}</text>
            </view>
            <view class="item-status">
              <text class="status-text">({{ item.stateName }})</text>
            </view>
          </view>

          <view class="item-content" @click="goToDetail(item)">
            <view class="info-item">
              <text class="label">申请人:</text>
              <text>{{ item.createUserName }}</text>
            </view>
            <view class="info-item">
              <text class="label">时间:</text>
              <text>{{ item.createTime }}</text>
            </view>
          </view>

          <view class="item-actions">
            <wd-button type="success" size="small" @click="handleAuditPass(item)">
              通过
            </wd-button>
            <wd-button type="error" size="small" custom-class="ml-16rpx" @click="handleAuditReject(item)">
              拒绝
            </wd-button>
            <wd-button type="info" size="small" plain custom-class="ml-16rpx" @click="goToDetail(item)">
              详情
            </wd-button>
          </view>
        </view>
      </view>

      <template #empty>
        <view class="empty-container">
          <wd-status-tip image="content" tip="暂无待审核数据" />
        </view>
      </template>

      <template #loading>
        <ZPagingLoading
          icon="document"
          icon-class="i-carbon-document text-blue-400 animate-pulse"
          primary-text="正在加载采购审核列表..."
          secondary-text="请稍候片刻"
        />
      </template>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.list-container {
  padding: 20rpx;
}

.list-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.item-title {
  display: flex;
  align-items: center;
  flex: 1;
}

.font-medium {
  font-weight: 500;
}

.status-text {
  color: #666;
  font-size: 28rpx;
}

.item-content {
  margin-bottom: 20rpx;
}

.info-item {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;

  .label {
    margin-right: 8rpx;
  }
}

.item-actions {
  display: flex;
  justify-content: flex-end;
}

.empty-container {
  padding: 100rpx 0;
}
</style>
