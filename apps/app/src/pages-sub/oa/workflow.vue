<!--
  OA 工作流首页
  功能：显示起草、待办、已办三个分区，支持进入对应流程页面

  访问地址: http://localhost:3000/#/pages-sub/oa/workflow

  旧代码：gitee-example/pages/oaWorkflow/oaWorkflow.vue
-->

<script setup lang="ts">
import type { OaWorkflowFlow } from '@/types/oa-workflow'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { queryOaWorkflow } from '@/api/oa-workflow'

definePage({
  style: {
    navigationBarTitleText: 'OA 工作流',
  },
})

/** 当前激活 Tab */
const active = ref(0)

/** 工作流列表 */
const workflowFlows = ref<OaWorkflowFlow[]>([])

/** Tab 配置 */
const tabs = [
  { label: '起草', value: 0 },
  { label: '待办', value: 1 },
  { label: '已办', value: 2 },
]

/** 加载工作流定义 */
const { send: loadWorkflowFlows } = useRequest(
  () => queryOaWorkflow({ page: 1, row: 100, state: 'C', flowType: '1001' }),
  {
    immediate: false,
  },
)
  .onSuccess((event) => {
    workflowFlows.value = event.data?.data || []
  })
  .onError((error) => {
    console.error('查询工作流失败:', error)
    workflowFlows.value = []
  })

/** 切换 Tab */
function handleTabChange(event: { index: number }) {
  active.value = event.index
}

/** 进入对应流程页面 */
function handleOpenFlow(flow: OaWorkflowFlow) {
  if (active.value === 0) {
    uni.navigateTo({
      url: `/pages-sub/oa/workflow-form?flowId=${flow.flowId}&flowName=${encodeURIComponent(flow.flowName)}`,
    })
    return
  }

  if (active.value === 1) {
    uni.navigateTo({
      url: `/pages-sub/oa/workflow-todo?flowId=${flow.flowId}&flowName=${encodeURIComponent(flow.flowName)}`,
    })
    return
  }

  uni.navigateTo({
    url: `/pages-sub/oa/workflow-finish?flowId=${flow.flowId}&flowName=${encodeURIComponent(flow.flowName)}`,
  })
}

/** 获取流程右侧提示文案 */
function getFlowDescription(flow: OaWorkflowFlow) {
  if (active.value === 1) {
    return `待办: ${flow.undoCount}`
  }

  if (active.value === 2) {
    return '查看已办记录'
  }

  return '新建流程单'
}

onLoad(() => {
  loadWorkflowFlows()
})

onShow(() => {
  loadWorkflowFlows()
})
</script>

<template>
  <view class="workflow-page">
    <wd-tabs :value="active" @change="handleTabChange">
      <wd-tab v-for="tab in tabs" :key="tab.value" :title="tab.label" />
    </wd-tabs>

    <view class="content-area">
      <wd-cell-group v-if="workflowFlows.length > 0" border>
        <wd-cell
          v-for="flow in workflowFlows"
          :key="flow.flowId"
          :title="flow.flowName"
          :value="getFlowDescription(flow)"
          is-link
          @click="handleOpenFlow(flow)"
        >
          <template #icon>
            <wd-icon name="" custom-class="i-carbon-document text-blue-500 mr-2" />
          </template>
        </wd-cell>
      </wd-cell-group>

      <wd-status-tip v-else image="content" tip="暂无可用流程" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.workflow-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content-area {
  padding: 20rpx;
}
</style>
