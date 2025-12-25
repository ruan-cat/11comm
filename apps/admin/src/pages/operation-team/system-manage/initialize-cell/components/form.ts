import type { Mode } from "@/composables/use-mode";
import type { OptionsType } from "plus-pro-components";
import { cellTypeOptions, initializeCellStatusOptions, statusOptions } from "@01s-11comm/type";

// ==================== 联合类型定义 ====================

/** 单元格类型联合类型 */
export type CellType =
	| "ResidentialUnit"
	| "CommercialUnit"
	| "GarageUnit"
	| "OfficeUnit"
	| "ClubUnit"
	| "PropertyUnit"
	| "SportsUnit"
	| "EducationUnit"
	| "MedicalUnit"
	| "StorageUnit"
	| "CultureUnit";

/** 状态联合类型 */
export type CellStatus = "Initialized" | "Uninitialized" | "Initializing" | "InitializationFailed";

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
	cellType: "ResidentialUnit",
	buildingId: "",
	buildingName: "",
	floor: "",
	unitNumber: "",
	households: 0,
	status: "Uninitialized",
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
