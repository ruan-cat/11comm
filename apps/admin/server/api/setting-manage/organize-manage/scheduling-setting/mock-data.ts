import type { SchedulingSetting } from "@01s-11comm/type";

/**
 * 模拟排班设置数据
 */
export const mockSchedulingSettingData: SchedulingSetting[] = [
	{
		id: "1",
		name: "客服中心排班",
		type: "固定排班",
		cycle: "每周",
		effectiveTime: "2024-01-01 00:00:00",
		staff: "张三、李四",
		status: "启用",
		createTime: "2024-01-01 00:00:00",
	},
	{
		id: "2",
		name: "安保部门排班",
		type: "轮班排班",
		cycle: "每天",
		effectiveTime: "2024-01-01 00:00:00",
		staff: "王五、赵六",
		status: "启用",
		createTime: "2024-01-02 00:00:00",
	},
	{
		id: "3",
		name: "工程部排班",
		type: "自由排班",
		cycle: "每月",
		effectiveTime: "2024-01-01 00:00:00",
		staff: "钱七、孙八",
		status: "禁用",
		createTime: "2024-01-03 00:00:00",
	},
	{
		id: "4",
		name: "保洁部排班",
		type: "固定排班",
		cycle: "每周",
		effectiveTime: "2024-01-01 00:00:00",
		staff: "周九、吴十",
		status: "启用",
		createTime: "2024-01-04 00:00:00",
	},
];
