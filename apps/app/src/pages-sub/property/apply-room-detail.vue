<!--
  房屋申请详情页
  功能：显示房屋申请详细信息，支持验房和审核操作

  访问地址: http://localhost:3000/#/pages-sub/property/apply-room-detail
  建议携带参数: ?ardId=xxx&communityId=xxx

  http://localhost:3000/#/pages-sub/property/apply-room-detail?ardId=ARD_002&communityId=COMM_001

  旧代码：gitee-example/pages/applyRoomDetail/applyRoomDetail.vue
-->
<script setup lang="ts">
import type { DiscountType, PropertyApplication } from '@/types/property-application'
import { onLoad, onReady, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import {
  getFeeDetailList,
  getFeeDiscountList,
  getPropertyApplicationDetail,
  submitCheckUpdate,
  submitReviewUpdate,
} from '@/api/property-application'
import { extractApplyRecordParams } from '@/hooks/property/use-property-apply-room'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { goBack, TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '房屋申请详情',
  },
})

const toast = useGlobalToast()

const applyRoomInfo = ref<PropertyApplication>({} as PropertyApplication)
const errorSwitch = ref(false)
const checkStateRange = ref([
  { state: 2, name: '验房通过' },
  { state: 3, name: '验房不通过' },
])
const reviewStateRange = ref([
  { state: 4, name: '审批通过' },
  { state: 5, name: '审批不通过' },
])
const checkState = ref<{ state: number, name: string }>({ state: 0, name: '' })
const reviewState = ref<{ state: number, name: string }>({ state: 0, name: '' })
const checkRemark = ref('')
const reviewRemark = ref('')
const discountTypeRange = ref([{ id: '3003', name: '优惠(需要申请)' }])
const discountType = ref<{ id: string, name: string }>({ id: '', name: '' })
const discountIdRange = ref<any[]>([])
const discountId = ref<any>({})
const returnWays = ref([
  { statCd: 1001, statName: '享受缴纳折扣' },
  { statCd: 1002, statName: '返还至余额账户' },
])
const returnWayIndex = ref(0)
const returnWay = ref<string>('')
const fees = ref<any[]>([])
const selectedFees = ref<string[]>([])
const maxPhotoNum = ref(4)
const sendImgList = ref<string[]>([])
const photos = ref<string[]>([])
const canEdit = ref(false)
const imgTitle = ref('图片材料')

const pickerDisabled = computed(() => {
  return false
})

function getBase64List(_data: string[]) {
  photos.value = _data
}

/** 查询费用项缴费历史 - 使用 useRequest */
const {
  send: loadFeeDetailRequest,
  onSuccess: onFeeDetailSuccess,
  onError: onFeeDetailError,
} = useRequest(
  () => getFeeDetailList({
    page: 1,
    row: 50,
    communityId: applyRoomInfo.value.communityId,
    feeId: applyRoomInfo.value.feeId,
  }),
  {
    immediate: false,
  },
)

onFeeDetailSuccess((res) => {
  fees.value = res.data.feeDetails
})

