import type { Mode } from "@/composables/use-mode";
import type { BuildingSpaceStructureDiagramFormVO } from "@01s-11comm/type";

export interface BuildingSpaceStructureDiagramFormProps {
	form: BuildingSpaceStructureDiagramFormVO;
	defaultValues: BuildingSpaceStructureDiagramFormVO;
	mode?: Mode;
}

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
