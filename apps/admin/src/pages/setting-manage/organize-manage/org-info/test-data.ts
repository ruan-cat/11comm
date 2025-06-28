import type { TreeNodeWithIcon } from "components/ReTreeLineIcon";

// ========== 组织管理业务类型定义 ==========

/** 组织类型枚举 */
export type OrganizationType = "company" | "department" | "group";

/** 组织树节点业务接口 - 扩展自TreeNodeWithIcon */
export interface OrganizationTreeNode extends TreeNodeWithIcon {
	/** 组织类型 */
	type: OrganizationType;
	/** 组织层级 */
	level?: number;
	/** 组织编码 */
	code?: string;
	/** 组织描述 */
	description?: string;
	/** 负责人ID */
	managerId?: string;
	/** 负责人姓名 */
	managerName?: string;
	/** 联系电话 */
	phone?: string;
	/** 是否启用 */
	enabled?: boolean;
	/** 创建时间 */
	createTime?: string;
	/** 更新时间 */
	updateTime?: string;
	/** 子组织节点 */
	children?: OrganizationTreeNode[];
}

/** 员工数据接口 */
export interface Employee {
	/** 员工ID */
	id: string;
	/** 员工姓名 */
	name: string;
	/** 手机号 */
	phone: string;
	/** 岗位 */
	position: string;
	/** 邮箱 */
	email: string;
	/** 地址 */
	address: string;
	/** 性别 */
	gender: "男" | "女";
	/** 所属组织ID */
	orgId: string;
	/** 所属组织名称 */
	orgName?: string;
	/** 员工编号 */
	employeeNumber?: string;
	/** 入职时间 */
	joinDate?: string;
	/** 员工状态 */
	status?: "active" | "inactive" | "leave";
}

// ========== 测试数据 ==========

