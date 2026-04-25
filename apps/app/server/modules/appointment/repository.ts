import type { PaginationResponse } from '../../../src/types/api.ts'
import type { AppointmentOrder, AppointmentOrderQueryParams } from '../../../src/types/appointment.ts'
import { createPaginationResponse, formatDateTime, generatePhoneNumber } from '../../shared/runtime/common-utils.ts'

export interface AppointmentModuleRepository {
  confirm: (timeId: string) => boolean
  list: (params: AppointmentOrderQueryParams) => PaginationResponse<AppointmentOrder>
}

/** 创建 `appointment` 模块的 mock 内存仓储。 */
export function createAppointmentMockRepository(): AppointmentModuleRepository {
  return new AppointmentDatabase()
}

class AppointmentDatabase implements AppointmentModuleRepository {
  private readonly orders: AppointmentOrder[] = Array.from({ length: 48 }, (_, index) => {
    const baseDay = (index % 20) + 1
    const startHour = 8 + (index % 8)

    return {
      orderId: `ORDER_${(index + 1).toString().padStart(5, '0')}`,
      timeId: `HEXIAO_${(100000 + index).toString()}`,
      spaceName: index % 2 === 0 ? '羽毛球馆' : '篮球场',
      appointmentDate: `2026-03-${baseDay.toString().padStart(2, '0')}`,
      hours: `${startHour.toString().padStart(2, '0')}:00-${(startHour + 1).toString().padStart(2, '0')}:00`,
      personName: index % 2 === 0 ? '张先生' : '李女士',
      personTel: generatePhoneNumber(),
      createTime: formatDateTime(Date.now() - index * 7200000),
      state: index % 3 === 0 ? 'CONFIRMED' : 'WAIT_CONFIRM',
    }
  })

  confirm(timeId: string): boolean {
    const target = this.orders.find(item => item.timeId === timeId)
    if (!target) {
      return false
    }

    target.state = 'CONFIRMED'
    target.createTime = formatDateTime()
    return true
  }

  list(params: AppointmentOrderQueryParams): PaginationResponse<AppointmentOrder> {
    let list = [...this.orders]

    if (params.timeId) {
      list = list.filter(item => item.timeId.includes(String(params.timeId)))
    }

    return createPaginationResponse(list, params.page, params.row)
  }
}

/** 默认复用的 appointment mock 仓储实例。 */
export const appointmentMockRepository = createAppointmentMockRepository()
