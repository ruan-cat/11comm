import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 业主信息列表数据类型
 */
export interface 业主信息_列表数据 {
	/** 人脸 */
	人脸: string;
	/** 客户名称 */
	客户名称: string;
	/** 人员类型 */
	人员类型: string;
	/** 人员角色 */
	人员角色: string;
	/** 性别 */
	性别: string;
	/** 证件号 */
	证件号: string;
	/** 联系手机 */
	联系手机: string;
	/** 备用手机 */
	备用手机: string;
	/** 地址 */
	地址: string;
	/** 房屋数 */
	房屋数: string;
	/** 业主成员 */
	业主成员: string;
	/** 车辆数 */
	车辆数: string;
	/** 欠费 */
	欠费: string;
	/** 门禁钥匙 */
	门禁钥匙: string;
}

/**
 * 业主信息列表查询参数类型
 */
export interface 业主信息_列表查询_VO {
	/** 人员类型 */
	人员类型?: string;
	/** 客户名称 */
	客户名称?: string;
	/** 房屋编号 */
	房屋编号?: string;
	/** 联系方式 */
	联系方式?: string;
	/** 身份证 */
	身份证?: string;
}

/**
 * 业主信息表单数据类型
 */
export interface 业主信息表单_VO {
	/** 人员类型 */
	人员类型: string;
	/** 人员角色 */
	人员角色: string;
	/** 客户名称 */
	客户名称: string;
	/** 联系手机 */
	联系手机: string;
	/** 性别 */
	性别: string;
	/** 备用手机 */
	备用手机: string;
	/** 地址 */
	地址: string;
	/** 门禁钥匙 */
	门禁钥匙: string;
	/** 身份证 */
	身份证: string;
	/** 备注 */
	备注: string;
}

// ==================== 选项数据 ====================

/** 人员类型选项 */
export const 人员类型Options: OptionsType = [
	{ label: "个人", value: "个人" },
	{ label: "公司", value: "公司" },
];

/** 人员角色选项 */
export const 人员角色Options: OptionsType = [
	{ label: "业主", value: "业主" },
	{ label: "租客", value: "租客" },
];

/** 性别选项 */
export const 性别Options: OptionsType = [
	{ label: "男", value: "男" },
	{ label: "女", value: "女" },
];

// ==================== 假数据 ====================

/** 单条假数据模板 */
const tableDataItem: 业主信息_列表数据 = {
	人脸: "人脸",
	客户名称: "客户名称",
	人员类型: "个人",
	人员角色: "业主",
	性别: "男",
	证件号: "证件号",
	联系手机: "联系手机",
	备用手机: "备用手机",
	地址: "地址",
	房屋数: "房屋数",
	业主成员: "业主成员",
	车辆数: "车辆数",
	欠费: "欠费",
	门禁钥匙: "门禁钥匙",
};

/** 生成35条假数据 */
export const tableData: 业主信息_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => ({
		人脸: `人脸${index + 1}`,
		客户名称: `客户${index + 1}`,
		人员类型: index % 2 === 0 ? "个人" : "公司",
		人员角色: index % 3 === 0 ? "业主" : "租客",
		性别: index % 2 === 0 ? "男" : "女",
		证件号: `${320000000000000000 + index}`,
		联系手机: `138${String(index).padStart(8, "0")}`,
		备用手机: `139${String(index + 100).padStart(8, "0")}`,
		地址: `江苏省连云港市地址${index + 1}`,
		房屋数: `${(index % 5) + 1}`,
		业主成员: `${(index % 4) + 1}`,
		车辆数: `${(index % 3) + 1}`,
		欠费: index % 5 === 0 ? "是" : "否",
		门禁钥匙: index % 3 === 0 ? "有" : "无",
	}));
