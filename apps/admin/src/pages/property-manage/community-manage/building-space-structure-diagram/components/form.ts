import type { Mode } from "@/composables/use-mode";
import {
	BuildingSpaceStructureDiagramFormVO,
	defaultBuildingSpaceStructureDiagramForm,
	buildingStructureOptions,
	buildingStatusOptions,
} from "@01s-11comm/type";

/**
 * 楼栋结构图表单 Props / Building space structure diagram form props
 */
export interface BuildingSpaceStructureDiagramFormProps {
	/** 表单数据 / Form data */
	form: BuildingSpaceStructureDiagramFormVO;
	/** 表单组件重置时默认使用的对象 / Default values for form reset */
	defaultValues: BuildingSpaceStructureDiagramFormVO;
}

// 向后兼容的类型别名
export type 楼栋结构图表单_VO = BuildingSpaceStructureDiagramFormVO;

// 向后兼容的常量导出
export const 建筑结构选项 = buildingStructureOptions;
export const 楼栋状态选项 = buildingStatusOptions;

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultBuildingSpaceStructureDiagramForm;

export type { BuildingSpaceStructureDiagramFormVO };
export { defaultBuildingSpaceStructureDiagramForm, buildingStructureOptions, buildingStatusOptions };
