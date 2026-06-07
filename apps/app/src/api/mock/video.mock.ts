/**
 * 视频监控模块 Mock 接口。
 */

import type { MonitorArea, MonitorMachine } from '../../types/video'
import { createPaginationResponse, defineUniAppMock, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 监控区域 mock 数据。 */
const monitorAreas: MonitorArea[] = [
  { maId: '', maName: '全部区域' },
  { maId: 'AREA_001', maName: '北门通道' },
  { maId: 'AREA_002', maName: '南门广场' },
  { maId: 'AREA_003', maName: '地下车库' },
]

/** 监控设备 mock 数据。 */
const monitorMachines: MonitorMachine[] = Array.from({ length: 12 }, (_, index) => {
  const area = monitorAreas[(index % 3) + 1]

  return {
    machineId: `MACHINE_${(index + 1).toString().padStart(4, '0')}`,
    communityId: 'COMM_001',
    machineName: `监控设备-${(index + 1).toString().padStart(2, '0')}`,
    maId: area.maId,
    maName: area.maName,
    photoUrl: `https://picsum.photos/seed/video-${index + 1}/640/360`,
  }
})

export default defineUniAppMock([
  {
    url: '/app/video.listMonitorArea',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 20)

      return successResponse(createPaginationResponse(monitorAreas, page, row), '查询成功')
    },
  },
  {
    url: '/app/video.listStaffMonitorMachine',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const maId = asOptionalString(params.maId)
      const machineNameLike = asOptionalString(params.machineNameLike)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 10)
      const machines = monitorMachines.filter((machine) => {
        const matchArea = !maId || machine.maId === maId
        const matchName = !machineNameLike || machine.machineName.includes(machineNameLike)

        return matchArea && matchName
      })

      return successResponse(createPaginationResponse(machines, page, row), '查询成功')
    },
  },
  {
    url: '/app/video.getPlayVideoUrl',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const machineId = asOptionalString(params.machineId) || 'MACHINE_0001'

      return successResponse({
        url: `https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4?machineId=${encodeURIComponent(machineId)}`,
      }, '查询成功')
    },
  },
])

/** 合并 Vite mock 的 query、body 与 params。 */
function getRequestParams(context: MockContext): Record<string, unknown> {
  return {
    ...(context.query || {}),
    ...(context.body || {}),
    ...(context.params || {}),
  }
}

/** 将未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

/** 将未知值收敛为正数。 */
function asPositiveNumber(value: unknown, fallback: number): number {
  const numberValue = Number(asOptionalString(value))

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback
}