/** 组织树测试数据 */
export const mockOrganizationTreeData: OrganizationTreeNode[] = [
	{
		id: "1",
		name: "中航物业集团",
		type: "company",
		icon: "ep:office-building",
		level: 1,
		code: "AVIC_PROPERTY",
		managerName: "张总",
		phone: "400-8888-0001",
		enabled: true,
		children: [
			{
				id: "1-1",
				name: "行政管理部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "AVIC_ADMIN",
				managerName: "李部长",
				phone: "010-8888-0101",
				enabled: true,
				children: [
					{
						id: "1-1-1",
						name: "人事科",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "AVIC_HR",
						managerName: "王科长",
						phone: "010-8888-0111",
						enabled: true,
						children: [],
					},
					{
						id: "1-1-2",
						name: "财务科",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "AVIC_FINANCE",
						managerName: "赵科长",
						phone: "010-8888-0112",
						enabled: true,
						children: [],
					},
				],
			},
			{
				id: "1-2",
				name: "物业服务部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "AVIC_SERVICE",
				managerName: "刘部长",
				phone: "010-8888-0102",
				enabled: true,
				children: [],
			},
			{
				id: "1-3",
				name: "工程维护部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "AVIC_ENGINEERING",
				managerName: "陈部长",
				phone: "010-8888-0103",
				enabled: true,
				children: [
					{
						id: "1-3-1",
						name: "电梯维护组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "AVIC_ELEVATOR",
						managerName: "杨组长",
						phone: "010-8888-0131",
						enabled: true,
						children: [],
					},
				],
			},
		],
	},
	{
		id: "2",
		name: "万科物业公司",
		type: "company",
		icon: "ep:office-building",
		level: 1,
		code: "VANKE_PROPERTY",
		managerName: "王总",
		phone: "400-8888-0002",
		enabled: true,
		children: [
			{
				id: "2-1",
				name: "客户服务部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "VANKE_SERVICE",
				managerName: "孙部长",
				phone: "020-8888-0201",
				enabled: true,
				children: [],
			},
			{
				id: "2-2",
				name: "保安部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "VANKE_SECURITY",
				managerName: "周部长",
				phone: "020-8888-0202",
				enabled: true,
				children: [
					{
						id: "2-2-1",
						name: "门岗班组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "VANKE_GATE",
						managerName: "吴班长",
						phone: "020-8888-0221",
						enabled: true,
						children: [],
					},
					{
						id: "2-2-2",
						name: "巡逻班组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "VANKE_PATROL",
						managerName: "胡班长",
						phone: "020-8888-0222",
						enabled: true,
						children: [],
					},
				],
			},
		],
	},
	{
		id: "3",
		name: "绿城物业服务",
		type: "company",
		icon: "ep:office-building",
		level: 1,
		code: "GREENTOWN_PROPERTY",
		managerName: "马总",
		phone: "400-8888-0003",
		enabled: true,
		children: [
			{
				id: "3-1",
				name: "营销策划部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "GREENTOWN_MARKETING",
				managerName: "徐部长",
				phone: "0571-8888-0301",
				enabled: true,
				children: [],
			},
			{
				id: "3-2",
				name: "运营管理部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "GREENTOWN_OPERATION",
				managerName: "朱部长",
				phone: "0571-8888-0302",
				enabled: true,
				children: [
					{
						id: "3-2-1",
						name: "质量监督组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "GREENTOWN_QA",
						managerName: "林组长",
						phone: "0571-8888-0321",
						enabled: true,
						children: [],
					},
				],
			},
			{
				id: "3-3",
				name: "清洁服务部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "GREENTOWN_CLEANING",
				managerName: "高部长",
				phone: "0571-8888-0303",
				enabled: true,
				children: [],
			},
			{
				id: "3-4",
				name: "绿化养护部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "GREENTOWN_LANDSCAPE",
				managerName: "何部长",
				phone: "0571-8888-0304",
				enabled: true,
				children: [],
			},
		],
	},
	{
		id: "4",
		name: "保利物业管理",
		type: "company",
		icon: "ep:office-building",
		level: 1,
		code: "POLY_PROPERTY",
		managerName: "郑总",
		phone: "400-8888-0004",
		enabled: true,
		children: [
			{
				id: "4-1",
				name: "项目管理部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "POLY_PROJECT",
				managerName: "韩部长",
				phone: "020-8888-0401",
				enabled: true,
				children: [
					{
						id: "4-1-1",
						name: "住宅项目组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "POLY_RESIDENTIAL",
						managerName: "冯组长",
						phone: "020-8888-0411",
						enabled: true,
						children: [],
					},
					{
						id: "4-1-2",
						name: "商业项目组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "POLY_COMMERCIAL",
						managerName: "邓组长",
						phone: "020-8888-0412",
						enabled: true,
						children: [],
					},
				],
			},
			{
				id: "4-2",
				name: "技术服务部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "POLY_TECH",
				managerName: "曾部长",
				phone: "020-8888-0402",
				enabled: true,
				children: [],
			},
			{
				id: "4-3",
				name: "设备管理部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "POLY_EQUIPMENT",
				managerName: "彭部长",
				phone: "020-8888-0403",
				enabled: true,
				children: [
					{
						id: "4-3-1",
						name: "空调维护组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "POLY_HVAC",
						managerName: "吕组长",
						phone: "020-8888-0431",
						enabled: true,
						children: [],
					},
					{
						id: "4-3-2",
						name: "消防设备组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "POLY_FIRE",
						managerName: "卢组长",
						phone: "020-8888-0432",
						enabled: true,
						children: [],
					},
				],
			},
			{
				id: "4-4",
				name: "环境管理部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "POLY_ENV",
				managerName: "丁部长",
				phone: "020-8888-0404",
				enabled: true,
				children: [],
			},
			{
				id: "4-5",
				name: "安全监管部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "POLY_SAFETY",
				managerName: "薛部长",
				phone: "020-8888-0405",
				enabled: true,
				children: [],
			},
		],
	},
	{
		id: "5",
		name: "碧桂园物业",
		type: "company",
		icon: "ep:office-building",
		level: 1,
		code: "COUNTRY_GARDEN",
		managerName: "杨总",
		phone: "400-8888-0005",
		enabled: true,
		children: [
			{
				id: "5-1",
				name: "综合管理部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "CG_GENERAL",
				managerName: "袁部长",
				phone: "0757-8888-0501",
				enabled: true,
				children: [
					{
						id: "5-1-1",
						name: "行政办公室",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "CG_OFFICE",
						managerName: "侯主任",
						phone: "0757-8888-0511",
						enabled: true,
						children: [],
					},
				],
			},
			{
				id: "5-2",
				name: "客户关系部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "CG_CUSTOMER",
				managerName: "江部长",
				phone: "0757-8888-0502",
				enabled: true,
				children: [],
			},
			{
				id: "5-3",
				name: "工程技术部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "CG_ENGINEERING",
				managerName: "顾部长",
				phone: "0757-8888-0503",
				enabled: true,
				children: [
					{
						id: "5-3-1",
						name: "机电维修组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "CG_MECHANICAL",
						managerName: "康组长",
						phone: "0757-8888-0531",
						enabled: true,
						children: [],
					},
				],
			},
		],
	},
	{
		id: "6",
		name: "中海物业集团",
		type: "company",
		icon: "ep:office-building",
		level: 1,
		code: "CHINA_OVERSEAS",
		managerName: "范总",
		phone: "400-8888-0006",
		enabled: true,
		children: [
			{
				id: "6-1",
				name: "运营支持部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "CO_OPERATION",
				managerName: "雷部长",
				phone: "0755-8888-0601",
				enabled: true,
				children: [],
			},
			{
				id: "6-2",
				name: "品质管理部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "CO_QUALITY",
				managerName: "方部长",
				phone: "0755-8888-0602",
				enabled: true,
				children: [
					{
						id: "6-2-1",
						name: "质量检查组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "CO_QC",
						managerName: "任组长",
						phone: "0755-8888-0621",
						enabled: true,
						children: [],
					},
					{
						id: "6-2-2",
						name: "服务监督组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "CO_SUPERVISION",
						managerName: "魏组长",
						phone: "0755-8888-0622",
						enabled: true,
						children: [],
					},
				],
			},
			{
				id: "6-3",
				name: "设施管理部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "CO_FACILITY",
				managerName: "夏部长",
				phone: "0755-8888-0603",
				enabled: true,
				children: [],
			},
		],
	},
	{
		id: "7",
		name: "招商物业服务",
		type: "company",
		icon: "ep:office-building",
		level: 1,
		code: "CHINA_MERCHANTS",
		managerName: "蒋总",
		phone: "400-8888-0007",
		enabled: true,
		children: [
			{
				id: "7-1",
				name: "业务拓展部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "CM_BUSINESS",
				managerName: "沈部长",
				phone: "0755-8888-0701",
				enabled: true,
				children: [
					{
						id: "7-1-1",
						name: "市场开发组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "CM_MARKET",
						managerName: "汪组长",
						phone: "0755-8888-0711",
						enabled: true,
						children: [],
					},
				],
			},
			{
				id: "7-2",
				name: "综合服务部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "CM_SERVICE",
				managerName: "祝部长",
				phone: "0755-8888-0702",
				enabled: true,
				children: [],
			},
			{
				id: "7-3",
				name: "物业管理部",
				type: "department",
				icon: "ep:add-location",
				level: 2,
				code: "CM_PROPERTY",
				managerName: "闫部长",
				phone: "0755-8888-0703",
				enabled: true,
				children: [
					{
						id: "7-3-1",
						name: "保洁服务组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "CM_CLEANING",
						managerName: "乔组长",
						phone: "0755-8888-0731",
						enabled: true,
						children: [],
					},
					{
						id: "7-3-2",
						name: "维修保养组",
						type: "group",
						icon: "ep:user-filled",
						level: 3,
						code: "CM_MAINTENANCE",
						managerName: "尹组长",
						phone: "0755-8888-0732",
						enabled: true,
						children: [],
					},
				],
			},
		],
	},
];

