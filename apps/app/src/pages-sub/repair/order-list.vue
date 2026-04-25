<!--
  维修工单池
  功能：显示维修工单列表，支持搜索和筛选
  列表页

  访问地址: http://localhost:3000/#/pages-sub/repair/order-list
  建议携带参数: ?statusCd=10001&page=1&row=10

  完整示例: http://localhost:3000/#/pages-sub/repair/order-list?statusCd=10001&page=1&row=10

  旧代码： gitee-example/pages/repairOrder/repairOrder.vue
-->

<!-- 基本完成检查审核 -->

<script setup lang="ts">
import type { RepairOrder } from '@/types/repair'
import type { PageParams } from '@/types/routes'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getRepairOrderList, robRepairOrder } from '@/api/repair'
import RepairListItem from '@/components/common/repair-list-item/index.vue'
import RepairListSearchBar from '@/components/common/repair-list-search-bar/index.vue'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { getCurrentCommunity, getUserInfo } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '维修工单池',
    enablePullDownRefresh: false,
  },
})

const toast = useGlobalToast()

/** 搜索条件 */
const searchName = ref('')
const selectedState = ref<string>('')

/** 从 URL 参数初始化筛选条件 */
onLoad((options: PageParams['/pages-sub/repair/order-list']) => {
  // 从 URL 参数读取状态筛选条件
  if (options?.statusCd) {
    selectedState.value = options.statusCd
    console.log('从 URL 参数初始化状态筛选:', options.statusCd)
  }

  // 从 URL 参数读取搜索关键词
  if (options?.repairName) {
    searchName.value = options.repairName
    console.log('从 URL 参数初始化搜索关键词:', options.repairName)
  }
})

/** 列表数据（由 z-paging 接管） */
const repairList = ref<RepairOrder[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
const pagingRef = ref()

/** 获取用户信息 */
const userInfo = getUserInfo()
const communityInfo = getCurrentCommunity()

/** 查询维修工单列表请求（z-paging 集成） */
const { send: loadRepairOrderList } = useRequest(
  (params: { page: number, row: number, statusCd?: string }) =>
    getRepairOrderList({
      ...params,
      storeId: userInfo.storeId || '',
      userId: userInfo.userId || '',
      communityId: communityInfo.communityId || '',
      repairName: searchName.value,
      reqSource: 'mobile',
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const response = event.data
    total.value = response?.total || 0
    pagingRef.value?.complete(response?.ownerRepairs || [])
  })
  .onError((error) => {
    console.error('加载列表失败:', error)
    pagingRef.value?.complete(false)
  })

/** z-paging 查询回调 */
function handleQuery(pageNo: number, pageSizeValue: number) {
  currentPage.value = pageNo
  pageSize.value = pageSizeValue

  loadRepairOrderList({
    page: pageNo,
    row: pageSizeValue,
    statusCd: selectedState.value,
  })
}

// 进入页面自动触发首次加载
onMounted(() => {
  pagingRef.value?.reload()
})

/** 搜索 */
function handleSearch() {
  // 重置到第一页并刷新
  pagingRef.value?.reload()
}

/** 查看详情 */
function handleViewDetail(item: RepairOrder) {
  TypedRouter.toRepairDetail(item.repairId!, userInfo.storeId)
}

/** 派单 */
function handleDispatch(item: RepairOrder) {
  TypedRouter.toRepairHandle({
    action: 'DISPATCH',
    repairId: item.repairId!,
    repairType: item.repairType || '',
    preStaffId: item.preStaffId,
    preStaffName: item.preStaffName,
    repairObjType: item.repairObjType,
  })
}

/** 结束工单 */
function handleEndRepair(item: RepairOrder) {
  TypedRouter.toEndRepair(item.repairId!, item.communityId)
}

/** 抢单 */
const { send: robOrder } = useRequest(
  (params: { repairId: string, staffId: string, staffName: string, communityId: string }) => robRepairOrder(params),
  { immediate: false },
)
  .onSuccess(() => {
    uni.hideLoading()
    toast.success('抢单成功')

    // 延迟刷新列表
    setTimeout(() => {
      pagingRef.value?.reload()
    }, 1500)
  })
  .onError((error) => {
    uni.hideLoading()
    console.error('抢单失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

async function handleRobOrder(item: RepairOrder) {
  uni.showLoading({ title: '请稍候...' })

  await robOrder({
    repairId: item.repairId!,
    staffId: userInfo.userId || '',
    staffName: userInfo.userName || '',
    communityId: communityInfo.communityId || '',
  })
}

/** 检查权限 */
function checkAuth(privilegeId: string): boolean {
  // TODO: 实现权限检查逻辑
  // 暂时返回 true，后续接入实际权限系统
  return true
}

// ==================== 按钮显示状态判断 ====================

/** 是否显示派单按钮（待派单状态） */
function canDispatch(item: RepairOrder): boolean {
  return item.statusCd === '10001' && checkAuth('502019101946430010')
}

/** 是否显示结束按钮（未完成且未关闭） */
function canEnd(item: RepairOrder): boolean {
  return item.statusCd !== '10004' && item.statusCd !== '10005' && checkAuth('502019101946430010')
}

/** 是否显示抢单按钮（抢单模式且待派单） */
function canRob(item: RepairOrder): boolean {
  return item.repairWay === '100' && item.statusCd === '10001' && checkAuth('502021012099350016')
}
</script>

<template>
  <view class="repair-order-list-page">
    <z-paging
      ref="pagingRef"
      v-model="repairList"
      :default-page-size="pageSize"
      @query="handleQuery"
    >
      <!-- 顶部吸顶工具栏 -->
      <template #top>
        <repair-list-search-bar
          v-model="searchName"
          v-model:selected-state="selectedState"
          :total="total"
          @search="handleSearch"
          @clear="handleSearch"
          @state-change="handleSearch"
        />
      </template>

      <!-- 列表内容 -->
      <view class="repair-list">
        <repair-list-item
          v-for="item in repairList"
          :key="item.repairId"
          :item="item"
        >
          <template #action>
            <wd-button size="small" plain @click="handleViewDetail(item)">
              详情
            </wd-button>
            <wd-button
              v-if="canDispatch(item)"
              size="small"
              type="warning"
              @click="handleDispatch(item)"
            >
              派单
            </wd-button>
            <wd-button
              v-if="canEnd(item)"
              size="small"
              type="error"
              @click="handleEndRepair(item)"
            >
              结束
            </wd-button>
            <wd-button
              v-if="canRob(item)"
              size="small"
              type="warning"
              @click="handleRobOrder(item)"
            >
              抢单
            </wd-button>
          </template>
        </repair-list-item>
      </view>

      <!-- 空状态 -->
      <template #empty>
        <view class="empty-wrap">
          <wd-status-tip image="search" tip="暂无维修工单" />
        </view>
      </template>

      <!-- 加载状态 -->
      <template #loading>
        <ZPagingLoading
          icon="document"
          icon-class="i-carbon-document text-orange-400 animate-pulse"
          primary-text="正在加载工单列表..."
          secondary-text="请稍候片刻"
        />
      </template>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.repair-order-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.repair-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.empty-wrap,
.loading-wrap {
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
