<!--
  楼层列表页
  功能：显示楼层列表，支持按楼栋编号搜索并进入单元列表

  访问地址: http://localhost:3000/#/pages-sub/property/floor-list

  旧代码：gitee-example/pages/floorList/floorList.vue
-->
<script setup lang="ts">
import type { Floor } from '@/types/selector'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getFloorList } from '@/api/floor'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'

definePage({
  style: {
    navigationBarTitleText: '楼层列表',
  },
})

const floorNum = ref('')
const floorList = ref<Floor[]>([])
const pagingRef = ref()

const { send: queryFloors } = useRequest(
  (params: { page: number, row: number }) =>
    getFloorList({
      page: params.page,
      row: params.row,
      communityId: 'COMM_001',
      floorNum: floorNum.value || undefined,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('查询楼层失败', error)
    pagingRef.value?.complete(false)
  })

function handleQuery(pageNo: number, pageSize: number) {
  queryFloors({ page: pageNo, row: pageSize })
}

function handleSearch() {
  pagingRef.value?.reload()
}

function openUnitList(item: Floor) {
  uni.navigateTo({
    url: `/pages-sub/property/unit-list?floorId=${item.floorId}`,
  })
}

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <view class="search-bar">
      <wd-search
        v-model="floorNum"
        placeholder="请输入楼栋编号"
        @search="handleSearch"
        @clear="handleSearch"
      />
    </view>

    <z-paging
      ref="pagingRef"
      v-model="floorList"
      @query="handleQuery"
    >
      <template #loading>
        <ZPagingLoading
          icon="building"
          icon-class="i-carbon-building text-blue-500 animate-pulse"
          primary-text="正在加载楼栋列表..."
          secondary-text="请稍候"
        />
      </template>

      <wd-cell-group v-if="floorList.length > 0" border>
        <wd-cell
          v-for="item in floorList"
          :key="item.floorId"
          :title="`${item.floorNum}栋`"
          :label="item.floorId"
          is-link
          @click="openUnitList(item)"
        >
          <template #icon>
            <wd-icon name="" custom-class="i-carbon-building text-blue-500 mr-2" />
          </template>
        </wd-cell>
      </wd-cell-group>

      <template #empty>
        <wd-status-tip image="content" tip="暂无楼栋数据" />
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
