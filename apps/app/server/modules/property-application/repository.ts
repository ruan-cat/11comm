import type {
  ApplicationRecord,
  ApplicationRecordDetail,
  ApplicationRecordDetailParams,
  ApplicationRecordListParams,
  ApplicationState,
  CheckUpdateRequest,
  DeleteApplicationRecordRequest,
  DictInfo,
  DictQueryParams,
  FeeDetail,
  FeeDetailParams,
  FeeDiscount,
  FeeDiscountParams,
  PropertyApplication,
  PropertyApplicationListParams,
  RelationTypeCd,
  ReviewUpdateRequest,
  SaveApplicationRecordRequest,
} from '../../../src/types/property-application.ts'
import {
  PROPERTY_APPLICATION_STATE_OPTIONS,
  PROPERTY_APPLY_TYPE_OPTIONS,
  PROPERTY_RECORD_STATE_OPTIONS,
  PROPERTY_RELATION_TYPE_OPTIONS,
} from '../../../src/constants/property-application.ts'
import {
  createPaginationResponse,
  formatDateTime,
  generateChineseName,
  generateId,
  generatePhoneNumber,
  generateTimeRange,
} from '../../shared/runtime/common-utils.ts'

export interface PropertyApplicationModuleRepository {
  deleteRecord: (data: DeleteApplicationRecordRequest) => boolean
  getApplicationById: (ardId: string) => PropertyApplication | undefined
  getApplicationList: (params: PropertyApplicationListParams) => ReturnType<typeof createPaginationResponse<PropertyApplication>>
  getDictInfo: (params: DictQueryParams) => DictInfo[]
  getFeeDetailList: (params: FeeDetailParams) => { feeDetails: FeeDetail[] }
  getFeeDiscountList: (params: FeeDiscountParams) => FeeDiscount[]
  getRecordDetailList: (params: ApplicationRecordDetailParams) => ApplicationRecordDetail[]
  getRecordList: (params: ApplicationRecordListParams) => ReturnType<typeof createPaginationResponse<ApplicationRecord>>
  saveRecord: (data: SaveApplicationRecordRequest) => boolean
  updateCheckInfo: (data: CheckUpdateRequest) => boolean
  updateReviewInfo: (data: ReviewUpdateRequest) => boolean
}

/** 创建 `property-application` 模块的 mock 内存仓储。 */
export function createPropertyApplicationMockRepository(): PropertyApplicationModuleRepository {
  return new PropertyApplicationDatabase()
}

/** property-application 模块的 mock 内存仓储实现。 */
class PropertyApplicationDatabase implements PropertyApplicationModuleRepository {
  private readonly applyRooms: PropertyApplication[] = [
    {
      ardId: 'ARD_001',
      applyType: '1001',
      applyTypeName: '空置房申请',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      communityId: 'COMM_001',
      createUserName: '张三',
      createUserTel: '13812345678',
      createRemark: '业主申请空置房，希望获得费用减免',
      checkRemark: '验房通过，房屋状况良好',
      reviewRemark: '审批通过，同意给予费用减免',
      startTime: '2024-01-15 00:00:00',
      endTime: '2024-03-15 23:59:59',
      feeId: 'FEE_001',
      state: '4',
      stateName: '审批通过',
      urls: ['https://picsum.photos/400/300?random=room1'],
      createTime: '2024-01-10 10:30:00',
      updateTime: '2024-01-20 14:20:00',
    },
    {
      ardId: 'ARD_002',
      applyType: '1001',
      applyTypeName: '空置房申请',
      roomId: 'ROOM_002',
      roomName: '2栋202B室',
      communityId: 'COMM_001',
      createUserName: '李四',
      createUserTel: '13823456789',
      createRemark: '房屋长期空置，申请减免物业费',
      checkRemark: '验房通过，房屋设施完好',
      reviewRemark: '审批通过，减免部分费用',
      startTime: '2024-02-01 00:00:00',
      endTime: '2024-04-01 23:59:59',
      feeId: 'FEE_002',
      state: '1',
      stateName: '待验房',
      urls: ['https://picsum.photos/400/300?random=room2'],
      createTime: '2024-01-25 09:15:00',
      updateTime: '2024-01-25 09:15:00',
    },
    {
      ardId: 'ARD_003',
      applyType: '1001',
      applyTypeName: '空置房申请',
      roomId: 'ROOM_003',
      roomName: '3栋303C室',
      communityId: 'COMM_001',
      createUserName: '王五',
      createUserTel: '13834567890',
      createRemark: '房屋装修期间空置，申请费用减免',
      checkRemark: '验房不通过，房屋存在损坏',
      reviewRemark: '',
      startTime: '2024-01-20 00:00:00',
      endTime: '2024-02-20 23:59:59',
      feeId: 'FEE_003',
      state: '3',
      stateName: '验房不通过',
      urls: ['https://picsum.photos/400/300?random=room3'],
      createTime: '2024-01-15 16:45:00',
      updateTime: '2024-01-18 11:30:00',
    },
    {
      ardId: 'ARD_004',
      applyType: '1001',
      applyTypeName: '空置房申请',
      roomId: 'ROOM_004',
      roomName: '4栋404D室',
      communityId: 'COMM_001',
      createUserName: '赵六',
      createUserTel: '13845678901',
      createRemark: '长期外出工作，房屋空置',
      checkRemark: '验房通过',
      reviewRemark: '',
      startTime: '2024-02-10 00:00:00',
      endTime: '2024-05-10 23:59:59',
      feeId: 'FEE_004',
      state: '2',
      stateName: '待审核',
      urls: ['https://picsum.photos/400/300?random=room4'],
      createTime: '2024-02-05 14:20:00',
      updateTime: '2024-02-08 10:15:00',
    },
  ]

