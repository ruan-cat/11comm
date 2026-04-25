<!--
  单元列表页
  功能：显示单元列表，支持按单元编号搜索并进入房间列表

  访问地址: http://localhost:3000/#/pages-sub/property/unit-list
  建议携带参数: ?floorId=xxx

  旧代码：gitee-example/pages/unitList/unitList.vue
-->
<script setup lang="ts">
import type { Unit } from '@/types/selector'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getUnitList } from '@/api/unit'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'

definePage({
  style: {
    navigationBarTitleText: '单元列表',
  },
})

const floorId = ref('')
const unitNum = ref('')
const unitList = ref<Unit[]>([])
const pagingRef = ref()

const { send: queryUnits } = useRequest(
  (params: { page: number, row: number }) =>
    getUnitList({
      page: params.page,
      row: params.row,
      communityId: 'COMM_001',
      floorId: floorId.value,
      unitNum: unitNum.value || undefined,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('查询单元失败', error)
    pagingRef.value?.complete(false)
  })

function handleQuery(pageNo: number, pageSize: number) {
  queryUnits({ page: pageNo, row: pageSize })
}

function handleSearch() {
  pagingRef.value?.reload()
}

function openRoomList(item: Unit) {
  uni.navigateTo({
    url: `/pages-sub/property/room-list?floorId=${item.floorId}&unitId=${item.unitId}`,
  })
}

onLoad((options) => {
  floorId.value = options?.floorId || ''
})

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <view class="search-bar">
      <wd-search
        v-model="unitNum"
        placeholder="请输入单元编号"
        @search="handleSearch"
        @clear="handleSearch"
      />
    </view>

    <z-paging
      ref="pagingRef"
      v-model="unitList"
      @query="handleQuery"
    >
      <template #loading>
        <ZPagingLoading
          icon="grid"
          icon-class="i-carbon-grid text-blue-500 animate-pulse"
          primary-text="正在加载单元列表..."
          secondary-text="请稍候"
        />
      </template>

      <wd-cell-group v-if="unitList.length > 0" border>
        <wd-cell
          v-for="item in unitList"
          :key="item.unitId"
          :title="`${item.unitNum}单元`"
          :label="item.unitId"
          is-link
          @click="openRoomList(item)"
        >
          <template #icon>
            <wd-icon name="" custom-class="i-carbon-grid text-blue-500 mr-2" />
          </template>
        </wd-cell>
      </wd-cell-group>

      <template #empty>
        <wd-status-tip image="content" tip="暂无单元数据" />
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
