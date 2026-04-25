/** 巡检任务信息 */
export interface InspectionTask {
  /** 任务ID */
  taskId: string
  /** 巡检计划ID */
  inspectionPlanId: string
  /** 巡检计划名称 */
  inspectionPlanName: string
  /** 巡检人姓名 */
  planUserName: string
  /** 计划巡检时间 */
  planInsTime: string
  /** 巡检方式名称 */
  signTypeName: string
  /** 任务状态名称 */
  stateName: string
  /** 任务状态编码 */
  state: string
  /** 原始巡检人ID（用于流转） */
  originalPlanUserId?: string
  /** 原始巡检人姓名（用于流转） */
  originalPlanUserName?: string
  /** 计划结束时间 */
  planEndTime?: string
  /** 巡检人ID */
  planUserId?: string
  /** 签到类型 */
  signType?: string
  /** 状态编码 */
  statusCd?: string
}

/** 巡检任务详情 */
export interface InspectionTaskDetail {
  /** 任务详情ID */
  taskDetailId: string
  /** 任务ID */
  taskId: string
  /** 巡检项ID */
  inspectionId: string
  /** 巡检项名称 */
  inspectionName: string
  /** 项目ID */
  itemId: string
  /** 状态 */
  state: string
  /** 状态名称 */
  stateName?: string
  /** 巡检开始时间 */
  pointStartTime?: string
  /** 巡检结束时间 */
  pointEndTime?: string
  /** 处理意见 */
  description?: string
  /** 照片列表 */
  photos?: InspectionPhoto[]
}

/** 巡检照片 */
export interface InspectionPhoto {
  /** 照片URL */
  url: string
  /** 文件ID */
  fileId?: string
}

/** 巡检项标题 */
export interface InspectionItemTitle {
  /** 标题ID */
  titleId: string
  /** 标题 */
  itemTitle: string
  /** 标题类型 (1001=单选, 2002=多选, 其他=文本) */
  titleType: string
  /** 选中的值 (单选/文本时为字符串，多选时为字符串数组) */
  radio: string | string[]
  /** 标题值选项 */
  inspectionItemTitleValueDtos: Array<{
    /** 选项值 */
    itemValue: string
  }>
}

/** 巡检结果提交参数 */
export interface InspectionSubmitParams {
  /** 任务ID */
  taskId: string
  /** 任务详情ID */
  taskDetailId: string
  /** 巡检项ID */
  inspectionId: string
  /** 巡检项名称 */
  inspectionName: string
  /** 小区ID */
  communityId: string
  /** 巡检类型 */
  patrolType: string
  /** 巡检说明 */
  description: string
  /** 照片文件ID列表 */
  photos: string[]
  /** 用户ID */
  userId: string
  /** 用户姓名 */
  userName: string
  /** 纬度 */
  latitude: number
  /** 经度 */
  longitude: number
}

/** 任务流转参数 */
export interface InspectionTransferParams {
  /** 流转说明 */
  transferDesc: string
  /** 接收人ID */
  staffId: string
  /** 接收人姓名 */
  staffName: string
  /** 小区ID */
  communityId: string
  /** 巡检计划ID */
  inspectionPlanId: string
  /** 巡检计划名称 */
  inspectionPlanName: string
  /** 原始计划用户ID */
  originalPlanUserId?: string
  /** 原始计划用户姓名 */
  originalPlanUserName?: string
  /** 计划结束时间 */
  planEndTime?: string
  /** 计划巡检时间 */
  planInsTime?: string
  /** 计划用户ID */
  planUserId?: string
  /** 计划用户姓名 */
  planUserName?: string
  /** 签到类型 */
  signType?: string
  /** 签到类型名称 */
  signTypeName?: string
  /** 状态 */
  state?: string
  /** 状态名称 */
  stateName?: string
  /** 状态编码 */
  statusCd?: string
  /** 任务ID */
  taskId: string
  /** 任务类型 */
  taskType: number
}

/** 今日巡检统计 */
export interface InspectionTodayReport {
  /** 员工ID */
  staffId: string
  /** 员工姓名 */
  staffName: string
  /** 已完成数量 */
  finishCount: number
  /** 未完成数量 */
  waitCount: number
}
