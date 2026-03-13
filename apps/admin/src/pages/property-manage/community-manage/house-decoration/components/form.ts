import type { Mode } from "@/composables/use-mode";
import type { HouseDecorationFormVO } from "@01s-11comm/type";

export const defaultForm: HouseDecorationFormVO = {
	houseNumber: "",
	contactName: "",
	contactPhone: "",
	decorationTime: "",
	applicationTime: "",
	decorationCompany: "",
	managerPhone: "",
	status: "待审核",
	isDelayed: "否",
	delayTime: "",
	isViolated: "否",
	violationDescription: "",
	remarks: "",
};

export interface HouseDecorationFormProps {
	form: HouseDecorationFormVO;
	defaultValues: HouseDecorationFormVO;
	mode?: Mode;
}
