import { type OptionsType } from "plus-pro-components";

/** 发票列表数据 */
export interface 发票_列表数据 {
	编号: string;
	发票类型: string;
	业主名称: string;
	申请人: string;
	发票名头: string;
	纳税人识别号: string;
	申请金额: string;
	发票号: string;
	发审核状态: string;
	申请时间: string;
}

/** 发票表单数据 */
export interface 发票表单_VO {
	编号: string;
	发票类型: string;
	业主名称: string;
	申请人: string;
	发票名头: string;
	纳税人识别号: string;
	申请金额: string;
	发票号: string;
	发审核状态: string;
	申请时间: string;
}

/** 发票类型选项 */
export const 发票类型Options: OptionsType = [
	{ label: "增值税普通发票", value: "增值税普通发票" },
	{ label: "增值税专用发票", value: "增值税专用发票" },
	{ label: "电子发票", value: "电子发票" },
];

/** 审核状态选项 */
export const 审核状态Options: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "已通过", value: "已通过" },
	{ label: "已驳回", value: "已驳回" },
];

/** 默认表单 */
export const defaultForm: 发票表单_VO = {
	编号: "",
	发票类型: "",
	业主名称: "",
	申请人: "",
	发票名头: "",
	纳税人识别号: "",
	申请金额: "",
	发票号: "",
	发审核状态: "",
	申请时间: "",
};

/** 生成35条假数据 */
export const tableData: 发票_列表数据[] = Array.from({ length: 35 }, (_, index) => ({
	编号: `F${String(index + 1).padStart(4, "0")}`,
	发票类型: "增值税普通发票",
	业主名称: `业主${index + 1}`,
	申请人: `申请人${index + 1}`,
	发票名头: `公司${index + 1}`,
	纳税人识别号: `91110000${String(index + 1).padStart(8, "0")}`,
	申请金额: `${Math.floor(Math.random() * 10000) + 100}.00`,
	发票号: `INV${String(index + 1).padStart(6, "0")}`,
	发审核状态: "待审核",
	申请时间: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
}));
