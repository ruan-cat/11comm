import type { ReserveVenueFormVO } from "@01s-11comm/type";

/**
 * 场地预约表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ReserveVenueFormProps {
	/** 表单数据 */
	form: ReserveVenueFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: ReserveVenueFormVO;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: ReserveVenueFormVO = {
	预约人: "",
	联系电话: "",
	预约时间: "",
	开始时间: "",
	结束时间: "",
	场地类型: "篮球馆",
	预约状态: "待审核",
	使用人数: 1,
	备注: "",
};
