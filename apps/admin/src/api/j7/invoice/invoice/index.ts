import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 申请发票参数
 */
export interface AddInvoiceParams {
	/** 申请人电话 */
	applyTel?: string;
	/** 社区id */
	communityId?: string;
	/** 用户id */
	createUserId?: string;
	/** 申请人 */
	createUserName?: string;
	/** 申请金额 */
	invoiceAmount?: number;
	/** 发票类型1001 个人 2002 企业 */
	invoiceType: string;
	/** 开票内容1001 账户预存 2002 物业缴费 */
	itemName: string;
	/** 收据ID或缴费id(账户预存为收据id，物业缴费为缴费id) */
	itemObjId?: string;
	/** 业主发票id(发票抬头id） */
	oiId?: string;
	/** 业主 */
	ownerName: string;
	/** 缴费时间 */
	payTime?: string;
	/** 备注 */
	remark?: string;
	/** 审核状态，W待审核 U 待上传 F 审核失败 G 带领用 C 已领用 */
	state?: string;
}

/**
 * 删除发票参数
 */
export interface DeleteInvoiceParams {
	/** 发票ID */
	invoiceId?: string;
}

/**
 * 获取发票列表参数
 */
export interface QueryInvoiceParams {
	/** 申请人电话 */
	applyTel?: string;
	/** 申请人 */
	createUserName?: string;
	/** 发票编号 */
	invoiceCode?: string;
	/** 发票类型 1001个人 2002 企业 */
	invoiceType?: string;
	/** 业主名称 */
	ownerName?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 发票查询数据模型
 */
export interface InvoiceQueryDataModel {
	/** 编号 */
	applyId?: string;
	/** 申请人电话 */
	applyTel?: string;
	/** 社区id */
	communityId?: string;
	/** 申请时间 */
	createTime?: string;
	/** 用户id */
	createUserId?: string;
	/** 申请人 */
	createUserName?: string;
	/** 地址，电话 */
	invoiceAddress?: string;
	/** 申请金额 */
	invoiceAmount?: number;
	/** 发票号 */
	invoiceCode?: string;
	/** 发票名头 */
	invoiceName?: string;
	/** 纳税人识别号 */
	invoiceNum?: string;
	/** 发票类型1001 个人 2002 企业 */
	invoiceType?: string;
	/** 开票内容1001 账户预存 2002 物业缴费 */
	itemName?: string;
	/** 收据ID或缴费id(账户预存为收据id，物业缴费为缴费id) */
	itemObjId?: string;
	/** 业主发票id(发票抬头id） */
	oiId?: string;
	/** 业主 */
	ownerName?: string;
	/** 缴费时间 */
	payTime?: string;
	/** 备注 */
	remark?: string;
	/** 审核状态，W待审核 U 待上传 F 审核失败 G 带领用 C 已领用 */
	state?: string;
}

/**
 * 获取发票详情参数
 */
export interface QueryInvoiceDetailParams {
	/** 申请ID */
	applyId: string;
	/** 小区ID */
	communityId: string;
}

/**
 * 发票开票明细参数
 */
export interface QueryInvoiceDetailsParams {
	/** 发票申请ID */
	applyId: string;
	/** 小区ID */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 发票开票明细数据模型
 */
export interface InvoiceDetailsDataModel {
	/** 发票申请ID */
	applyId?: string;
	/** 小区ID */
	communityId?: string;
	/** 发票金额 */
	itemAmount?: string;
	/** 项目ID */
	itemId?: string;
	/** 缴费名称 */
	itemName?: string;
	/** 缴费对象ID */
	itemObjId?: string;
	/** 缴费类型 1001账户预存 2002物业缴费 */
	itemType?: string;
	/** 缴费时间 */
	payTime?: string;
	/** 备注 */
	remark?: string;
	/** 发票状态 详细参考c_status表， 0在用 1失效 */
	statusCd?: string;
}

/**
 * 发票审核记录参数
 */
export interface QueryAuditRecordsParams {
	/** 发票申请ID */
	applyId: string;
	/** 小区ID */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 发票审核记录数据模型
 */
export interface InvoiceAuditRecordDataModel {
	/** 发票申请ID */
	applyId?: string;
	/** 小区ID */
	communityId?: string;
	/** 创建时间 */
	createTime?: any;
	/** 操作人ID */
	createUserId?: string;
	/** 操作人 */
	createUserName?: string;
	/** 事件ID */
	eventId?: string;
	/** 类型 1001 审核成功 2002 上传 3003 审核失败 4004 领用 5005 登记 */
	eventType?: string;
	/** 备注 */
	remark?: string;
	/** 数据状态 详细参考c_status表， 0在用 1失效 */
	statusCd?: string;
}

/**
 * 查看发票参数
 */
export interface QueryInvoiceDownloadLinkParams {
	/** 发票申请ID */
	applyId: string;
	/** 小区ID */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 登记发票参数
 */
export interface RegisterInvoiceParams {
	/** 发票申请ID */
	applyId?: string;
	/** 社区Id */
	communityId?: string;
	/** 事件类型 */
	eventType?: string;
	/** 操作说明 */
	remark?: string;
}

/**
 * 审核发票参数
 */
export interface AuditInvoiceParams {
	/** 编号 */
	applyId?: string;
	/** 申请人电话 */
	applyTel?: string;
	/** 社区id */
	communityId?: string;
	/** 用户id */
	createUserId?: string;
	/** 申请人 */
	createUserName?: string;
	/** 申请金额 */
	invoiceAmount?: number;
	/** 发票类型1001 个人 2002 企业 */
	invoiceType: string;
	/** 开票内容1001 账户预存 2002 物业缴费 */
	itemName: string;
	/** 收据ID或缴费id(账户预存为收据id，物业缴费为缴费id) */
	itemObjId?: string;
	/** 业主发票id(发票抬头id） */
	oiId?: string;
	/** 业主 */
	ownerName: string;
	/** 缴费时间 */
	payTime?: string;
	/** 备注 */
	remark?: string;
	/** 审核状态，W待审核 U 待上传 F 审核失败 G 带领用 C 已领用 */
	state?: string;
}

/**
 * 上传发票参数
 */
export interface UploadInvoiceParams {
	/** 发票申请ID */
	applyId: string;
	/** 社区ID */
	communityId: string;
	/** 上传文件 */
	uploadFiles: File[];
}

// ==================== 接口函数 ====================

/**
 * 申请发票
 */
export function addInvoice<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddInvoiceParams>({
		url: "/j7-property/property-manage/invoice/add-invoice",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				invoiceType: "",
				itemName: "",
				ownerName: "",
			},
		},
		options,
	});
}

/**
 * 删除发票
 */
export function deleteInvoice<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteInvoiceParams>({
		url: "/j7-property/property-manage/invoice/delete-invoice",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {},
		},
		options,
	});
}

