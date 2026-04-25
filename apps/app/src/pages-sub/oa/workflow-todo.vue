<!--
  工作流待办页
  功能：显示当前流程的待办工单，支持分页加载和进入详情处理

  访问地址: http://localhost:3000/#/pages-sub/oa/workflow-todo
  建议携带参数: ?flowId=FLOW_001&flowName=请假申请

  旧代码：gitee-example/pages/newOaWorkflowUndo/newOaWorkflowUndo.vue
-->

<script setup lang="ts">
import type { OaWorkflowFormDataRecord } from '@/types/oa-workflow'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { queryOaWorkflowUserTaskFormData } from '@/api/oa-workflow'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'

definePage({
  style: {
    navigationBarTitleText: '工作流待办',
    enablePullDownRefresh: false,
  },
})

/** 分页组件引用 */
type ZPagingRef = any
const pagingRef = ref<ZPagingRef>()
/** 列表数据 */
const dataList = ref<OaWorkflowFormDataRecord[]>([])
/** 流程ID */
const flowId = ref('')
/** 流程名称 */
const flowName = ref('')

/** 加载待办列表 */
const { send: loadTodoList } = useRequest(
  (params: { page: number, row: number, flowId: string }) =>
    queryOaWorkflowUserTaskFormData(params),
  {
    immediate: false,
  },
)
  .onSuccess((event) => {
    const list = event.data?.data || []
    pagingRef.value?.complete(list)
  })
  .onError((error) => {
    console.error('加载待办列表失败:', error)
    pagingRef.value?.complete(false)
  })

/** 分页查询 */
function handleQuery(pageNo: number, pageSize: number) {
  if (!flowId.value) {
    pagingRef.value?.complete([])
    return
  }

  loadTodoList({
    page: pageNo,
    row: pageSize,
    flowId: flowId.value,
  })
}

/** 进入详情 */
function handleGoDetail(item: OaWorkflowFormDataRecord) {
  uni.navigateTo({
    url: `/pages-sub/oa/workflow-detail?flowId=${item.flowId}&id=${item.id}&action=Audit&taskId=${item.taskId}`,
  })
}

/** 状态文案 */
function getStateText(item: OaWorkflowFormDataRecord) {
  return item.stateName || '未知'
}

onLoad((options) => {
  flowId.value = options?.flowId || ''
  flowName.value = decodeURIComponent(options?.flowName || '')

  if (flowName.value) {
    uni.setNavigationBarTitle({
      title: `${flowName.value} - 待办`,
    })
  }
})

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="todo-page">
    <z-paging ref="pagingRef" v-model="dataList" @query="handleQuery">
      <template #loading>
        <ZPagingLoading
          icon="task"
          icon-class="i-carbon-task text-blue-500 animate-pulse"
          primary-text="正在加载待办列表..."
          secondary-text="请稍候片刻"
        />
      </template>

      <view class="list-container">
        <view
          v-for="item in dataList"
          :key="item.id"
          class="item-card"
          @click="handleGoDetail(item)"
        >
          <view class="item-header">
            <view class="item-title">
              <wd-icon name="" custom-class="i-carbon-document text-green-500 mr-2" />
              <text>{{ item.createUserName }}申请的{{ flowName || '流程' }}单</text>
            </view>
            <wd-tag type="warning" size="small">
              {{ getStateText(item) }}
            </wd-tag>
          </view>

          <view class="item-time">
            <text class="label">申请时间：</text>
            <text>{{ item.createTime }}</text>
          </view>
        </view>
      </view>

      <template #empty>
        <wd-status-tip image="content" tip="暂无待办数据" />
      </template>
    </z-paging>
  </view>
</template>

<style scoped lang="scss">
.todo-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.list-container {
  padding: 20rpx;
}

.item-card {
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  background: #fff;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgb(0 0 0 / 4%);
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-title {
  display: flex;
  align-items: center;
  color: #303133;
  font-size: 28rpx;
  font-weight: 500;
}

.item-time {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #909399;
}

.label {
  margin-right: 8rpx;
}
</style>
