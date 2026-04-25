<!--
  视频列表页
  功能：按监控区域和设备名称筛选视频设备，进入播放页

  访问地址: http://localhost:3000/#/pages-sub/video/list

  旧代码：gitee-example/pages/video/videoList.vue
-->
<script setup lang="ts">
import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'
import type { MonitorArea, MonitorMachine } from '@/types/video'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { listMonitorArea, listStaffMonitorMachine } from '@/api/video'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '视频列表',
  },
})

type ZPagingRef = any

const communityInfo = getCurrentCommunity()
const pagingRef = ref<ZPagingRef>()
const machines = ref<MonitorMachine[]>([])

const areaId = ref('')
const machineNameLike = ref('')
const areas = ref<MonitorArea[]>([])
const areaColumns = ref<ColumnItem[]>([])

const { send: loadAreas } = useRequest(
  () => listMonitorArea({ page: 1, row: 100, communityId: communityInfo.communityId }),
  { immediate: false },
)
  .onSuccess((event) => {
    areas.value = event.data?.list || []
    areaColumns.value = areas.value.map(item => ({
      label: item.maName,
      value: item.maId,
    }))
  })
  .onError((error) => {
    console.error('加载监控区域失败', error)
  })

const { send: loadMachines } = useRequest(
  (params: { page: number, row: number }) =>
    listStaffMonitorMachine({
      page: params.page,
      row: params.row,
      communityId: communityInfo.communityId,
      maId: areaId.value || undefined,
      machineNameLike: machineNameLike.value.trim() || undefined,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('加载监控设备失败', error)
    pagingRef.value?.complete(false)
  })

function handleQuery(pageNo: number, pageSize: number) {
  loadMachines({
    page: pageNo,
    row: pageSize,
  })
}

function handleSearch() {
  pagingRef.value?.reload()
}

function handleAreaConfirm(event: { value: string }) {
  areaId.value = event.value
}

function openPlay(item: MonitorMachine) {
  uni.navigateTo({
    url: `/pages-sub/video/play?communityId=${item.communityId}&machineId=${item.machineId}&machineName=${encodeURIComponent(item.machineName)}`,
  })
}

onLoad(() => {
  loadAreas()
})

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <wd-cell-group border>
      <wd-picker
        v-model="areaId"
        label="监控区域"
        label-width="88px"
        :columns="areaColumns"
        @confirm="handleAreaConfirm"
      />
      <wd-input
        v-model="machineNameLike"
        label="设备名称"
        label-width="88px"
        placeholder="请输入设备名称"
        clearable
      />
    </wd-cell-group>

    <view class="search-btn-wrap">
      <wd-button block type="primary" @click="handleSearch">
        搜索
      </wd-button>
    </view>

    <z-paging ref="pagingRef" v-model="machines" @query="handleQuery">
      <template #loading>
        <ZPagingLoading
          icon="video"
          icon-class="i-carbon-video text-blue-500 animate-pulse"
          primary-text="正在加载视频设备..."
          secondary-text="请稍候"
        />
      </template>

      <view class="grid-list">
        <view
          v-for="item in machines"
          :key="item.machineId"
          class="machine-card"
          @click="openPlay(item)"
        >
          <image class="thumb" :src="item.photoUrl || '/static/image/noPhoto.jpg'" mode="aspectFill" />
          <view class="meta">
            <text class="name">{{ item.machineName }}</text>
            <text class="area">{{ item.maName }}</text>
          </view>
        </view>
      </view>

      <template #empty>
        <wd-status-tip image="content" tip="暂无监控设备" />
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

.search-btn-wrap {
  margin-top: 16rpx;
  margin-bottom: 20rpx;
}

.grid-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8rpx;
  padding-bottom: 20rpx;
}

.machine-card {
  width: calc(50% - 16rpx);
  margin: 0 8rpx 16rpx;
  border-radius: 14rpx;
  overflow: hidden;
  background: #fff;
}

.thumb {
  width: 100%;
  height: 180rpx;
  background: #e5e7eb;
}

.meta {
  padding: 14rpx;
}

.name {
  display: block;
  font-size: 26rpx;
  color: #111827;
  font-weight: 600;
}

.area {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: #6b7280;
}
</style>
