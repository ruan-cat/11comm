import { type Mode } from "@/composables/use-mode";

// ==================== 联合类型定义 ====================

/** 房屋装修状态联合类型 */
export type HouseDecorationStatusType = "待审核" | "审核不通过" | "装修中" | "待验收" | "验收成功" | "验收失败";

/** 是否延期联合类型 */
export type IsDelayedType = "是" | "否";

/** 是否违规联合类型 */
export type IsViolatedType = "是" | "否";

export interface HouseDecorationFormVO {
	/** 房屋编号 */
	houseNumber: string;
	/** 联系人姓名 */
	contactName: string;
	/** 联系电话 */
	contactPhone: string;
	/** 装修时间 */
	decorationTime: string;
	/** 申请时间 */
	applicationTime: string;
	/** 装修单位 */
	decorationCompany: string;
	/** 负责人电话 */
	managerPhone: string;
	/** 当前状态 */
	status: HouseDecorationStatusType;
	/** 是否延期 */
	isDelayed: IsDelayedType;
	/** 延期时间 */
	delayTime: string;
	/** 是否违规 */
	isViolated: IsViolatedType;
	/** 违规说明 */
	violationDescription: string;
	/** 备注信息 */
	remarks: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: HouseDecorationFormVO = {
	houseNumber: "",
	contactName: "",
	contactPhone: "",
	decorationTime: "",
	applicationTime: "",
	decorationCompany: "",
	managerPhone: "",
	status: "待审核",
	isDelayed: "否",
	delayTime: "",
	isViolated: "否",
	violationDescription: "",
	remarks: "",
};

/**
 * 房屋装修表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface HouseDecorationFormProps {
	/** 表单数据 */
	form: HouseDecorationFormVO;

	/** 表单组件重置时默认使用的对象 */
	defaultValues: HouseDecorationFormVO;

	/** 表单模式 */
	mode?: Mode;
}
