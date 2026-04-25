<!--
  采购申请详情
  功能：显示采购申请详细信息

  访问地址: http://localhost:3000/#/pages-sub/resource/purchase-apply-detail
  建议携带参数: ?applyOrderId=xxx&resOrderType=xxx

  旧代码：gitee-example/pages/resource/purchaseApplyDetail.vue
-->

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { queryPurchaseApplyList } from '@/api/resource'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '采购详情',
    enablePullDownRefresh: false,
  },
})

const communityInfo = getCurrentCommunity()

const applyInfo = ref<any>({})
const resourceList = ref<any[]>([])
const auditList = ref<any[]>([])

const { send: loadDetail, loading } = useRequest(
  (params: { page: number, row: number, applyOrderId: string, resOrderType: string }) =>
    queryPurchaseApplyList(params),
  { immediate: false },
).onSuccess((event) => {
  const response = event.data
  const info = response?.list?.[0]
  if (info) {
    applyInfo.value = info
    resourceList.value = info.purchaseApplyDetailVo || []
    // 模拟加载审核流程
    auditList.value = [
      {
        auditTime: info.createTime,
        userName: info.createUserName,
        context: '提交申请',
        endTime: info.createTime,
      },
    ]
  }
}).onError((error) => {
  console.error('加载采购申请详情失败:', error)
})

onLoad((options) => {
  const apply = options?.apply
  if (apply) {
    const applyData = JSON.parse(apply)
    loadDetail({
      page: 1,
      row: 10,
      applyOrderId: applyData.applyOrderId,
      resOrderType: applyData.resOrderType || '10000',
    })
  }
})

function formatStateName(state: number) {
  const stateMap: Record<number, string> = {
    1000: '待审核',
    1200: '审核中',
    1300: '审核通过',
    1400: '已拒绝',
  }
  return stateMap[state] || '未知'
}

function formatWarehousingWay(way: number) {
  if (applyInfo.value.resOrderType === '10000') {
    return way === 10000 ? '直接入库' : '采购入库'
  }
  return way === 10000 ? '直接出库' : '审核出库'
}
</script>

<template>
  <view class="page-container">
    <wd-loading v-if="loading" />
    <view v-else>
      <!-- 基本信息 -->
      <wd-cell-group title="基本信息" border>
        <wd-cell title="申请ID" :value="applyInfo.applyOrderId || '-'" />
        <wd-cell title="申请人" :value="applyInfo.userName || '-'" />
        <wd-cell title="使用人" :value="applyInfo.endUserName || '-'" />
        <wd-cell title="联系方式" :value="applyInfo.endUserTel || '-'" />
        <wd-cell title="申请时间" :value="applyInfo.createTime || '-'" />
        <wd-cell
          v-if="applyInfo.resOrderType === '10000' && applyInfo.warehousingWay !== 10000"
          title="参考总价格"
          :value="`¥${applyInfo.totalPrice || 0}`"
        />
        <wd-cell title="审批状态" :value="applyInfo.stateName || '-'" />
        <wd-cell
          title="入库方式"
          :value="formatWarehousingWay(applyInfo.warehousingWay)"
        />
        <wd-cell
          v-if="applyInfo.resOrderType === '10000'"
          title="采购总价格"
          :value="applyInfo.purchaseTotalPrice > 0 ? `¥${applyInfo.purchaseTotalPrice}` : '-'"
        />
        <wd-cell title="说明" :value="applyInfo.description || '-'" />
      </wd-cell-group>

      <!-- 商品列表 -->
      <view class="resource-section">
        <view class="section-title">
          商品
        </view>
        <view class="resource-header">
          <text class="header-cell">商品</text>
          <text class="header-cell">参考价格</text>
          <text class="header-cell">申请数量</text>
          <text v-if="applyInfo.resOrderType === '10000'" class="header-cell">采购价格</text>
          <text class="header-cell">{{ applyInfo.resOrderType === '10000' ? '采购数量' : '领用数量' }}</text>
        </view>
        <view v-for="(item, index) in resourceList" :key="index" class="resource-item">
          <text class="resource-cell">{{ item.resName }}</text>
          <text class="resource-cell">¥{{ item.price }}/{{ item.unitCodeName || '个' }}</text>
          <text class="resource-cell">{{ item.quantity }}{{ item.unitCodeName || '个' }}</text>
          <text v-if="applyInfo.resOrderType === '10000'" class="resource-cell">
            {{ item.purchasePrice ? `¥${item.purchasePrice}` : '-' }}
          </text>
          <text class="resource-cell">
            {{ item.purchaseQuantity ? `${item.purchaseQuantity}${item.unitCodeName || '个'}` : '-' }}
          </text>
        </view>
      </view>

      <!-- 审核流程 -->
      <wd-cell-group v-if="applyInfo.warehousingWay !== 10000" title="审核流程" border>
        <view v-for="(item, index) in auditList" :key="index" class="audit-item">
          <view class="audit-time">
            {{ item.auditTime || '' }} 到达 {{ item.userName || item.auditName }} 工位
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
