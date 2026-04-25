<!--
  房间缴费页面
  功能：查询房屋信息，显示欠费缴费和缴费记录

  访问地址: http://localhost:3000/#/pages-sub/fee/room-pay
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:3000/#/pages-sub/fee/room-pay?communityId=COMM_001

  旧代码：gitee-example/pages/fee/roomPayFee.vue
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { getRoomInfo } from '@/api/room'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '房间缴费',
    enablePullDownRefresh: false,
  },
})

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 全局 Toast */
const toast = useGlobalToast()

/** 表单标签统一宽度 */
const LABEL_WIDTH = '140rpx'

/** 搜索表单 */
const searchForm = reactive({
  roomName: '',
  floorNum: '',
  unitNum: '',
  roomNum: '',
})

/** 房屋信息 */
const roomInfo = ref<{
  roomId: string
  floorNum?: string
  unitNum?: string
  roomNum?: string
  builtUpArea?: string
  ownerName?: string
  link?: string
}>({ roomId: '' })

/** 当前 Tab */
const activeTab = ref(0)

/** 表单引用 */
const formRef = ref()

/** 表单校验规则 */
const searchRules: FormRules = {
  roomName: [{ required: true, message: '请输入房屋编号' }],
}

/** 加载房屋信息 */
const { send: loadRoomInfo, loading: roomLoading } = useRequest(
  (params: { floorNum?: string, unitNum?: string, roomNum?: string }) =>
    getRoomInfo({
      page: 1,
      row: 1,
      communityId: communityInfo.communityId,
      floorNum: params.floorNum,
      unitNum: params.unitNum,
      roomNum: params.roomNum,
    }),
  { immediate: false },
).onSuccess((event) => {
  const data = event.data as { rooms: typeof roomInfo.value[] }
  if (!data.rooms || data.rooms.length === 0) {
    toast.error('未查询到房屋')
    roomInfo.value = { roomId: '' }
    return
  }
  roomInfo.value = data.rooms[0]
  // 默认选中第一个 tab
  activeTab.value = 0
}).onError((error) => {
  console.error('加载房屋信息失败:', error)
  toast.warning('加载房屋信息失败')
})

/** 搜索房屋 */
async function handleSearch() {
  const valid = await formRef.value?.validate()
  if (!valid) {
    return
  }

  const roomNums = searchForm.roomName.split('-')
  if (roomNums.length !== 3) {
    toast.error('输入房屋格式错误，如1-1-1')
    return
  }

  searchForm.floorNum = roomNums[0]
  searchForm.unitNum = roomNums[1]
  searchForm.roomNum = roomNums[2]

  loadRoomInfo({
    floorNum: searchForm.floorNum,
    unitNum: searchForm.unitNum,
    roomNum: searchForm.roomNum,
  })
}

/** Tab 切换 */
function handleTabChange(index: number) {
  activeTab.value = index
}

/** 创建费用 */
function handleCreateFee() {
  if (!roomInfo.value.roomId) {
    toast.error('请先搜索房屋')
    return
  }

  TypedRouter.toFeeCreate({
    payerObjId: roomInfo.value.roomId,
    payerObjName: `${roomInfo.value.floorNum || ''}${roomInfo.value.unitNum || ''}${roomInfo.value.roomNum || ''}`,
  })
}
</script>

<template>
  <view class="room-pay-page">
    <!-- 搜索栏 -->
    <wd-form ref="formRef" :model="searchForm" :rules="searchRules">
      <FormSectionTitle title="房屋检索" />
      <wd-cell-group border>
        <wd-input
          v-model="searchForm.roomName"
          label="房屋编号"
          :label-width="LABEL_WIDTH"
          prop="roomName"
          placeholder="输入房屋编号 楼栋-单元-房屋"
          clearable
          @confirm="handleSearch"
        />
      </wd-cell-group>

      <view class="search-bar bg-white px-3 pb-3 pt-2">
        <view class="flex items-center justify-end">
          <wd-button size="small" @click="handleSearch">
            搜索
          </wd-button>
          <wd-button v-if="roomInfo.roomId" size="small" type="primary" custom-class="ml-8rpx" @click="handleCreateFee">
            创建费用
          </wd-button>
        </view>
      </view>
    </wd-form>

    <!-- 房屋信息 -->
    <view v-if="roomInfo.roomId">
      <FormSectionTitle title="房屋信息" />

      <wd-cell-group>
        <wd-cell title="房屋编号">
          <text>{{ roomInfo.floorNum }}-{{ roomInfo.unitNum }}-{{ roomInfo.roomNum }}</text>
        </wd-cell>
        <wd-cell title="建筑面积">
          <text>{{ roomInfo.builtUpArea || '-' }}平方米</text>
        </wd-cell>
        <wd-cell title="业主">
          <text>
            {{ roomInfo.ownerName }}
            <text v-if="roomInfo.link">({{ roomInfo.link }})</text>
          </text>
        </wd-cell>
      </wd-cell-group>

      <!-- Tab 栏 -->
      <view class="tab-bar mt-3 bg-white">
        <view class="flex">
          <view
            class="flex-1 py-3 text-center"
            :class="activeTab === 0 ? 'border-b-2 border-green-500 text-green-500 font-medium' : 'text-gray-500'"
            @click="handleTabChange(0)"
          >
            欠费缴费
          </view>
          <view
            class="flex-1 py-3 text-center"
            :class="activeTab === 1 ? 'border-b-2 border-green-500 text-green-500 font-medium' : 'text-gray-500'"
            @click="handleTabChange(1)"
          >
            缴费记录
          </view>
        </view>
      </view>

      <!-- Tab 内容 -->
      <view class="tab-content p-3">
        <!-- 欠费缴费 -->
        <view v-show="activeTab === 0">
          <text class="text-gray-400">欠费缴费功能开发中...</text>
        </view>

        <!-- 缴费记录 -->
        <view v-show="activeTab === 1">
          <text class="text-gray-400">缴费记录功能开发中...</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="flex flex-col items-center justify-center py-20">
      <text class="text-gray-400">请输入房屋编号进行搜索</text>
    </view>

    <!-- 加载状态 -->
    <view v-if="roomLoading" class="p-3 text-center text-gray-400">
      <text>加载中...</text>
    </view>
  </view>
</template>

<style scoped>
.tab-bar {
  background-color: #fff;
}
</style>
