<!--
  用户信息页
  功能：展示商户信息和员工信息

  访问地址: http://localhost:3000/#/pages/profile/user-info

  旧代码：gitee-example/pages/userInfo/userInfo.vue
-->
<script setup lang="ts">
import type { ProfileInfo } from '@/types/profile'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getProfileInfo } from '@/api/profile'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'

definePage({
  style: {
    navigationBarTitleText: '用户信息',
  },
})

const profile = ref<ProfileInfo>({
  userId: '',
  userName: '',
  storeId: '',
  storeName: '',
  avatar: '',
  currentCommunityId: '',
  currentCommunityName: '',
  version: 'V1.0',
})

const { send: loadProfile } = useRequest(
  () => getProfileInfo(),
  { immediate: false },
)
  .onSuccess((event) => {
    profile.value = event.data
  })
  .onError((error) => {
    console.error('加载用户信息失败', error)
  })

onLoad(() => {
  loadProfile()
})
</script>

<template>
  <view class="page">
    <FormSectionTitle title="商户信息" icon="i-carbon-store" />
    <wd-cell-group border>
      <wd-cell title="商户名称" :value="profile.storeName || '-'" />
      <wd-cell title="商户类型" value="物业" />
      <wd-cell title="商户编码" :value="profile.storeId || '-'" />
    </wd-cell-group>

    <FormSectionTitle title="员工信息" icon="i-carbon-user-avatar" />
    <wd-cell-group border>
      <wd-cell title="员工名称" :value="profile.userName || '-'" />
      <wd-cell title="员工编号" :value="profile.userId || '-'" />
      <wd-cell title="当前小区" :value="profile.currentCommunityName || '-'" />
    </wd-cell-group>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 24rpx;
}
</style>
