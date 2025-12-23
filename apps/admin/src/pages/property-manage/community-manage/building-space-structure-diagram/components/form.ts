import type { Mode } from "@/composables/use-mode";
import {
	type BuildingSpaceStructureDiagramFormVO,
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

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultBuildingSpaceStructureDiagramForm;

