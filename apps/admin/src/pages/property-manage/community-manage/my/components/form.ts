import type { OptionsType } from "plus-pro-components";
import type { Mode } from "@/composables/use-mode";

// ==================== 联合类型定义 ====================

/** 省份联合类型 / Province union type */
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

/** 小区状态联合类型 / Community status union type */
export type CommunityStatusType = "" | "正常运营" | "筹备中" | "维护中" | "已停用";

// ==================== 表单类型定义 ====================

/**
 * 小区信息表单数据接口 / Community information form data interface
 */
export interface CommunityManageMyFormVO {
	/** 省份 / Province */
	province: ProvinceType;
	/** 城市 / City */
	city: string;
	/** 区县 / District */
	district: string;
	/** 小区名称 / Community name */
	name: string;
	/** 小区编码 / Community code */
	code: string;
	/** 客服电话 / Service phone */
	servicePhone: string;
	/** 面积 / Area */
	area: string;
	/** 开始时间 / Start time */
	startTime: string;
	/** 结束时间 / End time */
	endTime: string;
	/** 状态 / Status */
	status: CommunityStatusType;
}

/**
 * 我的小区管理表单 Props / My community management form props
 */
export interface CommunityManageMyFormProps {
	/** 表单数据 / Form data */
	form: CommunityManageMyFormVO;
	/** 表单组件重置时默认使用的对象 / Default values for form reset */
	defaultValues: CommunityManageMyFormVO;
	/** 弹框模式 / Dialog mode */
	mode: Mode;
}

// ==================== 常量定义 ====================

/** 省份选项数组 / Province options array */
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

/** 小区状态选项数组 / Community status options array */
export const communityStatuses = ["正常运营", "筹备中", "维护中", "已停用"] as const;

/** 省份选项列表 / Province options list */
export const provinceOptions: OptionsType = provinces.map((province) => ({
	label: province,
	value: province,
}));

/** 小区状态选项列表 / Community status options list */
export const communityStatusOptions: OptionsType = communityStatuses.map((status) => ({
	label: status,
	value: status,
}));

/** 城市选项列表 / City options list */
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

// ==================== 默认表单对象 ====================

/** 默认表单数据 / Default form data */
export const defaultCommunityManageMyForm: CommunityManageMyFormVO = {
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

/** 默认表单数据 @description 对外导出用于其他场景使用 */
export const defaultForm: CommunityManageMyFormVO = defaultCommunityManageMyForm;
