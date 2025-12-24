import type { PatrolTaskFormVO } from "@01s-11comm/type";
export type { PatrolTaskFormVO };
import { type Mode } from "@/composables/use-mode";

/**
 * 巡检任务表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PatrolTaskFormProps {
	/** 表单数据 */
	form: PatrolTaskFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: PatrolTaskFormVO;
	/** 表单模式 */
	mode?: Mode;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: PatrolTaskFormVO = {
	taskCode: "",
	patrolPlan: "",
	patrolPersonTimeRange: "",
	actualPatrolTime: "",
	plannedPatrolPerson: "",
	currentPatrolPerson: "",
	transferDescription: "",
	patrolMethod: "",
	patrolStatus: "",
};

