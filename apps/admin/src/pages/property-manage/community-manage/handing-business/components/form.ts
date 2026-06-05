import type { Mode } from "@/composables/use-mode";
import type { HandingBusinessFormVO } from "@01s-11comm/type";

export interface HandingBusinessFormProps {
	form: HandingBusinessFormVO;
	defaultValues: HandingBusinessFormVO;
	mode?: Mode;
}

export const defaultForm: HandingBusinessFormVO = {
	feeItem: "",
	feeId: "",
	feeType: "",
	amountReceivable: "",
	accountCreationTime: "",
	receivablePeriod: "",
	description: "",
	status: "pending",
};
