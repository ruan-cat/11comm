import { type Mode } from "@/composables/use-mode";

/** 物业公司表单数据类型 */
export interface 物业公司表单_VO {
	/** 物业公司编号 */
	编号: string;
	/** 物业公司名称 */
	名称: string;
	/** 公司地址 */
	地址: string;
	/** 联系电话 */
	电话: string;
	/** 管理员姓名 */
	管理员: string;
	/** 公司法人代表 */
	公司法人: string;
	/** 公司成立日期 */
	成立日期: string;
	/** 位置地标 */
	地标: string;
	/** 开通小区数量 */
	开通小区数量: number;
	/** 公司类型 */
	公司类型: string;
	/** 服务等级 */
	服务等级: string;
	/** 运营状态 */
	运营状态: string;
	/** 备注 */
	备注: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 物业公司表单_VO = {
	编号: "",
	名称: "",
	地址: "",
	电话: "",
	管理员: "",
	公司法人: "",
	成立日期: "",
	地标: "",
	开通小区数量: 0,
	公司类型: "",
	服务等级: "",
	运营状态: "正常运营",
	备注: "",
};

/**
 * 物业公司表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PropertyManagementCompanyFormProps {
	/** 表单数据 */
	form: 物业公司表单_VO;

	/** 表单组件重置时默认使用的对象 */
	defaultValues: 物业公司表单_VO;

	/** 表单模式 */
	mode?: Mode;
}
