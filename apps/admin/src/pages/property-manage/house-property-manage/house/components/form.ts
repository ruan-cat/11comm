import type { HouseManagementFormVO } from "@01s-11comm/type";

// ==================== 类型别名 ====================

/** 房屋管理表单数据类型（中文别名） */
export type HouseManagementFormVO_中文 = HouseManagementFormVO;

// ==================== Options 导出 ====================

import { 房屋类型选项, 房屋状态选项 } from "@01s-11comm/type";

/** 房屋类型选项 */
export { 房屋类型选项 };

/** 房屋状态选项 */
export { 房屋状态选项 };

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: HouseManagementFormVO = {
	house: "",
	floor: "",
	owner: "",
	type: "",
	houseArea: "",
	rent: "",
	houseStatus: "",
	validUntil: "",
};

/**
 * 房屋管理表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface HouseManageFormProps {
	/** 表单数据 */
	form: HouseManagementFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: HouseManagementFormVO;
}

export type { HouseManagementFormVO };
