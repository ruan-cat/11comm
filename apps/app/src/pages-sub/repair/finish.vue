<!--
  维修已办单
  功能：显示已完成的维修工单列表，支持搜索和筛选
  列表页

  访问地址: http://localhost:3000/#/pages-sub/repair/finish
  建议携带参数: ?page=1&row=10

  完整示例: http://localhost:3000/#/pages-sub/repair/finish?page=1&row=10

  旧代码：gitee-example/pages/repairDispatchFinish/repairDispatchFinish.vue
-->

<!-- 基本完成检查审核 -->

<script setup lang="ts">
import type { RepairOrder } from '@/types/repair'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getRepairFinishList } from '@/api/repair'
import RepairListItem from '@/components/common/repair-list-item/index.vue'
import RepairListSearchBar from '@/components/common/repair-list-search-bar/index.vue'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { TypedRouter } from '@/router'
import { getCurrentCommunity, getUserInfo } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '维修已办单',
    enablePullDownRefresh: false,
  },
})

/** 搜索条件 */
const searchName = ref('')

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
const { send: loadRepairFinishList } = useRequest(
  (params: { page: number, row: number, statusCd?: string }) =>
    getRepairFinishList({
      ...params,
      userId: userInfo.userId || '',
      communityId: communityInfo.communityId || '',
      repairName: searchName.value,
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

  loadRepairFinishList({
    page: pageNo,
    row: pageSizeValue,
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
</script>

<template>
  <view class="repair-finish-page">
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
          :total="total"
          :is-use-state-options="false"
          @search="handleSearch"
          @clear="handleSearch"
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
          </template>
        </repair-list-item>
      </view>

      <!-- 空状态 -->
      <template #empty>
        <view class="empty-wrap">
          <wd-status-tip image="search" tip="暂无已办工单" />
        </view>
      </template>

      <!-- 加载状态 -->
      <template #loading>
        <ZPagingLoading
          icon="document"
          icon-class="i-carbon-document text-orange-400 animate-pulse"
          primary-text="正在加载已办工单..."
          secondary-text="请稍候片刻"
        />
      </template>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.repair-finish-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.repair-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.empty-wrap {
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
