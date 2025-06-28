/**
 * 紧急联系人
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
 * 业委会成员详情数据模型
 */
export interface CommitteeMemberDetail {
	/** 住址 */
	address: string;
	/** 届期 */
	appointTime: string;
	/** 紧急联系人列表 */
	contacts: EmergencyContact[];
	/** 任期 */
	curTime: string;
	/** 身份证号 */
	idCard: string;
	/** 电话 */
	link: string;
	/** 姓名 */
	name: string;
	/** 职位 */
	position: string;
	/** 岗位 */
	post: string;
	/** 岗位描述 */
	postDesc: string;
	/** 备注 */
	remark: string;
	/** 性别 */
	sex: string;
	/** 状态 */
	stateDesc: string;
}

/**
 * 业委会成员列表数据模型
 */
export interface CommitteeMemberListItem {
	/** 住址 */
	address: string;
	/** 届期 */
	appointTime: string;
	/** 任期 */
	curTime: string;
	/** 身份证 */
	idCard: string;
	/** 电话 */
	link: string;
	/** 姓名 */
	name: string;
	/** 编号 */
	ocId: string;
	/** 职位 */
	position: string;
	/** 岗位 */
	post: string;
	/** 性别 */
	sex: string;
	/** 状态 */
	state: string;
}

/**
 * 获取业委会列表参数
 */
export interface QueryCommitteeListParams {
	/** 联系电话 */
	link?: string;
	/** 业委会名称 */
	name?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/**
	 * 状态 业委会在职状态
	 * @description
	 * - 在职
	 * - 离职
	 */
	state?: string;
}

/**
 * 获取业委会详情
 * @description 根据 ocId 获取业委会成员详情
 */
export function queryCommitteeDetail<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, { ocId: string }>({
		url: "/j8-housemgt/committee/query-detail/{ocId}",
		options,
		httpParamWay: "path",
		config: {
			method: "GET",
			url: "/j8-housemgt/committee/query-detail/{ocId}",
		},
	});
}

/**
 * 获取业委会列表
 * @description 获取业委会列表(条件+分页)
 */
export function queryCommitteeList<T = PageDTO<CommitteeMemberListItem>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryCommitteeListParams>({
		url: "/j8-housemgt/committee/query-list",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				state: "1000",
			},
		},
	});
}