/** 员工测试数据 */
export const mockEmployeeData: Employee[] = [
	// 中航物业集团员工
	{
		id: "emp-001",
		name: "张明华",
		phone: "13800138001",
		position: "总经理",
		email: "zhangminghua@avic.com",
		address: "北京市朝阳区建国路88号",
		gender: "男",
		orgId: "1",
		orgName: "中航物业集团",
		employeeNumber: "AVIC001",
		joinDate: "2020-03-15",
		status: "active",
	},
	{
		id: "emp-002",
		name: "李梅",
		phone: "13800138002",
		position: "人事主管",
		email: "limei@avic.com",
		address: "北京市海淀区中关村大街123号",
		gender: "女",
		orgId: "1-1-1",
		orgName: "人事科",
		employeeNumber: "AVIC002",
		joinDate: "2021-05-20",
		status: "active",
	},
	{
		id: "emp-003",
		name: "王强",
		phone: "13800138003",
		position: "财务经理",
		email: "wangqiang@avic.com",
		address: "北京市西城区金融街25号",
		gender: "男",
		orgId: "1-1-2",
		orgName: "财务科",
		employeeNumber: "AVIC003",
		joinDate: "2019-08-10",
		status: "active",
	},
	{
		id: "emp-004",
		name: "赵丽娟",
		phone: "13800138004",
		position: "客服专员",
		email: "zhaolijuan@avic.com",
		address: "北京市东城区王府井大街168号",
		gender: "女",
		orgId: "1-2",
		orgName: "物业服务部",
		employeeNumber: "AVIC004",
		joinDate: "2022-01-15",
		status: "active",
	},
	{
		id: "emp-005",
		name: "陈建国",
		phone: "13800138005",
		position: "工程师",
		email: "chenjianguo@avic.com",
		address: "北京市丰台区丽泽金融街5号",
		gender: "男",
		orgId: "1-3-1",
		orgName: "电梯维护组",
		employeeNumber: "AVIC005",
		joinDate: "2020-11-08",
		status: "active",
	},

	// 万科物业公司员工
	{
		id: "emp-006",
		name: "孙雨欣",
		phone: "13800138006",
		position: "客服经理",
		email: "sunyuxin@vanke.com",
		address: "广州市天河区珠江新城花城大道38号",
		gender: "女",
		orgId: "2-1",
		orgName: "客户服务部",
		employeeNumber: "VK001",
		joinDate: "2021-03-10",
		status: "active",
	},
	{
		id: "emp-007",
		name: "周志强",
		phone: "13800138007",
		position: "保安队长",
		email: "zhouzhiqiang@vanke.com",
		address: "广州市越秀区东风中路123号",
		gender: "男",
		orgId: "2-2",
		orgName: "保安部",
		employeeNumber: "VK002",
		joinDate: "2019-12-01",
		status: "active",
	},
	{
		id: "emp-008",
		name: "吴军",
		phone: "13800138008",
		position: "门岗班长",
		email: "wujun@vanke.com",
		address: "广州市荔湾区沙面大街56号",
		gender: "男",
		orgId: "2-2-1",
		orgName: "门岗班组",
		employeeNumber: "VK003",
		joinDate: "2020-07-15",
		status: "active",
	},
	{
		id: "emp-009",
		name: "胡海燕",
		phone: "13800138009",
		position: "巡逻队员",
		email: "huhaiyan@vanke.com",
		address: "广州市白云区机场路88号",
		gender: "女",
		orgId: "2-2-2",
		orgName: "巡逻班组",
		employeeNumber: "VK004",
		joinDate: "2021-09-20",
		status: "active",
	},

	// 绿城物业服务员工
	{
		id: "emp-010",
		name: "徐文博",
		phone: "13800138010",
		position: "策划主管",
		email: "xuwenbo@greentown.com",
		address: "杭州市西湖区文三路123号",
		gender: "男",
		orgId: "3-1",
		orgName: "营销策划部",
		employeeNumber: "GT001",
		joinDate: "2020-04-18",
		status: "active",
	},
	{
		id: "emp-011",
		name: "朱小红",
		phone: "13800138011",
		position: "运营经理",
		email: "zhuxiaohong@greentown.com",
		address: "杭州市上城区延安路456号",
		gender: "女",
		orgId: "3-2",
		orgName: "运营管理部",
		employeeNumber: "GT002",
		joinDate: "2019-11-25",
		status: "active",
	},
	{
		id: "emp-012",
		name: "林志华",
		phone: "13800138012",
		position: "质检员",
		email: "linzhihua@greentown.com",
		address: "杭州市下城区体育场路789号",
		gender: "男",
		orgId: "3-2-1",
		orgName: "质量监督组",
		employeeNumber: "GT003",
		joinDate: "2021-06-12",
		status: "active",
	},
	{
		id: "emp-013",
		name: "高莉",
		phone: "13800138013",
		position: "清洁主管",
		email: "gaoli@greentown.com",
		address: "杭州市江干区钱江路101号",
		gender: "女",
		orgId: "3-3",
		orgName: "清洁服务部",
		employeeNumber: "GT004",
		joinDate: "2020-08-30",
		status: "active",
	},
	{
		id: "emp-014",
		name: "何建军",
		phone: "13800138014",
		position: "绿化工程师",
		email: "hejianjun@greentown.com",
		address: "杭州市拱墅区莫干山路202号",
		gender: "男",
		orgId: "3-4",
		orgName: "绿化养护部",
		employeeNumber: "GT005",
		joinDate: "2018-12-05",
		status: "active",
	},

	// 保利物业管理员工
	{
		id: "emp-015",
		name: "韩雪峰",
		phone: "13800138015",
		position: "项目经理",
		email: "hanxuefeng@poly.com",
		address: "广州市海珠区新港中路303号",
		gender: "男",
		orgId: "4-1",
		orgName: "项目管理部",
		employeeNumber: "POLY001",
		joinDate: "2019-05-18",
		status: "active",
	},
	{
		id: "emp-016",
		name: "冯丽萍",
		phone: "13800138016",
		position: "项目助理",
		email: "fengliping@poly.com",
		address: "广州市番禺区大学城外环路404号",
		gender: "女",
		orgId: "4-1-1",
		orgName: "住宅项目组",
		employeeNumber: "POLY002",
		joinDate: "2020-10-12",
		status: "active",
	},
	{
		id: "emp-017",
		name: "邓伟华",
		phone: "13800138017",
		position: "商务专员",
		email: "dengweihua@poly.com",
		address: "广州市黄埔区科学大道505号",
		gender: "男",
		orgId: "4-1-2",
		orgName: "商业项目组",
		employeeNumber: "POLY003",
		joinDate: "2021-02-28",
		status: "active",
	},
	{
		id: "emp-018",
		name: "曾国强",
		phone: "13800138018",
		position: "技术总监",
		email: "zengguoqiang@poly.com",
		address: "广州市南沙区港前大道606号",
		gender: "男",
		orgId: "4-2",
		orgName: "技术服务部",
		employeeNumber: "POLY004",
		joinDate: "2018-08-15",
		status: "active",
	},
	{
		id: "emp-019",
		name: "彭小兰",
		phone: "13800138019",
		position: "设备管理员",
		email: "pengxiaolan@poly.com",
		address: "广州市花都区新华街道707号",
		gender: "女",
		orgId: "4-3",
		orgName: "设备管理部",
		employeeNumber: "POLY005",
		joinDate: "2020-01-20",
		status: "active",
	},
	{
		id: "emp-020",
		name: "吕刚",
		phone: "13800138020",
		position: "空调技师",
		email: "lvgang@poly.com",
		address: "广州市从化区温泉大道808号",
		gender: "男",
		orgId: "4-3-1",
		orgName: "空调维护组",
		employeeNumber: "POLY006",
		joinDate: "2019-06-10",
		status: "active",
	},
	{
		id: "emp-021",
		name: "卢晓明",
		phone: "13800138021",
		position: "消防工程师",
		email: "luxiaoming@poly.com",
		address: "广州市增城区荔城街道909号",
		gender: "男",
		orgId: "4-3-2",
		orgName: "消防设备组",
		employeeNumber: "POLY007",
		joinDate: "2020-03-25",
		status: "active",
	},

	// 碧桂园物业员工
	{
		id: "emp-022",
		name: "袁翠花",
		phone: "13800138022",
		position: "综合管理员",
		email: "yuancuihua@countrygarden.com",
		address: "佛山市顺德区大良街道111号",
		gender: "女",
		orgId: "5-1",
		orgName: "综合管理部",
		employeeNumber: "CG001",
		joinDate: "2021-01-15",
		status: "active",
	},
	{
		id: "emp-023",
		name: "侯建设",
		phone: "13800138023",
		position: "行政主任",
		email: "houjianshe@countrygarden.com",
		address: "佛山市禅城区祖庙路222号",
		gender: "男",
		orgId: "5-1-1",
		orgName: "行政办公室",
		employeeNumber: "CG002",
		joinDate: "2018-11-08",
		status: "active",
	},
	{
		id: "emp-024",
		name: "江梅芳",
		phone: "13800138024",
		position: "客户关系专员",
		email: "jiangmeifang@countrygarden.com",
		address: "佛山市南海区桂城街道333号",
		gender: "女",
		orgId: "5-2",
		orgName: "客户关系部",
		employeeNumber: "CG003",
		joinDate: "2020-09-12",
		status: "active",
	},
	{
		id: "emp-025",
		name: "顾建华",
		phone: "13800138025",
		position: "工程部长",
		email: "gujianhua@countrygarden.com",
		address: "佛山市三水区西南街道444号",
		gender: "男",
		orgId: "5-3",
		orgName: "工程技术部",
		employeeNumber: "CG004",
		joinDate: "2017-07-20",
		status: "active",
	},
	{
		id: "emp-026",
		name: "康小军",
		phone: "13800138026",
		position: "机电工",
		email: "kangxiaojun@countrygarden.com",
		address: "佛山市高明区荷城街道555号",
		gender: "男",
		orgId: "5-3-1",
		orgName: "机电维修组",
		employeeNumber: "CG005",
		joinDate: "2019-04-03",
		status: "active",
	},

	// 中海物业集团员工
	{
		id: "emp-027",
		name: "雷志斌",
		phone: "13800138027",
		position: "运营经理",
		email: "leizhibin@chinaoverseas.com",
		address: "深圳市福田区中心四路666号",
		gender: "男",
		orgId: "6-1",
		orgName: "运营支持部",
		employeeNumber: "CO001",
		joinDate: "2020-02-18",
		status: "active",
	},
	{
		id: "emp-028",
		name: "方玉华",
		phone: "13800138028",
		position: "品质部长",
		email: "fangyuhua@chinaoverseas.com",
		address: "深圳市南山区科技园北区777号",
		gender: "女",
		orgId: "6-2",
		orgName: "品质管理部",
		employeeNumber: "CO002",
		joinDate: "2018-10-25",
		status: "active",
	},
	{
		id: "emp-029",
		name: "任建东",
		phone: "13800138029",
		position: "质检专员",
		email: "renjiandong@chinaoverseas.com",
		address: "深圳市宝安区中心区888号",
		gender: "男",
		orgId: "6-2-1",
		orgName: "质量检查组",
		employeeNumber: "CO003",
		joinDate: "2021-07-12",
		status: "active",
	},
];

