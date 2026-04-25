<!--
  房屋申请记录页
  功能：显示房屋申请的跟踪记录列表

  访问地址: http://localhost:3000/#/pages-sub/property/apply-room-record
  建议携带参数: ?apply=JSON.stringify(applyRoomInfo)

  旧代码：gitee-example/pages/applyRoomRecord/applyRoomRecord.vue
-->
<script setup lang="ts">
import type { ApplicationRecord, ApplicationRecordListParams, PropertyApplication } from '@/types/property-application'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getApplicationRecordList } from '@/api/property-application'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { buildApplyFromParams, extractRecordDetailParams } from '@/hooks/property/use-property-apply-room'
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '申请记录',
    enablePullDownRefresh: false,
  },
})

const applyRoomInfo = ref<PropertyApplication>({} as PropertyApplication)
const communityId = ref<string>('')

/** z-paging 组件引用 */
const pagingRef = ref()

/** 申请记录列表（由 z-paging 接管） */
const applyRoomRecordList = ref<ApplicationRecord[]>([])

/**
 * 加载申请记录列表 - 使用 useRequest + z-paging
 */
const { send: loadRecordListRequest } = useRequest(
  (params: ApplicationRecordListParams) =>
    getApplicationRecordList({
      ...params,
      communityId: applyRoomInfo.value.communityId,
      applicationId: applyRoomInfo.value.ardId,
      roomId: applyRoomInfo.value.roomId,
      roomName: applyRoomInfo.value.roomName,
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
  loadRecordListRequest({
    page: pageNo,
    row: pageSize,
    communityId: applyRoomInfo.value.communityId,
    applicationId: applyRoomInfo.value.ardId,
    roomId: applyRoomInfo.value.roomId,
    roomName: applyRoomInfo.value.roomName,
  })
}

/** 新增跟踪记录 */
function addRecord() {
  const params = {
    ardId: applyRoomInfo.value.ardId,
    communityId: applyRoomInfo.value.communityId,
    roomId: applyRoomInfo.value.roomId,
    roomName: applyRoomInfo.value.roomName,
    state: applyRoomInfo.value.state,
    stateName: applyRoomInfo.value.stateName,
  }
  TypedRouter.toApplyRoomRecordHandle(params)
}

/** 显示记录详情 */
function showDetail(_item: ApplicationRecord) {
  const params = extractRecordDetailParams(_item, applyRoomInfo.value.communityId)
  TypedRouter.toApplyRoomRecordDetail(params)
}

onLoad((options: {
  ardId?: string
  communityId?: string
  roomId?: string
  roomName?: string
  state?: string
  stateName?: string
}) => {
  if (options.ardId && options.communityId && options.roomId && options.roomName && options.state && options.stateName) {
    applyRoomInfo.value = buildApplyFromParams({
      ardId: options.ardId,
      communityId: options.communityId,
      roomId: options.roomId,
      roomName: options.roomName,
      state: options.state,
      stateName: options.stateName,
    }) as PropertyApplication
    console.log(applyRoomInfo.value)
  }
})

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view>
    <z-paging
      ref="pagingRef"
      v-model="applyRoomRecordList"
      @query="handleQuery"
    >
      <!-- 申请记录列表 -->
      <view v-if="applyRoomRecordList.length > 0" class="mt-4">
        <view
          v-for="(item, index) in applyRoomRecordList"
          :key="index"
          class="mb-2 bg-white"
          @tap="showDetail(item)"
        >
          <view class="flex items-center p-4">
            <!-- 内容区域 -->
            <view class="ml-5 w-full leading-relaxed">
              <view class="text-gray-600">
                <wd-icon name="" custom-class="i-carbon-notification truncate mr-1 text-colorui-green" />
                {{ item.stateName }}-{{ item.createTime }}
              </view>
              <view class="flex text-sm text-gray-500">
                <view class="truncate">
                  操作人员：{{ item.createUserName }}
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
          <wd-status-tip image="content" tip="暂无申请记录" />
        </view>
      </template>

      <!-- 加载状态 -->
      <template #loading>
        <ZPagingLoading
          icon="document"
          icon-class="i-carbon-document text-orange-400 animate-pulse"
          primary-text="正在加载申请记录..."
          secondary-text="请稍候片刻"
        />
      </template>
    </z-paging>

    <!-- 新增记录按钮 -->
    <view class="fixed bottom-12.5 right-2.5 h-25 w-25" @tap="addRecord">
      <img src="/static/image/renovation-add.png" alt="" class="h-full w-full">
    </view>
  </view>
</template>
