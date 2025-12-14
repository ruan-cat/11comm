// ==================== 类型定义 ====================

const _applicationType = ["空置房", "困难家庭", "长期住户", "特殊贡献"] as const;

/** 警告 这里仅为了演示 实际上的业务类型为 string */
export type ApplicationType = (typeof _applicationType)[number];

/** 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内 */
export interface DiscountApplyFormVO {
	/** 房屋 */
	house: string;
	/** 申请类型 */
	applicationType: ApplicationType;
	/** 费用项目 */
	expenseItem: string;
	/** 申请人 */
	applicant: string;
	/** 申请电话 */
	applicantPhone: string;
	/** 开始时间 */
	startTime: string;
	/** 结束时间 */
	endTime: string;
	/** 申请名说明 */
	description: string;
	/** 图片材料 */
	material: string;
}

// ==================== 常量定义 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: DiscountApplyFormVO = {
	house: "",
	applicationType: "空置房",
	expenseItem: "",
	applicant: "",
	applicantPhone: "",
	startTime: "",
	endTime: "",
	description: "",
	material: "",
};

/**
 * 优惠申请表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface DiscountApplyFormProps {
	/** 表单数据 */
	form: DiscountApplyFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: DiscountApplyFormVO;
}
