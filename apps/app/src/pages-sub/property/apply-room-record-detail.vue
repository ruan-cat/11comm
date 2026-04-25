<!--
  房屋申请记录详情页
  功能：显示房屋申请记录的详细信息，支持删除操作

  访问地址: http://localhost:3000/#/pages-sub/property/apply-room-record-detail
  建议携带参数: ?apply=JSON.stringify(recordInfo)

  旧代码：gitee-example/pages/applyRoomRecordDetail/applyRoomRecordDetail.vue
-->
<script setup lang="ts">
import type { ApplicationRecord, ApplicationRecordDetail } from '@/types/property-application'
import { onLoad, onReady, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { deleteApplicationRecord, getApplicationRecordDetailList } from '@/api/property-application'
import { buildRecordFromParams } from '@/hooks/property/use-property-apply-room'
import { useGlobalToast } from '@/hooks/useGlobalToast'

definePage({
  style: {
    navigationBarTitleText: '记录详情',
  },
})

const toast = useGlobalToast()

const recordInfo = ref<ApplicationRecord & { communityId?: string, roomName?: string }>({} as ApplicationRecord & { communityId?: string, roomName?: string })
const recordList = ref<ApplicationRecordDetail[]>([])
const imgRecordList = ref<ApplicationRecordDetail[]>([])
const videoRecordList = ref<ApplicationRecordDetail[]>([])
const commonBaseUrl = ref<string>('')

/** 加载记录详情 - 使用 useRequest */
const {
  send: loadRecordDetailRequest,
  onSuccess: onRecordDetailSuccess,
  onError: onRecordDetailError,
} = useRequest(
  () => getApplicationRecordDetailList({
    page: 1,
    row: 10,
    communityId: recordInfo.value.communityId || '',
    ardrId: recordInfo.value.ardrId,
    roomName: recordInfo.value.roomName || '',
  }),
  {
    immediate: false,
  },
)

onRecordDetailSuccess((res) => {
  recordList.value = res.data
  res.data.forEach((item: ApplicationRecordDetail) => {
    if (item.relTypeCd === '19000') {
      imgRecordList.value.push(item)
    }
    else if (item.relTypeCd === '21000') {
      videoRecordList.value.push(item)
    }
  })
})

onRecordDetailError((error) => {
  console.error('加载记录详情失败', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

/** 预览图片 */
function preview(e: { target: { dataset: { index: number } } }) {
  const index = e.target.dataset.index
  const urls: string[] = []
  imgRecordList.value.forEach((item: ApplicationRecordDetail) => {
    urls.push(item.url)
  })
  uni.previewImage({
    current: index,
    urls,
  })
}

/** 删除记录 - 使用 useRequest */
const {
  send: deleteRecordRequest,
  onSuccess: onDeleteSuccess,
  onError: onDeleteError,
} = useRequest(
  () => deleteApplicationRecord({
    ardrId: recordInfo.value.ardrId,
    communityId: recordInfo.value.communityId || '',
    roomName: recordInfo.value.roomName || '',
    applicationId: recordInfo.value.applicationId || '',
    roomId: recordInfo.value.roomId || '',
    state: recordInfo.value.state || '',
    stateName: recordInfo.value.stateName || '',
  }),
  {
    immediate: false,
  },
)

onDeleteSuccess(() => {
  toast.success('删除成功')
  setTimeout(() => {
    uni.navigateBack({
      delta: 1,
    })
  }, 1000)
})

onDeleteError((error) => {
  console.error('删除记录失败', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

/** 删除记录 */
function deleteRecord() {
  uni.showModal({
    title: '提示',
    content: '是否确认删除？',
    success: (res) => {
      if (res.confirm) {
        deleteRecordRequest()
      }
    },
  })
}

onLoad((options: {
  ardrId?: string
  applicationId?: string
  roomId?: string
  roomName?: string
  communityId?: string
  state?: string
  stateName?: string
}) => {
  // TODO: 请优化这段逻辑 缺少字段时就弹框报错 并且精简代码写法 别太冗长
  if (options.ardrId && options.applicationId && options.roomId && options.roomName && options.communityId && options.state && options.stateName) {
    recordInfo.value = buildRecordFromParams({
      ardrId: options.ardrId,
      applicationId: options.applicationId,
      roomId: options.roomId,
      roomName: options.roomName,
      communityId: options.communityId,
      state: options.state,
      stateName: options.stateName,
    }) as ApplicationRecord & { communityId: string }
    commonBaseUrl.value = ''
    loadRecordDetailRequest()
  }
})

onReady(() => {
  // 页面初次渲染完成
})

onShow(() => {
  // 页面显示
})
</script>

<template>
  <view>
    <!-- 记录详情列表 -->
    <view class="mt-4 bg-white">
      <!-- 操作按钮 -->
      <view class="record-row flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-trash-can text-colorui-green" />
          <text class="ml-2 text-gray-600">操作</text>
        </view>
        <view class="ml-auto">
          <text class="cursor-pointer rounded-full bg-colorui-red px-6 py-2 text-center text-white transition-all" @click="deleteRecord">删除</text>
        </view>
      </view>

      <!-- 申请房间 -->
      <view class="record-row flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-time text-colorui-green" />
          <text class="ml-2 text-gray-600">申请房间</text>
        </view>
        <view class="ml-auto">
          <text class="text-sm text-gray-600">{{ recordInfo.roomName }}</text>
        </view>
      </view>

      <!-- 跟踪备注 -->
      <view class="record-row flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-pedestrian text-colorui-green" />
          <text class="ml-2 text-gray-600">跟踪备注</text>
        </view>
        <view class="ml-auto">
          <text class="text-sm text-gray-600">
            {{ recordList.length > 0 ? recordList[0].remark : '' }}
          </text>
        </view>
      </view>

      <!-- 图片列表 -->
      <view v-if="imgRecordList.length > 0">
        <view class="px-4 py-2 text-gray-600">
          图片
        </view>
        <view class="record-row flex items-center p-4">
          <view class="image-grid-wrap w-full text-center">
            <view
              v-for="(item, index) in imgRecordList"
              :key="index"
              class="image-grid-wrap__item aspect-square"
            >
              <image
                mode="widthFix"
                :data-url="item.url"
                :data-index="index"
                :src="item.url"
                class="h-full w-full object-cover"
                @tap="preview"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 视频列表 -->
      <view v-if="videoRecordList.length > 0">
        <view class="px-4 py-2 text-gray-600">
          视频
        </view>
        <view v-for="(item, index) in videoRecordList" :key="index" class="px-4 py-2">
          <video
            class="w-full"
            object-fit="contain"
            :src="commonBaseUrl + item.url"
            controls
          />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
/** 保留 uni-video 全局样式 */
uni-video {
  width: 100%;
}

.record-row + .record-row {
  border-top: 1px solid rgb(243 244 246);
}

.image-grid-wrap {
  display: flex;
  flex-wrap: wrap;
  margin: -8rpx;
}

.image-grid-wrap__item {
  box-sizing: border-box;
  width: 25%;
  padding: 8rpx;
}
</style>
