<!--
  充电桩列表页面
  功能：查询并选择充电桩，进入充电桩详情

  访问地址: http://localhost:3000/#/pages-sub/fee/charge
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/fee/charge?communityId=COMM_001

  旧代码：gitee-example/pages/charge/charge.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { onMounted, reactive, ref } from 'vue'
import { getChargeMachineList } from '@/api/fee'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import ZPagingLoading from '@/components/common/z-paging-loading/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '充电桩',
    enablePullDownRefresh: false,
  },
})

interface ChargeMachine {
  machineId: string
  machineName: string
  machineCode: string
  photoUrl: string
  communityId: string
  factoryName: string
  ruleName: string
  chargeTypeName: string
  stateName: string
  state: string
}

type ZPagingRef = any

const LABEL_WIDTH = '92px'
const communityInfo = getCurrentCommunity()
const toast = useGlobalToast()
const pagingRef = ref<ZPagingRef>()
const formRef = ref()

const machines = ref<ChargeMachine[]>([])
const currentCommunityId = ref(communityInfo.communityId)
const searchModel = reactive({
  machineNameLike: '',
})

const searchRules: FormRules = {
  machineNameLike: [{ required: false, message: '请输入充电桩名称' }],
}

const { send: loadMachines } = useRequest(
  (params: { page: number, row: number, machineNameLike?: string, communityId: string }) => getChargeMachineList(params),
  { immediate: false },
)
  .onSuccess((event) => {
    machines.value = event.data.list || []
    pagingRef.value?.complete(machines.value)
  })
  .onError((error) => {
    console.error('加载充电桩列表失败:', error)
    toast.warning('加载充电桩列表失败，请稍后重试')
    pagingRef.value?.complete(false)
  })

function handleQuery(pageNo: number, pageSize: number) {
  loadMachines({
    page: pageNo,
    row: pageSize,
    communityId: currentCommunityId.value,
    machineNameLike: searchModel.machineNameLike || undefined,
  })
}

function handleSearch() {
  pagingRef.value?.reload()
}

function handleDetail(machine: ChargeMachine) {
  TypedRouter.toFeeChargeDetail({
    communityId: machine.communityId,
    machineId: machine.machineId,
    machineName: machine.machineName,
  })
}

onLoad((options) => {
  currentCommunityId.value = options?.communityId || communityInfo.communityId
})

onMounted(() => {
  pagingRef.value?.reload()
})
</script>

<template>
  <view class="charge-page">
    <wd-form ref="formRef" :model="searchModel" :rules="searchRules">
      <FormSectionTitle title="查询条件" />
      <wd-cell-group border>
        <wd-input
          v-model="searchModel.machineNameLike"
          label="充电桩名称"
          :label-width="LABEL_WIDTH"
          prop="machineNameLike"
          placeholder="请输入充电桩名称"
          clearable
          @confirm="handleSearch"
        />
      </wd-cell-group>

      <view class="search-actions">
        <wd-button type="primary" block @click="handleSearch">
          搜索
        </wd-button>
      </view>
    </wd-form>

    <FormSectionTitle title="充电桩" />
    <z-paging ref="pagingRef" v-model="machines" @query="handleQuery">
      <view class="list-wrap">
        <view class="machine-grid">
          <view
            v-for="(item, index) in machines"
            :key="item.machineId || index"
            class="machine-card"
            @click="handleDetail(item)"
          >
            <wd-img
              :src="item.photoUrl || '/static/image/noPhoto.jpg'"
              mode="aspectFill"
              class="machine-image"
            />
            <view class="machine-name-wrap">
              <text class="machine-name">{{ item.machineName }}</text>
            </view>
          </view>
        </view>
      </view>

      <template #empty>
        <view class="empty-wrap">
          <wd-status-tip image="search" tip="暂无充电桩" />
        </view>
      </template>

      <template #loading>
        <z-paging-loading
          icon="data-base"
          icon-class="i-carbon-data-base text-blue-400 animate-pulse"
          primary-text="正在加载充电桩列表..."
          secondary-text="请稍候片刻"
        />
      </template>
    </z-paging>
  </view>
</template>

<style scoped lang="scss">
.charge-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-actions {
  padding: 20rpx 24rpx 16rpx;
}

.list-wrap {
  padding: 0 24rpx 24rpx;
}

.machine-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -12rpx;
}

.machine-card {
  width: calc(50% - 24rpx);
  margin: 0 12rpx 24rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.machine-image {
  width: 100%;
  height: 220rpx;
}

.machine-name-wrap {
  padding: 16rpx;
  display: flex;
  justify-content: center;
}

.machine-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  text-align: center;
}

.empty-wrap {
  padding: 120rpx 0;
}
</style>
