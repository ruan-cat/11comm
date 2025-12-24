import type { BaseListQueryParams, OptionsType } from "../../../common";

// 从公共选项文件导入原始名称
import {
	operationRegisterProtocolTypeOptions,
	operationRegisterProtocolEnabledOptions,
	registerProtocolStatusOptions,
	operationRegisterProtocolRequiredOptions,
} from "../../../common/business-options";

/**
 * 运营团队注册协议列表查询参数
 * 从 business-types.ts 导入
 */
export type { OperationTeamRegisterProtocolListQuery } from "../../../common/business-types";

/**
 * 运营团队注册协议
 * 从 business-types.ts 导入
 */
export type { OperationTeamRegisterProtocol } from "../../../common/business-types";

/**
 * 协议类型选项别名
 */
export const protocolTypeOptions = operationRegisterProtocolTypeOptions;

/**
 * 是否必读选项别名
 */
export const isMandatoryOptions = operationRegisterProtocolRequiredOptions;

/**
 * 必读状态选项
 */
export const registerProtocolRequiredOptions: OptionsType = [
	{ label: "必读", value: true },
	{ label: "选读", value: false },
];
