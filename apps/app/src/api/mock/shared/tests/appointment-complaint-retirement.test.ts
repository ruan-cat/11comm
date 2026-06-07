import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import appointmentMocks from '../../appointment.mock'
import complaintMocks from '../../complaint.mock'

const mockSourceFiles = [
  fileURLToPath(new URL('../../appointment.mock.ts', import.meta.url)),
  fileURLToPath(new URL('../../complaint.mock.ts', import.meta.url)),
]

describe('appointment and complaint local mock retirement', () => {
  test('do not depend on old app server modules or adapter', () => {
    const source = mockSourceFiles.map(file => readFileSync(file, 'utf8')).join('\n')

    expect(source).not.toContain('server/modules')
    expect(source).not.toContain('mock-definition-adapter')
  })

  test('export local handlers for appointment and complaint urls', () => {
    const mocks = [...appointmentMocks, ...complaintMocks]
    const urls = mocks.map(mock => mock.url)

    expect(urls).toEqual(expect.arrayContaining([
      '/app/communitySpace.listCommunitySpaceConfirmOrder',
      '/app/communitySpace.saveCommunitySpaceConfirmOrder',
      '/app/auditUser.listAuditComplaints',
      '/app/auditUser.listAuditHistoryComplaints',
      '/app/complaint',
      '/app/complaint.auditComplaint',
      '/app/complaint.listComplaintEvent',
      '/app/complaintAppraise.listComplaintAppraise',
      '/app/complaintAppraise.replyComplaintAppraise',
    ]))
  })
})
