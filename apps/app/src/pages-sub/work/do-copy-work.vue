<!--
  处理抄送工作单页面
  功能：处理抄送给我的工作单，可以查看任务项详情并提交评分

  访问地址: http://localhost:3000/#/pages-sub/work/do-copy-work
  建议携带参数: ?copyId=xxx

  http://localhost:3000/#/pages-sub/work/do-copy-work?copyId=WC_001

  旧代码：gitee-example/pages/work/doCopyWork.vue
-->

<script lang="ts" setup>
import type { WorkOrderDetail, WorkTaskItem } from '@/types/work-order'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import { finishWorkCopy, getWorkOrderDetail, getWorkTaskItems } from '@/api/work-order'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

/** 路由参数 */
const props = defineProps<{
  copyId?: string
  workId?: string
}>()

definePage({
  style: {
    navigationBarTitleText: '处理抄送工作单',
    navigationBarBackgroundColor: '#368bff',
    navigationBarTextStyle: 'white',
  },
})

const toast = useGlobalToast()

/** 工作单信息 */
const workDetail = ref<WorkOrderDetail | null>(null)

/** 任务项列表 */
const taskItems = ref<WorkTaskItem[]>([])

/** 选中的任务项ID */
const selectedItemId = ref('')

/** 评分（字符串类型用于 picker） */
const scoreValue = ref('10')

/** 扣款金额 */
const deductionMoney = ref(0)

/** 扣款原因 */
const deductionReason = ref('')

/** 评分选项 */
const scoreColumns = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}分`,
}))

/** 选中的任务项详情 */
const selectedItem = computed(() => {
  return taskItems.value.find(item => item.itemId === selectedItemId.value)
})

/** 获取工作单详情 */
const { send: loadDetail } = useRequest(
  () => getWorkOrderDetail({ orderId: props.workId || '' }),
  { immediate: false },
).onSuccess(({ data }) => {
  workDetail.value = data.order as WorkOrderDetail
}).onError((error) => {
  console.error('获取工作单详情失败:', error)
})

/** 获取任务项列表 */
const { send: loadTaskItems } = useRequest(
  () => getWorkTaskItems({ workId: props.workId || '', states: 'W,C' }),
  { immediate: false },
).onSuccess(({ data }) => {
  taskItems.value = data.list || []
}).onError((error) => {
  console.error('获取任务项列表失败:', error)
})

/** 提交处理 */
const { send: submitFinish, loading: submitLoading } = useRequest(
  () => finishWorkCopy({
    copyId: props.copyId || '',
    itemId: selectedItemId.value,
    score: Number(scoreValue.value),
    deductionMoney: deductionMoney.value,
    deductionReason: deductionReason.value,
  }),
  { immediate: false },
).onSuccess(() => {
  toast.success('提交成功')
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}).onError((error) => {
  console.error('提交失败:', error)
})

/** 处理提交 */
function handleSubmit() {
  if (!selectedItemId.value) {
    toast.warning('请选择任务项')
    return
  }
  if (!deductionReason.value.trim()) {
    toast.warning('请输入处理说明')
    return
  }
  submitFinish()
}

/** 获取任务项状态文本 */
function getStateText(state: string) {
  const stateMap: Record<string, string> = {
    W: '未办理',
    C: '已完成',
    P: '处理中',
  }
  return stateMap[state] || state
}

/** 预览图片 */
function handlePreviewImage(url: string, urls: string[]) {
  uni.previewImage({
    current: url,
    urls,
  })
}

onLoad(() => {
  if (props.workId) {
    loadDetail()
    loadTaskItems()
  }
})
</script>

<template>
  <view class="do-copy-work-page">
    <!-- 工作单基本信息 -->
    <FormSectionTitle title="工作单信息" icon="i-carbon-document" />
    <wd-cell-group border>
      <wd-cell title="题目" :value="workDetail?.title || '-'" />
      <wd-cell title="提交人" :value="workDetail?.creatorName || '-'" />
    </wd-cell-group>

    <!-- 任务项列表 -->
    <FormSectionTitle title="任务项列表" icon="i-carbon-list" />
    <wd-cell-group border>
      <view
        v-for="item in taskItems"
        :key="item.itemId"
        class="task-item border-b border-gray-100 p-20rpx"
        @click="selectedItemId = item.itemId"
      >
        <view class="flex items-start justify-between">
          <view class="flex-1">
            <view class="text-gray-800 text-28rpx">
              {{ item.content }}
            </view>
            <view class="text-gray-500 mt-10rpx text-24rpx">
              {{ item.staffName || '-' }} · {{ item.createTime }}
            </view>
          </view>
          <view v-if="item.state === 'C'" class="ml-20rpx">
            <!-- @ts-ignore - wot-design-uni radio -->
            <wd-radio :value="selectedItemId === item.itemId" />
          </view>
          <view v-else class="text-gray-400 ml-20rpx text-24rpx">
            {{ getStateText(item.state) }}
          </view>
        </view>
      </view>
    </wd-cell-group>

    <!-- 选中任务项详情 -->
    <view v-if="selectedItem">
      <FormSectionTitle title="任务详情" icon="i-carbon-information" />
      <wd-cell-group border>
        <wd-cell title="处理人" :value="selectedItem.staffName || '-'" />
        <wd-cell title="说明" :value="selectedItem.remark || '-'" />
        <wd-cell title="完成时间" :value="selectedItem.finishTime || '-'" />

        <!-- 附件图片 -->
        <view v-if="selectedItem.pathUrls?.length" class="p-20rpx">
          <view class="text-gray-600 mb-10rpx text-28rpx">
            附件
          </view>
          <view class="attachment-list">
            <image
              v-for="(url, index) in selectedItem.pathUrls"
              :key="index"
              :src="url"
              mode="aspectFill"
              class="attachment-list__item w-120rpx h-120rpx rounded-10rpx"
              @click="handlePreviewImage(url, selectedItem.pathUrls || [])"
            />
          </view>
        </view>
      </wd-cell-group>

      <!-- 评价表单 -->
      <FormSectionTitle title="评价" icon="i-carbon-star" />
      <wd-cell-group border>
        <wd-picker
          v-model="scoreValue"
          :columns="scoreColumns"
          label="评分"
          label-width="100px"
        />

        <wd-input
          v-model="deductionMoney"
          type="number"
          label="扣款金额"
          label-width="100px"
          placeholder="请输入扣款金额"
        />

        <wd-textarea
          v-model="deductionReason"
          placeholder="请输入处理说明（必填）"
          :maxlength="200"
          show-word-limit
        />
      </wd-cell-group>

      <!-- 提交按钮 -->
      <view class="p-30rpx">
        <wd-button
          type="primary"
          block
          :loading="submitLoading"
          @click="handleSubmit"
        >
          提交
        </wd-button>
      </view>
    </view>
  </view>
</template>

<style scoped>
.do-copy-work-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.task-item:last-child {
  border-bottom: none;
}

.attachment-list {
  display: flex;
  flex-wrap: wrap;
  margin: -10rpx;
}

.attachment-list__item {
  margin: 10rpx;
}
</style>
