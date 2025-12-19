import type { OptionsType } from "plus-pro-components";

// Define types locally based on the migration
export interface BuildingSpaceStructureDiagramFormVO {
	/** 楼栋编号 / Building ID */
	buildingId: string;
	/** 楼栋名称 / Building name */
	buildingName: string;
	/** 总楼层 / Total floors */
	totalFloors: number;
	/** 总户数 / Total households */
	totalHouseholds: number;
	/** 建筑面积 / Building area */
	buildingArea: number;
	/** 建筑结构 / Building structure */
	buildingStructure: string;
	/** 建成年份 / Construction year */
	constructionYear: string;
	/** 图纸路径 / Drawing path */
	drawingPath: string;
	/** 状态 / Status */
	status: string;
	/** 负责人 / Person in charge */
	personInCharge: string;
	/** 联系电话 / Contact phone */
	contactPhone: string;
	/** 备注 / Remarks */
	remarks: string;
}

/**
 * 楼栋结构图表单 Props / Building space structure diagram form props
 */
export interface BuildingSpaceStructureDiagramFormProps {
	/** 表单数据 / Form data */
	form: BuildingSpaceStructureDiagramFormVO;
	/** 表单组件重置时默认使用的对象 / Default values for form reset */
	defaultValues: BuildingSpaceStructureDiagramFormVO;
}

// Define Chinese-named interface for backward compatibility
export interface 楼栋结构图表单_VO extends BuildingSpaceStructureDiagramFormVO {}

// Define constants
export const buildingStructureOptions: OptionsType = [
	{ label: "钢筋混凝土结构", value: "钢筋混凝土结构" },
	{ label: "钢结构", value: "钢结构" },
	{ label: "砖混结构", value: "砖混结构" },
	{ label: "框架结构", value: "框架结构" },
	{ label: "剪力墙结构", value: "剪力墙结构" },
];

export const buildingStatusOptions: OptionsType = [
	{ label: "正常使用", value: "正常使用" },
	{ label: "装修中", value: "装修中" },
	{ label: "维修中", value: "维修中" },
	{ label: "待验收", value: "待验收" },
	{ label: "已停用", value: "已停用" },
];

// Export constants with Chinese names
export const 建筑结构选项 = buildingStructureOptions;
export const 楼栋状态选项 = buildingStatusOptions;

// Default form
export const defaultBuildingSpaceStructureDiagramForm: BuildingSpaceStructureDiagramFormVO = {
	buildingId: "",
	buildingName: "",
	totalFloors: 0,
	totalHouseholds: 0,
	buildingArea: 0,
	buildingStructure: "",
	constructionYear: "",
	drawingPath: "",
	status: "正常使用",
	personInCharge: "",
	contactPhone: "",
	remarks: "",
};

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 楼栋结构图表单_VO = defaultBuildingSpaceStructureDiagramForm;
