import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 紧急联系人类型
 */
export interface EmergencyContact {
	/** 地址 */
	address: string;
	/** 联系电话 */
	link: string;
	/** 联系人姓名 */
	name: string;
	/** 与业委会成员关系 */
	relName: string;
}

/**
 * 添加业委会参数类型
 */
export interface AddCommitteeParams {
	/** 地址 */
	address: string;
	/** 届期 */
	appointTime: string;
	/** 所属社区 */
	communityId?: string;
	/** 紧急联系人列表 */
	contacts?: EmergencyContact[];
	/** 任期 */
	curTime: string;
	/** 身份证号 */
	idCard: string;
	/** 联系方式 */
	link: string;
	/** 姓名 */
	name: string;
	/** 职位 */
	position: string;
	/** 岗位 */
	post: string;
	/** 岗位描述 */
	postDesc?: string;
	/** 备注 */
	remark?: string;
	/** 性别 B-男 G女*/
	sex: string;
	/** 状态 2000-在职 1000离职*/
	state: string;
}

/**
 * 修改业委会参数类型
 */
export interface ModifyCommitteeParams extends AddCommitteeParams {
	/** 业委会编号 */
	ocId: string;
}

/**
 * 删除业委会参数类型
 */
export interface RemoveCommitteeParams {
	/** 业委会编号 */
	ocId: string;
}

// ==================== 接口函数 ====================

/**
 * 删除业委会接口
 * @description 通过业委会编号删除指定业委会
 */
export function removeCommittee<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, RemoveCommitteeParams>({
		url: "/j8-housemgt/committee/remove-committee",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				ocId: "",
			},
		},
		options,
	});
}

/**
 * 添加业委会接口
 * @description 添加新的业委会成员
 */
export function addCommittee<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddCommitteeParams>({
		url: "/j8-housemgt/committee/add-committee",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				address: "",
				appointTime: "",
				curTime: "",
				idCard: "",
				link: "",
				name: "",
				position: "",
				post: "",
				sex: "",
				state: "",
			},
		},
		options,
	});
}

/**
 * 修改业委会接口
 * @description 修改业委会成员信息
 */
export function modifyCommittee<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyCommitteeParams>({
		url: "/j8-housemgt/committee/modify-committee",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				address: "",
				appointTime: "",
				curTime: "",
				idCard: "",
				link: "",
				name: "",
				ocId: "",
				position: "",
				post: "",
				sex: "",
				state: "",
			},
		},
		options,
	});
}
