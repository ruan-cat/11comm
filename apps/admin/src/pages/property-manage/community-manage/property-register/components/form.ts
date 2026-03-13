import type { Mode } from "@/composables/use-mode";
import type { PropertyRegisterFormVO } from "@01s-11comm/type";

export interface PropertyRegisterFormProps {
	form: PropertyRegisterFormVO;
	defaultValues: PropertyRegisterFormVO;
	mode?: Mode;
}

export const defaultForm: PropertyRegisterFormVO = {
	propertyRightId: "",
	houseId: "",
	houseNumber: "",
	ownerName: "",
	contactInfo: "",
	idCardNumber: "",
	address: "",
	status: "enabled",
	remark: "",
};
