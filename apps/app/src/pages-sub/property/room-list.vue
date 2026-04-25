<!--
  房间列表页
  功能：显示房间列表，支持按房间号搜索并进入详情

  访问地址: http://localhost:3000/#/pages-sub/property/room-list
  建议携带参数: ?floorId=xxx&unitId=xxx

  旧代码：gitee-example/pages/roomList/roomList.vue
-->
<script setup lang="ts">
import type { Room } from '@/types/selector'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getRoomList } from '@/api/room'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '房间列表',
  },
})

const communityInfo = getCurrentCommunity()
const floorId = ref('')
const unitId = ref('')
const roomNum = ref('')
const roomList = ref<Room[]>([])
const pagingRef = ref()

const { send: queryRooms } = useRequest(
  (params: { page: number, row: number }) =>
    getRoomList({
      page: params.page,
      row: params.row,
      communityId: communityInfo.communityId,
      floorId: floorId.value,
      unitId: unitId.value,
      roomNum: roomNum.value || undefined,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('查询房间失败', error)
    pagingRef.value?.complete(false)
  })

function handleQuery(pageNo: number, pageSize: number) {
  queryRooms({
    page: pageNo,
    row: pageSize,
  })
}

function handleSearch() {
  pagingRef.value?.reload()
}

function openDetail(item: Room) {
  uni.navigateTo({
    url: `/pages-sub/property/room-detail?roomId=${item.roomId}`,
  })
}

onLoad((options) => {
  floorId.value = options?.floorId || ''
  unitId.value = options?.unitId || ''
})

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <view class="search-bar">
      <wd-search
        v-model="roomNum"
        placeholder="请输入房间号"
        @search="handleSearch"
        @clear="handleSearch"
      />
    </view>

    <z-paging
      ref="pagingRef"
      v-model="roomList"
      @query="handleQuery"
    >
      <template #loading>
        <ZPagingLoading
          icon="home"
          icon-class="i-carbon-home text-blue-500 animate-pulse"
          primary-text="正在加载房间列表..."
          secondary-text="请稍候"
        />
      </template>

      <wd-cell-group v-if="roomList.length > 0" border>
        <wd-cell
          v-for="item in roomList"
          :key="item.roomId"
          :title="`${item.roomNum}室`"
          :label="`楼栋:${item.floorId} 单元:${item.unitId}`"
          is-link
          @click="openDetail(item)"
        >
          <template #icon>
            <wd-icon name="" custom-class="i-carbon-home text-blue-500 mr-2" />
          </template>
        </wd-cell>
      </wd-cell-group>

      <template #empty>
        <wd-status-tip image="content" tip="暂无房间数据" />
      </template>
    </z-paging>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

.search-bar {
  padding: 24rpx;
  background: #fff;
}
</style>
