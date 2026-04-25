<!--
  装修管理列表页
  功能：显示装修申请列表，支持按房间号和状态筛选

  访问地址: http://localhost:3000/#/pages-sub/property/renovation

  旧代码：gitee-example/pages/roomRenovation/roomRenovation.vue
-->
<script setup lang="ts">
import type { RenovationApplication } from '@/types/property-management'
import { onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { queryRoomRenovation } from '@/api/renovation'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { RENOVATION_STATE_OPTIONS } from '@/types/property-management'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '装修管理',
  },
})

const communityInfo = getCurrentCommunity()
const pagingRef = ref()
const renovationList = ref<RenovationApplication[]>([])
const searchForm = reactive({
  roomName: '',
  state: '',
})
const stateColumns = RENOVATION_STATE_OPTIONS.map(item => ({
  label: item.name,
  value: item.statusCd,
}))

const { send: loadRenovationList } = useRequest(
  (params: { page: number, row: number }) =>
    queryRoomRenovation({
      page: params.page,
      row: params.row,
      communityId: communityInfo.communityId,
      roomName: searchForm.roomName || undefined,
      state: searchForm.state || undefined,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('查询装修列表失败', error)
    pagingRef.value?.complete(false)
  })

function handleQuery(pageNo: number, pageSize: number) {
  loadRenovationList({ page: pageNo, row: pageSize })
}

function handleSearch() {
  pagingRef.value?.reload()
}

function openDetail(item: RenovationApplication) {
  uni.navigateTo({
    url: `/pages-sub/property/renovation-detail?apply=${encodeURIComponent(JSON.stringify(item))}`,
  })
}

onShow(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <view class="search-wrap">
      <wd-input
        v-model="searchForm.roomName"
        label="房屋号"
        label-width="88px"
        placeholder="输入房屋号"
        clearable
      />
      <wd-picker
        v-model="searchForm.state"
        label="状态"
        label-width="88px"
        :columns="stateColumns"
      />
      <wd-button type="success" block @click="handleSearch">
        搜索
      </wd-button>
    </view>

    <z-paging
      ref="pagingRef"
      v-model="renovationList"
      @query="handleQuery"
    >
      <template #loading>
        <ZPagingLoading
          icon="construction"
          icon-class="i-carbon-construction text-blue-500 animate-pulse"
          primary-text="正在加载装修申请..."
          secondary-text="请稍候"
        />
      </template>

      <wd-cell-group v-if="renovationList.length > 0" border>
        <wd-cell
          v-for="item in renovationList"
          :key="item.rId"
          :title="`${item.stateName}-${item.roomName}`"
          :label="`申请人：${item.personName}-${item.personTel}`"
          is-link
          @click="openDetail(item)"
        >
          <template #icon>
            <wd-icon name="" custom-class="i-carbon-notification text-green-500 mr-2" />
          </template>
        </wd-cell>
      </wd-cell-group>

      <template #empty>
        <wd-status-tip image="content" tip="暂无装修申请数据" />
      </template>
    </z-paging>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

.search-wrap {
  background: #fff;
  padding: 20rpx;
}
</style>