  private feeDetails: FeeDetail[] = [
    {
      detailId: 'DETAIL_001',
      feeName: '物业管理费',
      receivedAmount: 300,
      createTime: '2024-01-15 00:00:00',
      checked: false,
      feeId: 'FEE_001',
      roomId: 'ROOM_001',
      communityId: 'COMM_001',
    },
    {
      detailId: 'DETAIL_002',
      feeName: '垃圾处理费',
      receivedAmount: 50,
      createTime: '2024-01-15 00:00:00',
      checked: false,
      feeId: 'FEE_001',
      roomId: 'ROOM_001',
      communityId: 'COMM_001',
    },
    {
      detailId: 'DETAIL_003',
      feeName: '公共区域维护费',
      receivedAmount: 100,
      createTime: '2024-01-15 00:00:00',
      checked: false,
      feeId: 'FEE_001',
      roomId: 'ROOM_001',
      communityId: 'COMM_001',
    },
  ]

  private readonly feeDiscounts: FeeDiscount[] = [
    {
      discountId: 'DISCOUNT_001',
      discountName: '季度空置房优惠',
      discountType: '3003',
      discountAmount: 200,
      communityId: 'COMM_001',
    },
    {
      discountId: 'DISCOUNT_002',
      discountName: '半年空置房优惠',
      discountType: '3003',
      discountAmount: 500,
      communityId: 'COMM_001',
    },
    {
      discountId: 'DISCOUNT_003',
      discountName: '年度空置房优惠',
      discountType: '3003',
      discountAmount: 1200,
      communityId: 'COMM_001',
    },
  ]

  private recordDetails: ApplicationRecordDetail[] = [
    {
      ardrId: 'ARDR_001',
      applicationId: 'ARD_001',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      relTypeCd: '19000',
      url: 'https://picsum.photos/400/300?random=record1',
      remark: '验房照片1',
      createTime: '2024-01-18 10:30:00',
    },
    {
      ardrId: 'ARDR_002',
      applicationId: 'ARD_001',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      relTypeCd: '21000',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      remark: '验房视频1',
      createTime: '2024-01-18 10:35:00',
    },
  ]

  private readonly records: ApplicationRecord[] = [
    {
      ardrId: 'ARDR_001',
      applicationId: 'ARD_001',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      state: '4',
      stateName: '审批通过',
      remark: '完成最终审核，同意费用减免申请',
      createUserName: '管理员',
      createTime: '2024-01-20 14:20:00',
      communityId: 'COMM_001',
    },
    {
      ardrId: 'ARDR_002',
      applicationId: 'ARD_001',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      state: '1',
      stateName: '待验房',
      remark: '开始验房流程',
      createUserName: '验房员',
      createTime: '2024-01-18 10:30:00',
      communityId: 'COMM_001',
    },
  ]

  constructor() {
    this.initMoreData()
  }

  getApplicationList(params: PropertyApplicationListParams) {
    let filteredData = [...this.applyRooms]

    if (params.communityId) {
      filteredData = filteredData.filter(item => item.communityId === params.communityId)
    }

    if (params.roomName) {
      filteredData = filteredData.filter(item =>
        item.roomName.toLowerCase().includes(params.roomName.toLowerCase()),
      )
    }

    if (params.state) {
      filteredData = filteredData.filter(item => item.state === params.state)
    }

    return cloneValue(createPaginationResponse(filteredData, params.page, params.row))
  }

  getApplicationById(ardId: string): PropertyApplication | undefined {
    const applyRoom = this.applyRooms.find(item => item.ardId === ardId)
    return applyRoom ? cloneValue(applyRoom) : undefined
  }

