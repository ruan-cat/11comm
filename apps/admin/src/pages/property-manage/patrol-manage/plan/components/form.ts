import type { PatrolPlanFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: PatrolPlanFormVO = {
	计划名称: "",
	计划路线: "",
	计划周期: "",
	签到方式: "二维码",
	日期范围: "",
	时间范围: {
		开始时间: "",
		结束时间: "",
	},
	"任务提前(分钟)": "",
	制定人: "",
	制定时间: "",
	状态: "启用",
	巡检人员: "",
};

/**
 * 巡检计划表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PatrolPlanFormProps {
	/** 表单数据 */
	form: PatrolPlanFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: PatrolPlanFormVO;
}
