export const LOGIN_STRATEGY_MAP = {
  DEFAULT_NO_NEED_LOGIN: 0, // 黑名单策略，默认可以进入APP
  DEFAULT_NEED_LOGIN: 1, // 白名单策略，默认不可以进入APP，需要强制登录
}
/** 登录策略，根据项目原则：不考虑严格的登录逻辑，固定使用无需登录策略 */
export const LOGIN_STRATEGY = LOGIN_STRATEGY_MAP.DEFAULT_NO_NEED_LOGIN
export const isNeedLoginMode = false // 根据项目原则，固定为 false

export const LOGIN_PAGE = '/pages/login/login'
export const REGISTER_PAGE = '/pages/login/register'

export const LOGIN_PAGE_LIST = [LOGIN_PAGE, REGISTER_PAGE]

/**
 * 排除在外的列表，白名单策略指白名单列表，黑名单策略指黑名单列表
 * 注意：根据项目原则，我们不考虑严格的登录逻辑，这个列表暂时保留为空
 */
export const EXCLUDE_PAGE_LIST: string[] = [
  // 根据项目原则：不做任何鉴权处理，任何页面都可以随意跳转
  // 以下配置保留供未来扩展使用：
  // '/pages/activity/index', // 社区活动列表需要登录
  // '/pages/activity/detail', // 活动详情需要登录
  // '/pages/me/me', // 个人中心需要登录
]

/**
 * 在微信小程序里面是否使用小程序默认的登录，默认为true
 * 如果为 false 则复用 h5 的登录逻辑
 */
export const IS_USE_WX_LOGIN_IN_MP = true // 暂时还没用到，没想好怎么整合
