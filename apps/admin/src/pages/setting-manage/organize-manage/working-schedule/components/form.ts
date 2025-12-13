
/** 排班表表单业务接口 */
export interface 排班表表单_VO {
	/** 排班名称 */
	排班名称: string;
	/** 排班类型 */
	排班类型: ScheduleType;
	/** 开始时间 */
	开始时间: string;
	/** 结束时间 */
	结束时间: string;
	/** 星期几 */
	星期几: number;
	/** 负责人姓名 */
	负责人姓名: string;
	/** 联系电话 */
	联系电话: string;
	/** 排班描述 */
	排班描述: string;
	/** 是否启用 */
	是否启用: boolean;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 排班表表单_VO = {
	排班名称: "",
	排班类型: "morning",
	开始时间: "",
	结束时间: "",
	星期几: 1,
	负责人姓名: "",
	联系电话: "",
	排班描述: "",
	是否启用: true,
};

/**
 * 排班表表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface WorkingScheduleFormProps {
	/** 表单数据 */
	form: 排班表表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 排班表表单_VO;
}
