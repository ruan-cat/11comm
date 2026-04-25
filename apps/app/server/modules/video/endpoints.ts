import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { VideoModuleRepository } from './repository.ts'
import { successResponse } from '../../shared/runtime/response-builder.ts'
import { videoMockRepository } from './repository.ts'

/** 创建 `video` 模块的共享 endpoint 定义。 */
export function createVideoEndpointDefinitions(
  repository: VideoModuleRepository = videoMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/video.listMonitorArea',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.listMonitorArea({
        page: Number(params.page) || 1,
        row: Number(params.row) || 20,
      }), '查询成功'),
    },
    {
      url: '/app/video.listStaffMonitorMachine',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.listStaffMonitorMachine({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        maId: optionalString(params.maId),
        machineNameLike: optionalString(params.machineNameLike),
      }), '查询成功'),
    },
    {
      url: '/app/video.getPlayVideoUrl',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getPlayVideoUrl(optionalString(params.machineId) || 'MACHINE_0001'), '查询成功'),
    },
  ]
}

/** 导出默认的 video endpoint 集合。 */
export const videoEndpointDefinitions = createVideoEndpointDefinitions()

function optionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }

  const text = `${value}`.trim()
  return text || undefined
}
