import type { Mode } from "@/composables/use-mode";
import type { OptionsType } from "plus-pro-components";
export { statusOptions } from "@01s-11comm/type";

// ==================== 联合类型定义 ====================

/** 单元格类型联合类型 */
export type CellType =
	| "住宅单元"
	| "商业单元"
	| "车库单元"
	| "办公单元"
	| "会所单元"
	| "物业单元"
	| "运动单元"
	| "教育单元"
	| "医疗单元"
	| "仓储单元"
	| "文化单元";

/** 状态联合类型 */
export type CellStatus = "已初始化" | "未初始化" | "初始化中" | "初始化失败";

// ==================== 业务类型定义 ====================

/**
 * 初始化单元格表单数据类型
 * @description
 * 用于表单组件的数据传输和验证
 */
export interface InitializeCellFormVO {
	/** 单元格名称 */
	cellName: string;
	/** 单元格类型 */
	cellType: CellType;
	/** 建筑物ID */
	buildingId: string;
	/** 建筑物名称 */
	buildingName: string;
	/** 楼层 */
	floor: string;
	/** 单元号 */
	unitNumber: string;
	/** 户数 */
	households: number;
	/** 状态 */
	status: CellStatus;
	/** 描述 */
	description: string;
}

// ==================== 常量定义 ====================
// 选项常量已移至 ../test-data.ts 中，避免重复定义

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: InitializeCellFormVO = {
	cellName: "",
	cellType: "住宅单元",
	buildingId: "",
	buildingName: "",
	floor: "",
	unitNumber: "",
	households: 0,
	status: "未初始化",
	description: "",
};

/**
 * 初始化单元格表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface InitializeCellFormProps {
	/** 表单数据 */
	form: InitializeCellFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: InitializeCellFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
