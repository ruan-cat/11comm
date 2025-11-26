import type { OptionsType } from "plus-pro-components";
import type { 合同类型, 到期处理类型 } from "./components/form";

/** 到期合同_列表数据 */
export interface 到期合同_列表数据 {
	合同名称: string;
	合同编号: string;
	合同类型: 合同类型;
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
	到期处理类型?: 到期处理类型;
	处理人?: string;
	说明?: string;
	处理时间?: string;
	备注?: string;
}

/** 到期合同_列表查询_VO */
export interface 到期合同_列表查询_VO {
	合同名称?: string;
	合同编号?: string;
	合同类型?: string;
	处理状态?: string;
}

/** 处理状态选项 */
export const 处理状态Options: OptionsType = [
	{ label: "未处理", value: "未处理" },
	{ label: "处理中", value: "处理中" },
	{ label: "已续签", value: "已续签" },
	{ label: "已终止", value: "已终止" },
	{ label: "已延期", value: "已延期" },
];

/** 合同类型选项 */
export const 合同类型Options: OptionsType = [
	{ label: "采购合同", value: "采购合同" },
	{ label: "销售合同", value: "销售合同" },
	{ label: "服务合同", value: "服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "劳务合同", value: "劳务合同" },
	{ label: "技术合同", value: "技术合同" },
];

/** 生成35条到期合同假数据 */
const 公司名称 = [
	"北京智慧科技有限公司",
	"上海云端网络技术有限公司",
	"深圳数据服务股份有限公司",
	"广州人工智能科技有限公司",
	"杭州区块链技术有限公司",
	"成都物联网服务有限公司",
	"武汉智能制造有限公司",
	"西安软件开发股份公司",
	"南京系统集成有限公司",
	"重庆大数据处理中心",
];

const 合同名称前缀 = [
	"智慧社区系统采购",
	"物业管理平台开发",
	"安防监控系统维护",
	"智能家居设备采购",
	"数据中心建设服务",
	"云计算平台租赁",
	"移动应用开发服务",
	"网络基础设施维护",
	"信息化系统集成",
	"技术咨询服务合同",
];

export const tableData: 到期合同_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => {
		const 基准时间 = Date.now() - (30 - index) * 24 * 60 * 60 * 1000; // 从30天前到今天
		const 随机天数 = Math.floor(Math.random() * 365) + 1;
		const 开始日期 = new Date(基准时间 - 随机天数 * 24 * 60 * 60 * 1000);
		const 结束日期 = new Date(基准时间 + 随机天数 * 24 * 60 * 60 * 1000);
		const 签订日期 = new Date(开始日期.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);

		return {
			合同名称: `${合同名称前缀[index % 合同名称前缀.length]}${index + 1}期`,
			合同编号: `HT${String(2024000 + index + 1)}${String.fromCharCode(65 + (index % 26))}`,
			合同类型: (合同类型Options[index % 合同类型Options.length].value) as 合同类型,
			甲方: 公司名称[index % 公司名称.length],
			甲方联系人: ["李经理", "王总监", "张主任", "陈主管", "赵部长"][index % 5],
			甲方联系电话: `1${3 + Math.floor(Math.random() * 7)}${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
			乙方: 公司名称[(index + 3) % 公司名称.length],
			乙方联系人: ["刘经理", "孙总监", "周主任", "吴主管", "郑部长"][index % 5],
			乙方联系电话: `1${3 + Math.floor(Math.random() * 7)}${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
			经办人: ["张明", "李华", "王强", "刘洋", "陈红", "杨军", "赵丽", "黄伟"][index % 8],
			经办电话: `1${3 + Math.floor(Math.random() * 7)}${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
			合同金额: `${(Math.floor(Math.random() * 100) + 1) * 10000}.${String(Math.floor(Math.random() * 100)).padStart(2, "0")}`,
			开始时间: 开始日期.toISOString().split('T')[0] + ' 09:00:00',
			结束时间: 结束日期.toISOString().split('T')[0] + ' 18:00:00',
			签订时间: 签订日期.toISOString().split('T')[0] + ' 14:30:00',
			到期时间: 结束日期.toISOString().split('T')[0] + ' 23:59:59',
			状态: ["即将到期", "已到期", "已延期"][index % 3],
			处理状态: (处理状态Options[index % 处理状态Options.length].value) as string,
			到期处理类型: index % 5 === 0 ? undefined : (index % 2 === 0 ? "续签" : "终止") as 到期处理类型,
			处理人: index % 3 === 0 ? undefined : ["张明", "李华", "王强", "刘洋", "陈红"][index % 5],
			说明: index % 4 === 0 ? undefined : `${["经双方协商一致", "根据合同条款", "按实际履行情况", "综合考虑业务需求"][index % 4]}，${["建议续签", "需要终止", "重新谈判", "延期处理"][index % 4]}相关合同条款。`,
			处理时间: index % 3 === 0 ? undefined : new Date(基准时间 + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 16:00:00',
			备注: index % 6 === 0 ? undefined : `合同编号${index + 1}的补充说明信息，包含${["付款方式", "交付要求", "质量标准", "违约责任"][index % 4]}等详细条款。`,
		};
	});
