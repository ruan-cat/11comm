/**
 * @file 报修汇总表表单类型
 * @description Repair reports summary table form types
 */

import type { RepairReportsSummaryTableFormVO } from "@01s-11comm/type";

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: RepairReportsSummaryTableFormVO = {
	repairType: "",
	repairStatus: "",
	urgencyLevel: "",
	community: "",
	statisticsStartTime: "",
	statisticsEndTime: "",
};

/** 报修汇总表表单属性 Repair reports summary table form props */
export interface RepairReportsSummaryTableFormProps {
	/** 表单数据 Form data */
	form: RepairReportsSummaryTableFormVO;
	/** 表单组件重置时默认使用的对象 Default object used when form component is reset */
	defaultValues: RepairReportsSummaryTableFormVO;
	/** 表单模式 Form mode */
	mode?: Mode;
}
