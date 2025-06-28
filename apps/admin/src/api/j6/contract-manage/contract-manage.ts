/**
 * 获取合同类型扩展信息列表接口
 * @description 获取合同类型扩展信息列表（条件+分页）
 */
export function queryAllContractTypeInfo<T = any>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<
		ParamsQueryKey,
		T,
		{
			contractTypeId?: string;
			pageIndex?: number;
			pageSize?: number;
			specCd?: string;
			specName?: string;
			specShow?: string;
		}
	>({
		url: "/j6-contract/type/queryAll-contract-type-info",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				contractTypeId: "",
				pageIndex: 1,
				pageSize: 10,
				specCd: "",
				specName: "",
				specShow: "",
			},
			data: {}, // 添加空的 data 属性以满足类型要求
		},
	});
}

/**
 * 获取合同类型模板接口
 * @description 通过合同类型ID获取模板
 */
export function getContractTypeTemplate<T = any>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, { contractTypeId?: string }>({
		url: "/j6-contract/type/query-template",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				contractTypeId: "",
			},
			data: {}, // 添加空的 data 属性以满足类型要求
		},
	});
}

/**
 * 获取合同类型名称列表接口
 * @description 获取合同类型名称列表
 */
export function listContractTypeNames<T = any>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, {}>({
		url: "/j6-contract/type/list-contract-type-names",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {}, // 添加空的 data 属性以满足类型要求
		},
	});
}

/**
 * 获取合同类型列表接口
 * @description 获取合同类型列表（条件+分页）
 */
export function listContractTypes<T = any>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<
		ParamsQueryKey,
		T,
		{
			audit?: string;
			pageIndex?: number;
			pageSize?: number;
			typeName?: string;
		}
	>({
		url: "/j6-contract/type/query-contract-types",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				audit: "",
				pageIndex: 1,
				pageSize: 10,
				typeName: "",
			},
			data: {}, // 添加空的 data 属性以满足类型要求
		},
	});
}

/**
 * 获取到期合同列表接口
 * @description 获取到期合同列表（条件+分页）
 */
export function queryAllExpiredContracts<T = any>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<
		ParamsQueryKey,
		T,
		{
			contractCode?: string;
			contractNameLike?: string;
			contractType?: string;
			pageIndex?: number;
			pageSize?: number;
		}
	>({
		url: "/j6-contract/expire/query-expired-contract",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				contractCode: "",
				contractNameLike: "",
				contractType: "",
				pageIndex: 1,
				pageSize: 10,
			},
			data: {}, // 添加空的 data 属性以满足类型要求
		},
	});
}

/**
 * 打印合同接口
 * @description 打印指定合同
 */
export function createPrintTask<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<
		ParamsQueryKey,
		T,
		{
			contractId?: string;
			contractTypeId?: string;
		}
	>({
		url: "/j6-contract/draft/print",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				contractId: "",
				contractTypeId: "",
			},
			data: {}, // 添加空的 data 属性以满足类型要求
		},
	});
}

/**
 * 获取合同详情接口
 * @description 通过合同类型ID获取合同详情
 */
export function queryById<T = any>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, { contractTypeId: string }>({
		url: "/j6-contract/draft/query-by-id",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				contractTypeId: "",
			},
			data: { contractTypeId: "1" }, // 添加空的 data 属性以满足类型要求
		},
	});
}

/**
 * 获取合同列表接口
 * @description 获取合同列表（条件+分页）
 */
export function queryContractList<T = any>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<
		ParamsQueryKey,
		T,
		{
			contractCode?: string;
			contractNameLike?: string;
			contractType?: string;
			pageIndex?: number;
			pageSize?: number;
		}
	>({
		url: "/j6-contract/draft/query-contract",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				contractCode: "",
				contractNameLike: "",
				contractType: "",
				pageIndex: 1,
				pageSize: 10,
			},
			data: {}, // 添加空的 data 属性以满足类型要求
		},
	});
}

/**
 * 获取合同修改记录接口
 * @description 获取合同修改记录（条件+分页）
 */
export function listContractChangePlanById<T = any>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<
		ParamsQueryKey,
		T,
		{
			contractId?: string;
			staffNameLike?: string;
			pageIndex?: number;
			pageSize?: number;
		}
	>({
		url: "/j6-contract/draft/query-contract-change-plan-by-id",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				contractId: "",
				staffNameLike: "",
				pageIndex: 1,
				pageSize: 10,
			},
			data: {}, // 添加空的 data 属性以满足类型要求
		},
	});
}

/**
 * 选择合同列表接口
 * @description 选择合同列表（条件+分页）
 */
export function selectContractList<T = any>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<
		ParamsQueryKey,
		T,
		{
			contractNameLike?: string;
			pageIndex?: number;
			pageSize?: number;
		}
	>({
		url: "/j6-contract/draft/query-contract-select",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				contractNameLike: "",
				pageIndex: 1,
				pageSize: 10,
			},
			data: {}, // 添加空的 data 属性以满足类型要求
		},
	});
}

/**
 * 获取合同甲方列表接口
 * @description 获取合同甲方列表（条件+分页）
 */
export function queryAllPartyA<T = any>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<
		ParamsQueryKey,
		T,
		{
			pageIndex?: number;
			pageSize?: number;
			partyA: string;
			aContacts?: string;
			aLink: string;
		}
	>({
		url: "/j6-contract/partya/query-contract-partya",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				pageIndex: 1,
				pageSize: 10,
				partyA: "",
				aContacts: "",
				aLink: "",
			},
			data: {
				pageIndex: 1,
				pageSize: 10,
				partyA: "",
				aContacts: "string",
				aLink: "",
			},
		},
	});
}

/**
 * 查看变更明细接口
 * @description 获取合同变更明细列表
 */
export function listChangeDetails<T = any>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<
		ParamsQueryKey,
		T,
		{
			pageIndex?: number;
			pageSize?: number;
			planId?: string;
		}
	>({
		url: "/j6-contract/change/get-change-detail",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				pageIndex: 1,
				pageSize: 10,
				planId: "",
			},
			data: {}, // 添加空的 data 属性以满足类型要求
		},
	});
}

/**
 * 获取合同变更列表接口
 * @description 获取合同变更列表（条件+分页）
 */
export function listContractChanges<T = any>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<
		ParamsQueryKey,
		T,
		{
			contractType?: string;
			pageIndex?: number;
			pageSize?: number;
			contractName?: string;
			contractCode?: string;
		}
	>({
		url: "/j6-contract/change/get-contract-change",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				contractType: "",
				pageIndex: 1,
				pageSize: 10,
				contractName: "",
				contractCode: "",
			},
			data: {}, // 添加空的 data 属性以满足类型要求
		},
	});
}
