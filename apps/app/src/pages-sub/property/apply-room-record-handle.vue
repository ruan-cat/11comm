<!--
  房屋申请记录处理页
  功能：处理房屋申请记录，添加处理意见和违规信息

  访问地址: http://localhost:3000/#/pages-sub/property/apply-room-record-handle
  建议携带参数: ?apply=JSON.stringify(applyRoomInfo)

  旧代码：gitee-example/pages/applyRoomRecordHandle/applyRoomRecordHandle.vue
-->
<script setup lang="ts">
import type { PropertyApplication } from '@/types/property-application'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { saveApplicationRecord } from '@/api/property-application'
import { buildApplyFromParams } from '@/hooks/property/use-property-apply-room'
import { useGlobalToast } from '@/hooks/useGlobalToast'

definePage({
  style: {
    navigationBarTitleText: '记录处理',
  },
})

const toast = useGlobalToast()

const applyRoomInfo = ref<PropertyApplication>({} as PropertyApplication)
const imgList = ref<any[]>([])
const photos = ref<string[]>([])
const videoName = ref<string>('')
const tempFilePath = ref<string>('')
const content = ref<string>('')
const communityId = ref<string>('')
const violations = ref<Array<{ name: string, value?: string }>>([
  {
    name: '请选择是否违规',
  },
  {
    name: '是',
    value: 'true',
  },
  {
    name: '否',
    value: 'false',
  },
])
const violationIndex = ref(0)
const violation = ref<string>('')
const uploadImage = ref({
  maxPhotoNum: 4,
  imgTitle: '图片上传',
  canEdit: true,
})

function sendImagesData(e: Array<{ fileId: string }>) {
  photos.value = []
  if (e.length > 0) {
    e.forEach((img: { fileId: string }) => {
      photos.value.push(img.fileId)
    })
  }
}

function violationChange(e: { detail: { value: number } }) {
  violationIndex.value = e.detail.value
  if (violationIndex.value === 0) {
    violation.value = ''
    return
  }
  const selected = violations.value[violationIndex.value]
  violation.value = selected.value || ''
}

/** 保存申请记录 - 使用 useRequest */
const {
  loading: saveRecordLoading,
  send: saveRecordRequest,
  onSuccess: onSaveSuccess,
  onError: onSaveError,
} = useRequest(
  (params: any) => saveApplicationRecord(params),
  {
    immediate: false,
  },
)

onSaveSuccess(() => {
  toast.success('保存成功')
  setTimeout(() => {
    uni.navigateBack({
      delta: 1,
    })
  }, 1000)
})

onSaveError((error) => {
  toast.error('保存失败')
  console.error('保存记录失败', error)
})

/** 提交跟踪记录 */
function dispatchRecord() {
  const params = {
    applicationId: applyRoomInfo.value.ardId,
    roomId: applyRoomInfo.value.roomId,
    roomName: applyRoomInfo.value.roomName,
    state: applyRoomInfo.value.state,
    stateName: applyRoomInfo.value.stateName,
    photos: photos.value,
    remark: content.value,
    communityId: communityId.value,
    isTrue: violation.value,
  }

  let msg = ''
  if (params.remark === '') {
    msg = '请填写处理意见'
  }
  else if (params.isTrue === '') {
    msg = '请选择是否违规'
  }

  if (msg !== '') {
    toast.warning(msg)
    return
  }

  saveRecordRequest(params)
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
    communityId.value = options.communityId
  }
})
</script>

<template>
  <view>
    <!-- 处理意见输入区域 -->
    <view class="mt-4 bg-white p-4">
      <textarea
        v-model="content"
        placeholder="请输入处理意见"
        class="min-h-30 w-full border border-gray-200 rounded p-2 text-sm"
      />
    </view>

    <!-- 违规选择器 -->
    <view class="mt-4 bg-white p-4">
      <picker
        :value="violationIndex"
        :range="violations"
        range-key="name"
        class="w-full"
        @change="violationChange"
      >
        <view class="text-gray-600">
          {{ violations[violationIndex].name }}
        </view>
      </picker>
    </view>

    <!-- 相关图片标题 -->
    <view class="m-0 px-7.5 pb-5 pt-10 text-sm text-gray-600/60 font-normal">
      相关图片
    </view>

    <!-- 图片上传组件 -->
    <upload-image-async
      ref="vcUploadRef"
      :community-id="communityId"
      :max-photo-num="uploadImage.maxPhotoNum"
      :can-edit="uploadImage.canEdit"
      :title="uploadImage.imgTitle"
      @send-images-data="sendImagesData"
    />

    <!-- 提交按钮 -->
    <view class="mt-4 flex flex-col">
      <button
        class="my-2 cursor-pointer rounded-full bg-colorui-green px-6 py-2 text-center text-lg text-white transition-all"
        @click="dispatchRecord"
      >
        提交
      </button>
    </view>
  </view>
</template>
