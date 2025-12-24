/** 导入类型供其他文件使用 */
import type { PropertyRegisterFormVO } from "@01s-11comm/type";
import { auditStatusOptions } from "@01s-11comm/type";

// TODO: 不要编写向后兼容的中文类型，直接用纯英文命名的类型做替换
/** 向后兼容：产权登记表单_VO */
export type 产权登记表单_VO = PropertyRegisterFormVO;

/**
 * 产权登记表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface PropertyRegisterFormProps {
	/** 表单数据 */
	form: PropertyRegisterFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: PropertyRegisterFormVO;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: PropertyRegisterFormVO = {
	propertyRightId: "",
	houseId: "",
	houseNumber: "",
	ownerName: "",
	contactInfo: "",
	idCardNumber: "",
	address: "",
	status: "启用",
	remark: "",
};
