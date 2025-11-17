import type { 小区公示_列表数据 } from "../test-data";

/** 公示类型 */
const _公示类型 = ["通知", "公告", "提醒", "活动", "维修", "安全"] as const;

/** 公示状态 */
const _公示状态 = ["草稿", "已发布", "已过期"] as const;

// 警告 这里仅为了演示 实际上的业务类型为 string
export type 公示类型 = (typeof _公示类型)[number];
export type 公示状态 = (typeof _公示状态)[number];

// 警告 这里仅为了演示 实际上的业务类型应该都来自于 api 目录内
export interface 小区公示表单_VO {
	/** 公示标题 */
	标题: string;
	/** 公示类型 */
	类型: 公示类型;
	/** 有效期开始 */
	有效期开始: string;
	/** 有效期结束 */
	有效期结束: string;
	/** 公示状态 */
	状态: 公示状态;
	/** 公示内容摘要 */
	内容摘要: string;
	/** 发布人 */
	发布人?: string;
	/** 发布时间 */
	发布时间?: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 小区公示表单_VO = {
	标题: "",
	类型: "通知",
	有效期开始: "",
	有效期结束: "",
	状态: "草稿",
	内容摘要: "",
	发布人: "",
	发布时间: "",
};

/**
 * 小区公示表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CommunityNoticeFormProps {
	/** 表单数据 */
	form: 小区公示表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 小区公示表单_VO;
}

/** 公示类型选项 */
export const 公示类型选项 = [
	{ label: "通知", value: "通知" },
	{ label: "公告", value: "公告" },
	{ label: "提醒", value: "提醒" },
	{ label: "活动", value: "活动" },
	{ label: "维修", value: "维修" },
	{ label: "安全", value: "安全" },
];

/** 公示状态选项 */
export const 公示状态选项 = [
	{ label: "草稿", value: "草稿" },
	{ label: "已发布", value: "已发布" },
	{ label: "已过期", value: "已过期" },
];

/** 从列表数据转换为表单数据的辅助函数 */
export function 列表数据转表单数据(列表数据: 小区公示_列表数据): 小区公示表单_VO {
	return {
		标题: 列表数据.公示标题,
		类型: 列表数据.公示类型 as 公示类型,
		有效期开始: "",
		有效期结束: "",
		状态: "草稿",
		内容摘要: "",
		发布人: 列表数据.发布人,
		发布时间: 列表数据.公示时间,
	};
}
