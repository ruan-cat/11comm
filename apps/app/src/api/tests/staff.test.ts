import { describe, expect, test } from 'vitest'
import { formatStaffList } from '../staff'

describe('staff api helpers', () => {
  test('formatStaffList keeps same-initial search results visible', () => {
    const groups = formatStaffList([
      {
        id: 'STAFF_ZHANG_XIA',
        name: '张霞',
        tel: '13800138001',
        orgName: '客服部',
        initials: 'Z',
        position: '客服专员',
        isOnline: true,
      },
      {
        id: 'STAFF_ZHANG_XIUYING',
        name: '张秀英',
        tel: '13800138002',
        orgName: '工程部',
        initials: 'Z',
        position: '工程专员',
        isOnline: false,
      },
    ])

    expect(groups).toHaveLength(1)
    expect(groups[0]).toMatchObject({
      initials: 'Z',
      staffs: [
        { name: '张霞' },
        { name: '张秀英' },
      ],
    })
  })
})
