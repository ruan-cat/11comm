<!--
  新增业主页
  功能：新增业主成员信息

  访问地址: http://localhost:3000/#/pages-sub/property/add-owner

  旧代码：gitee-example/pages/owner/addOwner.vue
-->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { saveRoomOwner } from '@/api/owner'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { OWNER_ROLE_OPTIONS } from '@/types/property-management'

definePage({
  style: {
    navigationBarTitleText: '新增业主',
  },
})

const formRef = ref<FormInstance>()
const formModel = reactive({
  name: '',
  link: '',
  idCard: '',
  sex: '0',
  roomName: '',
  address: '',
  remark: '',
  ownerPhotoUrl: '',
  personRole: '3',
  personType: 'P',
  ownerTypeCd: '1002',
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名' }],
  link: [{ required: true, message: '请输入手机号' }],
  roomName: [{ required: true, message: '请输入房屋信息' }],
  personRole: [{ required: true, message: '请选择人员角色' }],
}

const roleColumns = OWNER_ROLE_OPTIONS.map(item => ({
  label: item.label,
  value: item.value,
}))

const sexColumns = [
  { label: '男', value: '0' },
  { label: '女', value: '1' },
]

const { loading, send: submitAdd } = useRequest(
  () => saveRoomOwner({
    ...formModel,
    communityId: 'COMM_001',
  }),
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({
      title: '添加成功',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 800)
  })
  .onError((error) => {
    console.error('新增业主失败', error)
  })

function handleSubmit() {
  formRef.value?.validate().then(({ valid }) => {
    if (!valid)
      return

    submitAdd()
  })
}

function handleReset() {
  formModel.name = ''
  formModel.link = ''
  formModel.idCard = ''
  formModel.sex = '0'
  formModel.roomName = ''
  formModel.address = ''
  formModel.remark = ''
  formModel.ownerPhotoUrl = ''
  formModel.personRole = '3'
  formModel.personType = 'P'
  formModel.ownerTypeCd = '1002'
}
</script>

<template>
  <view class="page">
    <wd-form ref="formRef" :model="formModel" :rules="rules">
      <FormSectionTitle title="基本信息" icon="i-carbon-user-avatar" />
      <wd-cell-group border>
        <wd-picker
          v-model="formModel.personRole"
          label="人员角色"
          label-width="96px"
          :columns="roleColumns"
        />
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
          v-model="formModel.roomName"
          label="房屋"
          label-width="96px"
          placeholder="请输入楼栋-单元-房屋"
          prop="roomName"
          clearable
        />
        <wd-input
          v-model="formModel.address"
          label="地址"
          label-width="96px"
          placeholder="请输入地址"
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
      <wd-button plain @click="handleReset">
        重置
      </wd-button>
      <wd-button type="success" custom-class="ml-16rpx" :loading="loading" @click="handleSubmit">
        提交
      </wd-button>
    </view>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 140rpx;
}

.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgb(0 0 0 / 8%);
}
</style>
