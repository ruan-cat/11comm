<!--
  任务流转页
  功能：将保养任务流转给其他员工

  访问地址: http://localhost:3000/#/pages-sub/maintenance/transfer
  建议携带参数: ?taskId=xxx

  示例: http://localhost:3000/#/pages-sub/maintenance/transfer?taskId=MT_001

  旧代码：gitee-example/pages/maintainance/maintainanceTransfer.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import type { MaintenanceTask } from '@/types/maintenance'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getStaffList } from '@/api/inspection'
import { getMaintenanceDetail, transferMaintenanceTask } from '@/api/maintenance'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

definePage({
  style: {
    navigationBarTitleText: '任务流转',
    enablePullDownRefresh: false,
  },
})

const toast = useGlobalToast()

/** 路由参数 */
const taskId = ref('')

/** 获取路由参数 */
onLoad((options) => {
  taskId.value = options?.taskId as string || ''
})

/** 任务信息 */
const taskInfo = ref<MaintenanceTask | null>(null)

/** 表单数据 */
const formData = ref({
  targetStaffId: '',
  targetStaffName: '',
  reason: '',
})

/** 表单引用 */
const formRef = ref()

/** 表单校验规则 */
const rules: FormRules = {
  targetStaffId: [
    { required: true, message: '请选择接收员工' },
  ],
  reason: [
    { required: true, message: '请输入流转原因' },
  ],
}

/** 员工列表 */
const staffList = ref<Array<{ userId: string, userName: string }>>([])

/** 员工选择器显示状态 */
const showStaffPicker = ref(false)

/** 获取任务详情 */
const { loading: loadingTask, send: loadTaskDetail } = useRequest(
  () => getMaintenanceDetail({ taskId: taskId.value }),
  { immediate: false },
)
  .onSuccess((event) => {
    taskInfo.value = (event.data as { task: MaintenanceTask }).task || null
  })
  .onError((error) => {
    console.error('获取任务详情失败:', error)
    toast.error('获取任务详情失败')
  })

/** 获取员工列表 */
const { send: loadStaffList } = useRequest(
  () => getStaffList(),
  { immediate: false },
)
  .onSuccess((event) => {
    staffList.value = event.data || []
  })
  .onError((error) => {
    console.error('获取员工列表失败:', error)
  })

/** 加载数据 */
async function loadData() {
  if (!taskId.value)
    return
  await Promise.all([loadTaskDetail(), loadStaffList()])
}

/** 处理员工选择 */
function handleStaffConfirm({ value }: { value: string }) {
  const staff = staffList.value.find(item => item.userId === value)
  if (staff) {
    formData.value.targetStaffId = staff.userId
    formData.value.targetStaffName = staff.userName
  }
  showStaffPicker.value = false
}

/** 获取员工显示名称 */
function getStaffLabel(userId: string): string {
  const staff = staffList.value.find(item => item.userId === userId)
  return staff?.userName || ''
}

/** 提交流转 */
const { loading: submitting, send: submitTransfer } = useRequest(
  () => transferMaintenanceTask({
    taskId: taskId.value,
    targetStaffId: formData.value.targetStaffId,
    reason: formData.value.reason,
  }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('流转成功')
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  })
  .onError((error) => {
    console.error('流转失败:', error)
    toast.error('流转失败')
  })

/** 处理提交 */
async function handleSubmit() {
  try {
    await formRef.value?.validate()

    // 验证不能流转给当前执行人
    if (taskInfo.value?.staffId === formData.value.targetStaffId) {
      toast.error('不能流转给当前执行人')
      return
    }

    await submitTransfer()
  }
  catch (error) {
    console.error('表单校验失败:', error)
  }
}

/** 获取状态颜色 */
function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    10001: '#ff9800', // 待保养
    10002: '#2196f3', // 保养中
    10003: '#4caf50', // 已完成
  }
  return colorMap[status] || '#999999'
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="transfer-page">
    <!-- 任务信息卡片 -->
    <view v-if="taskInfo" class="task-card">
      <view class="task-header">
        <view class="task-name">
          <wd-icon name="" custom-class="i-carbon-settings text-colorui-blue text-24px" />
          <text>{{ taskInfo.taskName }}</text>
        </view>
        <wd-tag :custom-style="`background-color: ${getStatusColor(taskInfo.status)}`" size="small">
          {{ taskInfo.statusName }}
        </wd-tag>
      </view>

      <view class="task-info">
        <view class="info-item">
          <wd-icon name="" custom-class="i-carbon-machine-learning text-gray-400 text-16px" />
          <text>设备：{{ taskInfo.machineName }}</text>
        </view>
        <view class="info-item">
          <wd-icon name="" custom-class="i-carbon-time text-gray-400 text-16px" />
          <text>计划时间：{{ taskInfo.planTime }}</text>
        </view>
        <view v-if="taskInfo.staffName" class="info-item">
          <wd-icon name="" custom-class="i-carbon-user text-gray-400 text-16px" />
          <text>当前执行人：{{ taskInfo.staffName }}</text>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-else-if="loadingTask" class="loading-wrap">
      <wd-loading type="ring" />
    </view>

    <!-- 流转表单 -->
    <view class="form-section">
      <wd-form ref="formRef" :model="formData" :rules="rules">
        <!-- 接收员工 -->
        <FormSectionTitle title="接收员工" icon="i-carbon-user-avatar" required />
        <wd-cell-group>
          <wd-cell
            title="选择员工"
            is-link
            :value="getStaffLabel(formData.targetStaffId) || '请选择'"
            @click="showStaffPicker = true"
          />
        </wd-cell-group>

        <!-- 流转原因 -->
        <FormSectionTitle title="流转原因" icon="i-carbon-document" required class="mt-4" />
        <wd-cell-group>
          <wd-textarea
            v-model="formData.reason"
            placeholder="请输入流转原因"
            :maxlength="200"
            show-word-limit
            clearable
          />
        </wd-cell-group>
      </wd-form>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <wd-button
        type="primary"
        size="large"
        block
        :loading="submitting"
        @click="handleSubmit"
      >
        提交流转
      </wd-button>
    </view>

    <!-- 员工选择器 -->
    <wd-picker
      v-model:visible="showStaffPicker"
      :columns="staffList.map(item => ({ label: item.userName, value: item.userId }))"
      label-key="label"
      value-key="value"
      title="选择接收员工"
      @confirm="handleStaffConfirm"
    />
  </view>
</template>

<style scoped lang="scss">
.transfer-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.task-card {
  margin: 20rpx;
  padding: 32rpx;
  background: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;

    .task-name {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }

    .task-name .wd-icon {
      margin-right: 12rpx;
    }
  }

  .task-info {
    .info-item {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      color: #666666;
      margin-bottom: 12rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .wd-icon {
        margin-right: 12rpx;
      }
    }
  }
}

.loading-wrap {
  padding: 60rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-section {
  padding: 0 20rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + var(--window-bottom, 0px));
  background: #ffffff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.mt-4 {
  margin-top: 32rpx;
}
</style>
