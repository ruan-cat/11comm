<!--
  新增水表页
  功能：录入房屋抄表信息，支持费用类型、收费项目、抄表类型和房屋选择

  访问地址: http://localhost:3000/#/pages-sub/meter/add-meter

  旧代码：gitee-example/pages/meter/addmeter.vue
-->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'wot-design-uni/components/wd-form/types'
import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { computed, reactive, ref } from 'vue'
import {
  listMeterType,
  queryFeeConfigs,
  queryFeeTypes,
  queryPreMeterWater,
  saveMeterWater,
} from '@/api/meter'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { useSelectorStore } from '@/stores/useSelectorStore'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '新增水表',
  },
})

const LABEL_WIDTH = '88px'

const toast = useGlobalToast()
const communityInfo = getCurrentCommunity()
const selectorStore = useSelectorStore()

const formRef = ref<FormInstance>()

const feeTypeOptions = ref<ColumnItem[]>([])
const feeConfigOptions = ref<ColumnItem[]>([])
const meterTypeOptions = ref<ColumnItem[]>([])

const model = reactive({
  feeTypeCd: '',
  configId: '',
  meterType: '',
  floorId: '',
  floorNum: '',
  unitId: '',
  unitNum: '',
  roomId: '',
  roomNum: '',
  preDegrees: 0,
  preReadingTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  curDegrees: '',
  curReadingTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  remark: '',
})

const canQueryPreDegree = computed(() => Boolean(model.roomId && model.meterType))

const formRules: FormRules = {
  feeTypeCd: [{ required: true, message: '请选择费用类型' }],
  configId: [{ required: true, message: '请选择收费项目' }],
  meterType: [{ required: true, message: '请选择抄表类型' }],
  curDegrees: [
    { required: true, message: '请填写本期度数' },
    {
      required: false,
      message: '',
      validator: (value) => {
        const parsed = Number(value)
        if (!Number.isFinite(parsed) || parsed < 0)
          return Promise.reject(new Error('本期度数格式不正确'))
        return Promise.resolve()
      },
    },
  ],
  curReadingTime: [{ required: true, message: '请选择本期读表时间' }],
}

const { send: loadFeeTypes } = useRequest(() => queryFeeTypes(), { immediate: false })
  .onSuccess((event) => {
    feeTypeOptions.value = (event.data || []).map(item => ({
      label: item.name,
      value: item.id,
    }))
  })
  .onError((error) => {
    console.error('加载费用类型失败:', error)
  })

const { send: loadFeeConfigs } = useRequest(
  (feeTypeCd: string) =>
    queryFeeConfigs({
      feeTypeCd,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    feeConfigOptions.value = (event.data || []).map(item => ({
      label: item.feeName,
      value: item.configId,
    }))
    model.configId = ''
  })
  .onError((error) => {
    console.error('加载收费项目失败:', error)
  })

const { send: loadMeterTypes } = useRequest(
  () => listMeterType({ page: 1, row: 50, communityId: communityInfo.communityId }),
  { immediate: false },
)
  .onSuccess((event) => {
    meterTypeOptions.value = (event.data || []).map(item => ({
      label: item.typeName,
      value: item.typeId,
    }))
  })
  .onError((error) => {
    console.error('加载抄表类型失败:', error)
  })

const { send: loadPreMeter } = useRequest(
  () =>
    queryPreMeterWater({
      communityId: communityInfo.communityId,
      objId: model.roomId,
      meterType: model.meterType,
    }),
  { immediate: false },
)
  .onSuccess((event) => {
    model.preDegrees = Number(event.data?.curDegrees || 0)
    model.preReadingTime = String(event.data?.curReadingTime || dayjs().format('YYYY-MM-DD HH:mm:ss'))
  })
  .onError((error) => {
    console.error('加载上期读数失败:', error)
    model.preDegrees = 0
    model.preReadingTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  })

const { loading: submitting, send: submitMeter } = useRequest(
  (params: {
    communityId: string
    configId: string
    objId: string
    objName: string
    meterType: string
    preDegrees: number
    curDegrees: number
    preReadingTime: string
    curReadingTime: string
    remark?: string
  }) => saveMeterWater(params),
  { immediate: false },
)
  .onSuccess(() => {
    toast.success('提交成功')
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 1200)
  })
  .onError((error) => {
    console.error('提交抄表失败:', error)
  })

