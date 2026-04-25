<!--
  业主车辆页
  功能：显示业主车辆列表，支持多条件搜索

  访问地址: http://localhost:3000/#/pages-sub/parking/owner-car

  旧代码：gitee-example/pages/car/ownerCar.vue
-->
<script setup lang="ts">
import type { OwnerCar } from '@/types/parking'
import { useRequest } from 'alova/client'
import { onMounted, reactive, ref } from 'vue'
import { queryOwnerCars } from '@/api/parking'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '业主车辆',
  },
})

const communityInfo = getCurrentCommunity()
const pagingRef = ref()
const carList = ref<OwnerCar[]>([])
const searchForm = reactive({
  carNumLike: '',
  ownerName: '',
  memberCarNumLike: '',
  num: '',
  link: '',
})

const { send: loadCars } = useRequest(
  (params: { page: number, row: number }) =>
    queryOwnerCars({
      page: params.page,
      row: params.row,
      communityId: communityInfo.communityId,
      carNumLike: searchForm.carNumLike || undefined,
      ownerName: searchForm.ownerName || undefined,
      memberCarNumLike: searchForm.memberCarNumLike || undefined,
      num: searchForm.num || undefined,
      link: searchForm.link || undefined,
      carTypeCds: '1002,1001',
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('查询车辆失败', error)
    pagingRef.value?.complete(false)
  })

function handleQuery(pageNo: number, pageSize: number) {
  loadCars({ page: pageNo, row: pageSize })
}

function handleSearch() {
  pagingRef.value?.reload()
}

function callOwner(phone: string) {
  if (!phone)
    return

  uni.makePhoneCall({
    phoneNumber: phone,
  })
}

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <view class="search-wrap">
      <wd-input v-model="searchForm.carNumLike" label="车牌号" label-width="86px" placeholder="输入车牌号" clearable />
      <wd-input v-model="searchForm.ownerName" label="业主" label-width="86px" placeholder="输入业主名称" clearable />
      <wd-input v-model="searchForm.memberCarNumLike" label="成员车牌" label-width="86px" placeholder="输入成员车牌" clearable />
      <wd-input v-model="searchForm.num" label="车位编号" label-width="86px" placeholder="输入车位编号" clearable />
      <wd-input v-model="searchForm.link" label="手机号" label-width="86px" placeholder="输入手机号" clearable />
      <wd-button type="success" block @click="handleSearch">
        搜索
      </wd-button>
    </view>

    <z-paging
      ref="pagingRef"
      v-model="carList"
      @query="handleQuery"
    >
      <template #loading>
        <ZPagingLoading
          icon="car"
          icon-class="i-carbon-car text-blue-500 animate-pulse"
          primary-text="正在加载车辆列表..."
          secondary-text="请稍候"
        />
      </template>

      <view v-if="carList.length > 0" class="list-wrap">
        <view v-for="item in carList" :key="item.carId" class="car-card">
          <view class="title-row">
            <text class="plate">{{ item.carNum }}</text>
            <view class="owner-contact" @click="callOwner(item.link)">
              <wd-icon name="" custom-class="i-carbon-phone text-blue-500 mr-1" />
              <text>{{ item.ownerName }}/{{ item.link }}</text>
            </view>
          </view>

          <view class="info-row">
            <text>车位：</text>
            <text>{{ item.areaNum && item.state === '1001' ? `${item.areaNum}-${item.num}` : '车位已释放' }}</text>
          </view>
          <view class="info-row">
            <text>状态：</text>
            <text>{{ item.stateName }}</text>
          </view>
          <view class="info-row">
            <text>房屋号：</text>
            <text>{{ item.roomName || '-' }}</text>
          </view>
          <view class="info-row">
            <text>车牌类型：</text>
            <text>{{ item.leaseType === 'T' ? '临时车' : item.leaseTypeName }}</text>
          </view>
          <view v-if="item.leaseType === 'H'" class="info-row">
            <text>有效期：</text>
            <text>{{ item.startTime }} ~ {{ item.endTime }}</text>
          </view>
        </view>
      </view>

      <template #empty>
        <wd-status-tip image="content" tip="暂无车辆数据" />
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

.list-wrap {
  padding: 20rpx;
}

.car-card {
  margin-bottom: 16rpx;
  border-radius: 16rpx;
  background: #fff;
  padding: 20rpx;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.plate {
  font-size: 32rpx;
  font-weight: 600;
}

.owner-contact {
  color: #2563eb;
  display: flex;
  align-items: center;
  font-size: 24rpx;
}

.info-row {
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #4b5563;
}
</style>
