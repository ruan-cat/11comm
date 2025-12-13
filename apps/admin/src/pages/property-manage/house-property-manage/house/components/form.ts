import type { HouseManagementFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: HouseManagementFormVO = {
	房屋: "",
	楼层: "",
	业主: "",
	类型: "",
	房屋面积: "",
	租金: "",
	房屋状态: "",
	有效期: "",
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
