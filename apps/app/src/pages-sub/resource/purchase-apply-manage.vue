<!--
  采购申请管理
  功能：显示采购申请列表，支持搜索和筛选

  访问地址: http://localhost:3000/#/pages-sub/resource/purchase-apply-manage

  旧代码：gitee-example/pages/resource/purchaseApplyManage.vue
-->

<script setup lang="ts">
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { deletePurchaseApply, queryPurchaseApplyList } from '@/api/resource'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '采购申请管理',
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

/** 加载状态 */
const loading = ref(false)

// ==================== 分页请求 ====================

/** 查询采购申请列表 */
const { send: loadList } = useRequest(
  (params: { page: number, row: number }) =>
    queryPurchaseApplyList({
      ...params,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
).onSuccess((event) => {
  const response = event.data
  pagingRef.value?.complete(response?.list || [])
}).onError((error) => {
  console.error('加载采购申请列表失败:', error)
  pagingRef.value?.complete(false)
})

/** 取消申请 */
const { send: cancelApplyReq } = useRequest((data: { applyOrderId: string }) => deletePurchaseApply(data), {
  immediate: false,
}).onSuccess(() => {
  toast.success('取消成功')
  loadList({ page: 1, row: 10 })
}).onError((error) => {
  console.error('取消采购申请失败:', error)
})

// ==================== 方法 ====================

/** 跳转到新增采购申请 */
function goToAddApply() {
  uni.navigateTo({
    url: '/pages-sub/resource/add-purchase-apply',
  })
}

/** 跳转到详情 */
function goToDetail(item: any) {
  uni.navigateTo({
    url: `/pages-sub/resource/purchase-apply-detail?applyOrderId=${item.applyOrderId}`,
  })
}

/** 取消申请 */
function cancelApply(item: any) {
  uni.showModal({
    title: '提示',
    content: '确定要取消该采购申请吗？',
    success: (res) => {
      if (res.confirm) {
        cancelApplyReq({ applyOrderId: item.applyOrderId })
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
      <template #top>
        <view class="search-bar">
          <wd-button type="primary" size="small" @click="goToAddApply">
            采购
          </wd-button>
        </view>
      </template>

      <view class="list-container">
        <view v-for="(item, index) in list" :key="index" class="list-item" @click="goToDetail(item)">
          <view class="item-header">
            <view class="item-title">
              <wd-icon name="" custom-class="i-carbon-shopping-cart text-green-500 mr-2" />
              <text class="font-medium">{{ item.resourceNames }}</text>
              <text class="status-text">({{ item.stateName }})</text>
            </view>
            <view class="item-actions">
              <wd-button
                v-if="item.state === 1200"
                type="warning"
                size="small"
                plain
                @click.stop="cancelApply(item)"
              >
                取消
              </wd-button>
              <wd-button type="info" size="small" plain custom-class="ml-16rpx" @click.stop="goToDetail(item)">
                详情
              </wd-button>
            </view>
          </view>

          <view class="item-content">
            <view class="info-item">
              <text class="label">申请人:</text>
              <text>{{ item.createUserName }}</text>
            </view>
            <view class="info-item">
              <text class="label">时间:</text>
              <text>{{ item.createTime }}</text>
            </view>
            <view class="info-item">
              <text class="label">订单:</text>
              <text>{{ item.applyOrderId }}</text>
            </view>
          </view>
        </view>
      </view>

      <template #empty>
        <view class="empty-container">
          <wd-status-tip image="content" tip="暂无数据" />
        </view>
      </template>

      <template #loading>
        <ZPagingLoading
          icon="document"
          icon-class="i-carbon-document text-blue-400 animate-pulse"
          primary-text="正在加载采购申请列表..."
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

.search-bar {
  padding: 20rpx;
  background-color: #fff;
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
  margin-left: 16rpx;
  color: #666;
  font-size: 28rpx;
}

.item-actions {
  display: flex;
}

.item-content {
  display: flex;
  flex-wrap: wrap;
  margin: -8rpx;
}

.info-item {
  margin: 8rpx;
  font-size: 26rpx;
  color: #666;

  .label {
    margin-right: 8rpx;
  }
}

.empty-container {
  padding: 100rpx 0;
}
</style>
