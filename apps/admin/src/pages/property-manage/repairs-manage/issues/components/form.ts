import type { 工单池_列表数据 } from "../test-data";

/** 工单池表单_VO */
export interface 工单池表单_VO {
	工单编码: string;
	位置: string;
	报修类型: string;
	维修类型: string;
	报修人: string;
	联系方式: string;
	预约开始结束时间: string;
	提交时间: string;
	提单时长: string;
	完成时间: string;
	状态: string;
	违规说明: string;
	备注: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 工单池表单_VO = {
	工单编码: "",
	位置: "",
	报修类型: "",
	维修类型: "",
	报修人: "",
	联系方式: "",
	预约开始结束时间: "",
	提交时间: "",
	提单时长: "",
	完成时间: "",
	状态: "",
	违规说明: "",
	备注: "",
};

/**
 * 工单池表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface IssuesSettingFormProps {
	/** 表单数据 */
	form: 工单池表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 工单池表单_VO;
}
