import { type Mode } from "@/composables/use-mode";
// 从 @01s-11comm/type 导入缺失的选项
import { 物业公司选项 } from "@01s-11comm/type";

/** 商户管理员表单数据类型 */
export interface 商户管理员表单_VO {
	/** 物业公司名称 */
	物业公司: string;
	/** 管理员姓名 */
	管理员姓名: string;
	/** 管理员电话 */
	管理员电话: string;
	/** 管理员邮箱 */
	管理员邮箱: string;
	/** 身份证号码 */
	身份证号码: string;
	/** 账户状态 */
	账户状态: string;
	/** 登录密码 */
	登录密码: string;
	/** 确认密码 */
	确认密码: string;
	/** 联系地址 */
	联系地址: string;
	/** 备注 */
	备注: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 商户管理员表单_VO = {
	物业公司: "",
	管理员姓名: "",
	管理员电话: "",
	管理员邮箱: "",
	身份证号码: "",
	账户状态: "正常",
	登录密码: "",
	确认密码: "",
	联系地址: "",
	备注: "",
};

/**
 * 商户管理员表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface MerchantAdminFormProps {
	/** 表单数据 */
	form: 商户管理员表单_VO;

	/** 表单组件重置时默认使用的对象 */
	defaultValues: 商户管理员表单_VO;

	/** 表单模式 */
	mode?: Mode;
}

/** 物业公司选项导出 */
export { 物业公司选项 };
