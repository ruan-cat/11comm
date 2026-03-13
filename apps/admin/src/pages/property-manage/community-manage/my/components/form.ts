import { type Mode } from "@/composables/use-mode";
import type { CommunityManageMyFormVO } from "@01s-11comm/type";

export interface CommunityManageMyFormProps {
	form: CommunityManageMyFormVO;
	defaultValues: CommunityManageMyFormVO;
	mode?: Mode;
}

export const defaultForm: CommunityManageMyFormVO = {
	province: "福建省",
	city: "",
	district: "",
	name: "",
	code: "",
	servicePhone: "",
	area: "",
	startTime: "",
	endTime: "",
	status: "operating",
};
