import type { PatrolPathFormData } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: PatrolPathFormData = {
	patrolPointId: "",
	patrolPointName: "",
	patrolPointType: "",
	patrolLocation: "",
	startTime: "",
	endTime: "",
	sortOrder: "",
};

/**
 * 巡检路线表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PatrolPathFormProps {
	/** 表单数据 */
	form: PatrolPathFormData;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: PatrolPathFormData;
}

// ==================== 英文类型别名（已迁移到类型包）====================

/** 英文类型别名：PatrolPathFormVO */
export type PatrolPathFormVO = PatrolPathFormData;

export type { PatrolPathFormData };
