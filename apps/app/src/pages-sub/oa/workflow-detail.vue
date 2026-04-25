<!--
  工作流详情页
  功能：显示流程单据明细、流转记录和流程图，支持编辑与审核跳转

  访问地址: http://localhost:3000/#/pages-sub/oa/workflow-detail
  建议携带参数: ?flowId=FLOW_001&id=OA_001&action=Audit&taskId=TASK_001

  旧代码：gitee-example/pages/newOaWorkflowDetail/newOaWorkflowDetail.vue
-->

<script setup lang="ts">
import type { OaWorkflowComment, OaWorkflowFormDataRecord, OaWorkflowFormField } from '@/types/oa-workflow'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import {
  listRunWorkflowImage,
  queryOaWorkflowForm,
  queryOaWorkflowFormData,
  queryOaWorkflowUser,
} from '@/api/oa-workflow'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { getUserInfo } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '工作流详情',
  },
})

/** 流程ID */
const flowId = ref('')
/** 单据ID */
const dataId = ref('')
/** 动作标识 */
const action = ref('')
/** 任务ID */
const taskId = ref('')
/** 流程名称 */
const flowName = ref('')
/** 流程字段定义 */
const fields = ref<OaWorkflowFormField[]>([])
/** 单据详情 */
const detail = ref<OaWorkflowFormDataRecord | null>(null)
/** 流转记录 */
const comments = ref<OaWorkflowComment[]>([])
/** 流程图 */
const flowImage = ref('')
/** 页面加载中 */
const pageLoading = ref(false)

const toast = useGlobalToast()

/** 是否可编辑 */
const canEdit = computed(() => {
  const userInfo = getUserInfo()
  return !!detail.value && detail.value.createUserId === userInfo.userId
})

/** 是否可审核 */
const canAudit = computed(() => action.value === 'Audit' && !!taskId.value)

/** 可展示的业务字段（忽略标题和按钮） */
const displayFields = computed(() => {
  return fields.value.filter(field => field.type !== 'text' && field.type !== 'button' && field.key)
})

/** 加载流程模板 */
const { send: loadSchema } = useRequest(
  (params: { flowId: string }) => queryOaWorkflowForm({ page: 1, row: 1, flowId: params.flowId }),
  { immediate: false },
)
  .onSuccess((event) => {
    const formMeta = event.data?.data?.[0]
    if (!formMeta?.formJson) {
      fields.value = []
      return
    }

    try {
      const schema = JSON.parse(formMeta.formJson) as { components: OaWorkflowFormField[] }
      fields.value = schema.components || []
    }
    catch (error) {
      console.error('解析表单模板失败:', error)
      fields.value = []
    }
  })
  .onError((error) => {
    console.error('加载流程模板失败:', error)
    toast.error('加载流程模板失败')
  })

