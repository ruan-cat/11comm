// ==================== 联合类型定义 ====================

/** 巡检方式联合类型 */
export type 巡检方式 = "步行巡检" | "骑车巡检" | "驾车巡检" | "视频巡检";

/** 任务状态联合类型 */
export type 任务状态 = "待执行" | "执行中" | "已完成" | "已逾期" | "已取消";

/** 巡检点状态联合类型 */
export type 巡检点状态 = "正常" | "异常" | "待检查";

// ==================== 业务类型定义 ====================

/**
 * 巡查明细表单数据类型
 */
export interface 巡查明细表单_VO {
	/** 巡检点名称 */
	巡检点名称: string;
	/** 巡检计划名称 */
	巡检计划名称: string;
	/** 巡检路线名称 */
	巡检路线名称: string;
	/** 计划巡检人 */
	计划巡检人: string;
	/** 巡检方式 */
	巡检方式: 巡检方式 | "";
	/** 位置信息 */
	位置信息: string;
	/** 巡检情况 */
	巡检情况: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 巡查明细表单_VO = {
	巡检点名称: "",
	巡检计划名称: "",
	巡检路线名称: "",
	计划巡检人: "",
	巡检方式: "步行巡检",
	位置信息: "",
	巡检情况: "",
};

/**
 * 巡查明细表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface 巡查明细表单Props {
	/** 表单数据 */
	form: 巡查明细表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 巡查明细表单_VO;
}

// ==================== 英文类型别名（已迁移到类型包）====================

/** 英文类型别名：PatrolMethodType */
export type PatrolMethodType = 巡检方式;

/** 英文类型别名：TaskStatusType */
export type TaskStatusType = 任务状态;

/** 英文类型别名：PatrolPointStatusType */
export type PatrolPointStatusType = 巡检点状态;

/** 英文类型别名：PatrolDetailFormVO */
export type PatrolDetailFormVO = 巡查明细表单_VO;

/** 英文类型别名：PatrolDetailFormProps */
export type PatrolDetailFormProps = 巡查明细表单Props;