onFeeDetailError((error) => {
  console.error('查询费用项缴费历史失败', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

/** 缴费历史复选框选择 */
function checkboxChange(e: { detail: { value: string[] } }) {
  const values = e.detail.value
  selectedFees.value = values
  fees.value.forEach((item: any, index: number) => {
    if (values.includes(item.detailId)) {
      item.checked = true
    }
  })
}

function empty() {
  // 空方法
}

/** 失去焦点 */
function onBlur() {
  uni.pageScrollTo({
    scrollTop: 0,
  })
}

/** 修改开始时间 */
function dateStartChange(e: { detail: { value: string } }) {
  applyRoomInfo.value.startTime = e.detail.value
}

/** 修改结束时间 */
function dateEndChange(e: { detail: { value: string } }) {
  applyRoomInfo.value.endTime = e.detail.value
}

function switchShowModel() {
  errorSwitch.value = !errorSwitch.value
}

/** 查询费用折扣列表 - 使用 useRequest */
const {
  send: loadFeeDiscountRequest,
  onSuccess: onFeeDiscountSuccess,
  onError: onFeeDiscountError,
} = useRequest(
  (discountTypeId: DiscountType) => getFeeDiscountList({
    page: 1,
    row: 100,
    discountType: discountTypeId,
    communityId: applyRoomInfo.value.communityId,
  }),
  {
    immediate: false,
  },
)

onFeeDiscountSuccess((res) => {
  discountIdRange.value = res.data
})

onFeeDiscountError((error) => {
  console.error('查询费用折扣失败', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

/** 修改折扣类型 */
function discountTypeRangeChange(e: { detail: { value: number } }) {
  const index = e.detail.value
  discountType.value = discountTypeRange.value[index]
  loadFeeDiscountRequest((discountType.value as { id: DiscountType }).id)
}

/** 修改折扣名称 */
function discountIdRangeChange(e: { detail: { value: number } }) {
  const index = e.detail.value
  discountId.value = discountIdRange.value[index]
}

/** 修改返还方式 */
function returnWaysChange(e: { detail: { value: number } }) {
  const index = e.detail.value
  returnWayIndex.value = index
  returnWay.value = returnWays.value[index].statCd.toString()
}

/** 修改验房状态 */
function checkStateRangeChange(e: { detail: { value: number } }) {
  const index = e.detail.value
  checkState.value = checkStateRange.value[index]
  checkRemark.value = (checkState.value as { state: number, name: string }).name
}

/** 修改审批状态 */
function reviewStateRangeChange(e: { detail: { value: number } }) {
  const index = e.detail.value
  reviewState.value = reviewStateRange.value[index]
  reviewRemark.value = (reviewState.value as { state: number, name: string }).name
}

/** 提交验房更新 - 使用 useRequest */
const {
  loading: checkUpdateLoading,
  send: submitCheckRequest,
  onSuccess: onCheckSuccess,
  onError: onCheckError,
} = useRequest(
  (data: any) => submitCheckUpdate(data),
  {
    immediate: false,
  },
)

onCheckSuccess(() => {
  toast.success('保存成功')
  setTimeout(() => {
    goBack()
  }, 1000)
})

onCheckError((error) => {
  console.error('提交失败', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

/** 提交审核更新 - 使用 useRequest */
const {
  loading: reviewUpdateLoading,
  send: submitReviewRequest,
  onSuccess: onReviewSuccess,
  onError: onReviewError,
} = useRequest(
  (data: any) => submitReviewUpdate(data),
  {
    immediate: false,
  },
)

onReviewSuccess(() => {
  toast.success('保存成功')
  setTimeout(() => {
    // TODO: 用路由子代理来修复调整
    // goBack()
  }, 1000)
})

onReviewError((error) => {
  console.error('提交失败', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

/** 保存修改 */
function submit() {
  const startTime = `${applyRoomInfo.value.startTime.split(' ')[0]} 0:00:00`
  const endTime = `${applyRoomInfo.value.endTime.split(' ')[0]} 23:59:59`
  const ardId = applyRoomInfo.value.ardId
  const communityId = applyRoomInfo.value.communityId
  const createRemark = applyRoomInfo.value.createRemark

  // 验房提交
  if (applyRoomInfo.value.state === '1') {
    const state = (checkState.value as { state: number }).state
    if (!state) {
      toast.warning('请选择验房状态')
      return
    }

    if (!checkRemark.value) {
      toast.warning('请填写验房备注')
      return
    }

    submitCheckRequest({
      ardId,
      communityId,
      state: state.toString(),
      checkRemark: checkRemark.value,
      startTime,
      endTime,
      createRemark,
      photos: photos.value,
    })
  }
  // 审核提交
  else if (applyRoomInfo.value.state === '2') {
    const state = (reviewState.value as { state: number }).state
    if (!state) {
      toast.warning('请选择审批状态')
      return
    }

    if (state === 4 && !(discountId.value as any).discountId) {
      toast.warning('请选择优惠名称')
      return
    }

    if (state === 4 && !returnWay.value) {
      toast.warning('请选择退还方式')
      return
    }

    if (state === 4 && returnWay.value === '1002' && selectedFees.value.length <= 0) {
      toast.warning('请选择缴费记录')
      return
    }

    if (!reviewRemark.value) {
      toast.warning('请填写审批备注')
      return
    }

    submitReviewRequest({
      ardId,
      communityId,
      state: state.toString(),
      reviewRemark: reviewRemark.value,
      startTime,
      endTime,
      createRemark,
      discountType: (discountType.value as any).id || '',
      discountId: (discountId.value as any).discountId || '',
      returnWay: returnWay.value,
      selectedFees: selectedFees.value,
      feeId: applyRoomInfo.value.feeId,
      roomId: applyRoomInfo.value.roomId,
      checkRemark: applyRoomInfo.value.checkRemark,
      fees: fees.value,
      configId: '',
      discounts: discountIdRange.value,
    })
  }
}

// TODO: 用路由子代理来修复调整
// function goBack() {
//   // #ifdef H5
//   const canBack = true
//   const pages = getCurrentPages()
//   if (pages.length > 1) {
//     uni.navigateBack({ delta: 1 })
//     return
//   }
//   const a = (uni as any).$router.go(-1)
//   if (a === undefined) {
//     uni.reLaunch({
//       url: '/pages-sub/property/apply-room',
//     })
//   }
//   return
//   // #endif
//   uni.navigateBack({ delta: 1 })
// }

/** 显示房屋申请跟踪记录 */
function showApplyRoomRecord() {
  const params = extractApplyRecordParams(applyRoomInfo.value)
  TypedRouter.toApplyRoomRecord(params)
}

/** 加载申请详情 - 使用 useRequest */
const {
  send: loadDetailRequest,
  onSuccess: onDetailSuccess,
  onError: onDetailError,
} = useRequest(
  (params: { page: number, row: number, communityId: string, ardId: string }) =>
    getPropertyApplicationDetail(params),
  {
    immediate: false,
  },
)

onDetailSuccess((res) => {
  if (res && res.data && res.data.list.length > 0) {
    applyRoomInfo.value = res.data.list[0]
    sendImgList.value = applyRoomInfo.value.urls || []
    applyRoomInfo.value.startTime = applyRoomInfo.value.startTime.split(' ')[0]
    applyRoomInfo.value.endTime = applyRoomInfo.value.endTime.split(' ')[0]
    loadFeeDetailRequest()
  }
})

onDetailError((error) => {
  console.error('加载申请详情失败', error)
  // 全局拦截器已自动显示错误提示，无需重复处理
})

onLoad((options: { ardId?: string, communityId?: string }) => {
  if (!options.ardId || !options.communityId) {
    toast.error('参数错误')
    return
  }

  loadDetailRequest({
    page: 1,
    row: 1,
    communityId: options.communityId,
    ardId: options.ardId,
  })
})

onReady(() => {
  // 页面初次渲染完成
})

onShow(() => {
  // 页面显示
})
</script>

<template>
  <view>
    <!-- 申请详情列表 -->
    <view class="mt-4 bg-white divide-y divide-gray-100">
      <!-- 跟踪记录入口 -->
      <view class="flex items-center p-4" @click="showApplyRoomRecord()">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-time text-colorui-green" />
          <text class="ml-2 text-gray-600">空置房跟踪记录</text>
        </view>
        <view class="ml-auto">
          <text class="text-sm text-gray-600">查看</text>
        </view>
      </view>

      <!-- 申请ID -->
      <view class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-edit text-colorui-green" />
          <text class="ml-2 text-gray-600">申请ID</text>
        </view>
        <view class="ml-auto">
          <text class="text-sm text-gray-600">{{ applyRoomInfo.ardId }}</text>
        </view>
      </view>

      <!-- 申请类型 -->
      <view class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-ticket text-colorui-green" />
          <text class="ml-2 text-gray-600">申请类型</text>
        </view>
        <view class="ml-auto">
          <text class="text-sm text-gray-600">{{ applyRoomInfo.applyTypeName }}</text>
        </view>
      </view>

      <!-- 申请房间 -->
      <view class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-time text-colorui-green" />
          <text class="ml-2 text-gray-600">申请房间</text>
        </view>
        <view class="ml-auto">
          <text class="text-sm text-gray-600">{{ applyRoomInfo.roomName }}</text>
        </view>
      </view>

      <!-- 申请人 -->
      <view class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-user-avatar text-colorui-green" />
          <text class="ml-2 text-gray-600">申请人</text>
        </view>
        <view class="ml-auto">
          <text class="text-sm text-gray-600">{{ applyRoomInfo.createUserName }}</text>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-phone text-colorui-green" />
          <text class="ml-2 text-gray-600">联系方式</text>
        </view>
        <view class="ml-auto">
          <text class="text-sm text-gray-600">{{ applyRoomInfo.createUserTel }}</text>
        </view>
      </view>

      <!-- 开始时间 -->
      <view class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-time text-colorui-green" />
          <text class="ml-2 text-gray-600">开始时间</text>
        </view>
        <picker
          mode="date"
          :value="applyRoomInfo.startTime"
          start="2020-09-01"
          end="2050-09-01"
          :disabled="pickerDisabled"
          class="ml-auto"
          @change="dateStartChange"
        >
          <view class="picker text-sm text-gray-600">
            {{ applyRoomInfo.startTime }}
          </view>
        </picker>
      </view>

      <!-- 结束时间 -->
      <view class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-time text-colorui-green" />
          <text class="ml-2 text-gray-600">结束时间</text>
        </view>
        <picker
          mode="date"
          :value="applyRoomInfo.endTime"
          start="2020-09-01"
          end="2050-09-01"
          :disabled="pickerDisabled"
          class="ml-auto"
          @change="dateEndChange"
        >
          <view class="picker text-sm text-gray-600">
            {{ applyRoomInfo.endTime }}
          </view>
        </picker>
      </view>

      <!-- 申请备注 -->
      <view class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-pedestrian text-colorui-green" />
          <text class="ml-2 text-gray-600">申请备注</text>
        </view>
        <view class="ml-auto">
          <text class="text-sm text-gray-600">{{ applyRoomInfo.createRemark }}</text>
        </view>
      </view>

      <!-- 验房备注（状态>1时显示） -->
      <view v-if="Number(applyRoomInfo.state) > 1" class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-pedestrian text-colorui-green" />
          <text class="ml-2 text-gray-600">验房备注</text>
        </view>
        <view class="ml-auto">
          <text class="text-sm text-gray-600">{{ applyRoomInfo.checkRemark }}</text>
        </view>
      </view>

      <!-- 审核备注（状态>3时显示） -->
      <view v-if="Number(applyRoomInfo.state) > 3" class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-pedestrian text-colorui-green" />
          <text class="ml-2 text-gray-600">审核备注</text>
        </view>
        <view class="ml-auto">
          <text class="text-sm text-gray-600">{{ applyRoomInfo.reviewRemark }}</text>
        </view>
      </view>

      <!-- 当前状态 -->
      <view class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-time text-colorui-green" />
          <text class="ml-2 text-gray-600">当前状态</text>
        </view>
        <view class="ml-auto">
          <text class="text-sm text-gray-600">{{ applyRoomInfo.stateName }}</text>
        </view>
      </view>

      <!-- 验房状态选择器 -->
      <view v-if="Number(applyRoomInfo.state) === 1" class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-time text-colorui-green" />
          <text class="ml-2 text-gray-600">验房状态</text>
        </view>
        <picker
          mode="selector"
          :value="(checkState as { state: number }).state"
          :range="checkStateRange"
          range-key="name"
          class="ml-auto"
          @change="checkStateRangeChange"
        >
          <view class="picker text-sm text-gray-600">
            {{ (checkState as { state: number; name: string }).name || "请选择" }}
          </view>
        </picker>
      </view>

      <!-- 验房备注输入 -->
      <view v-if="Number(applyRoomInfo.state) === 1" class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-time text-colorui-green" />
          <text class="ml-2 text-gray-600">验房备注</text>
        </view>
        <input v-model="checkRemark" type="text" class="ml-auto text-right text-sm text-gray-600" @blur="onBlur()">
      </view>

      <!-- 审批状态选择器 -->
      <view v-if="Number(applyRoomInfo.state) === 2" class="flex items-center p-4">
        <view class="flex flex-1 items-center">
          <wd-icon name="" custom-class="i-carbon-time text-colorui-green" />
          <text class="ml-2 text-gray-600">审批状态</text>
        </view>
        <picker
          mode="selector"
          :value="(reviewState as { state: number }).state"
          :range="reviewStateRange"
          range-key="name"
          class="ml-auto"
          @change="reviewStateRangeChange"
        >
          <view class="picker text-sm text-gray-600">
            {{ (reviewState as { state: number; name: string }).name || "请选择" }}
          </view>
        </picker>
      </view>

      <!-- 提交按钮区域 -->
      <view class="flex items-center p-4">
        <button
          v-if="Number(applyRoomInfo.state) === 1"
          class="mx-auto my-7.5 h-22.5 w-1/2 rounded-3.75 bg-colorui-green text-center text-white leading-22.5 text-32rpx"
          @click="submit"
        >
          验房
        </button>
        <button
          v-if="Number(applyRoomInfo.state) === 2"
          class="mx-auto my-7.5 h-22.5 w-1/2 rounded-3.75 bg-colorui-green text-center text-white leading-22.5 text-32rpx"
          @click="submit"
        >
          审核
        </button>
      </view>
    </view>
  </view>
</template>

<style scoped>
/** 保留弹出框样式 - 这些复杂样式无法用原子类表达 */
.pop-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.pop-box {
  position: relative;
  width: 85%;
  max-height: 1000rpx;
  background-color: #fff;
  border-radius: 15rpx;
  padding-bottom: 85rpx;
}

.pop-title {
  padding: 30rpx 0;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
}

.pop-bottom {
  width: 100%;
  position: absolute;
  bottom: 0;
}

.btn-box {
  width: 90%;
  margin: 0 auto;
  border-top: 1px solid #f6f6f8;
  display: flex;
}

.cancel,
.confirm {
  width: 50%;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  font-size: 40rpx;
  font-weight: 400;
}

.cancel {
  color: #999999;
}

.confirm {
  color: #3488fe;
}

.checkbox-area {
  max-height: 160rpx;
  overflow-y: scroll;
}
</style>
