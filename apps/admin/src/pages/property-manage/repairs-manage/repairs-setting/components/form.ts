// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export type 报修设置类型 = "保洁单" | "维修单";
export type 派单方式类型 = "抢单" | "指派" | "轮训";
export type 区域类型 = "房屋" | "公共区域" | "车库" | "非房屋";
export type 业主端展示类型 = "是" | "否";
export type 通知方式类型 = "短信" | "微信" | "微信+员工工牌";
export type 回访设置类型 = "不回访" | "已评价不回访" | "回访";

export interface 报修设置表单_VO {
	类型名称: string;
	设置类型: 报修设置类型;
	派单方式: 派单方式类型;
	公共区域: 区域类型;
	业主端展示: 业主端展示类型;
	通知方式: 通知方式类型;
	回访设置: 回访设置类型;
	说明: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 报修设置表单_VO = {
	类型名称: "",
	设置类型: "维修单",
	派单方式: "指派",
	公共区域: "房屋",
	业主端展示: "是",
	通知方式: "微信",
	回访设置: "回访",
	说明: "",
};

/**
 * 报修设置表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface RepairsSettingFormProps {
	/** 表单数据 */
	form: 报修设置表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 报修设置表单_VO;
}
