<!--
  装修详情页
  功能：显示装修详情，支持审核、验收、装修完成和查看跟踪记录

  访问地址: http://localhost:3000/#/pages-sub/property/renovation-detail
  建议携带参数: ?apply=JSON

  旧代码：gitee-example/pages/roomRenovationDetail/roomRenovationDetail.vue
-->
<script setup lang="ts">
import type { RenovationApplication } from '@/types/property-management'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import {
  saveRoomRenovationDetail,
  updateRoomRenovationState,
  updateRoomToExamine,
} from '@/api/renovation'

definePage({
  style: {
    navigationBarTitleText: '装修详情',
  },
})

const renovationInfo = ref<RenovationApplication | null>(null)
const showPopup = ref(false)
const actionType = ref<'check' | 'review'>('check')
const checkState = ref(3000)
const reviewState = ref(5000)
const checkRemark = ref('审核通过')
const reviewRemark = ref('验收通过')

const checkColumns = [
  { label: '审核通过', value: 3000 },
  { label: '审核不通过', value: 2000 },
]
const reviewColumns = [
  { label: '验收通过', value: 5000 },
  { label: '验收不通过', value: 6000 },
]

const { send: submitCheck } = useRequest(
  () => {
    if (!renovationInfo.value) {
      throw new Error('装修信息不存在')
    }

    return updateRoomToExamine({
      communityId: renovationInfo.value.communityId,
      rId: renovationInfo.value.rId,
      roomId: renovationInfo.value.roomId,
      roomName: renovationInfo.value.roomName,
      userId: renovationInfo.value.userId,
      startTime: renovationInfo.value.startTime,
      endTime: renovationInfo.value.endTime,
      remark: renovationInfo.value.remark,
      detailType: '1001',
      state: checkState.value,
      examineRemark: checkRemark.value,
    })
  },
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({ title: '保存成功', icon: 'none' })
    showPopup.value = false
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 800)
  })
  .onError((error) => {
    console.error('提交审核失败', error)
  })

const { send: submitReview } = useRequest(
  () => {
    if (!renovationInfo.value) {
      throw new Error('装修信息不存在')
    }

    return saveRoomRenovationDetail({
      communityId: renovationInfo.value.communityId,
      rId: renovationInfo.value.rId,
      roomId: renovationInfo.value.roomId,
      roomName: renovationInfo.value.roomName,
      userId: renovationInfo.value.userId,
      startTime: renovationInfo.value.startTime,
      endTime: renovationInfo.value.endTime,
      remark: renovationInfo.value.remark,
      detailType: '1001',
      state: reviewState.value,
      examineRemark: reviewRemark.value,
    })
  },
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({ title: '保存成功', icon: 'none' })
    showPopup.value = false
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 800)
  })
  .onError((error) => {
    console.error('提交验收失败', error)
  })

const { send: finishRenovation } = useRequest(
  () => {
    if (!renovationInfo.value) {
      throw new Error('装修信息不存在')
    }

    return updateRoomRenovationState({
      rId: renovationInfo.value.rId,
      communityId: renovationInfo.value.communityId,
    })
  },
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({ title: '状态已更新', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 800)
  })
  .onError((error) => {
    console.error('装修完成失败', error)
  })

function openCheckPopup() {
  actionType.value = 'check'
  showPopup.value = true
}

function openReviewPopup() {
  actionType.value = 'review'
  showPopup.value = true
}

function submitPopup() {
  if (actionType.value === 'check') {
    if (!checkRemark.value) {
      uni.showToast({ title: '请填写审核备注', icon: 'none' })
      return
    }
    submitCheck()
    return
  }

  if (!reviewRemark.value) {
    uni.showToast({ title: '请填写验收备注', icon: 'none' })
    return
  }
  submitReview()
}

function openRecord() {
  if (!renovationInfo.value)
    return

  uni.navigateTo({
    url: `/pages-sub/property/renovation-record?apply=${encodeURIComponent(JSON.stringify(renovationInfo.value))}`,
  })
}

