<!--
  开门记录页面
  功能：查询开门记录列表

  访问地址: http://localhost:3000/#/pages-sub/report/open-door-log
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/report/open-door-log?communityId=COMM_001

  旧代码：gitee-example/pages/report/openDoorLog.vue
-->

<script setup lang="ts">
import { useRequest } from 'alova/client'
import { onMounted, reactive, ref } from 'vue'
import { getOpenDoorLogList } from '@/api/fee'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '开门记录',
    enablePullDownRefresh: false,
  },
})

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

/** 搜索表单 */
const searchForm = reactive({
  startDate: '',
  endDate: '',
})

/** 开门记录列表 */
const openDoorLogs = ref<
  Array<{
    logId: string
    roomId: string
    roomName: string
    ownerName: string
    openType: string
    openTypeName: string
    openTime: string
    remark: string
  }>
>([])

/** z-paging 引用 */
const pagingRef = ref()

/** 加载开门记录 */
const { send: loadLogs, loading: logsLoading } = useRequest(
  (page: number, pageSize: number) =>
    getOpenDoorLogList({
      page,
      row: pageSize,
      communityId: communityInfo.communityId,
      startDate: searchForm.startDate,
      endDate: searchForm.endDate,
    }),
  { immediate: false },
).onSuccess((event) => {
  const list = event.data.list || []
  openDoorLogs.value = list
  pagingRef.value?.complete(list)
}).onError(() => {
  toast.warning('加载开门记录失败')
  pagingRef.value?.complete(false)
})

/** 搜索并重新加载（搜索按钮点击） */
function handleSearch() {
  pagingRef.value?.reload()
}

/** z-paging 查询回调 */
function handleQuery(pageNo: number, pageSize: number) {
  loadLogs(pageNo, pageSize)
}

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="open-door-log-page">
    <!-- 搜索栏 -->
    <view class="search-bar bg-white p-3">
      <view class="form-grid">
        <view class="form-grid__item search-item">
          <wd-datetime-picker v-model="searchForm.startDate" type="date" placeholder="开始日期" />
        </view>
        <view class="form-grid__item search-item">
          <wd-datetime-picker v-model="searchForm.endDate" type="date" placeholder="结束日期" />
        </view>
      </view>
      <view class="mt-3">
        <wd-button type="primary" size="large" block @click="handleSearch">
          搜索
        </wd-button>
      </view>
    </view>

    <!-- 列表 -->
    <z-paging ref="pagingRef" v-model="openDoorLogs" @query="handleQuery">
      <template #loading>
        <z-paging-loading
          icon="time"
          icon-class="i-carbon-time text-cyan-400 animate-pulse"
          primary-text="正在加载开门记录..."
          secondary-text="请稍候片刻"
        />
      </template>

      <view class="p-3">
        <view v-for="(item, index) in openDoorLogs" :key="index" class="log-card mb-3 rounded-lg bg-white p-3">
          <view class="flex items-center justify-between border-b border-gray-200 pb-2">
            <text class="font-medium">{{ item.roomName }}</text>
            <text class="text-sm text-gray-500">{{ item.openTime }}</text>
          </view>
          <view class="detail-grid mt-2 text-sm">
            <view class="detail-grid__item text-gray-500">
              业主: {{ item.ownerName }}
            </view>
            <view class="detail-grid__item text-gray-500">
              开门方式: {{ item.openTypeName }}
            </view>
            <view v-if="item.remark" class="detail-grid__item detail-grid__item--full text-gray-500">
              备注: {{ item.remark }}
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<style scoped>
.form-grid,
.detail-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -8rpx;
}

.form-grid__item,
.detail-grid__item {
  box-sizing: border-box;
  width: 50%;
  padding: 8rpx;
}

.detail-grid__item--full {
  width: 100%;
}

.search-item {
  background-color: #f1f1f1;
  border-radius: 8rpx;
  padding: 10rpx 20rpx;
}
.log-card {
  background-color: #fff;
}
</style>
