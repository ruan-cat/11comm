<!--
  装修记录页
  功能：显示装修跟踪记录，支持新增和查看详情

  访问地址: http://localhost:3000/#/pages-sub/property/renovation-record
  建议携带参数: ?apply=JSON

  旧代码：gitee-example/pages/roomRenovationRecord/roomRenovationRecord.vue
-->
<script setup lang="ts">
import type { RenovationApplication, RenovationRecord } from '@/types/property-management'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { queryRoomRenovationRecord } from '@/api/renovation'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'

definePage({
  style: {
    navigationBarTitleText: '装修记录',
  },
})

const applyInfo = ref<RenovationApplication | null>(null)
const pagingRef = ref()
const recordList = ref<RenovationRecord[]>([])

const { send: loadRecords } = useRequest(
  (params: { page: number, row: number }) => {
    if (!applyInfo.value) {
      throw new Error('缺少装修信息')
    }

    return queryRoomRenovationRecord({
      page: params.page,
      row: params.row,
      communityId: applyInfo.value.communityId,
      rId: applyInfo.value.rId,
      roomName: applyInfo.value.roomName,
      roomId: applyInfo.value.roomId,
    })
  },
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('查询装修记录失败', error)
    pagingRef.value?.complete(false)
  })

function handleQuery(pageNo: number, pageSize: number) {
  loadRecords({ page: pageNo, row: pageSize })
}

function openHandle() {
  if (!applyInfo.value)
    return

  uni.navigateTo({
    url: `/pages-sub/property/renovation-record-handle?apply=${encodeURIComponent(JSON.stringify(applyInfo.value))}`,
  })
}

function openDetail(item: RenovationRecord) {
  const payload = {
    ...item,
    communityId: applyInfo.value?.communityId,
    roomName: applyInfo.value?.roomName,
    roomId: applyInfo.value?.roomId,
  }

  uni.navigateTo({
    url: `/pages-sub/property/renovation-record-detail?apply=${encodeURIComponent(JSON.stringify(payload))}`,
  })
}

onLoad((options) => {
  if (!options?.apply)
    return

  try {
    applyInfo.value = JSON.parse(decodeURIComponent(options.apply))
  }
  catch (error) {
    console.error('参数解析失败', error)
  }
})

onShow(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <z-paging
      ref="pagingRef"
      v-model="recordList"
      @query="handleQuery"
    >
      <template #loading>
        <ZPagingLoading
          icon="time"
          icon-class="i-carbon-time text-green-500 animate-pulse"
          primary-text="正在加载装修跟踪记录..."
          secondary-text="请稍候"
        />
      </template>

      <wd-cell-group v-if="recordList.length > 0" border>
        <wd-cell
          v-for="item in recordList"
          :key="item.recordId"
          :title="`${item.stateName}-${item.createTime}`"
          :label="`操作人员：${item.staffName}`"
          is-link
          @click="openDetail(item)"
        >
          <template #icon>
            <wd-icon name="" custom-class="i-carbon-notification text-green-500 mr-2" />
          </template>
        </wd-cell>
      </wd-cell-group>

      <template #empty>
        <wd-status-tip image="content" tip="暂无装修跟踪记录" />
      </template>
    </z-paging>

    <view class="add-btn" @click="openHandle">
      <wd-icon name="" custom-class="i-carbon-add text-white text-2xl" />
    </view>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

.add-btn {
  position: fixed;
  right: 24rpx;
  bottom: 120rpx;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 20rpx rgb(0 0 0 / 16%);
}
</style>
