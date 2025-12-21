/** 欠费明细表单_VO */
export interface 欠费明细表单_VO {
	费用编号: string;
	房号: string;
	业主: string;
	业主电话: string;
	面积: string;
	费用项: string;
	开始时间: string;
	结束时间: string;
	欠费时长: string;
	欠费金额: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 欠费明细表单_VO = {
	费用编号: "",
	房号: "",
	业主: "",
	业主电话: "",
	面积: "",
	费用项: "",
	开始时间: "",
	结束时间: "",
	欠费时长: "",
	欠费金额: "",
};

/**
 * 欠费明细表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface ArrearsDetailsFormProps {
	/** 表单数据 */
	form: 欠费明细表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 欠费明细表单_VO;
}

// ==================== 英文类型别名（已迁移到类型包）====================

/** 英文类型别名：ArrearsDetailsFormVO */
export type ArrearsDetailsFormVO = 欠费明细表单_VO;
