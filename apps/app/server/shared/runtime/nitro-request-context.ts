import type { H3Event } from 'nitro/h3'
import type { EndpointDispatchInput } from './endpoint-registry.ts'
import { getMethod, getQuery, getRequestURL, readBody } from 'nitro/h3'

/**
 * 脱离 H3Event 后的 Nitro 请求快照。
 *
 * 定义这层中间结构，是为了让请求归一化逻辑既能服务真实 Nitro event，
 * 也能在测试里直接构造快照，而不必每次都模拟完整的 H3Event。
 */
export interface NitroRequestSnapshot {
  body?: unknown
  method: string
  path: string
  query?: unknown
}

/**
 * 把 Nitro 请求快照转换成共享 dispatcher 可消费的输入结构。
 *
 * 这里是 Nitro 运行时与共享 endpoint registry 之间的解耦边界。
 * 一旦这层稳定，dispatcher 就不需要知道 H3 的任何细节。
 */
export function createDispatchInputFromNitroSnapshot(
  snapshot: NitroRequestSnapshot,
): EndpointDispatchInput {
  const method = snapshot.method.toUpperCase()

  return {
    method,
    path: snapshot.path,
    query: normalizeObject(snapshot.query),
    body: normalizeRequestBody(method, snapshot.body),
  }
}

/**
 * 直接从 H3Event 读取请求并完成归一化。
 *
 * 读取 body 时显式兜底为 `undefined`，
 * 是为了让上层统一通过 `normalizeRequestBody` 决定如何处理空 body 与非法 body。
 */
export async function createDispatchInputFromNitroEvent(
  event: H3Event,
): Promise<EndpointDispatchInput> {
  const body = await readBody(event).catch(() => undefined)

  return createDispatchInputFromNitroSnapshot({
    method: getMethod(event),
    path: getRequestURL(event).pathname,
    query: getQuery(event),
    body,
  })
}

/**
 * 归一化请求体。
 *
 * GET / HEAD 请求一律视为无 body，
 * 其他方法也只接受对象形态，避免把数组、字符串等非预期输入直接带进共享业务层。
 */
export function normalizeRequestBody(method: string, body: unknown): Record<string, any> {
  if (method === 'GET' || method === 'HEAD') {
    return {}
  }

  return normalizeObject(body)
}

/** 把未知值收敛成对象；非对象则回退为空对象。 */
function normalizeObject(value: unknown): Record<string, any> {
  return isObjectLike(value) ? value : {}
}

/** 判断一个值是否是 dispatcher 可接受的普通对象。 */
function isObjectLike(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
