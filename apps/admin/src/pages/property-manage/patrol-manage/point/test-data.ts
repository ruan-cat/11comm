import type { OptionsType } from "plus-pro-components";

/** 巡检点列表数据 */
export interface PatrolPointListData {
	/** 任务详情ID */
	taskDetailId: string;
	/** 巡检点名称 */
	patrolPointName: string;
	/** 巡检计划名称 */
	patrolPlanName: string;
	/** 巡检路线名称 */
	patrolRouteName: string;
	/** 巡检人开始/结束时间 */
	patrolPersonTime: string;
	/** 巡检点开始/结束时间 */
	patrolPointTime: string;
	/** 实际巡检时间 */
	actualPatrolTime: string;
	/** 实际签到状态 */
	actualCheckInStatus: string;
	/** 计划巡检人 */
	planPatrolPerson: string;
	/** 实际巡检人 */
	actualPatrolPerson: string;
	/** 巡检方式 */
	patrolMethod: string;
	/** 任务状态 */
	taskStatus: string;
	/** 巡检点状态 */
	patrolPointStatus: string;
	/** 巡检情况 */
	patrolSituation: string;
	/** 巡检照片 */
	patrolPhotos: string;
	/** 创建时间 */
	createTime: string;
	/** 位置信息 */
	locationInfo: string;
}

/** 巡检点列表查询VO */
export interface PatrolPointListQueryVO {
	/** 巡检人 */
	patrolPerson?: string;
	/** 巡检开始时间 */
	patrolStartTime?: string;
	/** 巡检结束时间 */
	patrolEndTime?: string;
}

/** 签到状态选项 */
export const checkInStatusOptions: OptionsType = [
	{ label: "已签到", value: "已签到" },
	{ label: "未签到", value: "未签到" },
	{ label: "迟到", value: "迟到" },
];

/** 巡检方式选项 */
export const patrolMethodOptions: OptionsType = [
	{ label: "二维码", value: "二维码" },
	{ label: "NFC", value: "NFC" },
	{ label: "手动", value: "手动" },
	{ label: "人脸识别", value: "人脸识别" },
];

/** 任务状态选项 */
export const taskStatusOptions: OptionsType = [
	{ label: "待执行", value: "待执行" },
	{ label: "执行中", value: "执行中" },
	{ label: "已完成", value: "已完成" },
	{ label: "已逾期", value: "已逾期" },
];

/** 巡检点状态选项 */
export const patrolPointStatusOptions: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "异常", value: "异常" },
	{ label: "待检查", value: "待检查" },
];

/** 巡检情况选项 */
export const patrolSituationOptions: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "异常", value: "异常" },
	{ label: "发现问题", value: "发现问题" },
	{ label: "已处理", value: "已处理" },
];

/** 巡检点数据模板 */
const patrolPointDataTemplate: PatrolPointListData = {
	taskDetailId: "T",
	patrolPointName: "",
	patrolPlanName: "",
	patrolRouteName: "",
	patrolPersonTime: "",
	patrolPointTime: "",
	actualPatrolTime: "",
	actualCheckInStatus: "",
	planPatrolPerson: "",
	actualPatrolPerson: "",
	patrolMethod: "",
	taskStatus: "",
	patrolPointStatus: "",
	patrolSituation: "",
	patrolPhotos: "",
	createTime: "",
	locationInfo: "",
};

/** 生成35条巡检点假数据 */
export const tableData: PatrolPointListData[] = Array(35)
	.fill(null)
	.map((_, index) => {
		const statusOptions = ["已签到", "未签到", "迟到"];
		const methodOptions = ["二维码", "NFC", "手动", "人脸识别"];
		const taskOptions = ["待执行", "执行中", "已完成", "已逾期"];
		const pointStatusOptions = ["正常", "异常", "待检查"];
		const situationOptions = ["正常", "异常", "发现问题", "已处理"];

		const patrolPointName = `${index + 1}号巡检点`;
		const patrolPlanName = `日常巡检计划${Math.floor(index / 5) + 1}`;
		const patrolRouteName = `A区巡检路线${Math.floor(index / 7) + 1}`;

		return {
			...patrolPointDataTemplate,
			taskDetailId: `T${String(index + 1).padStart(3, "0")}`,
			patrolPointName,
			patrolPlanName,
			patrolRouteName,
			patrolPersonTime: `2024-01-${String((index % 28) + 1).padStart(2, "0")} 08:00:00 - 18:00:00`,
			patrolPointTime: `2024-01-${String((index % 28) + 1).padStart(2, "0")} ${String(8 + (index % 8)).padStart(2, "0")}:00:00 - ${String(9 + (index % 8)).padStart(2, "0")}:00:00`,
			actualPatrolTime: `2024-01-${String((index % 28) + 1).padStart(2, "0")} ${String(8 + (index % 8)).padStart(2, "0")}:15:00`,
			actualCheckInStatus: statusOptions[index % statusOptions.length],
			planPatrolPerson: `张${(index % 3) + 1}工`,
			actualPatrolPerson: `李${(index % 4) + 1}师傅`,
			patrolMethod: methodOptions[index % methodOptions.length],
			taskStatus: taskOptions[index % taskOptions.length],
			patrolPointStatus: pointStatusOptions[index % pointStatusOptions.length],
			patrolSituation: situationOptions[index % situationOptions.length],
			patrolPhotos: `${index + 1}张照片`,
			createTime: `2024-01-${String((index % 28) + 1).padStart(2, "0")} ${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
			locationInfo: `经度116.404${String(index).padStart(4, "0")}, 纬度39.915${String(index).padStart(4, "0")}`,
		};
	});
