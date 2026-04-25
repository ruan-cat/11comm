import process from 'node:process'

/**
 * 运行时数据源类型。
 *
 * 当前阶段只真正实现 `mock`，
 * 但从第一阶段开始就把 `neon` 作为显式枚举保留下来，
 * 是为了先锁定 repository 边界，而不是将来再返工抽象层。
 */
export type RuntimeDataSource = 'mock' | 'neon'

/** 创建内存仓储时需要的最小配置。 */
export interface CreateMemoryRepositoryOptions<T extends Record<string, any>> {
  idKey: keyof T & string
  seed?: T[]
}

/**
 * 当前阶段通用的内存仓储接口。
 *
 * 这份接口的目标不是模拟复杂 ORM，
 * 而是防止试点逻辑继续直接绑死在 mock 数据文件里。
 */
export interface MemoryRepository<T extends Record<string, any>> {
  get: (id: string) => T | undefined
  list: () => T[]
  remove: (id: string) => boolean
  reset: (seed?: T[]) => void
  snapshot: () => T[]
  upsert: (entity: T) => T
}

/** `repair` 试点模块的最小仓储记录形态。 */
export interface PilotRepairRecord extends Record<string, any> {
  repairId: string
}

/** `work-order` 试点模块的最小仓储记录形态。 */
export interface PilotWorkOrderRecord extends Record<string, any> {
  orderId: string
}

/** 当前试点模块统一暴露的仓储集合。 */
export interface PilotRuntimeRepositories {
  repairs: MemoryRepository<PilotRepairRecord>
  workOrders: MemoryRepository<PilotWorkOrderRecord>
}

/** `repair` 仓储的默认种子数据，仅用于确认仓储边界已建立。 */
const defaultPilotRepairs: PilotRepairRecord[] = [
  {
    repairId: 'REPAIR_001',
    title: '电梯异常报修',
    status: '1000',
  },
]

/** `work-order` 仓储的默认种子数据，仅用于确认仓储边界已建立。 */
const defaultPilotWorkOrders: PilotWorkOrderRecord[] = [
  {
    orderId: 'WO_001',
    title: '试点工作单',
    status: '10003',
  },
]

/**
 * 解析当前运行时数据源。
 *
 * 默认回落到 `mock`，
 * 目的是让开发链路在没有额外数据库配置时始终可启动。
 */
export function resolveRuntimeDataSource(
  env: NodeJS.ProcessEnv = process.env,
): RuntimeDataSource {
  return env.NITRO_DATA_SOURCE === 'neon' ? 'neon' : 'mock'
}

/**
 * 创建可替换的内存仓储实现。
 *
 * 所有读写都通过 clone 保护，
 * 避免调用方直接持有内部引用，尽量接近未来真实仓储的值传递行为。
 */
export function createMemoryRepository<T extends Record<string, any>>(
  options: CreateMemoryRepositoryOptions<T>,
): MemoryRepository<T> {
  const { idKey } = options
  let store = createStore(idKey, options.seed || [])

  return {
    list() {
      return Array.from(store.values()).map(cloneEntity)
    },
    get(id) {
      const entity = store.get(id)
      return entity ? cloneEntity(entity) : undefined
    },
    upsert(entity) {
      const id = String(entity[idKey] || '')
      if (!id) {
        throw new Error(`Missing repository id field: ${idKey}`)
      }

      const clonedEntity = cloneEntity(entity)
      store.set(id, clonedEntity)
      return cloneEntity(clonedEntity)
    },
    remove(id) {
      return store.delete(id)
    },
    reset(seed = []) {
      store = createStore(idKey, seed)
    },
    snapshot() {
      return Array.from(store.values()).map(cloneEntity)
    },
  }
}

/**
 * 创建试点模块的运行时仓储集合。
 *
 * 当前只在 `mock` 模式下返回内存实现；
 * 如果传入 `neon`，则显式报错，确保“数据库尚未接入”这件事不会被静默掩盖。
 */
export function createPilotRuntimeRepositories(
  dataSource: RuntimeDataSource = resolveRuntimeDataSource(),
): PilotRuntimeRepositories {
  if (dataSource === 'neon') {
    throw new Error('Neon data source is not implemented yet for the Nitro pilot repositories')
  }

  return {
    repairs: createMemoryRepository({
      idKey: 'repairId',
      seed: defaultPilotRepairs,
    }),
    workOrders: createMemoryRepository({
      idKey: 'orderId',
      seed: defaultPilotWorkOrders,
    }),
  }
}

/** 根据种子数据构造初始 Map 存储。 */
function createStore<T extends Record<string, any>>(
  idKey: keyof T & string,
  seed: T[],
): Map<string, T> {
  const store = new Map<string, T>()

  for (const entity of seed) {
    const id = String(entity[idKey] || '')
    if (!id) {
      continue
    }

    store.set(id, cloneEntity(entity))
  }

  return store
}

/** 对外返回前统一克隆实体，避免调用方篡改内部状态。 */
function cloneEntity<T>(entity: T): T {
  return structuredClone(entity)
}
