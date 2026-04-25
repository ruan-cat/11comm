<!--
  修改密码页
  功能：修改当前账号密码

  访问地址: http://localhost:3000/#/pages/profile/change-password

  旧代码：gitee-example/pages/changePwd/changePwd.vue
-->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { changeProfilePassword } from '@/api/profile'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

definePage({
  style: {
    navigationBarTitleText: '修改密码',
  },
})

const LABEL_WIDTH = '96px'

const formRef = ref<FormInstance>()
const toast = useGlobalToast()

const formModel = reactive({
  oldPwd: '',
  pwd: '',
  newPwd: '',
})

const formRules: FormRules = {
  oldPwd: [{ required: true, message: '请输入原密码' }],
  pwd: [{ required: true, message: '请输入新密码' }],
  newPwd: [{ required: true, message: '请输入确认密码' }],
}

const { loading, send: submitChangePwd } = useRequest(
  () =>
    changeProfilePassword({
      oldPwd: formModel.oldPwd,
      newPwd: formModel.newPwd,
    }),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('修改成功')
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 600)
  })
  .onError((error) => {
    console.error('修改密码失败', error)
  })

function handleSubmit() {
  formRef.value?.validate().then(({ valid }) => {
    if (!valid)
      return

    if (formModel.newPwd !== formModel.pwd) {
      toast.warning('确认密码和新密码不一致')
      return
    }

    submitChangePwd()
  })
}
</script>

<template>
  <view class="page">
    <wd-form ref="formRef" :model="formModel" :rules="formRules">
      <FormSectionTitle title="密码信息" icon="i-carbon-password" />
      <wd-cell-group border>
        <wd-input
          v-model="formModel.oldPwd"
          label="原密码"
          :label-width="LABEL_WIDTH"
          prop="oldPwd"
          placeholder="请输入原密码"
          show-password
        />
        <wd-input
          v-model="formModel.pwd"
          label="新密码"
          :label-width="LABEL_WIDTH"
          prop="pwd"
          placeholder="请输入新密码"
          show-password
        />
        <wd-input
          v-model="formModel.newPwd"
          label="确认密码"
          :label-width="LABEL_WIDTH"
          prop="newPwd"
          placeholder="请再次输入新密码"
          show-password
        />
      </wd-cell-group>
    </wd-form>

    <view class="action-wrap">
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
  padding: 20rpx;
}

.action-wrap {
  margin-top: 24rpx;
}
</style>
