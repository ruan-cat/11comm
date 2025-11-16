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

/** 表格假数据 */
export const tableData: 业务受理_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => ({
		合同名称: `合同-${String(index + 1).padStart(3, "0")}`,
		合同编号: `HT-${Date.now().toString(36).toUpperCase().substring(4)}-${index + 1}`,
		合同类型: ["采购合同", "销售合同", "服务合同", "租赁合同"][index % 4],
		甲方: ["XX科技有限公司", "XX网络技术有限公司", "XX软件开发有限公司"][index % 3],
		乙方: ["XX信息技术服务公司", "XX系统集成有限公司", "XX数据服务中心"][index % 3],
		变更类型: ["合同金额", "服务期限", "服务内容", "付款方式", "合同主体"][index % 5],
		变更人: ["张三", "李四", "王五", "赵六", "钱七"][index % 5],
		申请时间: `2023-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")} ${String(index % 24).padStart(2, "0")}:${String(index % 60).padStart(2, "0")}`,
		说明: ["因业务调整，修改服务内容", "更新付款周期", "调整服务期限", "新增功能模块", "修改验收标准"][index % 5],
		状态: ["待审核", "审核中", "已通过", "已拒绝", "已撤回"][index % 5],
	}));
