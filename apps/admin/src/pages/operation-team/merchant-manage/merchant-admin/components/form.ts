import type { Mode } from "@/composables/use-mode";
import type { MerchantAdminFormVO } from "@01s-11comm/type";
import { merchantAdminDefaultForm as defaultFormValues, propertyCompanyOptions } from "@01s-11comm/type";

/** FormVO类型别名 */
export type FormVO = MerchantAdminFormVO;

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm = defaultFormValues;

/**
 * 商户管理员表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 * To avoid global type conflicts, a longer type name is designed
 */
export interface MerchantAdminFormProps {
	/** 表单数据 Form data */
	form: FormVO;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: FormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}

/**
 * 导出选项类型
 */
export { propertyCompanyOptions };
