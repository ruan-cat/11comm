import type { Mode } from "@/composables/use-mode";
import {
	BuildingSpaceStructureDiagramFormVO,
	BuildingSpaceStructureDiagramFormProps,
	defaultBuildingSpaceStructureDiagramForm,
	buildingStructureOptions,
	buildingStatusOptions,
} from "@01s-11comm/type";

// 向后兼容的类型别名
export type 楼栋结构图表单_VO = BuildingSpaceStructureDiagramFormVO;

// 向后兼容的常量导出
export const 建筑结构选项 = buildingStructureOptions;
export const 楼栋状态选项 = buildingStatusOptions;

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultBuildingSpaceStructureDiagramForm;

export type { BuildingSpaceStructureDiagramFormVO, BuildingSpaceStructureDiagramFormProps };
export { defaultBuildingSpaceStructureDiagramForm, buildingStructureOptions, buildingStatusOptions };
