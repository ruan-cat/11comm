/** 楼栋信息 */
export interface Floor {
  /** 楼栋ID */
  floorId: string
  /** 楼栋编号 */
  floorNum: string
  /** 楼栋名称 */
  floorName: string
  /** 所属社区ID */
  communityId: string
}

/** 单元信息 */
export interface Unit {
  /** 单元ID */
  unitId: string
  /** 单元编号 */
  unitNum: string
  /** 所属楼栋ID */
  floorId: string
  /** 所属社区ID */
  communityId: string
}

/** 房屋信息 */
export interface Room {
  /** 房屋ID */
  roomId: string
  /** 房间号 */
  roomNum: string
  /** 所属单元ID */
  unitId: string
  /** 所属楼栋ID */
  floorId: string
  /** 所属社区ID */
  communityId: string
}

/** 选择器通用查询参数 */
export interface SelectorQueryParams {
  /** 社区ID */
  communityId: string
  /** 页码 */
  page: number
  /** 每页条数 */
  row: number
}

/** 楼栋查询参数 */
export interface FloorQueryParams extends SelectorQueryParams {
  /** 楼栋编号（模糊搜索） */
  floorNum?: string
}

/** 单元查询参数 */
export interface UnitQueryParams extends SelectorQueryParams {
  /** 楼栋ID */
  floorId: string
  /** 单元编号（模糊搜索） */
  unitNum?: string
}

/** 房屋查询参数 */
export interface RoomQueryParams extends SelectorQueryParams {
  /** 楼栋ID */
  floorId: string
  /** 单元ID */
  unitId: string
  /** 房间号（模糊搜索） */
  roomNum?: string
}
