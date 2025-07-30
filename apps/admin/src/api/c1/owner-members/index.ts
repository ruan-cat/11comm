import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 业主成员基础信息
 */
export interface MemberAddData {
	/** 业主姓名 */
	name: string;
	/** 手机号 */
	link: string;
	/** 身份证 */
	idCard?: string;
	/** 性别 */
	sex: string;
	/** 成员类型 */
	ownerTypeCd: string;
	/** 家庭住址 */
	address?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 业主成员完整信息（包含ID）
 */
export interface MemberData extends MemberAddData {
	/** 业主成员id */
	memberId: string;
}

/**
 * 查询业主成员参数
 */
export interface QueryMemberParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 业主姓名 */
	name?: string;
	/** 手机号 */
	link?: string;
	/** 身份证 */
	idCard?: string;
	/** 成员类型 */
	ownerTypeCd?: string;
	/** 性别 */
	sex?: string;
	/** 家庭住址 */
	address?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 删除业主成员参数（支持批量）
 */
export interface DeleteMemberParams {
	/** 业主成员ID数组 */
	memberIds: string[];
}

// ==================== 接口函数 ====================

/**
 * 分页查询业主成员
 * @description 根据条件分页查询业主成员列表
 */
export function queryMember<T = PageDTO<MemberAddData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryMemberParams>({
		url: "/member",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				name: "",
				link: "",
				idCard: "",
				ownerTypeCd: "",
				sex: "",
				address: "",
				remark: "",
			},
		},
		options,
	});
}

/**
 * 根据member_id修改业主成员信息
 * @description 修改指定业主成员的信息
 */
export function modifyMember<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, MemberData>({
		url: "/member",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				name: "",
				link: "",
				idCard: "",
				sex: "",
				ownerTypeCd: "",
				address: "",
				remark: "",
				memberId: "",
			},
		},
		options,
	});
}

/**
 * 新增一条业主成员
 * @description 新增业主成员信息
 */
export function addMember<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, MemberAddData>({
		url: "/member",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				name: "",
				link: "",
				idCard: "",
				sex: "",
				ownerTypeCd: "",
				address: "",
				remark: "",
			},
		},
		options,
	});
}

/**
 * 根据member_id删除数据，且支持批量
 * @description 批量删除业主成员
 */
export function removeMember<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/member",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: [],
		},
		options,
	});
}
