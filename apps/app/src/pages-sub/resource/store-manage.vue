<!--
  库存管理
  功能：显示个人物资库存列表，支持搜索和筛选

  访问地址: http://localhost:3000/#/pages-sub/resource/store-manage
-->

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { queryMyResourceStoreInfo } from '@/api/resource'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '库存管理',
  },
})

const communityInfo = getCurrentCommunity()

const resName = ref('')
const searchUserName = ref('')
type ZPagingRef = any
const pagingRef = ref<ZPagingRef>()
const resourceList = ref<any[]>([])

const { send: loadList } = useRequest(
  (params: { page: number, row: number, resName?: string, searchUserName?: string, communityId: string }) =>
    queryMyResourceStoreInfo(params),
  { immediate: false },
).onSuccess((event) => {
  const response = event.data
  pagingRef.value?.complete(response?.list || [])
}).onError((error) => {
  console.error('加载失败:', error)
  pagingRef.value?.complete(false)
})

function handleQuery(pageNo: number, pageSize: number) {
  loadList({
    page: pageNo,
    row: pageSize,
    resName: resName.value,
    searchUserName: searchUserName.value,
    communityId: communityInfo.communityId,
  })
}

function searchResource() {
  pagingRef.value?.reload()
}

function goToReturn() {
  uni.navigateTo({
    url: '/pages-sub/resource/store-return',
  })
}

function goToScrap() {
  uni.navigateTo({
    url: '/pages-sub/resource/store-scrap',
  })
}

function goToTransfer() {
  uni.navigateTo({
    url: '/pages-sub/resource/store-transfer',
  })
}

onShow(() => {
  if (resourceList.value.length === 0) {
    pagingRef.value?.reload()
  }
})

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page-container">
    <z-paging ref="pagingRef" v-model="resourceList" @query="handleQuery">
      <template #top>
        <!-- 搜索栏 -->
        <view class="search-bar">
          <view class="search-form">
            <text class="cuIcon-search" />
            <input
              v-model="resName"
              type="text"
              placeholder="输入物品名称"
              confirm-type="search"
              @confirm="searchResource"
            >
          </view>
          <view class="action">
            <button class="search-btn" @click="searchResource">
              搜索
            </button>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="action-bar">
          <button class="action-btn" @click="goToReturn">
            退还
          </button>
          <button class="action-btn" @click="goToScrap">
            损耗
          </button>
          <button class="action-btn" @click="goToTransfer">
            转赠
          </button>
        </view>
      </template>

      <!-- 列表 -->
      <view class="resource-list">
        <view v-for="(item, index) in resourceList" :key="index" class="resource-item">
          <view class="item-content">
            <view class="item-name">
              <text class="margin-right-xs text-green">{{ item.userName }}</text>
              <text class="ellip">{{ item.resName }}({{ item.parentRstName }} > {{ item.rstName }})</text>
            </view>
            <view class="item-info">
              <text>库存：{{ item.stock }}{{ item.unitCodeName }}</text>
            </view>
            <view class="item-info">
              <text>最小计量总数：{{ item.miniStock }}{{ item.miniUnitCodeName }}</text>
            </view>
            <view class="item-info">
              <text>固定资产：{{ item.isFixedName }}</text>
            </view>
          </view>
        </view>
      </view>

      <template #empty>
        <view class="empty-page">
          <text class="empty-text">暂无数据</text>
        </view>
      </template>

      <template #loading>
        <ZPagingLoading
          icon="document"
          icon-class="i-carbon-document text-blue-400 animate-pulse"
          primary-text="正在加载库存列表..."
          secondary-text="请稍候片刻"
        />
      </template>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
}

.search-form {
  flex: 1;
  display: flex;
  align-items: center;
  height: 64rpx;
  padding: 0 20rpx;
  background-color: #f5f5f5;
  border-radius: 32rpx;
  margin-right: 16rpx;

  .cuIcon-search {
    margin-right: 12rpx;
    color: #999;
  }

  input {
    flex: 1;
    height: 100%;
    font-size: 28rpx;
  }
}

.search-btn {
  padding: 0 32rpx;
  height: 64rpx;
  line-height: 64rpx;
  background-color: #07c160;
  color: #fff;
  border-radius: 32rpx;
  font-size: 28rpx;
}

.action-bar {
  display: flex;
  justify-content: space-around;
  padding: 20rpx;
  background-color: #fff;
}

.action-btn {
  padding: 0 40rpx;
  height: 64rpx;
  line-height: 64rpx;
  background-color: #1989fa;
  color: #fff;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.resource-list {
  margin-top: 20rpx;
}

.resource-item {
  padding: 24rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
}

.item-content {
  width: 100%;
}

.item-name {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
}

.ellip {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-info {
  font-size: 24rpx;
  color: #999;
  padding: 6rpx 0;
}

.loading-more {
  padding: 30rpx;
  text-align: center;
  font-size: 24rpx;
  color: #999;
}

.empty-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 200rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.loading-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 200rpx 0;
}
</style>
