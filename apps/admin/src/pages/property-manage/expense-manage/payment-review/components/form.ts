import type { 缴费审核_列表数据 } from "../test-data";

/**
 * 缴费审核表单数据类型
 */
export interface 缴费审核_表单数据 {
	/** 房屋 */
	房屋: string;
	/** 费用项目 */
	费用项目: string;
	/** 付费周期 */
	付费周期: string;
	/** 缴费起始时间 */
	缴费起始时间: string;
	/** 缴费结束时间 */
	缴费结束时间: string;
	/** 应付金额 */
	应付金额: string;
	/** 实付金额 */
	实付金额: string;
	/** 操作员工 */
	操作员工: string;
	/** 缴费时间 */
	缴费时间: string;
	/** 审核状态 */
	审核状态: string;
	/** 审核说明 */
	审核说明: string;
	/** 缴费备注 */
	缴费备注: string;
	/** 详情 */
	详情: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 缴费审核_表单数据 = {
	房屋: "",
	费用项目: "",
	付费周期: "",
	缴费起始时间: "",
	缴费结束时间: "",
	应付金额: "",
	实付金额: "",
	操作员工: "",
	缴费时间: "",
	审核状态: "",
	审核说明: "",
	缴费备注: "",
	详情: "",
};

/**
 * 缴费审核表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface 缴费审核FormProps {
	/** 表单数据 */
	form: 缴费审核_表单数据;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 缴费审核_表单数据;
}
