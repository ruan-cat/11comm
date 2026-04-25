<!--
  房屋申请列表页
  功能：显示房屋申请列表，支持搜索和筛选

  访问地址: http://localhost:3000/#/pages-sub/property/apply-room

  旧代码：gitee-example/pages/applyRoom/applyRoom.vue
-->
<script setup lang="ts">
import type { PropertyApplication, PropertyApplicationListParams } from '@/types/property-application'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getPropertyApplicationList, queryDictInfo } from '@/api/property-application'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '房屋申请',
    enablePullDownRefresh: false,
  },
})

const communityId = ref<string>('COMM_001')

/** z-paging 组件引用 */
const pagingRef = ref()

/** 申请列表（由 z-paging 接管） */
const applyRoomList = ref<PropertyApplication[]>([])

const applyStates = ref<Array<{ name: string, statusCd?: string }>>([{ name: '请选择' }])
const applyStatesIndex = ref(0)
const applyState = ref<string>('')
const roomName = ref<string>('')

/** 加载申请状态字典 - 使用 useRequest */
const { send: loadApplyStateRequest } = useRequest(
  () => queryDictInfo({
    name: 'apply_room_discount',
    type: 'state',
  }),
  {
    immediate: false,
  },
)
  .onSuccess((res) => {
    console.log('字典接口返回数据：', res)
    if (res) {
      applyStates.value = [{ name: '请选择' }, ...res.data]
    }
  })
  .onError((error) => {
    console.error('加载申请状态失败', error)
  })

/**
 * 加载申请列表 - 使用 useRequest + z-paging
 */
const { send: loadApplyListRequest } = useRequest(
  (params: PropertyApplicationListParams) =>
    getPropertyApplicationList({
      ...params,
      communityId: communityId.value,
      roomName: roomName.value,
      state: applyState.value,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const result = event.data
    pagingRef.value?.complete(result.list || [])
  })
  .onError((error) => {
    console.error('加载列表失败:', error)
    pagingRef.value?.complete(false)
  })

/**
 * z-paging 的 @query 回调
 * @description 接收分页参数，触发请求（不使用 await/try-catch）
 */
function handleQuery(pageNo: number, pageSize: number) {
  loadApplyListRequest({
    page: pageNo,
    row: pageSize,
    communityId: communityId.value,
  })
}

/** 搜索申请 - 重置到第一页并刷新 */
function searchApply() {
  pagingRef.value?.reload()
}

/** 申请状态选择器变更 */
function applyStatesChange(e: { detail: { value: number } }) {
  applyStatesIndex.value = e.detail.value
  if (applyStatesIndex.value === 0) {
    applyState.value = ''
    return
  }
  const selected = applyStates.value[applyStatesIndex.value]
  applyState.value = selected.statusCd || ''
}

/** 跳转到房屋申请详情页 */
function toApplyRoomDetail(item: PropertyApplication) {
  TypedRouter.toApplyRoomDetail(item.ardId, item.communityId)
}

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view>
    <!-- 搜索栏 -->
    <view class="flex items-center justify-between bg-white p-4">
      <!-- 房屋号搜索 -->
      <view class="mr-2 flex flex-1 items-center rounded-full bg-gray-100 px-4 py-2">
        <wd-icon name="" custom-class="i-carbon-search" />
        <input
          v-model="roomName"
          type="text"
          placeholder="输入房屋号"
          confirm-type="search"
          class="ml-2 flex-1 bg-transparent text-sm outline-none"
        >
      </view>
      <!-- 状态筛选 -->
      <view class="mr-2 flex flex-1 items-center rounded-full bg-gray-100 px-4 py-2">
        <wd-icon name="" custom-class="i-carbon-search" />
        <picker
          :value="applyStatesIndex"
          :range="applyStates"
          range-key="name"
          class="ml-2 flex-1 text-sm"
          @change="applyStatesChange"
        >
          <view>{{ applyStates[applyStatesIndex].name }}</view>
        </picker>
      </view>
      <!-- 搜索按钮 -->
      <view class="ml-auto">
        <button class="cursor-pointer rounded-full px-6 py-2 text-center text-white shadow-lg transition-all bg-gradient-green" @tap="searchApply">
          搜索
        </button>
      </view>
    </view>

    <!-- 申请列表 -->
    <z-paging
      ref="pagingRef"
      v-model="applyRoomList"
      @query="handleQuery"
    >
      <view v-if="applyRoomList.length > 0" class="mt-4">
        <view
          v-for="(item, index) in applyRoomList"
          :key="index"
          class="mb-2 bg-white"
          @tap="toApplyRoomDetail(item)"
        >
          <view class="flex items-center p-4">
            <!-- 内容区域 -->
            <view class="ml-5 w-full leading-relaxed">
              <view class="text-gray-600">
                <wd-icon name="" custom-class="i-carbon-notification truncate mr-1 text-colorui-green" />
                {{ item.stateName }}-{{ item.roomName }}
              </view>
              <view class="flex text-sm text-gray-500">
                <view class="truncate">
                  申请人：{{ item.createUserName }}-{{ item.createUserTel }}
                </view>
              </view>
            </view>
            <!-- 箭头图标 -->
            <view class="ml-auto">
              <view class="text-xs text-gray-600">
                <wd-icon name="" custom-class="text-lg i-carbon-chevron-right ml-1 text-gray-500" />
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <template #empty>
        <view class="py-20">
          <wd-status-tip image="content" tip="暂无房屋申请数据" />
        </view>
      </template>

      <!-- 加载状态 -->
      <template #loading>
        <ZPagingLoading
          icon="document"
          icon-class="i-carbon-document text-orange-400 animate-pulse"
          primary-text="正在加载房屋申请列表..."
          secondary-text="请稍候片刻"
        />
      </template>
    </z-paging>
  </view>
</template>
