import type { Mode } from "@/composables/use-mode";

/** 密码修改记录弹窗表单字段，只保留 sm_change_password_records 真实可写字段。 */
export interface ChangePasswordRecordFormData {
	username: string;
	realName: string;
	department: string;
	changeTime: string;
	changeIp: string;
	changeType: string;
	operator: string;
	status: string;
	remark: string;
}

/** 密码修改记录默认值，字段边界需与新增/编辑接口接收的表单 payload 保持一致。 */
export const defaultForm: ChangePasswordRecordFormData = {
	username: "",
	realName: "",
	department: "",
	changeTime: "",
	changeIp: "",
	changeType: "用户自行修改",
	operator: "",
	status: "成功",
	remark: "",
};

/**
 * 密码修改记录表单 props
 * @description
 * form/defaultValues 共同服务弹窗提交、重置和关闭前脏数据判断；info 模式只读展示。
 */
export interface ChangePasswordRecordFormProps {
	/** 弹窗表单数据，新增来自 defaultForm，详情/编辑来自列表行转换结果。 */
	form: ChangePasswordRecordFormData;
	/** 表单组件重置和关闭前比较使用的基准值。 */
	defaultValues: ChangePasswordRecordFormData;
	/** 表单模式，info 模式下字段统一只读且页面隐藏提交区。 */
	mode?: Mode;
}