// ========== 业务工具函数 ==========

/**
 * 根据组织类型获取默认图标
 */
export function getOrgTypeIcon(type: OrganizationType): string {
	const iconMap: Record<OrganizationType, string> = {
		company: "ep:office-building",
		department: "ep:add-location",
		group: "ep:user-filled",
	};
	return iconMap[type];
}

/**
 * 获取组织的全路径名称
 */
export function getOrgFullPath(orgId: string, data: OrganizationTreeNode[]): string {
	const path: string[] = [];

	function findPath(nodes: OrganizationTreeNode[], targetId: string): boolean {
		for (const node of nodes) {
			path.push(node.name);
			if (node.id === targetId) {
				return true;
			}
			if (node.children && findPath(node.children, targetId)) {
				return true;
			}
			path.pop();
		}
		return false;
	}

	findPath(data, orgId);
	return path.join(" / ");
}

/**
 * 根据组织ID获取该组织下的所有员工
 */
export function getEmployeesByOrgId(orgId: string, includeSubOrgs = true): Employee[] {
	if (!includeSubOrgs) {
		return mockEmployeeData.filter((emp) => emp.orgId === orgId);
	}

	// 获取组织及其所有子组织的ID
	const orgIds = new Set<string>();

	function collectOrgIds(nodes: OrganizationTreeNode[], targetId: string): boolean {
		for (const node of nodes) {
			if (node.id === targetId) {
				// 找到目标组织，收集它及其所有子组织的ID
				function addOrgAndChildren(org: OrganizationTreeNode) {
					orgIds.add(org.id);
					if (org.children) {
						org.children.forEach(addOrgAndChildren);
					}
				}
				addOrgAndChildren(node);
				return true;
			}
			if (node.children && collectOrgIds(node.children, targetId)) {
				return true;
			}
		}
		return false;
	}

	collectOrgIds(mockOrganizationTreeData, orgId);
	return mockEmployeeData.filter((emp) => orgIds.has(emp.orgId));
}
