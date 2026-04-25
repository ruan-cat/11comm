/**
 * 日期工具函数
 */

/**
 * 日期工具类
 * @description
 * TODO: 未来需要迁移到 dayjs 库
 */
export const dateUtil = {
  /**
   * 比较两个日期的大小
   * @param endDate 结束日期
   * @param startDate 开始日期
   * @returns true if endDate > startDate, false otherwise
   */
  compareDate(endDate: string, startDate: string): boolean {
    const end = new Date(endDate.replace(/-/g, '/'))
    const start = new Date(startDate.replace(/-/g, '/'))
    return end.getTime() >= start.getTime()
  },

  /**
   * 日期格式化
   * @param date 日期对象或时间戳
   * @param format 格式字符串，默认 'YYYY-MM-DD'
   * @returns 格式化后的日期字符串
   */
  formatDate(date: Date | number | string, format: string = 'YYYY-MM-DD'): string {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hour = String(d.getHours()).padStart(2, '0')
    const minute = String(d.getMinutes()).padStart(2, '0')
    const second = String(d.getSeconds()).padStart(2, '0')

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second)
  },

  /**
   * 增加天数
   * @param date 日期对象
   * @param days 增加的天数
   * @returns 新的日期对象
   */
  addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  },

  /**
   * 获取当前日期字符串
   * @param format 格式字符串
   * @returns 当前日期字符串
   */
  today(format: string = 'YYYY-MM-DD'): string {
    return this.formatDate(new Date(), format)
  },

  /**
   * 获取昨天日期字符串
   * @param format 格式字符串
   * @returns 昨天日期字符串
   */
  yesterday(format: string = 'YYYY-MM-DD'): string {
    return this.formatDate(this.addDays(new Date(), -1), format)
  },

  /**
   * 获取明天日期字符串
   * @param format 格式字符串
   * @returns 明天日期字符串
   */
  tomorrow(format: string = 'YYYY-MM-DD'): string {
    return this.formatDate(this.addDays(new Date(), 1), format)
  },
}
