import type { MonitorArea, MonitorMachine, VideoPlayUrl } from '../../../src/types/video.ts'
import { createPaginationResponse } from '../../shared/runtime/common-utils.ts'

export interface PaginationResult<T> {
  hasMore: boolean
  list: T[]
  page: number
  pageSize: number
  total: number
}

export interface VideoModuleRepository {
  getPlayVideoUrl: (machineId: string) => VideoPlayUrl
  listMonitorArea: (params: { page: number, row: number }) => PaginationResult<MonitorArea>
  listStaffMonitorMachine: (params: { maId?: string, machineNameLike?: string, page: number, row: number }) => PaginationResult<MonitorMachine>
}

/** 创建 `video` 模块的 mock 内存仓库。 */
export function createVideoMockRepository(): VideoModuleRepository {
  const areaList: MonitorArea[] = [
    { maId: '', maName: '全部区域' },
    { maId: 'AREA_001', maName: '北门通道' },
    { maId: 'AREA_002', maName: '南门广场' },
    { maId: 'AREA_003', maName: '地下车库' },
  ]

  const machineList: MonitorMachine[] = Array.from({ length: 26 }, (_, index) => ({
    machineId: `MACHINE_${(index + 1).toString().padStart(4, '0')}`,
    communityId: 'COMM_001',
    machineName: `监控设备-${(index + 1).toString().padStart(2, '0')}`,
    maId: index % 3 === 0 ? 'AREA_001' : index % 3 === 1 ? 'AREA_002' : 'AREA_003',
    maName: index % 3 === 0 ? '北门通道' : index % 3 === 1 ? '南门广场' : '地下车库',
    photoUrl: `https://picsum.photos/seed/video-${index + 1}/640/360`,
  }))

  return {
    getPlayVideoUrl(machineId) {
      return {
        url: `https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4?machineId=${encodeURIComponent(machineId)}`,
      }
    },
    listMonitorArea(params) {
      return createPaginationResponse(areaList, params.page, params.row)
    },
    listStaffMonitorMachine(params) {
      let list = [...machineList]

      if (params.maId) {
        list = list.filter(item => item.maId === String(params.maId))
      }

      if (params.machineNameLike) {
        const keyword = String(params.machineNameLike).trim()
        list = list.filter(item => item.machineName.includes(keyword))
      }

      return createPaginationResponse(list, params.page, params.row)
    },
  }
}

/** 导出默认的 video mock 仓库实例。 */
export const videoMockRepository = createVideoMockRepository()