/** 加载单据详情 */
const { send: loadDetail } = useRequest(
  (params: { flowId: string, id: string }) =>
    queryOaWorkflowFormData({
      page: 1,
      row: 1,
      flowId: params.flowId,
      id: params.id,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    detail.value = event.data?.data?.[0] || null
  })
  .onError((error) => {
    console.error('加载流程详情失败:', error)
    toast.error('加载流程详情失败')
  })

/** 加载流转记录 */
const { send: loadComments } = useRequest(
  (params: { flowId: string, id: string }) =>
    queryOaWorkflowUser({
      page: 1,
      row: 100,
      flowId: params.flowId,
      id: params.id,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    comments.value = event.data?.data || []
  })
  .onError((error) => {
    console.error('加载流转记录失败:', error)
    toast.error('加载流转记录失败')
  })

/** 加载流程图 */
const { send: loadFlowImage } = useRequest(
  (params: { businessKey: string }) =>
    listRunWorkflowImage({
      businessKey: params.businessKey,
      communityId: '',
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const imageBase64 = event.data?.data || ''
    flowImage.value = imageBase64 ? `data:image/png;base64,${imageBase64}` : ''
  })
  .onError((error) => {
    console.error('加载流程图失败:', error)
    toast.error('加载流程图失败')
  })

/** 获取字段值 */
function getFieldValue(key: string) {
  return detail.value?.formData?.[key] || '-'
}

/** 状态文案 */
function getStateText() {
  return detail.value?.stateName || '未知'
}

/** 跳转编辑 */
function handleEdit() {
  if (!detail.value) {
    return
  }

  const encodedName = encodeURIComponent(flowName.value || '')
  uni.navigateTo({
    url: `/pages-sub/oa/workflow-form-edit?flowId=${detail.value.flowId}&id=${detail.value.id}&flowName=${encodedName}`,
  })
}

/** 跳转审核 */
function handleAudit() {
  if (!detail.value || !taskId.value) {
    return
  }

  uni.navigateTo({
    url: `/pages-sub/oa/workflow-audit?flowId=${detail.value.flowId}&id=${detail.value.id}&taskId=${taskId.value}`,
  })
}

/** 下载附件 */
function handleDownload() {
  const fileUrl = detail.value?.files?.[0]?.realFileName
  if (!fileUrl) {
    toast.warning('当前无可下载附件')
    return
  }

  // #ifdef H5
  window.open(fileUrl, '_blank')
  // #endif

  // #ifndef H5
  uni.downloadFile({
    url: fileUrl,
    success: (res) => {
      if (res.statusCode !== 200 || !res.tempFilePath) {
        toast.error('下载失败')
        return
      }

      uni.saveFile({
        tempFilePath: res.tempFilePath,
        success: () => {
          toast.success('已保存到本地')
        },
        fail: () => {
          toast.error('保存失败')
        },
      })
    },
    fail: () => {
      toast.error('下载失败')
    },
  })
  // #endif
}

/** 并行加载页面数据 */
async function initPageData() {
  if (!flowId.value || !dataId.value) {
    return
  }

  pageLoading.value = true

  await Promise.allSettled([
    loadSchema({ flowId: flowId.value }),
    loadDetail({ flowId: flowId.value, id: dataId.value }),
    loadComments({ flowId: flowId.value, id: dataId.value }),
    loadFlowImage({ businessKey: dataId.value }),
  ])

  pageLoading.value = false
}

onLoad((options) => {
  flowId.value = options?.flowId || ''
  dataId.value = options?.id || ''
  taskId.value = options?.taskId || ''
  action.value = options?.action || ''
  flowName.value = decodeURIComponent(options?.flowName || '')

  if (!flowId.value || !dataId.value) {
    toast.warning('flowId 或 id 参数不能为空')
    return
  }

  initPageData()
})
</script>

<template>
  <view class="detail-page">
    <wd-loading v-if="pageLoading" />

    <view v-else class="content">
      <view class="summary-card">
        <view class="summary-row">
          <text class="name">{{ detail?.createUserName || '-' }}</text>
          <text class="time">{{ detail?.createTime || '-' }}</text>
        </view>
        <view class="summary-row">
          <text class="label">工单状态</text>
          <text class="value">{{ getStateText() }}</text>
        </view>
        <view
          v-for="field in displayFields"
          :key="field.key"
          class="summary-row"
        >
          <text class="label">{{ field.label || '-' }}</text>
          <text class="value">{{ getFieldValue(field.key as string) }}</text>
        </view>

        <view class="actions">
          <wd-button v-if="canEdit" size="small" plain @click="handleEdit">
            编辑
          </wd-button>
          <wd-button v-if="canAudit" type="success" size="small" custom-class="ml-16rpx" @click="handleAudit">
            处理
          </wd-button>
          <wd-button
            v-if="detail?.files && detail.files.length > 0"
            type="warning"
            size="small"
            plain
            custom-class="ml-16rpx"
            @click="handleDownload"
          >
            下载附件
          </wd-button>
        </view>
      </view>

      <view class="timeline-card">
        <view class="card-title">
          流转记录
        </view>
        <view v-if="comments.length === 0" class="empty-text">
          暂无流转记录
        </view>
        <view v-else>
          <view v-for="(item, index) in comments" :key="index" class="timeline-item">
            <view class="timeline-line">
              {{ item.startTime }} 到达 {{ item.staffName }} 工位
            </view>
            <view v-if="item.endTime" class="timeline-line">
              {{ item.endTime }} 处理完成
            </view>
            <view v-if="item.context" class="timeline-line">
              处理意见：{{ item.context }}
            </view>
          </view>
        </view>
      </view>

      <view class="flow-card">
        <view class="card-title">
          流程图
        </view>
        <view v-if="flowImage" class="flow-image-wrap">
          <image :src="flowImage" mode="widthFix" class="flow-image" />
        </view>
        <view v-else class="empty-text">
          暂无流程图
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  padding: 20rpx;
}

.summary-card,
.timeline-card,
.flow-card {
  border-radius: 12rpx;
  background: #fff;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
  font-size: 26rpx;
}

.name {
  color: #303133;
  font-size: 30rpx;
  font-weight: 600;
}

.time,
.label {
  color: #909399;
}

.value {
  color: #303133;
  margin-left: 24rpx;
  text-align: right;
}

.actions {
  margin-top: 20rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16rpx;
}

.timeline-item {
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.timeline-item:last-child {
  border-bottom: none;
}

.timeline-line {
  font-size: 24rpx;
  color: #606266;
  margin-bottom: 8rpx;
}

.flow-image-wrap {
  width: 100%;
}

.flow-image {
  width: 100%;
}

.empty-text {
  font-size: 24rpx;
  color: #909399;
}
</style>
