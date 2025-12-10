/** 合同变更列表数据类型 */
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

/** 合同变更列表查询参数类型 */
export interface 合同类型_列表查询_VO {
	合同名称?: string;
	输入合同编号?: string;
	选择合同类型?: string;
}

/** 合同类型选项 */
export const 合同类型Options = [
	{ label: "采购合同", value: "采购合同" },
	{ label: "销售合同", value: "销售合同" },
	{ label: "服务合同", value: "服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
];

/** 变更类型选项 */
export const 变更类型Options = [
	{ label: "合同金额", value: "合同金额" },
	{ label: "服务期限", value: "服务期限" },
	{ label: "服务内容", value: "服务内容" },
	{ label: "付款方式", value: "付款方式" },
	{ label: "合同主体", value: "合同主体" },
];

/** 状态选项 */
export const 状态Options = [
	{ label: "待审核", value: "待审核" },
	{ label: "审核中", value: "审核中" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
	{ label: "已撤回", value: "已撤回" },
];

/** 生成随机日期 */
function generateRandomDate(startYear: number = 2023, endYear: number = 2024): string {
	const start = new Date(startYear, 0, 1);
	const end = new Date(endYear, 11, 31);
	const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	const year = randomDate.getFullYear();
	const month = String(randomDate.getMonth() + 1).padStart(2, "0");
	const day = String(randomDate.getDate()).padStart(2, "0");
	const hours = String(Math.floor(Math.random() * 24)).padStart(2, "0");
	const minutes = String(Math.floor(Math.random() * 60)).padStart(2, "0");
	return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/** 生成合同编号 */
function generateContractNumber(index: number): string {
	const prefixes = ["CG", "XS", "FW", "ZL"];
	const types = ["采购", "销售", "服务", "租赁"];
	const typeIndex = index % 4;
	const date = new Date();
	const year = date.getFullYear().toString().slice(2);
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const sequence = String(index + 1).padStart(4, "0");
	return `${prefixes[typeIndex]}${year}${month}${sequence}`;
}

/** 表格假数据 */
export const tableData: 业务受理_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => {
		const companyNames = [
			"华为技术有限公司",
			"腾讯科技(深圳)有限公司",
			"阿里巴巴(中国)有限公司",
			"百度(中国)有限公司",
			"京东集团股份有限公司",
			"网易(杭州)网络有限公司",
			"美团点评",
			"字节跳动科技有限公司",
			"小米科技有限责任公司",
			"OPPO广东移动通信有限公司",
			"vivo移动通信有限公司",
			"联想(北京)有限公司",
		];
		const contractorNames = [
			"中建三局集团有限公司",
			"中铁建设集团有限公司",
			"中交第一航务工程局有限公司",
			"中国建筑第八工程局有限公司",
			"上海建工集团股份有限公司",
			"北京建工集团有限责任公司",
			"中国水利水电建设集团",
			"中国铁建股份有限公司",
		];
		const changeReasons = [
			"因市场环境变化，调整合同金额以适应当前价格水平",
			"根据项目实际进展，延长服务期限确保项目质量",
			"应甲方要求，增加额外服务内容及技术支持",
			"优化付款方式，提高资金使用效率",
			"因业务重组，合同主体变更为集团子公司",
			"根据政策法规更新，调整合同相关条款",
			"为提升服务质量，增加专业技术人员配置",
			"因不可抗力因素，修改项目交付时间节点",
		];

		const contractTypeIndex = index % 4;
		const companyIndex = index % 12;
		const contractorIndex = index % 8;
		const changeTypeIndex = index % 5;
		const statusIndex = index % 5;
		const reasonIndex = index % 8;

		const contractNames = [
			"智能办公设备采购合同",
			"企业信息化系统开发合同",
			"物业管理服务合同",
			"办公场所租赁合同",
			"数据中心建设项目合同",
			"云服务平台建设合同",
			"网络安全服务合同",
			"设备维护保养合同",
		];

		return {
			合同名称: contractNames[contractTypeIndex],
			合同编号: generateContractNumber(index),
			合同类型: 合同类型Options[contractTypeIndex].value,
			甲方: companyNames[companyIndex],
			乙方: contractorNames[contractorIndex],
			变更类型: 变更类型Options[changeTypeIndex].value,
			变更人: ["张经理", "李总监", "王主管", "赵专员", "钱助理"][index % 5],
			申请时间: generateRandomDate(),
			说明: changeReasons[reasonIndex],
			状态: 状态Options[statusIndex].value,
		};
	});
