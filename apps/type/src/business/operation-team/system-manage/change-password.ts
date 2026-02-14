// 从 setting-manage 的 schema 导入类型（统一使用 schema 生成的类型）
export type {
	ChangePasswordRecord,
	ChangePasswordRecordListQuery,
	ChangePasswordRecordListItem,
	ChangePasswordRecordQueryParams,
	ChangePasswordRecordFormVO,
} from "../../setting-manage/system-manage/change-password";

// 从公共选项文件导入
export {
	changePasswordRecordTypeOptions,
	changePasswordRecordStatusOptions,
	changePasswordRecordDepartmentOptions,
	changeMethodOptions,
	changePasswordStatusOptions,
	changePasswordSuccessOptions,
	userRoleOptions,
	departmentOptions,
} from "../../../common/business-options";
