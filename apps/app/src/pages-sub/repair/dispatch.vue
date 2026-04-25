<!--
  维修待办单
  功能：显示待处理的维修工单列表
  列表页

  访问地址: http://localhost:3000/#/pages-sub/repair/dispatch
  建议携带参数: ?page=1&row=10

  完整示例: http://localhost:3000/#/pages-sub/repair/dispatch?page=1&row=10

  旧代码：gitee-example/pages/repairDispatch/repairDispatch.vue
-->

<!-- 基本完成检查审核 -->

<script setup lang="ts">
import type { RepairOrder } from '@/types/repair'
import type { PageParams } from '@/types/routes'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import { getRepairStaffList, repairStart, repairStop } from '@/api/repair'
import RepairListItem from '@/components/common/repair-list-item/index.vue'
import RepairListSearchBar from '@/components/common/repair-list-search-bar/index.vue'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { useGlobalMessage } from '@/hooks/useGlobalMessage'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { getCurrentCommunity, getUserInfo } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '维修待办单',
    enablePullDownRefresh: false,
  },
})

const message = useGlobalMessage()
const toast = useGlobalToast()

/** 搜索条件 */
const searchName = ref('')
const selectedState = ref<string>('')

/** 从 URL 参数初始化筛选条件 */
onLoad((options: PageParams['/pages-sub/repair/dispatch']) => {
  // 从 URL 参数读取状态筛选条件
  if (options?.statusCd) {
    selectedState.value = options.statusCd
    console.log('从 URL 参数初始化状态筛选:', options.statusCd)
  }

  // 从 URL 参数读取搜索关键词
  if (options?.repairName) {
    searchName.value = options.repairName
    console.log('从 URL 参数初始化搜索关键词:', options.repairName)
  }
})

/** 列表数据 */
const repairList = ref<RepairOrder[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)

/** z-paging 组件引用 */
const pagingRef = ref()

/** 获取用户信息 */
const userInfo = getUserInfo()
const communityInfo = getCurrentCommunity()

/** 查询维修工单列表请求（z-paging 集成） */
const { send: loadRepairStaffList } = useRequest(
  (params: { page: number, row: number, statusCd?: string }) =>
    getRepairStaffList({
      ...params,
      userId: userInfo.userId || '',
      communityId: communityInfo.communityId || '',
      repairName: searchName.value,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const response = event.data
    total.value = response?.total || 0
    pagingRef.value?.complete(response?.ownerRepairs || [])
  })
  .onError((error) => {
    console.error('加载列表失败:', error)
    pagingRef.value?.complete(false)
  })

/** z-paging 查询回调 */
function handleQuery(pageNo: number, pageSizeValue: number) {
  currentPage.value = pageNo
  pageSize.value = pageSizeValue

  loadRepairStaffList({
    page: pageNo,
    row: pageSizeValue,
    statusCd: selectedState.value,
  })
}

// 进入页面自动触发首次加载
onMounted(() => {
  pagingRef.value?.reload()
})

/** 搜索 */
function handleSearch() {
  pagingRef.value?.reload()
}

/** 查看详情 */
function handleViewDetail(item: RepairOrder) {
  TypedRouter.toRepairDetail(item.repairId!, userInfo.storeId)
}

/** 启动维修 */
const { send: startRepair } = useRequest(
  (params: { repairId: string, communityId: string }) => repairStart(params),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('启动成功')

    // 刷新列表
    setTimeout(() => {
      pagingRef.value?.reload()
    }, 1000)
  })
  .onError((error) => {
    toast.error(error.error || '启动失败')
  })

function handleStartRepair(item: RepairOrder) {
  message.confirm({
    title: '提示',
    msg: '确认启动报修？',
    success: (res) => {
      if (res.action === 'confirm') {
        startRepair({
          repairId: item.repairId!,
          communityId: item.communityId,
        }).catch((error) => {
          console.error('启动维修失败:', error)
        })
      }
    },
  })
}

/** 转单 */
function handleTransfer(item: RepairOrder) {
  TypedRouter.toRepairHandle({
    action: 'TRANSFER',
    repairId: item.repairId!,
    repairType: item.repairType || '',
    preStaffId: item.preStaffId,
    preStaffName: item.preStaffName,
    repairObjType: item.repairObjType,
    publicArea: item.publicArea,
    repairChannel: item.repairChannel,
  })
}

/** 暂停维修 */
const { send: stopRepair } = useRequest(
  (params: { repairId: string, communityId: string, remark: string }) => repairStop(params),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('暂停成功')

    // 刷新列表
    setTimeout(() => {
      pagingRef.value?.reload()
    }, 1000)
  })
  .onError((error) => {
    toast.error(error.error || '暂停失败')
  })

function handleStopRepair(item: RepairOrder) {
  message.prompt({
    title: '暂停维修',
    msg: '请填写暂停原因',
    inputPlaceholder: '请输入暂停原因（必填）',
    inputValue: '',
    inputError: '暂停原因不能为空',
    inputValidate: (value) => {
      const strValue = String(value || '').trim()
      return strValue.length > 0
    },
    success: (res) => {
      if (res.action === 'confirm' && res.value) {
        stopRepair({
          repairId: item.repairId!,
          communityId: item.communityId,
          remark: String(res.value).trim(),
        }).catch((error) => {
          console.error('暂停维修失败:', error)
        })
      }
    },
  })
}