function syncSelectedLocation() {
  if (selectorStore.selectedFloor) {
    model.floorId = selectorStore.selectedFloor.floorId
    model.floorNum = `${selectorStore.selectedFloor.floorNum}栋`
  }
  else {
    const floor = uni.getStorageSync('_selectFloor')
    if (floor) {
      model.floorId = floor.floorId
      model.floorNum = `${floor.floorNum}栋`
    }
  }

  if (selectorStore.selectedUnit) {
    model.unitId = selectorStore.selectedUnit.unitId
    model.unitNum = `${selectorStore.selectedUnit.unitNum}单元`
  }
  else {
    const unit = uni.getStorageSync('_selectUnit')
    if (unit) {
      model.unitId = unit.unitId
      model.unitNum = `${unit.unitNum}单元`
    }
  }

  if (selectorStore.selectedRoom) {
    model.roomId = selectorStore.selectedRoom.roomId
    model.roomNum = `${selectorStore.selectedRoom.roomNum}室`
  }
  else {
    const room = uni.getStorageSync('_selectRoom')
    if (room) {
      model.roomId = room.roomId
      model.roomNum = `${room.roomNum}室`
    }
  }
}

function clearLocation(scope: 'all' | 'unit-room' | 'room') {
  if (scope === 'all') {
    selectorStore.clearSelection()
    uni.removeStorageSync('_selectFloor')
    uni.removeStorageSync('_selectUnit')
    uni.removeStorageSync('_selectRoom')
    model.floorId = ''
    model.floorNum = ''
    model.unitId = ''
    model.unitNum = ''
    model.roomId = ''
    model.roomNum = ''
    return
  }

  if (scope === 'unit-room') {
    selectorStore.clearUnit()
    selectorStore.clearRoom()
    uni.removeStorageSync('_selectUnit')
    uni.removeStorageSync('_selectRoom')
    model.unitId = ''
    model.unitNum = ''
    model.roomId = ''
    model.roomNum = ''
    return
  }

  selectorStore.clearRoom()
  uni.removeStorageSync('_selectRoom')
  model.roomId = ''
  model.roomNum = ''
}

function handleChooseFloor() {
  clearLocation('all')
  TypedRouter.toSelectFloor()
}

function handleChooseUnit() {
  if (!model.floorId) {
    toast.warning('请先选择楼栋')
    return
  }
  clearLocation('unit-room')
  TypedRouter.toSelectUnit(model.floorId)
}

function handleChooseRoom() {
  if (!model.floorId || !model.unitId) {
    toast.warning('请先选择单元')
    return
  }
  clearLocation('room')
  TypedRouter.toSelectRoom(model.floorId, model.unitId)
}

function handleFeeTypeConfirm(event: { value: string }) {
  model.feeTypeCd = event.value
  if (model.feeTypeCd)
    loadFeeConfigs(model.feeTypeCd)
}

function handleMeterTypeConfirm(event: { value: string }) {
  model.meterType = event.value
  if (canQueryPreDegree.value)
    loadPreMeter()
}

function handleSubmit() {
  if (!model.roomId) {
    toast.warning('请选择房屋')
    return
  }

  formRef.value?.validate()
    .then(({ valid }: { valid: boolean }) => {
      if (!valid)
        return

      const curDegrees = Number(model.curDegrees)
      if (curDegrees < model.preDegrees) {
        toast.warning('本期度数不能小于上期度数')
        return
      }

      const preTime = dayjs(model.preReadingTime)
      const curTime = dayjs(model.curReadingTime)
      if (!curTime.isValid() || !preTime.isValid() || !curTime.isAfter(preTime)) {
        toast.warning('本期读表时间必须大于上期读表时间')
        return
      }

      submitMeter({
        communityId: communityInfo.communityId,
        configId: model.configId,
        objId: model.roomId,
        objName: `${model.floorNum}${model.unitNum}${model.roomNum}`,
        meterType: model.meterType,
        preDegrees: model.preDegrees,
        curDegrees,
        preReadingTime: model.preReadingTime,
        curReadingTime: model.curReadingTime,
        remark: model.remark || undefined,
      })
    })
    .catch((error: any) => {
      console.error('表单校验异常:', error)
    })
}

onLoad(() => {
  loadFeeTypes()
  loadMeterTypes()
})

