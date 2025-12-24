import type { PatrolDetailFormVO } from "@01s-11comm/type";
export type { PatrolDetailFormVO };
import { patrolMethodOptions } from "@01s-11comm/type";
import { type Mode } from "@/composables/use-mode";

/**
 * 巡查明细表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PatrolDetailFormProps {
	/** 表单数据 */
	form: PatrolDetailFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: PatrolDetailFormVO;
	/** 表单模式 */
	mode?: Mode;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: PatrolDetailFormVO = {
	patrolPointName: "",
	patrolPlanName: "",
	patrolRouteName: "",
	plannedPatrolPerson: "",
	patrolMethod: "walking",
	location: "",
	patrolSituation: "",
};

