<!--
  编辑业主页
  功能：编辑业主成员信息

  访问地址: http://localhost:3000/#/pages-sub/property/edit-owner
  建议携带参数: ?memberId=xxx

  旧代码：gitee-example/pages/owner/editOwner.vue
-->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { queryOwnerAndMembers, updateRoomOwner } from '@/api/owner'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'

definePage({
  style: {
    navigationBarTitleText: '编辑业主',
  },
})

const formRef = ref<FormInstance>()
const memberId = ref('')
const ownerId = ref('')
const formModel = reactive({
  name: '',
  link: '',
  idCard: '',
  sex: '0',
  address: '',
  remark: '',
  ownerPhotoUrl: '',
  ownerTypeCd: '1002',
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名' }],
  link: [{ required: true, message: '请输入手机号' }],
}

const sexColumns = [
  { label: '男', value: '0' },
  { label: '女', value: '1' },
]

const { send: loadMember } = useRequest(
  () =>
    queryOwnerAndMembers({
      page: 1,
      row: 1,
      communityId: 'COMM_001',
      memberId: memberId.value,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    const item = event.data?.list?.[0]
    if (!item) {
      uni.showToast({
        title: '未查询到业主信息',
        icon: 'none',
      })
      return
    }

    ownerId.value = item.ownerId
    formModel.name = item.name || ''
    formModel.link = item.link || ''
    formModel.idCard = item.idCard || ''
    formModel.sex = item.sex || '0'
    formModel.address = item.address || ''
    formModel.remark = item.remark || ''
    formModel.ownerPhotoUrl = item.faceUrl || ''
    formModel.ownerTypeCd = item.ownerTypeCd || '1002'
  })
  .onError((error) => {
    console.error('加载业主详情失败', error)
  })

const { loading, send: submitUpdate } = useRequest(
  () =>
    updateRoomOwner({
      memberId: memberId.value,
      ownerId: ownerId.value,
      communityId: 'COMM_001',
      ...formModel,
    }),
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({
      title: '修改成功',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 800)
  })
  .onError((error) => {
    console.error('修改业主失败', error)
  })

function handleSubmit() {
  formRef.value?.validate().then(({ valid }) => {
    if (!valid)
      return

    submitUpdate()
  })
}

onLoad((options) => {
  memberId.value = options?.memberId || ''
  if (!memberId.value) {
    uni.showToast({
      title: 'memberId 参数不能为空',
      icon: 'none',
    })
    return
  }

  loadMember()
})
</script>

<template>
  <view class="page">
    <wd-form ref="formRef" :model="formModel" :rules="rules">
      <FormSectionTitle title="基本信息" icon="i-carbon-user-avatar" />
      <wd-cell-group border>
        <wd-input
          v-model="formModel.name"
          label="姓名"
          label-width="96px"
          placeholder="请输入成员名称"
          prop="name"
          clearable
        />
        <wd-input
          v-model="formModel.idCard"
          label="身份证"
          label-width="96px"
          placeholder="请输入身份证"
          clearable
        />
        <wd-picker
          v-model="formModel.sex"
          label="性别"
          label-width="96px"
          :columns="sexColumns"
        />
        <wd-input
          v-model="formModel.address"
          label="家庭住址"
          label-width="96px"
          placeholder="请输入家庭住址"
          clearable
        />
      </wd-cell-group>

      <FormSectionTitle title="联系信息" icon="i-carbon-phone" />
      <wd-cell-group border>
        <wd-input
          v-model="formModel.link"
          label="手机号"
          label-width="96px"
          placeholder="请输入手机号"
          prop="link"
          clearable
        />
      </wd-cell-group>

      <FormSectionTitle title="图片与备注" icon="i-carbon-image" />
      <wd-cell-group border>
        <wd-input
          v-model="formModel.ownerPhotoUrl"
          label="头像链接"
          label-width="96px"
          placeholder="可选：输入头像URL"
          clearable
        />
        <wd-textarea
          v-model="formModel.remark"
          label="备注"
          label-width="96px"
          placeholder="请输入备注"
          :maxlength="300"
          show-word-limit
        />
      </wd-cell-group>
    </wd-form>

    <view class="action-bar">
      <wd-button type="success" block :loading="loading" @click="handleSubmit">
        提交
      </wd-button>
    </view>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgb(0 0 0 / 8%);
}
</style>
