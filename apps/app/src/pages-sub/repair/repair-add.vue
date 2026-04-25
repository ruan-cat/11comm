<!--
  维修录单
  功能：选择房屋并提交维修工单

  访问地址: http://localhost:3000/#/pages-sub/repair/repair-add

  旧代码：未找到（待补充）
-->

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router/helpers'
import { useSelectorStore } from '@/stores/useSelectorStore'

definePage({
  name: 'repair-add',
  style: {
    navigationBarTitleText: '维修录单',
  },
})

const selectorStore = useSelectorStore()
const toast = useGlobalToast()

// 选择楼栋
function handleSelectFloor() {
  TypedRouter.toSelectFloor()
}

// 选择单元
function handleSelectUnit() {
  if (!selectorStore.selectedFloor) {
    toast.show({ msg: '请先选择楼栋' })
    return
  }
  TypedRouter.toSelectUnit(selectorStore.selectedFloor.floorId)
}

// 选择房屋
function handleSelectRoom() {
  if (!selectorStore.selectedUnit) {
    toast.show({ msg: '请先选择单元' })
    return
  }
  if (!selectorStore.selectedFloor) {
    toast.show({ msg: '请先选择楼栋' })
    return
  }
  TypedRouter.toSelectRoom(
    selectorStore.selectedFloor.floorId,
    selectorStore.selectedUnit.unitId,
  )
}

// 清空选择
function handleClearSelection() {
  selectorStore.clearSelection()
  toast.show({ msg: '已清空选择' })
}

// 显示文本
const floorText = computed(() => selectorStore.floorText)
const unitText = computed(() => selectorStore.unitText)
const roomText = computed(() => selectorStore.roomText)

// 是否显示已选择的信息
const hasSelection = computed(
  () =>
    !!selectorStore.selectedFloor
    || !!selectorStore.selectedUnit
    || !!selectorStore.selectedRoom,
)

// 选择结果详情
const selectionDetail = computed(() => {
  const parts = []
  if (selectorStore.selectedFloor)
    parts.push(`${selectorStore.selectedFloor.floorNum}栋`)
  if (selectorStore.selectedUnit)
    parts.push(`${selectorStore.selectedUnit.unitNum}单元`)
  if (selectorStore.selectedRoom)
    parts.push(`${selectorStore.selectedRoom.roomNum}室`)

  return parts.join(' ')
})
</script>

<template>
  <!--
    维修录单页面（测试用）
    功能：测试选择器模块的完整流程

    访问地址: http://localhost:3000/#/pages-sub/repair/repair-add
  -->

  <view class="p-4">
    <wd-cell-group title="选择房屋位置">
      <wd-cell title="楼栋" :value="floorText" is-link @click="handleSelectFloor" />
      <wd-cell title="单元" :value="unitText" is-link @click="handleSelectUnit" />
      <wd-cell title="房屋" :value="roomText" is-link @click="handleSelectRoom" />
    </wd-cell-group>

    <wd-cell-group v-if="hasSelection" title="选择结果" style="margin-top: 20px">
      <wd-cell title="已选择" :value="selectionDetail" />
      <wd-cell title="操作" clickable @click="handleClearSelection">
        <text class="text-red-500">清空选择</text>
      </wd-cell>
    </wd-cell-group>

    <view
      v-if="!hasSelection"
      class="mt-4 rounded-lg bg-blue-50 p-4"
    >
      <text class="text-sm text-blue-700">
        提示：请点击上方选项，按顺序选择楼栋、单元和房屋。
      </text>
    </view>
  </view>
</template>