/**
 * 获取发票列表（条件+分页）
 */
export function queryInvoice<T = PageDTO<InvoiceQueryDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInvoiceParams>({
		url: "/j7-property/property-manage/invoice/query-invoice",
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
 * 获取发票详情
 */
export function queryInvoiceDetail<T = InvoiceQueryDataModel>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInvoiceDetailParams>({
		url: "/j7-property/property-manage/invoice/query-invoice-detail",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				applyId: "",
				communityId: "",
			},
		},
		options,
	});
}

/**
 * 发票详情----开票明细
 */
export function queryInvoiceDetails<T = PageDTO<InvoiceDetailsDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInvoiceDetailsParams>({
		url: "/j7-property/property-manage/invoice/query-invoice-details",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				applyId: "",
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 发票详情----审核记录
 */
export function queryAuditRecords<T = PageDTO<InvoiceAuditRecordDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryAuditRecordsParams>({
		url: "/j7-property/property-manage/invoice/query-invoice-details-audit-records",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				applyId: "",
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 发票详情----查看发票
 */
export function queryInvoiceDownloadLink<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryInvoiceDownloadLinkParams>({
		url: "/j7-property/property-manage/invoice/query-invoice-details-download-link",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				applyId: "",
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 登记发票
 */
export function registerInvoice<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RegisterInvoiceParams>({
		url: "/j7-property/property-manage/invoice/register-invoice",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {},
		},
		options,
	});
}

/**
 * 审核发票
 */
export function auditInvoice<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AuditInvoiceParams>({
		url: "/j7-property/property-manage/invoice/update-invoice-status",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				invoiceType: "",
				itemName: "",
				ownerName: "",
			},
		},
		options,
	});
}

/**
 * 上传发票
 */
export function uploadInvoice<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UploadInvoiceParams>({
		url: "/j7-property/property-manage/invoice/upload-invoice",
		httpParamWay: "body",
		upType: UpType.file,
		config: {
			method: "POST",
			data: {
				applyId: "",
				communityId: "",
				uploadFiles: [] as File[],
			},
		},
		options,
	});
}
