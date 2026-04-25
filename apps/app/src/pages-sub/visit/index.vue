<!--
  访客管理页
  功能：查看访客列表，支持全部/待审核筛选并进入详情审核

  访问地址: http://localhost:3000/#/pages-sub/visit/index

  旧代码：gitee-example/pages/visit/visit.vue
-->
<script setup lang="ts">
import type { VisitRecord } from '@/types/visit'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getVisit } from '@/api/visit'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'

definePage({
  style: {
    navigationBarTitleText: '访客管理',
  },
})

type ZPagingRef = any

const active = ref(0)
const pagingRef = ref<ZPagingRef>()
const visits = ref<VisitRecord[]>([])

const { send: loadVisits } = useRequest(
  (params: { page: number, row: number }) =>
    getVisit({
      page: params.page,
      row: params.row,
      communityId: 'COMM_001',
      state: active.value === 1 ? '0' : undefined,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('加载访客列表失败', error)
    pagingRef.value?.complete(false)
  })

function handleTabChange(e: { index: number }) {
  active.value = e.index
  pagingRef.value?.reload()
}

function handleQuery(pageNo: number, pageSize: number) {
  loadVisits({
    page: pageNo,
    row: pageSize,
  })
}

function openDetail(item: VisitRecord) {
  uni.navigateTo({
    url: `/pages-sub/visit/detail?visitId=${item.visitId}&taskId=${item.taskId || ''}`,
  })
}

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <wd-tabs :value="active" @change="handleTabChange">
      <wd-tab title="全部" />
      <wd-tab title="待审核" />
    </wd-tabs>

    <z-paging ref="pagingRef" v-model="visits" @query="handleQuery">
      <template #loading>
        <ZPagingLoading
          icon="user-multiple"
          icon-class="i-carbon-user-multiple text-blue-500 animate-pulse"
          primary-text="正在加载访客记录..."
          secondary-text="请稍候"
        />
      </template>

      <view class="list-wrap">
        <view v-for="item in visits" :key="item.visitId" class="visit-card" @click="openDetail(item)">
          <view class="visit-head">
            <text class="title">{{ item.name }} 访问 {{ item.ownerName }}</text>
            <wd-icon name="" custom-class="i-carbon-chevron-right text-gray-400 text-28rpx" />
          </view>
          <view class="visit-row">
            <text class="label">访问时间</text>
            <text class="value">{{ item.visitTime }}</text>
          </view>
          <view class="visit-row">
            <text class="label">状态</text>
            <text class="value">{{ item.stateName }}</text>
          </view>
        </view>
      </view>

      <template #empty>
        <wd-status-tip image="content" tip="暂无访客记录" />
      </template>
    </z-paging>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

.list-wrap {
  padding: 20rpx;
}

.visit-card {
  margin-bottom: 14rpx;
  border-radius: 12rpx;
  background: #fff;
  padding: 20rpx;
}

.visit-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 28rpx;
  color: #111827;
  font-weight: 600;
}

.visit-row {
  margin-top: 10rpx;
  display: flex;
  justify-content: space-between;
}

.label {
  font-size: 24rpx;
  color: #6b7280;
}

.value {
  font-size: 24rpx;
  color: #111827;
}
</style>
