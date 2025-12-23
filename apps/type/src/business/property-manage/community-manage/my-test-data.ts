import type { OptionsType } from "../../../common";

/**
 * @file 我的小区测试数据
 * @description My community test data
 */

// FIXME: 这些测试数据，不应该放在这里，应该放在 `@01s-11comm/admin` 项目内。

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
