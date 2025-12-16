import type { OrganizationTreeNode, Employee } from "@01s-11comm/type";

/**
 * 模拟组织树数据
 */
export const mockOrganizationTreeData: OrganizationTreeNode[] = [
	{
		id: "1",
		name: "总公司",
		icon: "mdi:domain",
		children: [
			{
				id: "2",
				name: "物业部",
				parentId: "1",
				icon: "mdi:account-hard-hat",
				children: [
					{
						id: "2-1",
						name: "客服中心",
						parentId: "2",
						icon: "mdi:face-agent",
					},
					{
						id: "2-2",
						name: "工程部",
						parentId: "2",
						icon: "mdi:hammer-wrench",
					},
					{
						id: "2-3",
						name: "安保部",
						parentId: "2",
						icon: "mdi:shield-account",
					},
				],
			},
			{
				id: "3",
				name: "运营部",
				parentId: "1",
				icon: "mdi:chart-line",
				children: [
					{
						id: "3-1",
						name: "市场部",
						parentId: "3",
						icon: "mdi:storefront",
					},
					{
						id: "3-2",
						name: "财务部",
						parentId: "3",
						icon: "mdi:finance",
					},
				],
			},
			{
				id: "4",
				name: "行政部",
				parentId: "1",
				icon: "mdi:account-group",
			},
		],
	},
];

/**
 * 模拟员工数据
 */
export const mockEmployeeData: Employee[] = [
	{
		id: "101",
		name: "张三",
		phone: "13800138001",
		position: "物业经理",
		email: "zhangsan@example.com",
		address: "北京市朝阳区",
		gender: "男",
		orgId: "2",
	},
	{
		id: "102",
		name: "李四",
		phone: "13800138002",
		position: "客服主管",
		email: "lisi@example.com",
		address: "北京市海淀区",
		gender: "女",
		orgId: "2-1",
	},
	{
		id: "103",
		name: "王五",
		phone: "13800138003",
		position: "维修工",
		email: "wangwu@example.com",
		address: "北京市丰台区",
		gender: "男",
		orgId: "2-2",
	},
	{
		id: "104",
		name: "赵六",
		phone: "13800138004",
		position: "保安队长",
		email: "zhaoliu@example.com",
		address: "北京市昌平区",
		gender: "男",
		orgId: "2-3",
	},
	{
		id: "105",
		name: "钱七",
		phone: "13800138005",
		position: "市场专员",
		email: "qianqi@example.com",
		address: "北京市大兴区",
		gender: "女",
		orgId: "3-1",
	},
	{
		id: "106",
		name: "孙八",
		phone: "13800138006",
		position: "会计",
		email: "sunba@example.com",
		address: "北京市通州区",
		gender: "女",
		orgId: "3-2",
	},
	{
		id: "107",
		name: "周九",
		phone: "13800138007",
		position: "行政助理",
		email: "zhoujiu@example.com",
		address: "北京市房山区",
		gender: "女",
		orgId: "4",
	},
];
