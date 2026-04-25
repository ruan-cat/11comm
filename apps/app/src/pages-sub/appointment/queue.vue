<!--
  排队预约页
  功能：扫码或手动输入核销码，并回填到预约管理页

  访问地址: http://localhost:3000/#/pages-sub/appointment/queue

  旧代码：gitee-example/pages/appointment/hou_one.vue
-->
<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: '排队预约',
  },
})

const code = ref('')

function confirmBack() {
  if (!code.value.trim()) {
    uni.showToast({
      title: '请输入核销码',
      icon: 'none',
    })
    return
  }

  const instance = getCurrentInstance()
  const channel = instance?.proxy?.getOpenerEventChannel?.()
  if (channel) {
    channel.emit('selectedCode', code.value.trim())
  }
  uni.navigateBack({ delta: 1 })
}

function scanCode() {
  uni.scanCode({
    onlyFromCamera: true,
    success: (res) => {
      code.value = res.result || ''
    },
    fail: () => {
      uni.showToast({
        title: '扫码失败，请手动输入',
        icon: 'none',
      })
    },
  })
}
</script>

<template>
  <view class="page">
    <wd-cell-group border>
      <wd-input
        v-model="code"
        label="核销码"
        label-width="88px"
        placeholder="请输入核销码"
        clearable
      />
    </wd-cell-group>

    <view class="action-wrap">
      <wd-button plain block @click="scanCode">
        扫码识别
      </wd-button>
      <wd-button type="primary" custom-class="mt-14rpx" block @click="confirmBack">
        确认回填
      </wd-button>
    </view>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.action-wrap {
  margin-top: 24rpx;
  display: flex;
  flex-direction: column;
}
</style>
