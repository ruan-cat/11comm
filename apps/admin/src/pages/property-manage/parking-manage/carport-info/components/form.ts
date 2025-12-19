import type { 车位信息_表单_VO, CarportInfoFormVO } from "@01s-11comm/type";
import type { Mode } from "@/composables/use-mode";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: CarportInfoFormVO = {
	parkingLot: "",
	parkingSpace: "",
	parkingSpaceStatus: "",
	parkingSpaceType: "",
	area: "",
	ownerName: "",
	contactPhone: "",
	vehicleNumber: "",
	purchaseDate: "",
	expiryDate: "",
	monthlyRent: 0,
	remark: "",
};

/**
 * 车位信息表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface CarportInfoFormProps {
	/** 表单数据 */
	form: CarportInfoFormVO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: CarportInfoFormVO;
	/** 表单模式 */
	mode?: Mode;
}

// 向后兼容 - 支持旧代码使用中文字段名
export const defaultFormChinese: 车位信息_表单_VO = {
	停车场: "",
	车位: "",
	车位状态: "",
	车位类型: "",
	面积: "",
	业主姓名: "",
	联系电话: "",
	车辆号码: "",
	购买日期: "",
	到期日期: "",
	月租费用: 0,
	备注: "",
};

export interface CarportInfoFormPropsChinese {
	/** 表单数据 */
	form: 车位信息_表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 车位信息_表单_VO;
	/** 表单模式 */
	mode?: Mode;
}
