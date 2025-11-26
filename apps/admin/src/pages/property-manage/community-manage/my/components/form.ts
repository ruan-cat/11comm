import type { OptionsType } from "plus-pro-components";
import type { Mode } from "@/composables/use-mode";

// ==================== 联合类型定义 ====================

/** 省份联合类型 */
export type ProvinceType =
	| ""
	| "福建省"
	| "广东省"
	| "浙江省"
	| "江苏省"
	| "北京市"
	| "上海市"
	| "四川省"
	| "湖北省"
	| "山东省"
	| "湖南省"
	| "河北省"
	| "河南省"
	| "江西省"
	| "安徽省";

/** 小区状态联合类型 */
export type CommunityStatusType = "" | "正常运营" | "筹备中" | "维护中" | "已停用";

// ==================== 常量定义 ====================

/** 省份选项数组 */
export const provinces = [
	"福建省",
	"广东省",
	"浙江省",
	"江苏省",
	"北京市",
	"上海市",
	"四川省",
	"湖北省",
	"山东省",
	"湖南省",
	"河北省",
	"河南省",
	"江西省",
	"安徽省",
] as const;

/** 小区状态选项数组 */
export const communityStatuses = ["正常运营", "筹备中", "维护中", "已停用"] as const;

/** 省份选项列表 */
export const provinceOptions: OptionsType = provinces.map((province) => ({
	label: province,
	value: province,
}));

/** 小区状态选项列表 */
export const communityStatusOptions: OptionsType = communityStatuses.map((status) => ({
	label: status,
	value: status,
}));

/** 城市选项列表 */
export const cityOptions: OptionsType = [
	{ label: "请选择城市", value: "" },
	{ label: "福州市", value: "福州市" },
	{ label: "厦门市", value: "厦门市" },
	{ label: "泉州市", value: "泉州市" },
	{ label: "广州市", value: "广州市" },
	{ label: "深圳市", value: "深圳市" },
	{ label: "杭州市", value: "杭州市" },
	{ label: "宁波市", value: "宁波市" },
	{ label: "南京市", value: "南京市" },
	{ label: "苏州市", value: "苏州市" },
	{ label: "北京市", value: "北京市" },
	{ label: "上海市", value: "上海市" },
	{ label: "成都市", value: "成都市" },
	{ label: "武汉市", value: "武汉市" },
	{ label: "济南市", value: "济南市" },
	{ label: "青岛市", value: "青岛市" },
];

/** 小区信息表单数据接口 */
export interface CommunityManageMyFormVO {
	/** 省份 */
	province: ProvinceType;
	/** 城市 */
	city: string;
	/** 区县 */
	district: string;
	/** 小区名称 */
	name: string;
	/** 小区编码 */
	code: string;
	/** 客服电话 */
	servicePhone: string;
	/** 面积 */
	area: string;
	/** 开始时间 */
	startTime: string;
	/** 结束时间 */
	endTime: string;
	/** 状态 */
	status: CommunityStatusType;
}

/** 默认表单数据 @description 对外导出用于其他场景使用 */
export const defaultForm: CommunityManageMyFormVO = {
	province: "福建省",
	city: "",
	district: "",
	name: "",
	code: "",
	servicePhone: "",
	area: "",
	startTime: "",
	endTime: "",
	status: "正常运营",
};

/**
 * 我的小区管理表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CommunityManageMyFormProps {
	/** 表单数据 */
	form: CommunityManageMyFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: CommunityManageMyFormVO;
	/** 弹框模式 */
	mode: Mode;
}
