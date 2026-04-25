<!--
  工作任务列表页
  功能：显示工作单的处理人列表，选择处理人后跳转到工作单详情

  访问地址: http://localhost:3000/#/pages-sub/work/task-list
  建议携带参数: ?workId=xxx

  http://localhost:3000/#/pages-sub/work/task-list?workId=WO_001

  旧代码：gitee-example/pages/work/workTask.vue
-->

<script lang="ts" setup>
import type { WorkTask } from '@/types/work-order'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getWorkTaskList } from '@/api/work-order'
import { TypedRouter } from '@/router/helpers'

/** 路由参数 */
const props = defineProps<{
  workId?: string
}>()

definePage({
  style: {
    navigationBarTitleText: '选择处理人',
    navigationBarBackgroundColor: '#368bff',
    navigationBarTextStyle: 'white',
  },
})

/** 任务列表 */
const tasks = ref<WorkTask[]>([])

/** 获取任务列表请求 */
const { send: loadTasks, loading } = useRequest(
  () => getWorkTaskList({ workId: props.workId || '', page: 1, row: 100 }),
  { immediate: false },
).onSuccess((event) => {
  const response = event.data
  tasks.value = response?.list || []
}).onError((error) => {
  console.error('获取任务列表失败:', error)
})

/** 选择处理人，跳转到工作单详情 */
function handleChooseStaff(task: WorkTask) {
  TypedRouter.toWorkDetail(props.workId || '')
}

onLoad(() => {
  if (props.workId) {
    loadTasks()
  }
})
</script>

<template>
  <view class="task-list-page">
    <!-- 标题 -->
    <view class="text-gray-500 p-30rpx pb-20rpx text-28rpx">
      选择处理人
    </view>

    <!-- 任务列表 -->
    <view v-if="tasks.length > 0">
      <wd-cell-group border>
        <wd-cell
          v-for="task in tasks"
          :key="task.taskId"
          :title="task.staffName"
          is-link
          @click="handleChooseStaff(task)"
        />
      </wd-cell-group>
    </view>

    <!-- 空状态 -->
    <view v-else-if="!loading" class="mt-100rpx">
      <wd-status-tip image="content" tip="暂无处理人" />
    </view>

    <!-- 加载中 -->
    <view v-if="loading" class="flex items-center justify-center h-200rpx">
      <wd-loading />
    </view>
  </view>
</template>

<style scoped>
.task-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
