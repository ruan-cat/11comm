import type { PatrolPointFormVO } from "@01s-11comm/type";
export type { PatrolPointFormVO };
import type { OptionsType } from "plus-pro-components";

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
}

/** 巡检方式选项 */
export const patrolMethodFormOptions: OptionsType = [
	{ label: "二维码", value: "二维码" },
	{ label: "NFC", value: "NFC" },
	{ label: "手动", value: "手动" },
	{ label: "人脸识别", value: "人脸识别" },
];

/** 签到状态选项 */
export const checkInStatusFormOptions: OptionsType = [
	{ label: "已签到", value: "已签到" },
	{ label: "未签到", value: "未签到" },
	{ label: "迟到", value: "迟到" },
];

/** 任务状态选项 */
export const taskStatusFormOptions: OptionsType = [
	{ label: "待执行", value: "待执行" },
	{ label: "执行中", value: "执行中" },
	{ label: "已完成", value: "已完成" },
	{ label: "已逾期", value: "已逾期" },
];

/** 巡检点状态选项 */
export const patrolPointStatusFormOptions: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "异常", value: "异常" },
	{ label: "待检查", value: "待检查" },
];

/** 巡检情况选项 */
export const patrolSituationFormOptions: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "异常", value: "异常" },
	{ label: "发现问题", value: "发现问题" },
	{ label: "已处理", value: "已处理" },
];
