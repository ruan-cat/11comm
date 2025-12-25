import type { BuildingSpaceStructureDiagramFormVO } from "@01s-11comm/type";
import { type Mode } from "@/composables/use-mode";

/**
 * 楼栋结构图表单 Props / Building space structure diagram form props
 */
export interface BuildingSpaceStructureDiagramFormProps {
	/** 表单数据 / Form data */
	form: BuildingSpaceStructureDiagramFormVO;
	/** 表单组件重置时默认使用的对象 / Default values for form reset */
	defaultValues: BuildingSpaceStructureDiagramFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: BuildingSpaceStructureDiagramFormVO = {
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