onShow(() => {
  const beforeRoomId = model.roomId
  syncSelectedLocation()

  if (model.roomId && model.roomId !== beforeRoomId && canQueryPreDegree.value)
    loadPreMeter()
})

onUnload(() => {
  selectorStore.clearSelection()
  uni.removeStorageSync('_selectFloor')
  uni.removeStorageSync('_selectUnit')
  uni.removeStorageSync('_selectRoom')
})
</script>

<template>
  <view class="min-h-screen bg-gray-100 p-3">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <wd-cell-group border>
        <FormSectionTitle
          title="基础配置"
          icon="settings"
          icon-class="i-carbon-settings text-blue-500"
          required
        />

        <wd-picker
          v-model="model.feeTypeCd"
          label="费用类型"
          :label-width="LABEL_WIDTH"
          prop="feeTypeCd"
          :columns="feeTypeOptions"
          :rules="formRules.feeTypeCd"
          @confirm="handleFeeTypeConfirm"
        />

        <wd-picker
          v-model="model.configId"
          label="收费项目"
          :label-width="LABEL_WIDTH"
          prop="configId"
          :columns="feeConfigOptions"
          :rules="formRules.configId"
        />

        <wd-picker
          v-model="model.meterType"
          label="抄表类型"
          :label-width="LABEL_WIDTH"
          prop="meterType"
          :columns="meterTypeOptions"
          :rules="formRules.meterType"
          @confirm="handleMeterTypeConfirm"
        />
      </wd-cell-group>

      <wd-cell-group border class="mt-3">
        <FormSectionTitle
          title="房屋信息"
          icon="home"
          icon-class="i-carbon-home text-green-500"
          required
        />

        <wd-cell
          title="楼栋"
          :title-width="LABEL_WIDTH"
          is-link
          center
          custom-value-class="cell-value-left"
          @click="handleChooseFloor"
        >
          <text :class="model.floorNum ? 'text-gray-900' : 'text-gray-400'">
            {{ model.floorNum || '请选择楼栋' }}
          </text>
        </wd-cell>

        <wd-cell
          title="单元"
          :title-width="LABEL_WIDTH"
          is-link
          center
          custom-value-class="cell-value-left"
          @click="handleChooseUnit"
        >
          <text :class="model.unitNum ? 'text-gray-900' : 'text-gray-400'">
            {{ model.unitNum || '请选择单元' }}
          </text>
        </wd-cell>

        <wd-cell
          title="房屋"
          :title-width="LABEL_WIDTH"
          is-link
          center
          custom-value-class="cell-value-left"
          @click="handleChooseRoom"
        >
          <text :class="model.roomNum ? 'text-gray-900' : 'text-gray-400'">
            {{ model.roomNum || '请选择房屋' }}
          </text>
        </wd-cell>
      </wd-cell-group>

      <wd-cell-group border class="mt-3">
        <FormSectionTitle
          title="抄表信息"
          icon="chart-line-data"
          icon-class="i-carbon-chart-line-data text-purple-500"
          required
        />

        <wd-input
          v-model="model.preDegrees"
          label="上期度数"
          :label-width="LABEL_WIDTH"
          readonly
        />

        <wd-input
          v-model="model.preReadingTime"
          label="上期时间"
          :label-width="LABEL_WIDTH"
          readonly
        />

        <wd-input
          v-model="model.curDegrees"
          label="本期度数"
          :label-width="LABEL_WIDTH"
          prop="curDegrees"
          type="digit"
          placeholder="请输入本期度数"
          :rules="formRules.curDegrees"
        />

        <wd-datetime-picker
          v-model="model.curReadingTime"
          type="datetime"
          label="本期时间"
          :label-width="LABEL_WIDTH"
          prop="curReadingTime"
          :rules="formRules.curReadingTime"
        />

        <wd-textarea
          v-model="model.remark"
          label="备注"
          :label-width="LABEL_WIDTH"
          placeholder="请输入备注信息"
          :maxlength="250"
          show-word-limit
        />
      </wd-cell-group>

      <view class="mt-6 px-1 pb-6">
        <wd-button
          block
          type="primary"
          size="large"
          :loading="submitting"
          :disabled="submitting"
          @click="handleSubmit"
        >
          提交抄表
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style scoped>
:deep(.cell-value-left) {
  flex: 1;
  text-align: left !important;
}
</style>
