import { describe, expect, test } from 'vitest'
import {
  createMemoryRepository,
  createPilotRuntimeRepositories,
  resolveRuntimeDataSource,
} from '../../../server/shared/runtime/memory-repository'

describe('memory repository', () => {
  test('supports upsert, get, remove and reset operations', () => {
    const repository = createMemoryRepository({
      idKey: 'orderId',
      seed: [
        {
          orderId: 'WO_001',
          title: 'Initial',
        },
      ],
    })

    expect(repository.get('WO_001')).toMatchObject({ title: 'Initial' })

    repository.upsert({
      orderId: 'WO_002',
      title: 'Created',
    })

    expect(repository.list()).toHaveLength(2)
    expect(repository.remove('WO_001')).toBe(true)
    expect(repository.get('WO_001')).toBeUndefined()

    repository.reset([
      {
        orderId: 'WO_003',
        title: 'Reset',
      },
    ])

    expect(repository.snapshot()).toEqual([
      {
        orderId: 'WO_003',
        title: 'Reset',
      },
    ])
  })

  test('resolves the runtime data source and creates pilot repositories', () => {
    expect(resolveRuntimeDataSource({})).toBe('mock')
    expect(resolveRuntimeDataSource({ NITRO_DATA_SOURCE: 'neon' })).toBe('neon')

    const repositories = createPilotRuntimeRepositories('mock')
    expect(repositories.workOrders.get('WO_001')).toMatchObject({ orderId: 'WO_001' })
    expect(() => createPilotRuntimeRepositories('neon')).toThrow(/Neon data source/)
  })
})
