<!--
  调拨详情
  功能：显示调拨申请详细信息

  访问地址: http://localhost:3000/#/pages-sub/resource/allocation-detail
  建议携带参数: ?allocationId=xxx

  旧代码：gitee-example/pages/resource/allocationStorehouseApplyDetail.vue
-->

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import { listAllocationStorehouseApplys, listAllocationStorehouses } from '@/api/resource'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '调拨详情',
    enablePullDownRefresh: false,
  },
})

const communityInfo = getCurrentCommunity()

const allocationId = ref('')
const applyInfo = ref<any>({})
const resourceList = ref<any[]>([])
const auditList = ref<any[]>([])

const { send: loadApplyInfo, loading: loadingApply } = useRequest(
  (params: { page: number, row: number, allocationId: string }) =>
    listAllocationStorehouseApplys(params),
  { immediate: false },
).onSuccess((event) => {
  const response = event.data
  const list = response?.list || []
  if (list.length > 0) {
    applyInfo.value = list[0]
    // 模拟加载审核流程
    auditList.value = [
      {
        startTime: applyInfo.value.createTime,
        userName: applyInfo.value.createUserName,
        context: '提交申请',
        endTime: applyInfo.value.createTime,
      },
    ]
  }
}).onError((error) => {
  console.error('加载调拨申请信息失败:', error)
})

const { send: loadResourceList, loading: loadingResource } = useRequest(
  (params: { page: number, row: number, allocationId: string }) =>
    listAllocationStorehouses(params),
  { immediate: false },
).onSuccess((event) => {
  const response = event.data
  resourceList.value = response?.list || []
}).onError((error) => {
  console.error('加载调拨商品列表失败:', error)
})

onLoad((options) => {
  allocationId.value = options?.allocationId || ''
  if (allocationId.value) {
    loadApplyInfo({
      page: 1,
      row: 10,
      allocationId: allocationId.value,
    })
    loadResourceList({
      page: 1,
      row: 10,
      allocationId: allocationId.value,
    })
  }
})

const loading = computed(() => loadingApply.value || loadingResource.value)
</script>

<template>
  <view class="page-container">
    <wd-loading v-if="loading" />
    <view v-else>
      <!-- 基本信息 -->
      <wd-cell-group title="基本信息" border>
        <wd-cell title="申请人" :value="applyInfo.startUserName || applyInfo.createUserName || '-'" />
        <wd-cell title="申请时间" :value="applyInfo.createTime || '-'" />
        <wd-cell title="审批状态" :value="applyInfo.stateName || '-'" />
        <wd-cell title="说明" :value="applyInfo.remark || '-'" />
      </wd-cell-group>

      <!-- 商品列表 -->
      <view class="resource-section">
        <view class="section-title">
          商品
        </view>
        <view class="resource-header">
          <text class="header-cell">商品</text>
          <text class="header-cell">数量</text>
          <text class="header-cell">源仓库</text>
          <text class="header-cell">目标仓库</text>
        </view>
        <view v-for="(item, index) in resourceList" :key="index" class="resource-item">
          <text class="resource-cell">{{ item.resName }}</text>
          <text class="resource-cell">{{ item.stock || 0 }}{{ item.unitCodeName || '个' }}</text>
          <text class="resource-cell">{{ item.shaName || '-' }}</text>
          <text class="resource-cell">{{ item.shzName || '-' }}</text>
        </view>
      </view>

      <!-- 审核流程 -->
      <wd-cell-group title="审核流程" border>
        <view v-for="(item, index) in auditList" :key="index" class="audit-item">
          <view class="audit-time">
            {{ item.startTime || '' }} 到达 {{ item.userName || item.auditName }} 工位
          </view>
          <view v-if="item.endTime" class="audit-end">
            处理完成
          </view>
          <view v-if="item.endTime" class="audit-context">
            处理意见：{{ item.context }}
          </view>
        </view>
      </wd-cell-group>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.resource-section {
  background-color: #fff;
  margin-top: 20rpx;
  padding: 20rpx;
}

.section-title {
  font-weight: 500;
  font-size: 28rpx;
  margin-bottom: 20rpx;
  color: #333;
}

.resource-header {
  display: flex;
  padding: 16rpx 0;
  background-color: #f5f5f5;
  border-radius: 8rpx;
}

.header-cell {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
  font-weight: 500;
  color: #666;
}

.resource-item {
  display: flex;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #eee;
  font-size: 24rpx;
  color: #666;

  &:last-child {
    border-bottom: none;
  }
}

.resource-cell {
  flex: 1;
  text-align: center;
}

.audit-item {
  padding: 16rpx 0;
  border-bottom: 1rpx solid #eee;

  &:last-child {
    border-bottom: none;
  }
}

.audit-time {
  font-size: 26rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.audit-end {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.audit-context {
  font-size: 24rpx;
  color: #999;
}
</style>
