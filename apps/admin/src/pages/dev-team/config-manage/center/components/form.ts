const _配置类型 = [
	"系统配置",
	"业务配置",
	"接口配置",
	"数据库配置",
	"缓存配置",
	"安全配置",
	"邮件配置",
	"文件配置",
] as const;

const _配置状态 = ["启用", "禁用"] as const;

// ==================== 联合类型定义 ====================

/** 配置类型联合类型 */
export type 配置类型 = (typeof _配置类型)[number];

/** 配置状态联合类型 */
export type 配置状态 = (typeof _配置状态)[number];

/** 配置中心表单数据类型 */
export interface 配置中心表单_VO {
	/** 配置项名称 */
	配置项名称: string;
	/** 配置类型 */
	配置类型: 配置类型;
	/** 配置键名 */
	配置键名: string;
	/** 配置值 */
	配置值: string;
	/** 默认值 */
	默认值: string;
	/** 配置描述 */
	配置描述: string;
	/** 状态 */
	状态: 配置状态;
	/** 排序号 */
	排序号: number;
	/** 备注 */
	备注: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 配置中心表单_VO = {
	配置项名称: "",
	配置类型: "系统配置",
	配置键名: "",
	配置值: "",
	默认值: "",
	配置描述: "",
	状态: "启用",
	排序号: 0,
	备注: "",
};

/**
 * 配置中心表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ConfigCenterFormProps {
	/** 表单数据 */
	form: 配置中心表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 配置中心表单_VO;
}