/** 退单 */
function handleReturn(item: RepairOrder) {
  TypedRouter.toRepairHandle({
    action: 'BACK',
    repairId: item.repairId!,
    repairType: item.repairType || '',
    preStaffId: item.preStaffId,
    preStaffName: item.preStaffName,
    repairObjType: item.repairObjType,
    publicArea: item.publicArea,
    repairChannel: item.repairChannel,
  })
}

/** 办结 */
function handleFinish(item: RepairOrder) {
  TypedRouter.toRepairHandle({
    action: 'FINISH',
    repairId: item.repairId!,
    repairType: item.repairType || '',
    preStaffId: item.preStaffId,
    preStaffName: item.preStaffName,
    repairObjType: item.repairObjType,
    publicArea: item.publicArea,
    repairChannel: item.repairChannel,
  })
}

/** 回访 */
function handleAppraise(item: RepairOrder) {
  TypedRouter.toAppraiseRepair({
    repairId: item.repairId!,
    repairType: item.repairType || '',
    repairChannel: item.repairChannel,
    publicArea: item.publicArea,
    communityId: item.communityId!,
  })
}

/** 检查权限 */
function checkAuth(privilegeId: string): boolean {
  // TODO: 实现权限检查逻辑
  return true
}

// ==================== 按钮显示状态判断 ====================

/** 是否显示启动按钮（已派单） */
function canStart(item: RepairOrder): boolean {
  return item.statusCd === '10002'
}

/** 是否显示转单/暂停/办结按钮（已派单、处理中、暂停） */
function canProcessing(item: RepairOrder): boolean {
  return item.statusCd === '10002' || item.statusCd === '10003' || item.statusCd === '10006'
}

/** 是否显示退单按钮（仅限已派单和处理中状态，不是初始派单） */
function canReturn(item: RepairOrder): boolean {
  return item.preStaffId !== '-1'
    && (item.statusCd === '10002' || item.statusCd === '10003')
}

/** 是否显示回访按钮（已完成且需回访） */
function canAppraise(item: RepairOrder): boolean {
  return item.statusCd === '10004' && item.returnVisitFlag === '003' && checkAuth('502021040151320003')
}
</script>

<template>
  <view class="repair-dispatch-page">
    <z-paging
      ref="pagingRef"
      v-model="repairList"
      :default-page-size="pageSize"
      @query="handleQuery"
    >
      <!-- 顶部吸顶工具栏 -->
      <template #top>
        <repair-list-search-bar
          v-model="searchName"
          v-model:selected-state="selectedState"
          :total="total"
          @search="handleSearch"
          @clear="handleSearch"
          @state-change="handleSearch"
        />
      </template>

      <!-- 列表内容 -->
      <view class="repair-list">
        <repair-list-item
          v-for="item in repairList"
          :key="item.repairId"
          :item="item"
        >
          <template #action>
            <!-- 详情按钮 -->
            <wd-button size="small" plain @click="handleViewDetail(item)">
              详情
            </wd-button>

            <!-- 启动按钮：已派单 -->
            <wd-button
              v-if="canStart(item)"
              size="small"
              type="success"
              @click="handleStartRepair(item)"
            >
              启动
            </wd-button>

            <!-- 转单按钮：已派单/处理中 -->
            <wd-button
              v-if="canProcessing(item)"
              size="small"
              type="warning"
              @click="handleTransfer(item)"
            >
              转单
            </wd-button>

            <!-- 暂停按钮：已派单/处理中 -->
            <wd-button
              v-if="canProcessing(item)"
              size="small"
              type="warning"
              @click="handleStopRepair(item)"
            >
              暂停
            </wd-button>

            <!-- 退单按钮 -->
            <wd-button
              v-if="canReturn(item)"
              size="small"
              type="error"
              @click="handleReturn(item)"
            >
              退单
            </wd-button>

            <!-- 办结按钮：已派单/处理中 -->
            <wd-button
              v-if="canProcessing(item)"
              size="small"
              type="success"
              @click="handleFinish(item)"
            >
              办结
            </wd-button>

            <!-- 回访按钮：已完成且需回访 -->
            <wd-button
              v-if="canAppraise(item)"
              size="small"
              type="success"
              @click="handleAppraise(item)"
            >
              回访
            </wd-button>
          </template>
        </repair-list-item>
      </view>

      <!-- 空状态 -->
      <template #empty>
        <view class="empty-wrap">
          <wd-status-tip image="search" tip="暂无待办工单" />
        </view>
      </template>

      <!-- 加载状态 -->
      <template #loading>
        <ZPagingLoading
          icon="document"
          icon-class="i-carbon-document text-orange-400 animate-pulse"
          primary-text="正在加载待办工单..."
          secondary-text="请稍候片刻"
        />
      </template>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.repair-dispatch-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.repair-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.empty-wrap {
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
