<!--
  装修记录处理页
  功能：新增装修跟踪记录，填写处理意见与是否违规

  访问地址: http://localhost:3000/#/pages-sub/property/renovation-record-handle
  建议携带参数: ?apply=JSON

  旧代码：gitee-example/pages/roomRenovationRecordHandle/roomRenovationRecordHandle.vue
-->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import type { RenovationApplication } from '@/types/property-management'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { reactive, ref } from 'vue'
import { updateRoomDecorationRecord } from '@/api/renovation'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'

definePage({
  style: {
    navigationBarTitleText: '记录处理',
  },
})

const formRef = ref<FormInstance>()
const applyInfo = ref<RenovationApplication | null>(null)
const formModel = reactive({
  remark: '',
  isTrue: '',
  photoIds: '',
})

const violationColumns = [
  { label: '是', value: 'true' },
  { label: '否', value: 'false' },
]

const rules: FormRules = {
  remark: [{ required: true, message: '请填写处理意见' }],
  isTrue: [{ required: true, message: '请选择是否违规' }],
}

const { loading, send: submitRecord } = useRequest(
  () => {
    if (!applyInfo.value) {
      throw new Error('装修信息不存在')
    }

    const photos = formModel.photoIds
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)

    return updateRoomDecorationRecord({
      rId: applyInfo.value.rId,
      roomId: applyInfo.value.roomId,
      roomName: applyInfo.value.roomName,
      state: applyInfo.value.state,
      stateName: applyInfo.value.stateName,
      photos,
      videoName: '',
      remark: formModel.remark,
      detailType: '1001',
      communityId: applyInfo.value.communityId,
      examineRemark: '',
      isTrue: formModel.isTrue,
    })
  },
  { immediate: false },
)
  .onSuccess(() => {
    uni.showToast({ title: '保存成功', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 800)
  })
  .onError((error) => {
    console.error('保存记录失败', error)
  })

function handleSubmit() {
  formRef.value?.validate().then(({ valid }) => {
    if (!valid)
      return

    submitRecord()
  })
}

onLoad((options) => {
  if (!options?.apply) {
    uni.showToast({ title: '缺少参数', icon: 'none' })
    return
  }

  try {
    applyInfo.value = JSON.parse(decodeURIComponent(options.apply))
  }
  catch (error) {
    console.error('参数解析失败', error)
  }
})
</script>

<template>
  <view class="page">
    <wd-form ref="formRef" :model="formModel" :rules="rules">
      <FormSectionTitle title="处理信息" icon="i-carbon-document" />
      <wd-cell-group border>
        <wd-textarea
          v-model="formModel.remark"
          label="处理意见"
          label-width="96px"
          placeholder="请输入处理意见"
          prop="remark"
          :maxlength="500"
          show-word-limit
        />
        <wd-picker
          v-model="formModel.isTrue"
          label="是否违规"
          label-width="96px"
          :columns="violationColumns"
          prop="isTrue"
        />
      </wd-cell-group>

      <FormSectionTitle title="图片信息" icon="i-carbon-image" />
      <wd-cell-group border>
        <wd-input
          v-model="formModel.photoIds"
          label="图片ID"
          label-width="96px"
          placeholder="可选：逗号分隔多个图片ID"
          clearable
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
