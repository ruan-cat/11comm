<!--
  任务流转页面
  功能：将巡检任务流转给其他员工，填写流转原因和选择接收人

  访问地址: http://localhost:3000/#/pages-sub/inspection/transfer
  建议携带参数: ?task=xxx (JSON字符串)

  示例: http://localhost:3000/#/pages-sub/inspection/transfer?task={"taskId":"TASK_001",...}

  旧代码： gitee-example/pages/inspectionTransfer/inspectionTransfer.vue
-->

<script setup lang="ts">
import type { FormInstance } from 'wot-design-uni/components/wd-form/types'
import type { InspectionTask } from '@/types/inspection'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, reactive, ref } from 'vue'
import { getStaffList, transferInspectionTask } from '@/api/inspection'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '任务流转',
    enablePullDownRefresh: false,
  },
})

/** 路由参数 */
const taskInfoStr = ref('')

/** 任务信息 */
const taskInfo = ref<InspectionTask>({} as InspectionTask)

/** 全局 Toast */
const toast = useGlobalToast()

/** 获取路由参数 */
onLoad((options) => {
  taskInfoStr.value = options?.task as string || ''
  if (taskInfoStr.value) {
    try {
      taskInfo.value = JSON.parse(taskInfoStr.value)
    }
    catch (error) {
      console.error('解析任务信息失败:', error)
    }
  }
})

/** 表单实例 */
const formRef = ref<FormInstance>()

/** 表单数据 */
const formData = reactive({
  /** 接收人ID */
  staffId: '',
  /** 接收人姓名 */
  staffName: '',
  /** 流转说明 */
  transferDesc: '',
})

/** 选中的员工ID（用于 wd-picker 的 v-model） */
const selectedStaffUserId = ref('')

/** 员工列表 */
const staffList = ref<Array<{ userId: string, userName: string }>>([])

/** 表单校验规则 */
const rules = {
  staffId: [{ required: true, message: '请选择接收员工' }],
  transferDesc: [{ required: true, message: '请输入流转说明' }],
}

/**
 * 获取员工列表
 */
const {
  send: sendGetStaffList,
} = useRequest(() => getStaffList(), {
  immediate: false,
})
  .onSuccess((event) => {
    staffList.value = event.data || []
  })
  .onError((event) => {
    console.error('获取员工列表失败:', event)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

async function loadStaffList() {
  await sendGetStaffList()
}

/**
 * 员工选择确认
 * @param value 选中的员工信息
 */
function handleStaffConfirm(value: { value: string, label: string }) {
  formData.staffId = value.value
  formData.staffName = value.label
  selectedStaffUserId.value = value.value
}

/**
 * 提交流转
 */
const {
  loading: submitting,
  send: sendTransferTask,
} = useRequest(transferData => transferInspectionTask(transferData), {
  immediate: false,
})
  .onSuccess(() => {
    toast.success('流转成功')

    // 跳转回巡检打卡页
    setTimeout(() => {
      TypedRouter.toInspectionTaskList()
    }, 1500)
  })
  .onError((error) => {
    console.error('流转失败:', error)
    // 全局拦截器已自动显示错误提示，无需重复处理
  })

async function submitTransfer() {
  // 表单校验
  const valid = await formRef.value?.validate()
  if (!valid)
    return

  // 获取当前用户信息（模拟）
  const currentUserId = 'CURRENT_USER_ID' // TODO: 从用户信息中获取

  // 验证不能流转给自己
  if (formData.staffId === currentUserId) {
    toast.show({
      msg: '不能流转给自己',
    })
    return
  }

  // 提交流转数据
  await sendTransferTask({
    taskId: taskInfo.value.taskId,
    staffId: formData.staffId,
    staffName: formData.staffName,
    transferDesc: formData.transferDesc,
  })
}

onMounted(() => {
  // 解析任务信息
  if (taskInfoStr.value) {
    try {
      taskInfo.value = JSON.parse(taskInfoStr.value)
    }
    catch (error) {
      console.error('解析任务信息失败:', error)
      toast.show({
        msg: '数据错误',
      })
    }
  }

  // 获取员工列表
  loadStaffList()
})
</script>

<template>
  <view class="inspection-transfer">
    <!-- 任务信息 -->
    <view class="task-info">
      <wd-cell-group title="任务信息">
        <wd-cell title="任务ID" :value="taskInfo.taskId" />
        <wd-cell title="巡检计划" :value="taskInfo.inspectionPlanName" />
        <wd-cell title="当前执行人" :value="taskInfo.planUserName" />
        <wd-cell title="巡检时间" :value="taskInfo.planInsTime" />
      </wd-cell-group>
    </view>

    <!-- 流转表单 -->
    <view class="transfer-form">
      <wd-form ref="formRef" :model="formData" :rules="rules">
        <!-- 接收员工 -->
        <wd-form-item label="接收员工" prop="staffId" required>
          <wd-picker
            v-model="selectedStaffUserId"
            :columns="staffList.map((staff) => ({ value: staff.userId, label: staff.userName }))"
            label-key="label"
            value-key="value"
            @confirm="handleStaffConfirm"
          >
            <wd-cell title-width="120rpx" is-link>
              <text :class="formData.staffName ? 'text-gray-900' : 'text-gray-400'">
                {{ formData.staffName || '请选择接收员工' }}
              </text>
            </wd-cell>
          </wd-picker>
        </wd-form-item>

        <!-- 流转说明 -->
        <wd-form-item label="流转说明" prop="transferDesc" required>
          <wd-textarea
            v-model="formData.transferDesc"
            placeholder="请输入流转说明"
            :maxlength="512"
            show-word-limit
          />
        </wd-form-item>
      </wd-form>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-area">
      <wd-button
        type="success"
        size="large"
        block
        :loading="submitting"
        @click="submitTransfer"
      >
        提交
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.inspection-transfer {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;

  .task-info {
    margin-bottom: 20rpx;
  }

  .transfer-form {
    background: #ffffff;
  }

  .submit-area {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx;
    background: #ffffff;
    box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.08);
  }
}
</style>
