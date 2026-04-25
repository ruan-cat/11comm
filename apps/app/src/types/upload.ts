/**
 * 文件上传模块类型定义
 */

/** 文件上传响应 */
export interface UploadResponse {
  fileId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadTime: string
}
