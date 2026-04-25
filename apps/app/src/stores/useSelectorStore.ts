import type { Floor, Room, Unit } from '@/types/selector'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/** 选择器状态管理 */
export const useSelectorStore = defineStore('selector', () => {
  // 状态
  const selectedFloor = ref<Floor | null>(null)
  const selectedUnit = ref<Unit | null>(null)
  const selectedRoom = ref<Room | null>(null)

  // 计算属性 - 格式化显示文本
  const floorText = computed(() => (selectedFloor.value ? `${selectedFloor.value.floorNum}栋` : '请选择'))

  const unitText = computed(() => (selectedUnit.value ? `${selectedUnit.value.unitNum}单元` : '请选择'))

  const roomText = computed(() => (selectedRoom.value ? `${selectedRoom.value.roomNum}室` : '请选择'))

  // 方法
  const selectFloor = (floor: Floor) => {
    selectedFloor.value = floor
    // 清空下级选择
    selectedUnit.value = null
    selectedRoom.value = null
  }

  const selectUnit = (unit: Unit) => {
    selectedUnit.value = unit
    // 清空下级选择
    selectedRoom.value = null
  }

  const selectRoom = (room: Room) => {
    selectedRoom.value = room
  }

  const clearSelection = () => {
    selectedFloor.value = null
    selectedUnit.value = null
    selectedRoom.value = null
  }

  const clearUnit = () => {
    selectedUnit.value = null
    selectedRoom.value = null
  }

  const clearRoom = () => {
    selectedRoom.value = null
  }

  return {
    // 状态
    selectedFloor,
    selectedUnit,
    selectedRoom,
    // 计算属性
    floorText,
    unitText,
    roomText,
    // 方法
    selectFloor,
    selectUnit,
    selectRoom,
    clearSelection,
    clearUnit,
    clearRoom,
  }
})
