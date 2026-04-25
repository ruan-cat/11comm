<!--
  我的页面
  功能：展示个人入口菜单，支持进入个人信息、考勤、切换小区和修改密码

  访问地址: http://localhost:3000/#/pages/profile/index

  旧代码：gitee-example/pages/my/my.vue
-->
<script setup lang="ts">
import type { ProfileInfo } from '@/types/profile'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getProfileInfo } from '@/api/profile'
import { useTokenStore } from '@/store/token'

definePage({
  style: {
    navigationBarTitleText: '我的',
  },
})

const profile = ref<ProfileInfo>({
  userId: '',
  userName: '',
  storeId: '',
  storeName: '',
  avatar: '',
  currentCommunityId: 'COMM_001',
  currentCommunityName: '默认小区',
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
    console.error('加载个人信息失败', error)
  })

function gotoChangeCommunity() {
  uni.navigateTo({
    url: '/pages/profile/change-community',
  })
}

function gotoUserInfo() {
  uni.navigateTo({
    url: '/pages/profile/user-info',
  })
}

function gotoAttendance() {
  uni.navigateTo({
    url: '/pages/profile/attendance',
  })
}

function gotoChangePassword() {
  uni.navigateTo({
    url: '/pages/profile/change-password',
  })
}

function handleLogout() {
  uni.showModal({
    title: '退出系统',
    content: '确认退出当前账号吗？',
    success: async (res) => {
      if (!res.confirm)
        return

      await useTokenStore().logout()
      uni.reLaunch({
        url: '/pages/login/login',
      })
    },
  })
}

onLoad(() => {
  loadProfile()
})
</script>

<template>
  <view class="page">
    <view class="header-card">
      <wd-img
        class="profile-avatar"
        width="120rpx"
        height="120rpx"
        round
        mode="aspectFill"
        :src="profile.avatar || 'https://picsum.photos/seed/profile-default/240/240'"
      />
      <view class="name-wrap">
        <text class="name">{{ profile.userName || '未登录用户' }}</text>
        <text class="store">{{ profile.storeName || '-' }}</text>
      </view>
    </view>

    <view class="menu-wrap">
      <wd-cell-group border>
        <wd-cell title="切换小区" :value="profile.currentCommunityName" is-link @click="gotoChangeCommunity">
          <template #icon>
            <wd-icon name="" custom-class="i-carbon-home text-blue-500 mr-8rpx" />
          </template>
        </wd-cell>
        <wd-cell title="个人信息" is-link @click="gotoUserInfo">
          <template #icon>
            <wd-icon name="" custom-class="i-carbon-user text-blue-500 mr-8rpx" />
          </template>
        </wd-cell>
        <wd-cell title="员工考勤" is-link @click="gotoAttendance">
          <template #icon>
            <wd-icon name="" custom-class="i-carbon-calendar text-blue-500 mr-8rpx" />
          </template>
        </wd-cell>
        <wd-cell title="修改密码" is-link @click="gotoChangePassword">
          <template #icon>
            <wd-icon name="" custom-class="i-carbon-password text-blue-500 mr-8rpx" />
          </template>
        </wd-cell>
        <wd-cell title="系统版本" :value="profile.version" />
      </wd-cell-group>
    </view>

    <view class="logout-wrap">
      <wd-button type="error" block @click="handleLogout">
        退出登录
      </wd-button>
    </view>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24rpx;
}

.header-card {
  display: flex;
  align-items: center;
  border-radius: 16rpx;
  background: #fff;
  padding: 24rpx;
}

.profile-avatar {
  margin-right: 18rpx;
}

.name-wrap {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 32rpx;
  font-weight: 600;
  color: #111827;
}

.store {
  font-size: 24rpx;
  color: #6b7280;
  margin-top: 8rpx;
}

.menu-wrap {
  margin-top: 24rpx;
}

.logout-wrap {
  margin-top: 36rpx;
}
</style>
