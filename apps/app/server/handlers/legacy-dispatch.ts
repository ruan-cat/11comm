import type { H3Event } from 'nitro/h3'
import { defineEventHandler } from 'nitro/h3'
import { createEndpointRegistry, dispatchEndpoint } from '../shared/runtime/endpoint-registry.ts'
import { createDispatchInputFromNitroEvent } from '../shared/runtime/nitro-request-context.ts'
import { runtimeEndpointDefinitions } from '../shared/runtime/runtime-endpoints.ts'

/**
 * 统一承接旧业务路径的 Nitro dispatcher。
 *
 * 设计目的：
 * 1. 当前阶段优先兼容 `/app/**`、`/callComponent/**` 等历史接口路径。
 * 2. 避免在 Nitro 首批试点阶段为每个旧接口都单独创建文件路由。
 * 3. 让已拆出的共享模块优先命中显式端点，其余模块继续由 legacy adapter 兜底。
 */
const registry = createEndpointRegistry(runtimeEndpointDefinitions)

/** 把 Nitro 请求归一化后交给共享 registry 分发。 */
export default defineEventHandler(async (event: H3Event) => {
  const input = await createDispatchInputFromNitroEvent(event)
  return await dispatchEndpoint(registry, input)
})
