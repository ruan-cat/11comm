<!--
  采购列表
  功能：展示商品列表，供采购申请时选择商品

  访问地址: http://localhost:3000/#/pages-sub/purchase/list
  建议携带参数: ?communityId=COMM_001

  旧代码：gitee-example/pages/purchaseList/purchaseList.vue
-->

<script setup lang="ts">
import type { ResourceStore } from '@/api/purchase'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { listResourceStores } from '@/api/purchase'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '选择商品',
    enablePullDownRefresh: false,
  },
})

// ==================== 依赖注入 ====================

/** 小区信息 */
const communityInfo = getCurrentCommunity()

// ==================== 页面状态 ====================

/** 商品列表 */
const purchaseList = ref<ResourceStore[]>([])
type ZPagingRef = any
const pagingRef = ref<ZPagingRef>()
const currentCommunityId = ref(communityInfo.communityId)

// ==================== API 请求 ====================

/** 加载商品列表 */
const { send: loadPurchaseList } = useRequest(
  (params: { page: number, row: number, communityId: string }) => listResourceStores(params),
  {
    immediate: false,
  },
).onSuccess((event) => {
  const data = event.data as { resourceStores?: typeof purchaseList.value }
  pagingRef.value?.complete(data?.resourceStores || [])
}).onError((error) => {
  console.error('加载商品列表失败:', error)
  pagingRef.value?.complete(false)
})

// ==================== 生命周期 ====================

onLoad((options) => {
  currentCommunityId.value = options?.communityId || communityInfo.communityId
  pagingRef.value?.reload()
})

function handleQuery(pageNo: number, pageSize: number) {
  loadPurchaseList({ page: pageNo, row: pageSize, communityId: currentCommunityId.value })
}

// ==================== 方法 ====================

/** 选择商品 */
function handleSelectItem(item: ResourceStore) {
  // 将选中的商品信息传递给上一个页面
  const pages = getCurrentPages()
  const prevPage = pages[pages.length - 2] as any

  if (prevPage) {
    // 设置商品信息
    const floorInfo = {
      resId: item.resId,
      resName: item.resName,
      resCode: item.resCode,
      price: item.price,
      stock: item.stock,
      description: item.description,
    }

    // 存储到全局或通过事件传递
    uni.$emit('purchaseSelect', floorInfo)

    uni.navigateBack({
      delta: 1,
    })
  }
}

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page-container">
    <z-paging ref="pagingRef" v-model="purchaseList" @query="handleQuery">
      <view class="goods-list">
        <wd-cell-group border>
          <wd-cell
            v-for="item in purchaseList"
            :key="item.resId"
            :title="item.resName"
            :value="`库存: ${item.stock}`"
            is-link
            @click="handleSelectItem(item)"
          >
            <template #label>
              <view class="goods-label">
                <text class="text-grey text-sm">{{ item.parentRstName }} - {{ item.rstName }}</text>
                <text class="text-grey text-sm">¥{{ item.price }}</text>
              </view>
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>

      <template #empty>
        <view class="empty-container">
          <text class="text-grey">暂无商品</text>
        </view>
      </template>

      <template #loading>
        <ZPagingLoading
          icon="document"
          icon-class="i-carbon-document text-blue-400 animate-pulse"
          primary-text="正在加载商品列表..."
          secondary-text="请稍候片刻"
        />
      </template>
    </z-paging>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
}

.text-grey {
  color: #999;
}

.text-sm {
  font-size: 24rpx;
}

.goods-list {
  padding: 20rpx;
}

.goods-label {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
}
</style>
