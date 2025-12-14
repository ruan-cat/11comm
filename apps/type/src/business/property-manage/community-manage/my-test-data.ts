import type { OptionsType } from "../../../common";

/**
 * @file 我的小区测试数据
 * @description My community test data
 */

// FIXME: 这些测试数据，不应该放在这里，应该放在 `@01s-11comm/admin` 项目内。

// ==================== 列表数据 ====================

/** 我的小区列表数据 */
export const 我的小区_列表Data = [
	{
		id: "1",
		name: "测试小区1",
		status: "启用",
		createTime: "2024-01-01 00:00:00",
		updateTime: "2024-01-01 00:00:00",
		remark: "测试数据",
	},
	{
		id: "2",
		name: "测试小区2",
		status: "启用",
		createTime: "2024-01-02 00:00:00",
		updateTime: "2024-01-02 00:00:00",
		remark: "测试数据",
	},
];

/** 车位结构图列表数据 */
export const 车位结构图_列表数据 = [
	{
		id: "1",
		name: "车位结构图1",
		status: "启用",
		createTime: "2024-01-01 00:00:00",
		updateTime: "2024-01-01 00:00:00",
		remark: "测试数据",
	},
	{
		id: "2",
		name: "车位结构图2",
		status: "启用",
		createTime: "2024-01-02 00:00:00",
		updateTime: "2024-01-02 00:00:00",
		remark: "测试数据",
	},
];

/** 产权登记列表数据 */
export const 产权登记_列表数据 = [
	{
		id: "1",
		name: "产权登记1",
		status: "启用",
		createTime: "2024-01-01 00:00:00",
		updateTime: "2024-01-01 00:00:00",
		remark: "测试数据",
	},
];

// ==================== 查询参数 ====================

/** 我的小区列表查询参数 */
export interface 我的小区_列表查询_VO {
	/** 名称 */
	name?: string;
	/** 状态 */
	status?: string;
	/** 当前页码 */
	pageIndex: number;
	/** 每页大小 */
	pageSize: number;
}

/** 车位结构图列表查询参数 */
export interface 车位结构图_列表查询_VO {
	/** 名称 */
	name?: string;
	/** 状态 */
	status?: string;
	/** 当前页码 */
	pageIndex: number;
	/** 每页大小 */
	pageSize: number;
}

/** 产权登记列表查询参数 */
export interface 产权登记_列表查询_VO {
	/** 名称 */
	name?: string;
	/** 状态 */
	status?: string;
	/** 当前页码 */
	pageIndex: number;
	/** 每页大小 */
	pageSize: number;
}

// ==================== 测试用的表格数据 ====================
// 注意：mockTableData 已移动到 common/test-data.ts

/** 全部表格数据 */
export const allTableData = [
	{
		id: "1",
		name: "全部数据1",
		status: "启用",
	},
	{
		id: "2",
		name: "全部数据2",
		status: "禁用",
	},
	{
		id: "3",
		name: "全部数据3",
		status: "启用",
	},
];

// ==================== 选项数据 ====================

/**
 * @description 我的小区楼栋选项
 * My community building options
 */
export const myCommunityBuildingOptions: OptionsType = [
	{ label: "1栋", value: "1栋" },
	{ label: "2栋", value: "2栋" },
	{ label: "3栋", value: "3栋" },
];

/**
 * @description 我的小区单元选项
 * My community unit options
 */
export const myCommunityUnitOptions: OptionsType = [
	{ label: "1单元", value: "1单元" },
	{ label: "2单元", value: "2单元" },
	{ label: "3单元", value: "3单元" },
];
