<!--
  二维码巡检页面
  功能：通过扫描二维码快速定位到对应的巡检项

  访问地址: http://localhost:3000/#/pages-sub/inspection/execute-qrcode
  建议携带参数: ?inspectionId=xxx&inspectionName=xxx&itemId=xxx

  示例: http://localhost:3000/#/pages-sub/inspection/execute-qrcode?inspectionId=INSP_002&inspectionName=消防通道检查&itemId=ITEM_002

  旧代码： gitee-example/pages/excuteOneQrCodeInspection/excuteOneQrCodeInspection.vue
-->

<script setup lang="ts">
import type { InspectionTaskDetail } from '@/types/inspection'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'
import { getInspectionTaskDetail } from '@/api/inspection'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { redirectToTyped } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '二维码巡检',
    enablePullDownRefresh: false,
  },
})

/** 全局 Toast */
const toast = useGlobalToast()

/** 路由参数 */
const inspectionId = ref('')
const inspectionName = ref('')
const itemId = ref('')

/** 获取路由参数 */
onLoad((options) => {
  inspectionId.value = options?.inspectionId as string || ''
  inspectionName.value = options?.inspectionName as string || ''
  itemId.value = options?.itemId as string || ''
})

/** 任务详情列表 */
const taskDetails = ref<InspectionTaskDetail[]>([])

/**
 * 查询巡检任务详情
 */
const { loading, send: sendQueryTaskDetails } = useRequest(
  () => {
    const currentTime = dayjs().format('HH:mm')
    return getInspectionTaskDetail({
      inspectionId: inspectionId.value,
      state: '20200405',
      qrCodeTime: currentTime,
      page: 1,
      row: 100,
    })
  },
  {
    immediate: false,
  },
)
  .onSuccess((event) => {
    const result = event.data
    taskDetails.value = result?.list || []

    // 如果找到任务，跳转到执行单项巡检页
    if (taskDetails.value.length > 0) {
      const item = taskDetails.value[0]

      redirectToTyped('/pages-sub/inspection/execute-single', {
        taskDetailId: item.taskDetailId,
        taskId: item.taskId,
        inspectionId: inspectionId.value,
        inspectionName: inspectionName.value,
        itemId: itemId.value,
        fromPage: 'QrCode',
      })
    }
  })
  .onError((error) => {
    console.error('请求失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

async function queryTaskDetails() {
  await sendQueryTaskDetails()
}

onMounted(() => {
  queryTaskDetails()
})
</script>

<template>
  <view class="inspection-execute-qrcode">
    <view v-if="!loading && taskDetails.length === 0" class="no-task">
      <wd-icon name="warn" size="80px" color="#FF9800" class="no-task-icon" />
      <view class="no-task-text">
        当前没有巡检任务或者没到巡检时间
      </view>
    </view>

    <wd-loading v-if="loading" type="ring" />
  </view>
</template>

<style scoped lang="scss">
.inspection-execute-qrcode {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;

  .no-task {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 40rpx;

    .no-task-icon {
      margin-bottom: 40rpx;
    }

    .no-task-text {
      font-size: 28rpx;
      color: #999999;
      text-align: center;
    }
  }
}
</style>
