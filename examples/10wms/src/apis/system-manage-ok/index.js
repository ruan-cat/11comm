// 以下是j2组系统管理目录下的请求方法
import Request from "../request";
/**
 * =======================================================================================================================
 */
// TODO 系统公告业务

/**
 * 获取公告列表（分页）
 */
export function getNoticeListAPI(obj) {
	return Request.requestForm(Request.GET, "/sysmgr/announcement/page-anno", obj);
}

/**
 * 录入公告接口
 */
export function addNoticeAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmgr/announcement/add", obj);
}

/**
 * 修改公告接口
 */
export function updateNoticeAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmgr/announcement/update", obj);
}

/**
 * 删除公告（支持批量删除）接口
 */
export function deleteNoticeAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmgr/announcement/deleteBatch", obj);
}

/**
 * 获取公告详细信息
 */
export function getNoticeDetailAPI(obj) {
	return Request.requestForm(Request.GET, "/sysmgr/announcement/detail-anno", obj);
}

/**
 * =======================================================================================================================
 */

// TODO 角色组织业务

/**
 * 获取组织名称树
 */
export function getDepartmentTreeAPI() {
	return Request.requestJson(Request.GET, "/sysmgr/department/tree");
}

/**
 * 获取组织列表
 */
export function getDepartmentListAPI(parentDepartId) {
	return Request.requestJson(Request.POST, "/sysmgr/get-organization-list", parentDepartId);
}

/**
 * 录入组织机构
 */
export function addDepartmentAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmgr/add-depart", obj);
}

/**
 * 修改组织机构数据
 */
export function updateDepartmentDataAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmgr/modify-depart", obj);
}
/**
 * 删除组织机构
 */
export function deleteDepartmentAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmgr/delete-depart", obj);
}

/**
 * 导入组织
 */
export function importDepartmentAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmgr/import-depart", obj, http.upType.file);
}

/**
 * 导出选择组织
 */
export function exportSelectedDepartmentAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmgr/export-selected-organization", obj);
}

/**
 * 删除组织成员
 */
export function deleteDepartmentMemberAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmgr/t-suser-org/deleteUser", obj);
}

/**
 * 获取组织成员(条件+分页)
 */
export function getDepartmentMemberAPI(obj) {
	return Request.requestJson(Request.GET, "/sysmgr/t-suser-org/listUser", obj);
}

/**
 * 添加组织成员
 */
export function addDepartmentMemberAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmgr/t-suser-org/addUser", obj);
}

// TODO 少了用户编辑和添加已有客户和删除用户

/**
 * 获取组织角色
 */
export function getDepartmentRoleAPI(obj) {
	return Request.requestJson(Request.GET, "/sysmgr/role-org/query-by-org", obj);
}

/**
 * 更新组织角色
 */
export function updateDepartmentAPI(obj) {
	return Request.requestJson(Request.POST, "/sysmgr/role-org/update-role-org", obj);
}
