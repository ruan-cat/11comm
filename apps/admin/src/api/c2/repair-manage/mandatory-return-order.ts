import { useRequest } from "@/composables/use-request";

/**
 * 强制回单信息
 */
export interface ForceBackDTO {
	/** 工单编码 */
	repair_id: string;
	/** 报修位置 */
	repair_obj_name: string;
	/** 报修类型 */
	repair_type: string;
	/** 报修类型中文映射 */
	repair_type_detail: string;
	/** 报修人 */
	repair_name: string;
	/** 报修人电话 */
	tel: string;
	/** 预约时间 */
	appointment_time: string;
	/** 提交时间 */
	create_time: string;
	/** 状态 */
	state: string;
	/** 报修状态中文映射 */
	state_detail: string;
}

/**
 * 获取强制回单列表
 * @description
 * 获取强制回单分页列表
 */
export function queryForceBackList<T = PageDTO<ForceBackDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-repairsetting/force-back/force-back/query-all",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "",
				repair_type: "",
				repair_name: "",
				tel: "",
			},
		},
	});
}

/**
 * 维修材料信息
 */
export interface RepairMaterialDTO {
	/** 商品ID */
	res_id: string;
	/** 商品名称 */
	material_name: string;
	/** 商品数量 */
	material_count: number;
	/** 商品单位 */
	material_unit?: string;
	/** 商品规格 */
	material_specification?: string;
	/** 商品单价 */
	material_price?: number;
}

/**
 * 强制回单操作参数
 */
export interface ForceBackModifyDTO {
	/** 工单编码 */
	repair_id: string;
	/** 维修类型 */
	maintenance_type: string;
	/** 商品列表 */
	materials?: RepairMaterialDTO[];
	/** 总价 */
	repair_fee?: string;
	/** 支付方式 */
	pay_type?: string;
	/** 处理意见 */
	context: string;
}

/**
 * 强制回单操作
 * @description
 * 提交强制回单操作
 */
export function modifyForceBack<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ForceBackModifyDTO>({
		url: "/comm-c2-repairsetting/force-back/force-back/modify",
		options,
		httpParamWay: "body",
		config: {
			method: "put",
			data: {
				repair_id: "",
				maintenance_type: "",
				materials: [],
				repair_fee: "",
				pay_type: "",
				context: "",
			},
		},
	});
}
