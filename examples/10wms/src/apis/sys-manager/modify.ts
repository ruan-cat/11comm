import type {
	ParamsBodyKey,
	ParamsPathKey,
	ParamsQueryKey,
	UseAxiosOptionsJsonVO,
} from "composables/use-request/index";
import type { RequiredPick } from "type-plus";
import { useRequest } from "composables/use-request/index";

/**
 * 用户详情对象
 * @description
 * 编辑用户详情
 * @see https://zero-one-star-10wms.apifox.cn
 */
export interface UserDetail {
	/**
	 * 用户ID
	 */
	id?: string;
	/**
	 * 用户名
	 */
	username?: string;
	/**
	 * 真实姓名
	 */
	realName?: string;
	/**
	 * 手机号
	 */
	phone?: string;
	/**
	 * 邮箱
	 */
	email?: string;
	/**
	 * 状态（0-禁用，1-启用）
	 */
	status?: number;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 部门ID
	 */
	deptId?: string;
	/**
	 * 角色ID列表
	 */
	roleIds?: string[];
}

/**
 * 编辑用户详情接口
 * @description
 * id必填，其他字段选填
 * @see https://zero-one-star-10wms.apifox.cn
 */
export function sysManagerModifyUserDetail<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RequiredPick<UserDetail, "id">>({
		url: "/sys-manager/modify/userdetail",
		options,
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				id: "",
			},
		},
	});
}

/**
 * 锁定用户状态对象
 * @description
 * 锁定/解锁用户状态
 *
 * TODO: 错的
 * @see https://zero-one-star-10wms.apifox.cn
 */
export interface LockUserStatus {
	/**
	 * 用户ID
	 */
	id: string;
	/**
	 * 是否锁定（true-锁定，false-解锁）
	 */
	locked: boolean;
}

/**
 * 锁定用户状态接口
 * @description
 * id和locked必填
 * @see https://zero-one-star-10wms.apifox.cn
 */
export function sysManagerLockUserStatus<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, LockUserStatus>({
		url: "/sys-manager/modify/modifyuserstatus-to-ban",
		options,
		httpParamWay: "query",
		config: {
			method: "PUT",
			data: {
				id: "",
				locked: false,
			},
		},
	});
}

/**
 * 激活用户状态接口
 * @description
 * userId必填
 * @see https://zero-one-star-10wms.apifox.cn
 */
export function sysManagerActiveUserStatus<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, { userId: string }>({
		url: "/sys-manager/modify/modifyuserstatus-to-active",
		options,
		httpParamWay: "query",
		config: {
			method: "PUT",
			data: {
				userId: "",
			},
		},
	});
}

/**
 * 查询重复账号接口
 * @description
 * username必填
 * @see https://zero-one-star-10wms.apifox.cn
 */
export function sysManagerCheckUsername<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, { username: string }>({
		url: "/sys-manager/get/username/{username}",
		options,
		httpParamWay: "path",
		config: {
			method: "GET",
			url: "/sys-manager/get/username/{username}",
		},
	});
}
