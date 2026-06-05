import type { Mode } from "@/composables/use-mode";
import type { InitializeCellFormVO } from "@01s-11comm/type";

// ==================== 常量定义 ====================
// 选项常量已移至 ../test-data.ts 中，避免重复定义

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: InitializeCellFormVO = {
	cellName: "",
	cellType: "ResidentialUnit",
	buildingId: "",
	buildingName: "",
	floor: "",
	unitNumber: "",
	households: 0,
	status: "Uninitialized",
	description: "",
};

/**
 * 初始化单元格表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface InitializeCellFormProps {
	/** 表单数据 */
	form: InitializeCellFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: InitializeCellFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
