/**
 * 共享 endpoint 分发上下文。
 *
 * 这里刻意不暴露 H3Event 或 Vite mock 的原始上下文，
 * 目的是让 Nitro 与 vite-plugin-mock-dev-server 都能消费同一套端点逻辑。
 */
export interface EndpointDispatchContext {
  body?: Record<string, any>
  method: string
  params: Record<string, any>
  path: string
  query?: Record<string, any>
}

/**
 * 共享 endpoint 定义。
 *
 * 当前阶段只保留 `url + method + handler` 这组最小抽象，
 * 先保证旧业务路径能在两个运行时之间复用，后续再逐步细化模块设计。
 */
export interface EndpointDefinition {
  handler: (context: EndpointDispatchContext) => any
  method: string | string[]
  url: string
}

interface EndpointMatchResult {
  definition: EndpointDefinition
  pathParams: Record<string, string>
}

/**
 * dispatcher 的最小输入结构。
 *
 * 不同运行时只需要负责把自己的请求对象转换成这份结构，
 * 共享分发层就能保持稳定。
 */
export interface EndpointDispatchInput {
  body?: Record<string, any>
  method: string
  path: string
  query?: Record<string, any>
}

/**
 * 创建共享 endpoint registry。
 *
 * 当前最重要的工作是把 method 归一化成大写数组，
 * 这样后续的匹配逻辑就不必同时处理字符串与数组两种输入形态。
 */
export function createEndpointRegistry(definitions: EndpointDefinition[]): EndpointDefinition[] {
  return definitions.map(definition => ({
    ...definition,
    method: normalizeMethods(definition.method),
  }))
}

/**
 * 按请求 method 和 path 查找匹配的 endpoint 定义。
 *
 * 当前阶段采用精确路径匹配，是因为目标是无痛复用现有 mock 契约，
 * 暂时不在这里引入动态路由参数或更复杂的路由规则。
 */
export function findEndpointDefinition(
  registry: EndpointDefinition[],
  method: string,
  path: string,
): EndpointDefinition | undefined {
  return matchEndpointDefinition(registry, method, path)?.definition
}

/**
 * 分发共享 endpoint 请求。
 *
 * 这里统一把 query 与 body 合并成 `params`，
 * 是为了兼容现有 mock 定义里大量“从统一参数对象取值”的写法，
 * 降低旧 mock 迁入 Nitro 的改造成本。
 */
export async function dispatchEndpoint(
  registry: EndpointDefinition[],
  input: EndpointDispatchInput,
): Promise<any> {
  const normalizedMethod = normalizeMethod(input.method)

  /**
   * CORS preflight requests only need a successful empty response.
   * They should not participate in business endpoint matching.
   */
  if (normalizedMethod === 'OPTIONS') {
    return null
  }

  const match = matchEndpointDefinition(registry, normalizedMethod, input.path)

  if (!match) {
    const error = new Error(`Endpoint not found: ${input.method} ${input.path}`) as Error & {
      statusCode: number
    }
    error.statusCode = 404
    throw error
  }

  const query = input.query || {}
  const body = input.body || {}

  return await match.definition.handler({
    method: normalizedMethod,
    path: input.path,
    query,
    body,
    params: {
      ...query,
      ...body,
      ...match.pathParams,
    },
  })
}

/** 统一把 method 归一化为大写，避免不同运行时大小写不一致。 */
function normalizeMethod(method: string): string {
  return method.toUpperCase()
}

/** 统一把单个 method 或 method 数组转换成可匹配的数组结构。 */
function normalizeMethods(method: string | string[]): string[] {
  const methods = Array.isArray(method) ? method : [method]

  return methods.map(normalizeMethod)
}

/** 查找与当前请求 method/path 匹配的 endpoint 及其动态路径参数。 */
function matchEndpointDefinition(
  registry: EndpointDefinition[],
  method: string,
  path: string,
): EndpointMatchResult | undefined {
  const normalizedMethod = normalizeMethod(method)

  for (const definition of registry) {
    const methods = normalizeMethods(definition.method)
    if (!methods.includes(normalizedMethod)) {
      continue
    }

    const pathParams = matchPathPattern(definition.url, path)
    if (pathParams) {
      return {
        definition,
        pathParams,
      }
    }
  }

  return undefined
}

/**
 * 匹配静态路径与 `:param` 动态路径。
 *
 * 这里只实现现有 mock 所需的最小能力：
 * - 静态段必须完全一致
 * - 动态段使用 `:name` 提取单段参数
 */
function matchPathPattern(pattern: string, actualPath: string): Record<string, string> | undefined {
  if (pattern === actualPath) {
    return {}
  }

  const patternSegments = splitPath(pattern)
  const actualSegments = splitPath(actualPath)

  if (patternSegments.length !== actualSegments.length) {
    return undefined
  }

  const pathParams: Record<string, string> = {}

  for (let index = 0; index < patternSegments.length; index += 1) {
    const patternSegment = patternSegments[index]
    const actualSegment = actualSegments[index]

    if (patternSegment.startsWith(':')) {
      pathParams[patternSegment.slice(1)] = actualSegment
      continue
    }

    if (patternSegment !== actualSegment) {
      return undefined
    }
  }

  return pathParams
}

/** 把路径拆成不含前后空段的 segment 数组。 */
function splitPath(path: string): string[] {
  return path.split('/').filter(Boolean)
}
