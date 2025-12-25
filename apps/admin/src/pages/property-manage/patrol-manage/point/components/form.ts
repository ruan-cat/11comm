import type { PatrolPointFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: PatrolPointFormVO = {
	patrolPointName: "",
	patrolPlanName: "",
	patrolRouteName: "",
	planPatrolPerson: "",
	patrolMethod: "",
	actualCheckInStatus: "",
	taskStatus: "",
	patrolPointStatus: "",
	patrolSituation: "",
	locationInfo: "",
};

/**
 * 巡检点表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PatrolPointFormProps {
	/** 表单数据 */
	form: PatrolPointFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: PatrolPointFormVO;
	/** 表单模式 */
	mode?: Mode;
}
