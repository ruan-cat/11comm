// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface 业主账户表单_VO {
	账户类型: "通用账户" | "物业费扣款账户" | "水电费扣款账户";
	业主手机: string;
	业主名称: "1" | "2";
	预存金额: string;
	支付方式: "现金" | "POS刷卡" | "微信二维码" | "支付宝二维码" | "转账" | "押金退款到账户";
	备注: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 业主账户表单_VO = {
	账户类型: "通用账户",
	业主手机: "",
	业主名称: "1",
	预存金额: "",
	支付方式: "现金",
	备注: "",
};

/**
 * 业主账户表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface OwnerAccountFormProps {
	/** 表单数据 */
	form: 业主账户表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 业主账户表单_VO;
}
