import type { PaginationResponse, PriorityType } from '../../../src/types/api.ts'
import dayjs from 'dayjs'

/** 统一的日期时间格式。 */
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/**
 * 统一的日期时间格式化。
 * @example formatDateTime()
 */
export function formatDateTime(value: dayjs.ConfigType = dayjs()): string {
  return dayjs(value).format(DATE_TIME_FORMAT)
}

/** 模拟请求延迟。 */
export function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** 生成随机延迟。 */
export function randomDelay(min: number = 200, max: number = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return delay(ms)
}

/**
 * 创建分页响应结构。
 * @example createPaginationResponse([1, 2, 3], 1, 2)
 */
export function createPaginationResponse<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10,
): PaginationResponse<T> {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = data.slice(start, end)

  return {
    list,
    total: data.length,
    page,
    pageSize,
    hasMore: end < data.length,
  }
}

/** 生成随机 ID。 */
export function generateId(prefix: string = 'ID'): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}_${random}`.toUpperCase()
}

/** 生成业务编号。 */
export function generateBusinessId(prefix: string = 'BIZ'): string {
  const dateStr = dayjs().format('YYYYMMDD')
  const timeStr = dayjs().format('HHmmss')
  const random = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, '0')

  return `${prefix}${dateStr}${timeStr}${random}`
}

/** 生成随机中文姓名。 */
export function generateChineseName(): string {
  const surnames = [
    '王',
    '李',
    '张',
    '刘',
    '陈',
    '杨',
    '赵',
    '黄',
    '周',
    '吴',
    '徐',
    '孙',
    '胡',
    '朱',
    '高',
    '林',
    '何',
    '郭',
    '马',
    '罗',
  ]
  const names = [
    '伟',
    '芳',
    '娜',
    '秀英',
    '敏',
    '静',
    '丽',
    '强',
    '磊',
    '军',
    '洋',
    '勇',
    '艳',
    '杰',
    '娟',
    '涛',
    '明',
    '超',
    '秀兰',
    '霞',
  ]
  const surname = surnames[Math.floor(Math.random() * surnames.length)]
  const name = names[Math.floor(Math.random() * names.length)]
  return surname + name
}

/** 生成随机手机号。 */
export function generatePhoneNumber(): string {
  const prefixes = [
    '130',
    '131',
    '132',
    '133',
    '134',
    '135',
    '136',
    '137',
    '138',
    '139',
    '150',
    '151',
    '152',
    '153',
    '155',
    '156',
    '157',
    '158',
    '159',
    '180',
    '181',
    '182',
    '183',
    '184',
    '185',
    '186',
    '187',
    '188',
    '189',
  ]
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, '0')
  return prefix + suffix
}

/** 生成随机地址。 */
export function generateAddress(): string {
  const buildings = Array.from({ length: 20 }, (_, index) => (index + 1).toString())
  const units = ['A', 'B', 'C', 'D', 'E', 'F']
  const floors = Array.from({ length: 30 }, (_, index) => (index + 1).toString().padStart(2, '0'))

  const building = buildings[Math.floor(Math.random() * buildings.length)]
  const unit = units[Math.floor(Math.random() * units.length)]
  const floor = floors[Math.floor(Math.random() * floors.length)]

  return `${building}栋${floor}${unit}室`
}

/** 生成随机时间范围。 */
export function generateTimeRange(startDaysFromNow: number = -30, endDaysFromNow: number = 30): string {
  const now = Date.now()
  const startTime = now + startDaysFromNow * 24 * 60 * 60 * 1000
  const endTime = now + endDaysFromNow * 24 * 60 * 60 * 1000
  const randomTime = startTime + Math.random() * (endTime - startTime)
  return formatDateTime(randomTime)
}

/** 生成随机金额。 */
export function generateAmount(min: number = 10, max: number = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** 生成随机状态。 */
export function generateStatus<T extends string>(statuses: T[]): T {
  return statuses[Math.floor(Math.random() * statuses.length)]
}

/** 生成随机优先级。 */
export function generatePriority(): PriorityType {
  return generateStatus(['HIGH', 'MEDIUM', 'LOW'])
}

/** 清理 HTML 标签。 */
export function stripHtmlTags(html: string, maxLength: number = 120): string {
  if (!html) {
    return ''
  }

  let text = html.replace(/<[^>]*>/g, '')
  text = text.replace(/\s+/g, ' ').trim()

  if (text.length > maxLength) {
    text = `${text.substring(0, maxLength).trim()}...`
  }

  return text
}

/** 生成更真实的活动标题。 */
export function generateRealisticTitle(category: string, index: number): string {
  const titleTemplates = {
    health: ['春季健身操培训班', '社区太极拳晨练', '健康体检义诊活动', '亲子瑜伽体验课', '老年人健康讲座'],
    family: ['亲子手工制作坊', '家庭趣味运动会', '少儿绘画比赛', '母亲节感恩活动', '家庭才艺展示'],
    culture: ['诗歌朗诵分享会', '书法展览开幕式', '传统文化知识竞赛', '社区合唱团招募', '文艺汇演筹备会'],
    environment: ['垃圾分类知识讲座', '绿色出行倡导活动', '社区植树护绿', '环保手工艺制作', '节能减排宣传'],
    safety: ['消防安全演练', '防诈骗知识宣传', '急救技能培训', '居家安全检查', '交通安全教育'],
    social: ['邻里见面交流会', '新业主欢迎会', '中秋佳节联谊', '社区议事协商', '志愿者表彰大会'],
    festival: ['春节联欢晚会', '端午节包粽子', '中秋赏月活动', '国庆文艺演出', '元宵节猜灯谜'],
    volunteer: ['爱心助老服务', '社区清洁志愿', '图书整理活动', '关爱儿童公益', '扶贫帮困行动'],
  } satisfies Record<string, string[]>
  const templates = titleTemplates[category] || ['社区活动']
  const baseTitle = templates[Math.floor(Math.random() * templates.length)]
  const suffixes = [`（第${index}期）`, '', '- 报名中', '（限额招募）', '']
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]

  return `${baseTitle}${suffix}`
}