  updateCheckInfo(data: CheckUpdateRequest): boolean {
    const applyRoom = this.applyRooms.find(item => item.ardId === data.ardId)
    if (!applyRoom) {
      return false
    }

    applyRoom.state = data.state as ApplicationState
    applyRoom.stateName = data.state === '2' ? '验房通过' : '验房不通过'
    applyRoom.checkRemark = data.checkRemark
    applyRoom.startTime = data.startTime
    applyRoom.endTime = data.endTime
    applyRoom.updateTime = formatDateTime()

    if (data.photos.length > 0) {
      applyRoom.urls = data.photos.map(photoId => `https://picsum.photos/400/300?random=${photoId}`)
    }

    return true
  }

  updateReviewInfo(data: ReviewUpdateRequest): boolean {
    const applyRoom = this.applyRooms.find(item => item.ardId === data.ardId)
    if (!applyRoom) {
      return false
    }

    applyRoom.state = data.state as ApplicationState
    applyRoom.stateName = data.state === '4' ? '审批通过' : '审批不通过'
    applyRoom.reviewRemark = data.reviewRemark
    applyRoom.startTime = data.startTime
    applyRoom.endTime = data.endTime
    applyRoom.updateTime = formatDateTime()

    return true
  }

  getRecordList(params: ApplicationRecordListParams) {
    let filteredData = [...this.records]

    if (params.communityId) {
      filteredData = filteredData.filter(item => item.communityId === params.communityId)
    }

    if (params.applicationId) {
      filteredData = filteredData.filter(item => item.applicationId === params.applicationId)
    }

    if (params.roomId) {
      filteredData = filteredData.filter(item => item.roomId === params.roomId)
    }

    if (params.roomName) {
      filteredData = filteredData.filter(item =>
        item.roomName.toLowerCase().includes(params.roomName.toLowerCase()),
      )
    }

    return cloneValue(createPaginationResponse(filteredData, params.page, params.row))
  }

  getRecordDetailList(params: ApplicationRecordDetailParams): ApplicationRecordDetail[] {
    let filteredData = [...this.recordDetails]

    if (params.ardrId) {
      filteredData = filteredData.filter(item => item.ardrId === params.ardrId)
    }

    if (params.communityId) {
      const relatedRecords = this.records.filter(item => item.communityId === params.communityId)
      const relatedRecordIds = relatedRecords.map(item => item.ardrId)
      filteredData = filteredData.filter(item => relatedRecordIds.includes(item.ardrId))
    }

    return cloneValue(filteredData)
  }

  saveRecord(data: SaveApplicationRecordRequest): boolean {
    const newRecord: ApplicationRecord = {
      ardrId: generateId('ARDR'),
      applicationId: data.applicationId,
      roomId: data.roomId,
      roomName: data.roomName,
      state: data.state,
      stateName: data.stateName,
      remark: data.remark,
      createUserName: '当前用户',
      createTime: formatDateTime(),
      communityId: data.communityId,
    }

    this.records.unshift(newRecord)

    data.photos.forEach((photoId) => {
      this.recordDetails.push({
        ardrId: newRecord.ardrId,
        applicationId: data.applicationId,
        roomId: data.roomId,
        roomName: data.roomName,
        relTypeCd: '19000',
        url: `https://picsum.photos/400/300?random=${photoId}`,
        remark: data.remark,
        createTime: formatDateTime(),
      })
    })

    return true
  }

  deleteRecord(data: DeleteApplicationRecordRequest): boolean {
    const recordIndex = this.records.findIndex(item => item.ardrId === data.ardrId)
    if (recordIndex === -1) {
      return false
    }

    this.records.splice(recordIndex, 1)
    this.recordDetails = this.recordDetails.filter(item => item.ardrId !== data.ardrId)
    return true
  }

  getFeeDiscountList(params: FeeDiscountParams): FeeDiscount[] {
    let filteredData = [...this.feeDiscounts]

    if (params.discountType) {
      filteredData = filteredData.filter(item => item.discountType === params.discountType)
    }

    if (params.communityId) {
      filteredData = filteredData.filter(item => item.communityId === params.communityId)
    }

    return cloneValue(filteredData)
  }

  getFeeDetailList(params: FeeDetailParams): { feeDetails: FeeDetail[] } {
    let filteredData = [...this.feeDetails]

    if (params.communityId) {
      filteredData = filteredData.filter(item => item.communityId === params.communityId)
    }

    if (params.feeId) {
      filteredData = filteredData.filter(item => item.feeId === params.feeId)
    }

    return cloneValue({ feeDetails: filteredData })
  }

  getDictInfo(params: DictQueryParams): DictInfo[] {
    if (params.name === 'apply_room_discount' && params.type === 'state') {
      return PROPERTY_APPLICATION_STATE_OPTIONS.map(item => ({
        statusCd: `${item.value}`,
        name: `${item.label}`,
      }))
    }

    return []
  }

