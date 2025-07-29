import { http } from "@/utils/http";

// TODO: 这些接口未来需要被废弃掉 换成正常的接口

type Result = {
	success: boolean;
	data?: {
		/** 列表数据 */
		list: Array<any>;
	};
};

const baseUrl = "http://39.105.211.152:11111";

// 获取合同
export const getContractList = (
	data?: Partial<{
		audit: string | null;
		pageIndex: number;
		pageSize: number;
		typeName: string | null;
	}>,
) => {
	// 默认参数
	const query: Required<typeof data> = {
		audit: null,
		pageIndex: 1,
		pageSize: 10,
		typeName: null,
	};

	// 合并默认参数和传入参数（浅合并）
	const mergedParams = { ...query, ...data };

	// return http.request<Result>(
	//   "get",
	//   `http://39.105.211.152:11111/contract/type/query-contract-types`,
	//   {
	//     // 使用合并后的参数对象
	//     params: mergedParams,
	//   }
	// );
	return http.request<Result>("get", baseUrl + "/contract/type/query-contract-types", {
		params: mergedParams,
		headers: {
			"Content-Type": "application/json",
		},
	});
};

// 获取合同甲方
export const getJF = (data?: object) => {
	return http.request<Result>("get", baseUrl + "/contract/change/get-contract-chang", {
		headers: {
			"Content-Type": "application/json",
		},
	});
};

// 获取合同类型
export const getLX = (data?: object) => {
	return http.request<Result>("get", baseUrl + "/contract/change/get-contract", {
		headers: {
			"Content-Type": "application/json",
		},
	});
};

// 获取合同变更
export const getBG = (data?: object) => {
	return http.request<Result>("get", baseUrl + "/contract/change/get-contrac", {
		headers: {
			"Content-Type": "application/json",
		},
	});
};

// 获取起草合同
export const getQC = (data?: object) => {
	return http.request<Result>("get", baseUrl + "/contract/change/get-const", {
		headers: {
			"Content-Type": "application/json",
		},
	});
};
