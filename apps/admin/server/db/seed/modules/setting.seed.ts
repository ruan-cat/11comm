import {
	smOrganizations,
	smRoles,
	smStaff,
	smPermissions,
	smRolePermissions,
	smStaffRoles,
	smDataPermissions,
	smShifts,
	smSchedulingSettings,
	smWorkingSchedules,
	smSystemConfigs,
	smRegisterProtocols,
	smInitializeCells,
	smChangePasswordRecords,
	smCommunityConfigurations,
} from "@01s-11comm/type";
import { defineSeed, sid, rows } from "../helpers";

export default defineSeed({
	name: "setting",
	dependencies: ["community"],
	async seed(db) {
		// ── Organizations (tree) ──
		await db.insert(smOrganizations).values(
			rows([
				{ id: sid("org", "hq"), orgName: "总公司", orgCode: "HQ", orgType: "department", parentId: null },
				{
					id: sid("org", "property"),
					orgName: "物业部",
					orgCode: "PROP",
					orgType: "department",
					parentId: sid("org", "hq"),
				},
				{
					id: sid("org", "customer-service"),
					orgName: "客服中心",
					orgCode: "CS",
					orgType: "department",
					parentId: sid("org", "property"),
				},
				{
					id: sid("org", "engineering"),
					orgName: "工程部",
					orgCode: "ENG",
					orgType: "department",
					parentId: sid("org", "property"),
				},
				{
					id: sid("org", "operations"),
					orgName: "运营部",
					orgCode: "OPS",
					orgType: "department",
					parentId: sid("org", "hq"),
				},
			]),
		);

		// ── Roles ──
		await db.insert(smRoles).values(
			rows([
				{
					id: sid("role", "admin"),
					roleName: "系统管理员",
					code: "ADMIN",
					description: "拥有系统全部权限",
					isEnabled: true,
				},
				{
					id: sid("role", "manager"),
					roleName: "物业经理",
					code: "PROPERTY_MANAGER",
					description: "物业管理核心角色",
					isEnabled: true,
				},
				{ id: sid("role", "staff"), roleName: "普通员工", code: "STAFF", description: "基础操作权限", isEnabled: true },
			]),
		);

		// ── Staff ──
		await db.insert(smStaff).values(
			rows([
				{
					id: sid("staff", "zhangsan"),
					employeeNumber: "EMP001",
					name: "张三",
					gender: "male",
					position: "物业经理",
					phone: "13800000001",
					email: "zhangsan@example.com",
					homeAddress: "北京市朝阳区",
					orgId: sid("org", "property"),
				},
				{
					id: sid("staff", "lisi"),
					employeeNumber: "EMP002",
					name: "李四",
					gender: "female",
					position: "客服主管",
					phone: "13800000002",
					email: "lisi@example.com",
					homeAddress: "北京市海淀区",
					orgId: sid("org", "customer-service"),
				},
				{
					id: sid("staff", "wangwu"),
					employeeNumber: "EMP003",
					name: "王五",
					gender: "male",
					position: "维修工",
					phone: "13800000003",
					email: "wangwu@example.com",
					homeAddress: "北京市丰台区",
					orgId: sid("org", "engineering"),
				},
				{
					id: sid("staff", "zhaoliu"),
					employeeNumber: "EMP004",
					name: "赵六",
					gender: "male",
					position: "安保队长",
					phone: "13800000004",
					email: "zhaoliu@example.com",
					homeAddress: "北京市西城区",
					orgId: sid("org", "property"),
				},
				{
					id: sid("staff", "qianqi"),
					employeeNumber: "EMP005",
					name: "钱七",
					gender: "female",
					position: "市场专员",
					phone: "13800000005",
					email: "qianqi@example.com",
					homeAddress: "北京市东城区",
					orgId: sid("org", "operations"),
				},
			]),
		);

		// ── Permissions ──
		const permIds = {
			system: sid("perm", "system-manage"),
			user: sid("perm", "user-manage"),
			role: sid("perm", "role-manage"),
			community: sid("perm", "community-manage"),
			property: sid("perm", "property-manage"),
		};

		await db.insert(smPermissions).values(
			rows([
				{
					id: permIds.system,
					permissionName: "系统管理",
					permissionCode: "system:manage",
					resourcePath: "/setting/system",
				},
				{ id: permIds.user, permissionName: "用户管理", permissionCode: "user:manage", resourcePath: "/setting/user" },
				{ id: permIds.role, permissionName: "角色管理", permissionCode: "role:manage", resourcePath: "/setting/role" },
				{
					id: permIds.community,
					permissionName: "小区管理",
					permissionCode: "community:manage",
					resourcePath: "/community",
				},
				{
					id: permIds.property,
					permissionName: "物业管理",
					permissionCode: "property:manage",
					resourcePath: "/house-property",
				},
			]),
		);

		// ── Role-Permissions ── admin→all 5, manager→3, staff→1
		await db.insert(smRolePermissions).values(
			rows([
				{ id: sid("rp", "admin-system"), roleId: sid("role", "admin"), permissionId: permIds.system },
				{ id: sid("rp", "admin-user"), roleId: sid("role", "admin"), permissionId: permIds.user },
				{ id: sid("rp", "admin-role"), roleId: sid("role", "admin"), permissionId: permIds.role },
				{ id: sid("rp", "admin-community"), roleId: sid("role", "admin"), permissionId: permIds.community },
				{ id: sid("rp", "admin-property"), roleId: sid("role", "admin"), permissionId: permIds.property },
				{ id: sid("rp", "manager-community"), roleId: sid("role", "manager"), permissionId: permIds.community },
				{ id: sid("rp", "manager-property"), roleId: sid("role", "manager"), permissionId: permIds.property },
				{ id: sid("rp", "manager-user"), roleId: sid("role", "manager"), permissionId: permIds.user },
				{ id: sid("rp", "staff-community"), roleId: sid("role", "staff"), permissionId: permIds.community },
			]),
		);

		// ── Staff-Roles ──
		await db.insert(smStaffRoles).values(
			rows([
				{ id: sid("sr", "zhangsan-admin"), staffId: sid("staff", "zhangsan"), roleId: sid("role", "admin") },
				{ id: sid("sr", "lisi-manager"), staffId: sid("staff", "lisi"), roleId: sid("role", "manager") },
				{ id: sid("sr", "wangwu-staff"), staffId: sid("staff", "wangwu"), roleId: sid("role", "staff") },
				{ id: sid("sr", "zhaoliu-staff"), staffId: sid("staff", "zhaoliu"), roleId: sid("role", "staff") },
				{ id: sid("sr", "qianqi-staff"), staffId: sid("staff", "qianqi"), roleId: sid("role", "staff") },
			]),
		);

		// ── Data Permissions ──
		await db.insert(smDataPermissions).values(
			rows([
				{
					id: sid("dp", "admin-all"),
					roleId: sid("role", "admin"),
					scope: "all",
					permissionRule: null,
					dataFilter: null,
				},
				{
					id: sid("dp", "manager-dept"),
					roleId: sid("role", "manager"),
					scope: "department",
					permissionRule: null,
					dataFilter: null,
				},
				{
					id: sid("dp", "staff-self"),
					roleId: sid("role", "staff"),
					scope: "self",
					permissionRule: null,
					dataFilter: null,
				},
			]),
		);

		// ── Shifts ──
		await db.insert(smShifts).values(
			rows([
				{ id: sid("shift", "morning"), shiftName: "早班", startTime: "08:00", endTime: "16:00", workDuration: null },
				{ id: sid("shift", "afternoon"), shiftName: "中班", startTime: "16:00", endTime: "24:00", workDuration: null },
				{ id: sid("shift", "night"), shiftName: "晚班", startTime: "00:00", endTime: "08:00", workDuration: null },
			]),
		);

		// ── Scheduling Settings ──
		await db.insert(smSchedulingSettings).values(
			rows([
				{ id: sid("sched-setting", "property"), schedulingMode: null, applicablePosition: null, rotationCycle: null },
				{ id: sid("sched-setting", "security"), schedulingMode: null, applicablePosition: null, rotationCycle: null },
			]),
		);

		// ── Working Schedules ──
		const today = new Date().toISOString().slice(0, 10);
		await db.insert(smWorkingSchedules).values(
			rows([
				{
					id: sid("ws", "zhangsan-morning"),
					staffId: sid("staff", "zhangsan"),
					shiftId: sid("shift", "morning"),
					scheduleDate: today,
					status: "enabled",
					workDate: today,
				},
				{
					id: sid("ws", "wangwu-afternoon"),
					staffId: sid("staff", "wangwu"),
					shiftId: sid("shift", "afternoon"),
					scheduleDate: today,
					status: "enabled",
					workDate: today,
				},
				{
					id: sid("ws", "zhaoliu-night"),
					staffId: sid("staff", "zhaoliu"),
					shiftId: sid("shift", "night"),
					scheduleDate: today,
					status: "enabled",
					workDate: today,
				},
			]),
		);

		// ── System Configs ──
		await db.insert(smSystemConfigs).values(
			rows([
				{
					id: sid("sys-config", "main"),
					configKey: "system.config",
					configValue: JSON.stringify({
						title: "智慧物业管理系统",
						subtitle: "Smart Property Management",
						companyName: "物业科技有限公司",
						logo: "/logo.png",
					}),
					configDescription: "系统基础配置",
					status: "enabled",
				},
			]),
		);

		// ── Register Protocols ──
		await db.insert(smRegisterProtocols).values(
			rows([
				{
					id: sid("protocol", "register"),
					protocolTitle: "用户注册协议",
					protocolContent: "欢迎使用智慧物业管理系统，请仔细阅读以下条款...",
					version: "v1.0.0",
					protocolType: null,
					status: "enabled",
				},
				{
					id: sid("protocol", "privacy"),
					protocolTitle: "隐私政策",
					protocolContent: "我们非常重视您的隐私保护，以下是我们的隐私政策...",
					version: "v1.0.0",
					protocolType: null,
					status: "enabled",
				},
			]),
		);

		// ── Initialize Cells ──
		await db.insert(smInitializeCells).values(
			rows([
				{
					id: sid("init", "database"),
					initItem: "数据库初始化",
					initStatus: "completed",
					configParams: JSON.stringify({ tables: 45, migrated: true }),
				},
				{
					id: sid("init", "roles"),
					initItem: "角色权限初始化",
					initStatus: "completed",
					configParams: JSON.stringify({ roles: 3, permissions: 5 }),
				},
				{
					id: sid("init", "community"),
					initItem: "小区数据初始化",
					initStatus: "pending",
					configParams: JSON.stringify({ target: "sunshine" }),
				},
			]),
		);

		// ── Change Password Records ──
		await db.insert(smChangePasswordRecords).values(
			rows([
				{
					id: sid("pwd-change", "zhangsan-init"),
					username: "zhangsan",
					realName: "张三",
					department: "物业部",
					changeTime: new Date().toISOString(),
					changeIp: "192.168.1.100",
					changeType: "initial_setup",
					operator: "system",
					status: "success",
					remark: "首次登录初始化密码",
				},
				{
					id: sid("pwd-change", "lisi-manual"),
					username: "lisi",
					realName: "李四",
					department: "客服中心",
					changeTime: new Date().toISOString(),
					changeIp: "192.168.1.101",
					changeType: "manual_change",
					operator: "lisi",
					status: "success",
					remark: "用户手动修改密码",
				},
			]),
		);

		// ── Community Configurations ──
		await db.insert(smCommunityConfigurations).values(
			rows([
				{
					id: sid("comm-cfg", "property-fee"),
					csId: "CS001",
					communityId: sid("community", "sunshine"),
					communityName: "阳光花园",
					settingName: "物业费标准",
					settingValue: JSON.stringify({ standard: 2.5, unit: "元/㎡/月" }),
					settingType: "fee",
					statusCd: "0",
				},
				{
					id: sid("comm-cfg", "parking-fee"),
					csId: "CS002",
					communityId: sid("community", "sunshine"),
					communityName: "阳光花园",
					settingName: "停车费标准",
					settingValue: JSON.stringify({ monthly: 300, temporary: 5, unit: "元" }),
					settingType: "fee",
					statusCd: "0",
				},
				{
					id: sid("comm-cfg", "access-time"),
					csId: "CS003",
					communityId: sid("community", "sunshine"),
					communityName: "阳光花园",
					settingName: "门禁开放时间",
					settingValue: JSON.stringify({ open: "06:00", close: "23:00" }),
					settingType: "access",
					statusCd: "0",
				},
			]),
		);
	},
});
