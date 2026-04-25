<!--
  抄表页
  功能：查询抄表记录，支持按房屋编号筛选并进入新增抄表

  访问地址: http://localhost:3000/#/pages-sub/meter/reading

  旧代码：gitee-example/pages/meter/meterReading.vue
-->
<script setup lang="ts">
import type { MeterReading } from '@/types/meter'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { listMeterWaters } from '@/api/meter'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '抄表',
  },
})

type ZPagingRef = any

const communityInfo = getCurrentCommunity()
const pagingRef = ref<ZPagingRef>()
const meterReads = ref<MeterReading[]>([])
const roomNum = ref('')

const { send: loadMeters } = useRequest(
  (params: { page: number, row: number }) =>
    listMeterWaters({
      page: params.page,
      row: params.row,
      communityId: communityInfo.communityId,
      roomNum: roomNum.value.trim() || undefined,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('查询抄表记录失败', error)
    pagingRef.value?.complete(false)
  })

function handleQuery(pageNo: number, pageSize: number) {
  loadMeters({ page: pageNo, row: pageSize })
}

function handleSearch() {
  pagingRef.value?.reload()
}

function gotoAddMeter() {
  uni.navigateTo({
    url: '/pages-sub/meter/add-meter',
  })
}

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <view class="search-wrap">
      <wd-input
        v-model="roomNum"
        placeholder="请填写房屋编号，如 1-1-101"
        clearable
      />
      <wd-button type="primary" custom-class="ml-10rpx" @click="handleSearch">
        搜索
      </wd-button>
      <wd-button type="success" custom-class="ml-10rpx" @click="gotoAddMeter">
        开始抄表
      </wd-button>
    </view>

    <z-paging ref="pagingRef" v-model="meterReads" @query="handleQuery">
      <template #loading>
        <ZPagingLoading
          icon="chart-line-data"
          icon-class="i-carbon-chart-line-data text-blue-500 animate-pulse"
          primary-text="正在加载抄表记录..."
          secondary-text="请稍候片刻"
        />
      </template>

      <view class="list-wrap">
        <view v-for="item in meterReads" :key="item.readingId" class="card">
          <view class="row">
            <text class="label">房屋</text>
            <text class="value">{{ item.objName }}</text>
          </view>
          <view class="row">
            <text class="label">本期读数</text>
            <text class="value">{{ item.curDegrees }}</text>
          </view>
          <view class="row">
            <text class="label">抄表时间</text>
            <text class="value">{{ item.curReadingTime }}</text>
          </view>
          <view class="row">
            <text class="label">类型</text>
            <text class="value">{{ item.meterTypeName }}</text>
          </view>
        </view>
      </view>

      <template #empty>
        <wd-status-tip image="content" tip="暂无抄表记录" />
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

.search-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
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
