import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import contactMocks from '../../contact.mock'
import ownerMocks from '../../owner.mock'
import profileMocks from '../../profile.mock'

const mockSourceFiles = [
  fileURLToPath(new URL('../../profile.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../contact.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../owner.mock.ts', import.meta.url)),
]

describe('profile contact owner local mock retirement', () => {
  test('do not depend on old app server modules or adapter', () => {
    const source = mockSourceFiles.map(file => readFileSync(file, 'utf8')).join('\n')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('export local handlers for profile contact and owner urls', () => {
    const mocks = [...profileMocks, ...contactMocks, ...ownerMocks]
    const urls = mocks.map(mock => mock.url)

    expect(urls).toEqual(expect.arrayContaining([
      '/app/profile.getUserProfile',
      '/app/profile.listCommunities',
      '/app/profile.changeCommunity',
      '/app/profile.changePassword',
      '/app/profile.listAttendanceRecords',
      '/app/contact.listContacts',
      '/app/contact.getContactDetail',
      '/app/contact.getContactsByDepartment',
      '/app/contact.searchContacts',
      '/app/contact.getDepartments',
      '/app/contact.updateOnlineStatus',
      '/app/contact.getFavoriteContacts',
      '/app/contact.getEmergencyContacts',
      '/app/owner.queryOwnerAndMembers',
      '/app/owner.saveRoomOwner',
      '/app/owner.editOwner',
      '/app/owner.deleteOwner',
    ]))
  })
})
