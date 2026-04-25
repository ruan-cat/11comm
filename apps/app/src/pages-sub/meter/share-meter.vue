<!--
  共享水表页
  功能：查看公摊抄表记录与公摊表列表，支持新增抄表和审核

  访问地址: http://localhost:3000/#/pages-sub/meter/share-meter

  旧代码：gitee-example/pages/meter/shareMeter.vue
-->
<script setup lang="ts">
import type { FloorShareMeter, FloorShareReading } from '@/types/meter'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { listFloorShareMeters, listFloorShareReadings } from '@/api/meter'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '共享水表',
  },
})

type ZPagingRef = any

const communityInfo = getCurrentCommunity()
const activeTab = ref<'reading' | 'meter'>('reading')

const readingPagingRef = ref<ZPagingRef>()
const meterPagingRef = ref<ZPagingRef>()

const readings = ref<FloorShareReading[]>([])
const meters = ref<FloorShareMeter[]>([])

const { send: loadReadings } = useRequest(
  (params: { page: number, row: number }) =>
    listFloorShareReadings({
      page: params.page,
      row: params.row,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    readingPagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('加载公摊抄表记录失败:', error)
    readingPagingRef.value?.complete(false)
  })

const { send: loadMeters } = useRequest(
  (params: { page: number, row: number }) =>
    listFloorShareMeters({
      page: params.page,
      row: params.row,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    meterPagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('加载公摊表失败:', error)
    meterPagingRef.value?.complete(false)
  })

function handleReadingsQuery(pageNo: number, pageSize: number) {
  loadReadings({ page: pageNo, row: pageSize })
}

function handleMetersQuery(pageNo: number, pageSize: number) {
  loadMeters({ page: pageNo, row: pageSize })
}

function switchTab(tab: 'reading' | 'meter') {
  activeTab.value = tab
}

function gotoAddShareReading(fsmId: string) {
  uni.navigateTo({
    url: `/pages-sub/meter/add-share-reading?fsmId=${fsmId}`,
  })
}

function gotoAuditShareReading(readingId: string) {
  uni.navigateTo({
    url: `/pages-sub/meter/audit-share-reading?readingId=${readingId}`,
  })
}

onMounted(() => {
  readingPagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <view class="tab-wrap">
      <wd-button
        :type="activeTab === 'reading' ? 'primary' : 'default'"
        size="small"
        @click="switchTab('reading')"
      >
        公摊抄表
      </wd-button>
      <wd-button
        :type="activeTab === 'meter' ? 'primary' : 'default'"
        custom-class="ml-10rpx"
        size="small"
        @click="switchTab('meter')"
      >
        公摊表
      </wd-button>
    </view>

    <z-paging
      v-if="activeTab === 'reading'"
      ref="readingPagingRef"
      v-model="readings"
      @query="handleReadingsQuery"
    >
      <template #loading>
        <ZPagingLoading
          icon="list"
          icon-class="i-carbon-list text-blue-500 animate-pulse"
          primary-text="正在加载公摊抄表记录..."
          secondary-text="请稍候片刻"
        />
      </template>

      <view class="list-wrap">
        <view v-for="item in readings" :key="item.readingId" class="card">
          <view class="row">
            <text class="label">楼栋</text>
            <text class="value">{{ item.floorNum }}栋 / {{ item.meterTypeName }}</text>
          </view>
          <view class="row">
            <text class="label">上期度数</text>
            <text class="value">{{ item.preDegrees }}</text>
          </view>
          <view class="row">
            <text class="label">本期度数</text>
            <text class="value">{{ item.curDegrees }}</text>
          </view>
          <view class="row">
            <text class="label">状态</text>
            <text class="value">{{ item.stateName }}</text>
          </view>
          <view class="row action-row">
            <text class="label">抄表时间</text>
            <text class="value">{{ item.curReadingTime }}</text>
          </view>
          <view v-if="item.state === 'W'" class="action-wrap">
            <wd-button size="small" type="warning" @click="gotoAuditShareReading(item.readingId)">
              去审核
            </wd-button>
          </view>
        </view>
      </view>

      <template #empty>
        <wd-status-tip image="content" tip="暂无公摊抄表记录" />
      </template>
    </z-paging>

    <z-paging
      v-if="activeTab === 'meter'"
      ref="meterPagingRef"
      v-model="meters"
      @query="handleMetersQuery"
    >
      <template #loading>
        <ZPagingLoading
          icon="meter"
          icon-class="i-carbon-meter text-green-500 animate-pulse"
          primary-text="正在加载公摊表..."
          secondary-text="请稍候片刻"
        />
      </template>

      <view class="list-wrap">
        <view v-for="item in meters" :key="item.fsmId" class="card">
          <view class="row">
            <text class="label">公摊表</text>
            <text class="value">{{ item.floorNum }}栋 - {{ item.meterTypeName }}</text>
          </view>
          <view class="row">
            <text class="label">表编号</text>
            <text class="value">{{ item.meterNum }}</text>
          </view>
          <view class="row">
            <text class="label">当前度数</text>
            <text class="value">{{ item.curDegree }}</text>
          </view>
          <view class="row">
            <text class="label">最近抄表</text>
            <text class="value">{{ item.curReadingTime }}</text>
          </view>
          <view class="action-wrap">
            <wd-button size="small" type="primary" @click="gotoAddShareReading(item.fsmId)">
              新增抄表
            </wd-button>
          </view>
        </view>
      </view>

      <template #empty>
        <wd-status-tip image="content" tip="暂无公摊表" />
      </template>
    </z-paging>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.tab-wrap {
  margin-bottom: 18rpx;
  display: flex;
}

.list-wrap {
  padding-bottom: 20rpx;
}

.card {
  margin-bottom: 14rpx;
  border-radius: 12rpx;
  background: #fff;
  padding: 20rpx;
}

.row {
  margin-top: 8rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-row {
  padding-bottom: 8rpx;
  border-bottom: 1rpx solid #f3f4f6;
}

.label {
  font-size: 24rpx;
  color: #6b7280;
}

.value {
  font-size: 24rpx;
  color: #111827;
}

.action-wrap {
  margin-top: 12rpx;
  display: flex;
  justify-content: flex-end;
}
</style>
