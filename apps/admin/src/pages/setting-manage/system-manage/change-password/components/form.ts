import type { ChangePasswordRecord } from "@01s-11comm/type";
import { type Mode } from "@/composables/use-mode";

// ==================== 表单类型定义 ====================

// ==================== 默认表单值 ====================

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ChangePasswordRecord = {
	id: "",
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

// ==================== 表单 Props 类型 ====================

/**
 * 密码修改记录表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ChangePasswordRecordFormProps {
	/** 表单数据 */
	form: ChangePasswordRecord;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ChangePasswordRecord;
	/** 表单模式 */
	mode?: Mode;
}
