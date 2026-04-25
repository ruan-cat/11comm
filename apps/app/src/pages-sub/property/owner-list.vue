<!--
  业主列表页
  功能：显示业主列表，支持搜索、编辑和删除

  访问地址: http://localhost:3000/#/pages-sub/property/owner-list

  旧代码：gitee-example/pages/owner/owner.vue
-->
<script setup lang="ts">
import type { OwnerMember } from '@/types/property-management'
import { onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { deleteOwner, queryOwnerAndMembers } from '@/api/owner'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '业主列表',
  },
})

const communityInfo = getCurrentCommunity()
const toast = useGlobalToast()
const pagingRef = ref()
const ownerList = ref<OwnerMember[]>([])
const searchForm = reactive({
  roomName: '',
  ownerName: '',
  link: '',
})
const deletingMemberId = ref('')

const { send: loadOwners } = useRequest(
  (params: { page: number, row: number }) =>
    queryOwnerAndMembers({
      page: params.page,
      row: params.row,
      communityId: communityInfo.communityId,
      roomName: searchForm.roomName || undefined,
      name: searchForm.ownerName || undefined,
      link: searchForm.link || undefined,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    pagingRef.value?.complete(event.data?.list || [])
  })
  .onError((error) => {
    console.error('查询业主失败', error)
    pagingRef.value?.complete(false)
  })

const { send: removeOwner } = useRequest(
  () => deleteOwner({ memberId: deletingMemberId.value, communityId: communityInfo.communityId }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('删除成功')
    pagingRef.value?.reload()
  })
  .onError((error) => {
    console.error('删除业主失败', error)
  })

function handleQuery(pageNo: number, pageSize: number) {
  loadOwners({ page: pageNo, row: pageSize })
}

function handleSearch() {
  pagingRef.value?.reload()
}

function openAddOwner() {
  uni.navigateTo({
    url: '/pages-sub/property/add-owner',
  })
}

function openEditOwner(item: OwnerMember) {
  uni.navigateTo({
    url: `/pages-sub/property/edit-owner?memberId=${item.memberId}`,
  })
}

function handleDelete(item: OwnerMember) {
  deletingMemberId.value = item.memberId
  uni.showModal({
    title: '温馨提示',
    content: `确认删除成员 ${item.name} 吗？`,
    success: (res) => {
      if (res.confirm) {
        removeOwner()
      }
    },
  })
}

onShow(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="page">
    <z-paging
      ref="pagingRef"
      v-model="ownerList"
      class="owner-list-paging"
      @query="handleQuery"
    >
      <template #top>
        <view class="search-wrap">
          <wd-input v-model="searchForm.roomName" label="房屋" placeholder="输入楼栋-单元-房屋" clearable />
          <wd-input v-model="searchForm.ownerName" label="业主" placeholder="输入业主名称" clearable />
          <wd-input v-model="searchForm.link" label="手机号" placeholder="输入手机号" clearable />
          <view class="action-row">
            <wd-button plain @click="handleSearch">
              搜索
            </wd-button>
            <wd-button type="success" @click="openAddOwner">
              添加
            </wd-button>
          </view>
        </view>
      </template>

      <template #loading>
        <ZPagingLoading
          icon="user-avatar"
          icon-class="i-carbon-user-avatar text-blue-500 animate-pulse"
          primary-text="正在加载业主列表..."
          secondary-text="请稍候"
        />
      </template>

      <view v-if="ownerList.length > 0" class="list-wrap">
        <view v-for="item in ownerList" :key="item.memberId" class="owner-card">
          <view class="card-title">
            <text class="name">{{ item.name }}({{ item.ownerTypeName }})</text>
            <view class="btn-group">
              <wd-button size="small" plain @click="openEditOwner(item)">
                修改
              </wd-button>
              <wd-button size="small" type="error" plain @click="handleDelete(item)">
                删除
              </wd-button>
            </view>
          </view>

          <view class="card-row">
            <text class="label">手机号：</text>
            <text>{{ item.link }}</text>
          </view>
          <view class="card-row">
            <text class="label">房屋：</text>
            <text>{{ item.roomName || '-' }}</text>
          </view>
          <view class="card-row">
            <text class="label">身份证：</text>
            <text>{{ item.idCard || '-' }}</text>
          </view>
          <view class="card-row">
            <text class="label">地址：</text>
            <text>{{ item.address || '-' }}</text>
          </view>
        </view>
      </view>

      <template #empty>
        <wd-status-tip image="content" tip="暂无业主数据" />
      </template>
    </z-paging>
  </view>
</template>

<style scoped>
/* 预留自定义 TabBar 高度（与 tabbar/index.vue 中 h-50px + safe-area 一致） */
.page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-bottom: calc(50px + var(--window-bottom, 0px));
  background: #f5f5f5;
}

.owner-list-paging {
  flex: 1;
  min-height: 0;
}

.search-wrap {
  padding: 20rpx;
  background: #fff;
}

.action-row {
  margin-top: 16rpx;
  display: flex;
}

.action-row .wd-button + .wd-button {
  margin-left: 16rpx;
}

.list-wrap {
  padding: 20rpx;
}

.owner-card {
  margin-bottom: 16rpx;
  border-radius: 16rpx;
  background: #fff;
  padding: 20rpx;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 600;
}

.btn-group {
  display: flex;
}

.btn-group .wd-button + .wd-button {
  margin-left: 12rpx;
}

.card-row {
  margin-top: 8rpx;
  color: #4b5563;
  font-size: 26rpx;
}

.label {
  color: #6b7280;
}
</style>
