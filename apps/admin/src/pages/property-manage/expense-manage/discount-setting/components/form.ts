// const _折扣设置 = ["空置房", "123"] as const;

// 警告 这里仅为了演示 实际上的业务类型为 string
// export type 申请类型 = (typeof _折扣设置)[number];

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface 折扣设置表单_VO {
	折扣名称: string;
	折扣类型: "优惠" | "违约";
	规则: string; // 规则可以是一个字符串，实际业务中可能是一个枚举或其他类型
	描述: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 折扣设置表单_VO = {
	折扣名称: "",
	折扣类型: "优惠",
	规则: "规则1",
	描述: "",
};

/**
 * 折扣设置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface DiscountSettingFormProps {
	/** 表单数据 */
	form: 折扣设置表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 折扣设置表单_VO;
}
