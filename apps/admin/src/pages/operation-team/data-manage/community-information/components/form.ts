/** 小区信息表单业务类型 */
export interface 小区信息表单_VO {
	小区ID: string;
	小区名称: string;
	物业公司: string;
	附近地标: string;
	城市编码: string;
	创建时间: string;
	社区编码: string;
	状态: string;
	省份: string;
	城市: string;
	区县: string;
	详细地址: string;
	联系电话: string;
	管理员: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 小区信息表单_VO = {
	小区ID: "",
	小区名称: "",
	物业公司: "",
	附近地标: "",
	城市编码: "",
	创建时间: "",
	社区编码: "",
	状态: "正常运营",
	省份: "",
	城市: "",
	区县: "",
	详细地址: "",
	联系电话: "",
	管理员: "",
};

/**
 * 小区信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CommunityInformationFormProps {
	/** 表单数据 */
	form: 小区信息表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 小区信息表单_VO;
}
