/**
 * @file 业务共同类型定义
 * @description 导出业务内共享通用的下拉选项数组
 */

import type { OptionsType } from "./OptionsType";

/**
 * @description 合同类型
 * Draft contract type options
 */
export const 合同类型Options: OptionsType = [
	{ label: "物业服务合同", value: "物业服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "维修合同", value: "维修合同" },
];
