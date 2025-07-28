import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 添加发票抬头参数
 */
export interface AddInvoiceTitleParams {
	/** 地址、电话 */
	invoiceAddress: string;
	/** 发票名头 */
	invoiceName: string;
	/** 纳税人识别号 */
	invoiceNum: string;
	/** 发票类型 1001 个人 2002 企业 */
	invoiceType: string;
	/** 业主ID */
	ownerId: string;
	/** 业主名称 */
	ownerName: string;
	/** 备注 */
	remark?: string;
}

/**
 * 修改发票抬头参数
 */
export interface ModifyInvoiceTitleParams {
	/** 地址、电话 */
	invoiceAddress: string;
	/** 发票名头 */
	invoiceName: string;
	/** 纳税人识别号 */
	invoiceNum: string;
	/** 发票类型 1001 个人 2002 企业 */
	invoiceType: string;
	/** ID */
	oiId: string;
	/** 业主ID */
	ownerId: string;
	/** 业主名称 */
	ownerName: string;
	/** 备注 */
	remark?: string;
}

/**
 * 获取发票抬头列表参数
 */
export interface QueryInvoiceTitleParams {
	/** 发票名头 */
	invoiceName?: string;
	/** 发票类型 */
	invoiceType?: string;
	/** 业主名称 */
	ownerName?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 发票抬头数据模型
 */
export interface InvoiceTitleDataModel {
	/** 地址、电话 */
	invoiceAddress?: string;
	/** 发票名头 */
	invoiceName?: string;
	/** 纳税人识别号 */
	invoiceNum?: string;
	/** 发票类型 1001 个人 2002 企业 */
	invoiceType?: string;
	/** ID */
	oiId?: string;
	/** 业主ID */
	ownerId?: string;
	/** 业主名称 */
	ownerName?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 删除发票抬头参数
 */
export interface RemoveInvoiceTitleParams {
	/** 编号 */
	oiId: string;
}

// ==================== 接口函数 ====================

/**
 * 添加发票抬头数据
 */
export function addInvoiceTitle<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddInvoiceTitleParams>({
		url: "/j7-property/property-manage/invoice-title/add",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				invoiceAddress: "",
				invoiceName: "",
				invoiceNum: "",
				invoiceType: "",
				ownerId: "",
				ownerName: "",
			},
		},
		options,
	});
}

/**
 * 修改发票抬头数据
 */
export function modifyInvoiceTitle<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyInvoiceTitleParams>({
		url: "/j7-property/property-manage/invoice-title/modify",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				invoiceAddress: "",
				invoiceName: "",
				invoiceNum: "",
				invoiceType: "",
				oiId: "",
				ownerId: "",
				ownerName: "",
			},
		},
		options,
	});
}

/**
 * 获取发票抬头列表（条件+分页）
 */
export function queryInvoiceTitle<T = PageDTO<InvoiceTitleDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInvoiceTitleParams>({
		url: "/j7-property/property-manage/invoice-title/query",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 删除发票抬头
 */
export function removeInvoiceTitle<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, RemoveInvoiceTitleParams>({
		url: "/j7-property/property-manage/invoice-title/remove-invoice-title",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				oiId: "",
			},
		},
		options,
	});
}
