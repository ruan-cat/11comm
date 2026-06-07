import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import floorMocks from '../../floor.mock'
import roomMocks from '../../room.mock'
import unitMocks from '../../unit.mock'

const mockSourceFiles = [
  fileURLToPath(new URL('../../floor.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../room.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../unit.mock.ts', import.meta.url)),
]

describe('floor room unit local mocks', () => {
  test('do not depend on old app server modules or adapter', () => {
    const source = mockSourceFiles.map(file => readFileSync(file, 'utf8')).join('\n')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('export local handlers for key selector urls', () => {
    const mocks = [...floorMocks, ...roomMocks, ...unitMocks]
    const urls = mocks.map(mock => mock.url)

    expect(mocks).toHaveLength(6)
    expect(urls).toEqual(expect.arrayContaining([
      '/app/floor.queryFloors',
      '/app/floor.queryFloorDetail',
      '/app/room.queryRooms',
      '/app/room.queryRoomDetail',
      '/app/unit.queryUnits',
      '/app/unit.queryUnitDetail',
    ]))
  })
})
