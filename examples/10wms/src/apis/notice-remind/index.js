// 以下是j2组通知提醒目录下的请求方法
import Request from "../request";

// TODO userid还没从store获取
/**
 * 分页获取公告列表(ok)
 */
export function getNoticeListAPI(obj) {
	return Request.requestForm(Request.GET, "/notice/list-notice-2-page", obj);
}

/**
 * 获取未读公告标题列表(里面没有公告写不了有公告的逻辑)
 */
export function getUnreadNoticeListAPI() {
	return Request.requestForm(Request.GET, `/notice/query-Unread-notices`);
}

/**
 * 获取公告详情(ok)
 * @param noticeId 通知id
 */
export function getNoticeDetailAPI(noticeId) {
	return Request.requestForm(Request.GET, `/notice/query-notice-2-by-id/${noticeId}`);
}

/**
 * 获取消息列表(分页)(空)
 */
export function getMessageListAPI(obj) {
	return Request.requestJson(Request.POST, "/notice/list-notice-page", obj);
}

/**
 * 获取消息标题列表(空)
 */
export function getMessageTitleListAPI(obj) {
	return Request.requestForm(Request.POST, "/notice/list-notice-title", obj);
}

/**
 * 获取消息详情(没有消息的noticeid无法进行获取详情)
 */
export function getMessageDetailAPI(noticeId) {
	return Request.requestForm(Request.GET, `/notice/query-notice-details-by-id/${noticeId}`);
}

/**
 * 修改公告状态(ok)
 */
export function updateNoticeStatusAPI(obj) {
	return Request.requestForm(Request.PUT, "/notice/update-notice-status", obj);
}
