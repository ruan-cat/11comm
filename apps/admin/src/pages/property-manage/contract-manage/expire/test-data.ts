import type { OptionsType } from "plus-pro-components";

/** 到期合同_列表数据 */
export interface 到期合同_列表数据 {
	合同名称: string;
	合同编号: string;
	合同类型: string;
	甲方: string;
	甲方联系人: string;
	甲方联系电话: string;
	乙方: string;
	乙方联系人: string;
	乙方联系电话: string;
	经办人: string;
	经办电话: string;
	合同金额: string;
	开始时间: string;
	结束时间: string;
	签订时间: string;
	到期时间: string;
	状态: string;
	处理状态?: string;
	到期处理类型?: string;
	处理人?: string;
	说明?: string;
}

/** 到期合同_列表查询_VO */
export interface 到期合同_列表查询_VO {
	合同名称?: string;
	合同编号?: string;
	选择合同类型?: string;
	处理状态?: string;
}

/** 处理状态选项 */
export const 处理状态Options: OptionsType = [
	{ label: "未处理", value: "未处理" },
	{ label: "处理中", value: "处理中" },
	{ label: "已处理", value: "已处理" },
	{ label: "已延期", value: "已延期" },
];

/** 业务受理_列表数据 */
export interface 业务受理_列表数据 {
	合同名称: string;
	合同编号: string;
	合同类型: string;
	甲方: string;
	乙方: string;
	变更类型: string;
	变更人: string;
	申请时间: string;
	说明: string;
	状态: string;
}

/** 合同类型_列表查询_VO */
export interface 合同类型_列表查询_VO {
	合同名称?: string;
	输入合同编号?: string;
	选择合同类型?: string;
}

/** 合同类型选项 */
export const 合同类型Options: OptionsType = [
	{ label: "采购合同", value: "采购合同" },
	{ label: "销售合同", value: "销售合同" },
	{ label: "服务合同", value: "服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
];

/** 审核类型选项 */
export const 审核类型Options: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "审核中", value: "审核中" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
	{ label: "已撤回", value: "已撤回" },
];

/** 生成35条到期合同假数据 */
export const tableData: 到期合同_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => ({
		合同名称: `合同-${index + 1}`,
		合同编号: `HT${(Date.now() + index * 1000).toString(36).toUpperCase().substring(4)}`,
		合同类型: String((合同类型Options as any)[index % (合同类型Options as any).length].value),
		甲方: ["XX科技有限公司", "XX网络技术有限公司", "XX软件开发有限公司", "XX信息技术服务公司"][index % 4],
		甲方联系人: `联系人${index + 1}`,
		甲方联系电话: `138${String(index).padStart(8, "0")}`,
		乙方: ["XX信息技术服务公司", "XX系统集成有限公司", "XX数据服务中心", "XX云端科技有限公司"][index % 4],
		乙方联系人: `联系人${index + 2}`,
		乙方联系电话: `139${String(index + 1).padStart(8, "0")}`,
		经办人: ["张三", "李四", "王五", "赵六", "钱七"][index % 5],
		经办电话: `137${String(index + 2).padStart(8, "0")}`,
		合同金额: `${(index + 1) * 10000}`,
		开始时间: `2023-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`,
		结束时间: `2024-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`,
		签订时间: `2023-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`,
		到期时间: `2024-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`,
		状态: ["即将到期", "已到期", "已延期"][index % 3],
		处理状态: String((处理状态Options as any)[index % (处理状态Options as any).length].value),
		到期处理类型: ["续签", "终止"][index % 2],
		处理人: ["张三", "李四", "王五", "赵六"][index % 4],
		说明: `说明信息${index + 1}`,
	}));

/** 生成35条业务受理假数据 */
export const allTableData: 业务受理_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => ({
		合同名称: `合同-${index + 1}`,
		合同编号: `HT${(Date.now() + index * 1000).toString(36).toUpperCase().substring(4)}`,
		合同类型: String((合同类型Options as any)[index % (合同类型Options as any).length].value),
		甲方: ["XX科技有限公司", "XX网络技术有限公司", "XX软件开发有限公司", "XX信息技术服务公司"][index % 4],
		乙方: ["XX信息技术服务公司", "XX系统集成有限公司", "XX数据服务中心", "XX云端科技有限公司"][index % 4],
		变更类型: ["合同金额", "服务期限", "服务内容", "付款方式", "合同主体"][index % 5],
		变更人: ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九"][index % 7],
		申请时间: `2024-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")} ${String(index % 24).padStart(2, "0")}:${String(index % 60).padStart(2, "0")}`,
		说明: [
			"因业务调整，修改服务内容",
			"更新付款周期",
			"调整服务期限",
			"新增功能模块",
			"修改验收标准",
			"优化合作条款",
			"补充技术附件",
		][index % 7],
		状态: String((审核类型Options as any)[index % (审核类型Options as any).length].value),
	}));