function handleFinish() {
  uni.showModal({
    title: '确认操作',
    content: '是否确认装修完成？',
    success: (res) => {
      if (res.confirm) {
        finishRenovation()
      }
    },
  })
}

onLoad((options) => {
  if (!options?.apply) {
    uni.showToast({ title: '缺少参数', icon: 'none' })
    return
  }

  try {
    renovationInfo.value = JSON.parse(decodeURIComponent(options.apply))
  }
  catch (error) {
    console.error('参数解析失败', error)
  }
})
</script>

<template>
  <view class="page">
    <wd-cell-group v-if="renovationInfo" border>
      <wd-cell title="装修跟踪记录" value="查看" is-link @click="openRecord" />
      <wd-cell title="申请房间" :value="renovationInfo.roomName" />
      <wd-cell title="申请人" :value="renovationInfo.personName" />
      <wd-cell title="联系方式" :value="renovationInfo.personTel" />
      <wd-cell title="开始时间" :value="renovationInfo.startTime" />
      <wd-cell title="结束时间" :value="renovationInfo.endTime" />
      <wd-cell title="装修单位" :value="renovationInfo.renovationCompany" />
      <wd-cell title="装修负责人" :value="renovationInfo.personMain" />
      <wd-cell title="负责人电话" :value="renovationInfo.personMainTel" />
      <wd-cell title="是否延期" :value="renovationInfo.isPostpone === 'Y' ? '是' : '否'" />
      <wd-cell v-if="renovationInfo.isPostpone === 'Y'" title="延期日期" :value="renovationInfo.postponeTime || '-'" />
      <wd-cell title="申请备注" :value="renovationInfo.remark" />
      <wd-cell title="当前状态" :value="renovationInfo.stateName" />
    </wd-cell-group>

    <view v-if="renovationInfo" class="actions">
      <wd-button
        v-if="renovationInfo.state === 1000"
        type="success"
        block
        @click="openCheckPopup"
      >
        审核
      </wd-button>
      <wd-button
        v-if="renovationInfo.state === 4000"
        type="success"
        custom-class="ml-12rpx"
        block
        @click="openReviewPopup"
      >
        验收
      </wd-button>
      <wd-button
        v-if="renovationInfo.state === 3000"
        type="warning"
        custom-class="ml-12rpx"
        block
        @click="handleFinish"
      >
        装修完成
      </wd-button>
    </view>

    <wd-popup v-model="showPopup" position="bottom" custom-style="height: 420rpx; border-radius: 24rpx 24rpx 0 0;">
      <view class="popup-body">
        <view class="popup-title">
          {{ actionType === 'check' ? '审核' : '验收' }}
        </view>

        <wd-picker
          v-if="actionType === 'check'"
          v-model="checkState"
          label="审核状态"
          label-width="96px"
          :columns="checkColumns"
        />
        <wd-picker
          v-else
          v-model="reviewState"
          label="验收状态"
          label-width="96px"
          :columns="reviewColumns"
        />

        <wd-input
          v-if="actionType === 'check'"
          v-model="checkRemark"
          label="审核备注"
          label-width="96px"
          placeholder="请输入审核备注"
          clearable
        />
        <wd-input
          v-else
          v-model="reviewRemark"
          label="验收备注"
          label-width="96px"
          placeholder="请输入验收备注"
          clearable
        />

        <view class="popup-actions">
          <wd-button plain @click="showPopup = false">
            取消
          </wd-button>
          <wd-button type="success" custom-class="ml-12rpx" @click="submitPopup">
            保存
          </wd-button>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.actions {
  margin-top: 24rpx;
}

.popup-body {
  padding: 24rpx;
}

.popup-title {
  margin-bottom: 20rpx;
  text-align: center;
  font-size: 30rpx;
  font-weight: 600;
}

.popup-actions {
  margin-top: 20rpx;
  display: flex;
}
</style>
