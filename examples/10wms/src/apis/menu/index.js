import Request from "../request";
/**
 * =======================================================================================================================
 */

/**
 * 获取菜单列表
 */
export function getMenuListAPI() {
	return Request.requestJson(Request.GET, "/sysmanager/menu/get-menu-list");
}

/**
 * 获取菜单详细信息
 */
export function getMenuDetailAPI(menuId) {
	return Request.requestJson(Request.GET, `/menu/menu/${menuId}`);
}

/**
 * 获取菜单列表(查询)
 */
export function getMenuTreeAPI(menuId) {
	return Request.requestForm(Request.GET, `/sysmanager/menu/get-menu-list/${menuId}`);
}

/**
 * 获取菜单名称树
 */
export function getMenuNameTreeAPI() {
	return Request.requestForm(Request.GET, `/sysmanager/menu/query-menu-tree`);
}

/**
 * 根据id回显图标编辑数据接口
 */
export function getIconListAPI(id) {
	return Request.requestJson(Request.GET, `/j3sysmanager/sysmanager/icons/${id}`);
}

/**
 * 删除资源
 */
export function deleteResourceAPI(id) {
	return Request.requestJson(Request.DELETE, `/sysmanager/menu/remove/${id}`);
}

/**
 * 录入菜单
 */
export function addMenuAPI(obj) {
	return Request.requestJson(Request.POST, `/sysmanager/menu/addmenu`, obj);
}

/**
 * 修改资源
 */
export function updateMenuAPI(obj) {
	return Request.requestJson(Request.PUT, `/sysmanager/menu/modify`, obj);
}

/**
 * 获取资源名称树
 */
export function getResourceNameTreeAPI() {
	return Request.requestForm(Request.GET, `/sysmanager/role/getAllFunctionTree`);
}

/**
 * 获取角色分配资源
 */
export function getRoleResourceAPI(roleCode) {
	return Request.requestForm(Request.GET, `/sysmanager/role/getFunctionTree/${roleCode}`);
}

/**
 * 设置角色分配资源
 */
export function setRoleResourceAPI(obj) {
	return Request.requestJson(Request.POST, `/sysmanager/role/setFunction`, obj);
}