  /** 初始化更多模拟数据。 */
  private initMoreData() {
    if (this.applyRooms.length < 50) {
      const additionalData = Array.from({ length: 46 }, (_, index) =>
        this.createMockApplyRoom(String(index + 5).padStart(3, '0')))
      this.applyRooms.push(...additionalData)
    }

    if (this.records.length < 100) {
      const additionalRecords = Array.from({ length: 98 }, (_, index) => {
        const applicationId = this.applyRooms[Math.floor(Math.random() * this.applyRooms.length)]?.ardId || 'ARD_001'
        return this.createMockRecord(String(index + 3).padStart(3, '0'), applicationId)
      })
      this.records.push(...additionalRecords)
    }

    if (this.recordDetails.length < 200) {
      const additionalDetails = Array.from({ length: 198 }, (_, index) => {
        const ardrId = this.records[Math.floor(Math.random() * this.records.length)]?.ardrId || 'ARDR_001'
        return this.createMockRecordDetail(String(index + 3).padStart(3, '0'), ardrId)
      })
      this.recordDetails.push(...additionalDetails)
    }
  }

  /** 生成模拟申请。 */
  private createMockApplyRoom(id: string): PropertyApplication {
    const stateItem
      = PROPERTY_APPLICATION_STATE_OPTIONS[Math.floor(Math.random() * PROPERTY_APPLICATION_STATE_OPTIONS.length)]
    const applyType = PROPERTY_APPLY_TYPE_OPTIONS[0]
    const startDate = generateTimeRange(-30, 0)
    const endDate = generateTimeRange(0, 90)

    return {
      ardId: `ARD_${id}`,
      applyType: `${applyType.value}`,
      applyTypeName: `${applyType.label}`,
      roomId: `ROOM_${id}`,
      roomName: `${Math.floor(Math.random() * 20 + 1)}栋${Math.floor(Math.random() * 30 + 1)}${String.fromCharCode(65 + Math.floor(Math.random() * 8))}室`,
      communityId: 'COMM_001',
      createUserName: generateChineseName(),
      createUserTel: generatePhoneNumber(),
      createRemark: '业主申请空置房，希望获得费用减免',
      checkRemark: stateItem.value === '3' ? '验房不通过，房屋存在损坏' : '验房通过，房屋状况良好',
      reviewRemark: stateItem.value === '4' ? '审批通过，同意给予费用减免' : '',
      startTime: `${startDate.slice(0, 10)} 00:00:00`,
      endTime: `${endDate.slice(0, 10)} 23:59:59`,
      feeId: `FEE_${id}`,
      state: stateItem.value as ApplicationState,
      stateName: `${stateItem.label}`,
      urls: [`https://picsum.photos/400/300?random=${id}`],
      createTime: generateTimeRange(-60, -1),
      updateTime: generateTimeRange(-30, 0),
    }
  }

  /** 生成模拟跟踪记录。 */
  private createMockRecord(id: string, applicationId: string): ApplicationRecord {
    const stateItem = PROPERTY_RECORD_STATE_OPTIONS[Math.floor(Math.random() * PROPERTY_RECORD_STATE_OPTIONS.length)]

    return {
      ardrId: `ARDR_${id}`,
      applicationId,
      roomId: `ROOM_${id}`,
      roomName: `${Math.floor(Math.random() * 20 + 1)}栋${Math.floor(Math.random() * 30 + 1)}${String.fromCharCode(65 + Math.floor(Math.random() * 8))}室`,
      state: `${stateItem.value}`,
      stateName: `${stateItem.label}`,
      remark: '处理记录详情',
      createUserName: generateChineseName(),
      createTime: generateTimeRange(-30, 0),
      communityId: 'COMM_001',
    }
  }

  /** 生成模拟记录详情。 */
  private createMockRecordDetail(id: string, ardrId: string): ApplicationRecordDetail {
    const relationItem
      = PROPERTY_RELATION_TYPE_OPTIONS[Math.floor(Math.random() * PROPERTY_RELATION_TYPE_OPTIONS.length)]

    return {
      ardrId,
      applicationId: `ARD_${id}`,
      roomId: `ROOM_${id}`,
      roomName: `${Math.floor(Math.random() * 20 + 1)}栋${Math.floor(Math.random() * 30 + 1)}${String.fromCharCode(65 + Math.floor(Math.random() * 8))}室`,
      relTypeCd: relationItem.value as RelationTypeCd,
      url: relationItem.value === '19000'
        ? `https://picsum.photos/400/300?random=detail${id}`
        : 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      remark: relationItem.value === '19000' ? '相关图片' : '相关视频',
      createTime: generateTimeRange(-30, 0),
    }
  }
}

/** 默认供运行时直接复用的 property-application 仓储实例。 */
export const propertyApplicationMockRepository = createPropertyApplicationMockRepository()

/** 克隆仓储返回值，避免外部篡改内部引用。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
