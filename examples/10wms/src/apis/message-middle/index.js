// 以下是j2组消息中间件目录下的请求方法
import Request from "../request";
/**
 * =======================================================================================================================
 */

// TODO 消息模块业务

/**
 * 获取消息模板名称列表
 */

export function getMessageTemplateNameListAPI() {
	return Request.requestForm(Request.GET, "/msgmw/get-messageTemplateName-list");
}

/**
 * 获取消息模板详细信息(条件+分页)
 */
export function getMessageTemplateListAPI(obj) {
	return Request.requestJson(Request.GET, "/msgmw/page-messageTemplate-list", obj);
}

/**
 * 录入消息模板
 */
export function addMessageTemplateAPI(obj) {
	return Request.requestJson(Request.POST, "/msgmw/add-messageTemplate", obj);
}

/**
 * 修改消息模板
 */
export function updateMessageTemplateAPI(obj) {
	return Request.requestJson(Request.PUT, "/msgmw/update-messageTemplate", obj);
}

/**
 * 删除消息模板，通过勾选对应的消息模版删除(可多项勾选)
 */
export function deleteMessageTemplateAPI(obj) {
	return Request.requestJson(Request.DELETE, "/msgmw/delete-messageTemplate", obj);
}

/**
 * =======================================================================================================================
 */

// TODO 消息中心业务
/**
 * 获取消息列表（带条件分页）
 */
export function getMessageCenterAPI(obj) {
	return Request.requestJson(Request.GET, "/msgmw/messages", obj);
}

/**
 * 修改消息
 */
export function updateMessageCenterAPI(obj, id) {
	return Request.requestJson(Request.PUT, `/msgmw/messages/${id}`, obj);
}

/**
 * =======================================================================================================================
 */

// TODO 业务配置业务

/**
 * 获取业务配置列表（条件+分页）
 */
export function getWorkSettingAPI({ page, size, obj }) {
	return Request.requestJson(Request.POST, `/msgmw/query?page=${page}&size=${size}`, obj);
}

/**
 * 录入业务配置
 */
export function addWorkSettingAPI(obj) {
	return Request.requestJson(Request.POST, "/msgmw/add", obj);
}

/**
 * 修改业务配置
 */
export function updateWorkSettingAPI(obj) {
	return Request.requestJson(Request.PUT, "/msgmw/update", obj);
}

/**
 * 删除业务配置（支持批量）
 */
export function deleteWorkSettingAPI(ids) {
	return Request.requestForm(Request.DELETE, `/msgmw/delete?ids=${ids}`);
}

/**
 * =======================================================================================================================
 */

// TODO 业务SQL业务

/**
 * 获取SQL列表(条件+分页)
 */
export function getSqlListAPI(obj) {
	return Request.requestForm(Request.GET, "/msgmw/query-sql-list", obj);
}

/**
 * 录入SQL
 */
export function addSqlAPI(obj) {
	return Request.requestJson(Request.POST, "/msgmw/add-sql", obj);
}

/**
 * 修改SQL
 */
export async function updateSqlAPI(obj) {
	return Request.requestJson(Request.PUT, "/msgmw/modify-sql", obj);
}

/**
 * 删除SQL
 * sqlId 单个删除
 * sqlIdList 批量删除
 */
export function deleteSqlAPI(obj) {
	return Request.requestJson(Request.DELETE, "/msgmw/remove-sql", obj);
}
