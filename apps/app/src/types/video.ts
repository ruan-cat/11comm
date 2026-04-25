/**
 * 视频监控模块类型定义
 */

/** 监控区域 */
export interface MonitorArea {
  maId: string
  maName: string
}

/** 监控设备 */
export interface MonitorMachine {
  machineId: string
  communityId: string
  machineName: string
  maId: string
  maName: string
  photoUrl?: string
}

/** 视频播放地址 */
export interface VideoPlayUrl {
  url: string
}
