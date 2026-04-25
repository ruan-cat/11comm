<!--
  切换小区页
  功能：查询并切换当前工作小区

  访问地址: http://localhost:3000/#/pages/profile/change-community

  旧代码：gitee-example/pages/changeCommunity/changeCommunity.vue
-->
<script setup lang="ts">
import type { CommunityInfo } from '@/types/profile'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { changeCurrentCommunity, listProfileCommunities } from '@/api/profile'

definePage({
  style: {
    navigationBarTitleText: '切换小区',
  },
})

const keyword = ref('')
const communities = ref<CommunityInfo[]>([])

const { send: searchCommunities } = useRequest(
  () =>
    listProfileCommunities({
      keyword: keyword.value.trim() || undefined,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    communities.value = event.data || []
  })
  .onError((error) => {
    console.error('查询小区失败', error)
  })

const { loading, send: submitChangeCommunity } = useRequest(
  (communityId: string) => changeCurrentCommunity({ communityId }),
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({
      title: '切换成功',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 600)
  })
  .onError((error) => {
    console.error('切换小区失败', error)
  })

function handleSearch() {
  searchCommunities()
}

function selectCommunity(item: CommunityInfo) {
  uni.setStorageSync('currentCommunity', JSON.stringify({
    communityId: item.communityId,
    communityName: item.name,
  }))
  submitChangeCommunity(item.communityId)
}

onLoad(() => {
  searchCommunities()
})
</script>

<template>
  <view class="page">
    <view class="search-wrap">
      <wd-input
        v-model="keyword"
        placeholder="输入搜索的小区名称"
        clearable
      />
      <wd-button type="primary" custom-class="ml-12rpx" @click="handleSearch">
        搜索
      </wd-button>
    </view>

    <wd-cell-group v-if="communities.length > 0" border>
      <wd-cell
        v-for="item in communities"
        :key="item.communityId"
        :title="item.name"
        :label="item.address"
        is-link
        :value="loading ? '切换中...' : ''"
        @click="selectCommunity(item)"
      >
        <template #icon>
          <wd-icon name="" custom-class="i-carbon-home text-blue-500 mr-8rpx" />
        </template>
      </wd-cell>
    </wd-cell-group>
    <wd-status-tip v-else image="content" tip="暂无可切换小区" />
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.search-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
</style>
