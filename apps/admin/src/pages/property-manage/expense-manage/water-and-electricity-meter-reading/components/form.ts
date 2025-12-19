const _expenseType = ["水费", "电费"] as const;

/** 费用类型 Expense type */
export type ExpenseType = (typeof _expenseType)[number];

/** 水电抄表表单VO Water and electricity meter reading form VO */
export interface WaterAndElectricityMeterReadingFormVO {
	/** 费用类型 Expense type */
	expenseType: ExpenseType;
	/** 收费项目 Charge item */
	chargeItem: "水表" | "电表";
	/** 抄表类型 Meter reading type */
	meterReadingType: "水表" | "电表";
	/** 收费对象 Charge object */
	chargeObject: string;
	/** 上期度数 Last reading */
	lastReading: string;
	/** 本期度数 Current reading */
	currentReading: string;
	/** 上期读表时间 Last reading time */
	lastReadingTime: string;
	/** 本期读表时间 Current reading time */
	currentReadingTime: string;
	/** 备注 Remark */
	remark?: string;
}

/** 默认表单 Default form @description 对外导出用于其他场景使用 */
export const defaultForm: WaterAndElectricityMeterReadingFormVO = {
	expenseType: "水费",
	chargeItem: "水表",
	meterReadingType: "水表",
	chargeObject: "",
	lastReading: "0",
	currentReading: "0",
	lastReadingTime: "",
	currentReadingTime: "",
	remark: "",
};

/**
 * 水电抄表表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface WaterAndElectricityMeterReadingFormProps {
	/** 表单数据 Form data */
	form: WaterAndElectricityMeterReadingFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: WaterAndElectricityMeterReadingFormVO;
}
