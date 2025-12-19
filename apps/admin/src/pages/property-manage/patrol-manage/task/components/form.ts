/** 巡检任务 表单_VO */
export interface 巡检任务表单_VO {
	任务编码: string;
	巡检计划: string;
	"巡检人开始/结束时间": string;
	实际巡检时间: string;
	计划巡检人: string;
	当前巡检人: string;
	转移描述: string;
	巡检方式: string;
	巡检状态: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 巡检任务表单_VO = {
	任务编码: "",
	巡检计划: "",
	"巡检人开始/结束时间": "",
	实际巡检时间: "",
	计划巡检人: "",
	当前巡检人: "",
	转移描述: "",
	巡检方式: "",
	巡检状态: "",
};

/**
 * 巡检任务表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PatrolTaskFormProps {
	/** 表单数据 */
	form: 巡检任务表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 巡检任务表单_VO;
}

// ==================== 英文类型别名（已迁移到类型包）====================

/** 英文类型别名：PatrolTaskFormVO */
export type PatrolTaskFormVO = 巡检任务表单_VO;
