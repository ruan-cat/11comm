import {
	cmCommunities,
	cmNotices,
	cmHandingBusiness,
	cmHouseDecorations,
	cmPropertyRegisters,
	cmBuildingStructures,
} from "@01s-11comm/type";
import { defineSeed, sid, rows } from "../helpers";

export default defineSeed({
	name: "community",
	dependencies: [],
	async seed(db) {
		// ── Communities ────────────────────────────────────────────────
		await db.insert(cmCommunities).values(
			rows([
				{
					id: sid("community", "sunshine"),
					name: "阳光花园小区",
					code: "CM-SUNSHINE-001",
					address: "北京市朝阳区阳光路88号",
					phone: "010-88881234",
					status: "enabled",
					buildingCount: 12,
					householdCount: 1200,
					parkingCount: 800,
					greenRate: "35.50",
					developer: "阳光地产集团",
					propertyCompany: "阳光物业管理有限公司",
					establishedDate: "2018-06-01",
					province: "北京市",
					city: "北京市",
					district: "朝阳区",
				},
				{
					id: sid("community", "riverside"),
					name: "绿城国际",
					code: "CM-RIVERSIDE-002",
					address: "上海市浦东新区滨江大道168号",
					phone: "021-66778899",
					status: "enabled",
					buildingCount: 8,
					householdCount: 960,
					parkingCount: 600,
					greenRate: "40.00",
					developer: "绿城中国",
					propertyCompany: "绿城物业服务集团",
					establishedDate: "2020-03-15",
					province: "上海市",
					city: "上海市",
					district: "浦东新区",
				},
				{
					id: sid("community", "phoenix"),
					name: "华润凤凰城",
					code: "CM-PHOENIX-003",
					address: "深圳市南山区凤凰路66号",
					phone: "0755-55667788",
					status: "enabled",
					buildingCount: 20,
					householdCount: 3500,
					parkingCount: 2000,
					greenRate: "38.20",
					developer: "华润置地",
					propertyCompany: "华润万象物业",
					establishedDate: "2016-09-20",
					province: "广东省",
					city: "深圳市",
					district: "南山区",
				},
			]),
		);

		// ── Notices ───────────────────────────────────────────────────
		await db.insert(cmNotices).values(
			rows([
				{
					id: sid("notice", "water-cut"),
					communityId: sid("community", "sunshine"),
					title: "关于临时停水的通知",
					content: "因市政管网维修，本小区将于3月25日8:00-18:00停水，请各住户提前做好储水准备。",
					publishTime: new Date("2026-03-20"),
					publisher: "物业管理处",
					status: "enabled",
				},
				{
					id: sid("notice", "greenery"),
					communityId: sid("community", "sunshine"),
					title: "小区绿化养护通知",
					content: "本周末将对小区公共区域绿化进行修剪养护，施工期间请注意安全。",
					publishTime: new Date("2026-03-18"),
					publisher: "物业管理处",
					status: "enabled",
				},
				{
					id: sid("notice", "parking-rules"),
					communityId: sid("community", "riverside"),
					title: "停车场管理规定更新",
					content: "为规范小区停车秩序，自4月1日起实施新的停车管理规定，详情请查看公告栏。",
					publishTime: new Date("2026-03-15"),
					publisher: "安保部",
					status: "enabled",
				},
			]),
		);

		// ── Handing Business ──────────────────────────────────────────
		await db.insert(cmHandingBusiness).values(
			rows([
				{
					id: sid("handing-business", "move-in-zhang"),
					businessType: "入住办理",
					applicant: "张三",
					contactPhone: "13800138001",
					status: "已缴费",
					handleTime: new Date("2026-03-10"),
					remark: "1号楼2单元301室入住手续",
				},
				{
					id: sid("handing-business", "parking-li"),
					businessType: "车位租赁",
					applicant: "李四",
					contactPhone: "13900139002",
					status: "待缴费",
					remark: "地下B1层车位申请",
				},
				{
					id: sid("handing-business", "decoration-wang"),
					businessType: "装修申请",
					applicant: "王五",
					contactPhone: "13700137003",
					status: "已缴费",
					handleTime: new Date("2026-03-05"),
					remark: "3号楼1单元502室装修押金",
				},
			]),
		);

		// ── House Decorations ─────────────────────────────────────────
		await db.insert(cmHouseDecorations).values(
			rows([
				{
					id: sid("decoration", "501-remodel"),
					houseNumber: "1-2-501",
					ownerInfo: "赵六 / 13600136001",
					decorationCompany: "居然之家装饰公司",
					plannedStartTime: "2026-04-01",
					plannedEndTime: "2026-06-30",
					auditStatus: "approved",
				},
				{
					id: sid("decoration", "302-remodel"),
					houseNumber: "3-1-302",
					ownerInfo: "孙七 / 13500135002",
					decorationCompany: "红星美凯龙装饰",
					plannedStartTime: "2026-03-20",
					plannedEndTime: "2026-05-20",
					auditStatus: "pending",
				},
				{
					id: sid("decoration", "1201-remodel"),
					houseNumber: "5-3-1201",
					ownerInfo: "周八 / 13400134003",
					decorationCompany: "业之峰装饰",
					plannedStartTime: "2026-02-01",
					plannedEndTime: "2026-04-30",
					auditStatus: "approved",
				},
			]),
		);

		// ── Property Registers ────────────────────────────────────────
		await db.insert(cmPropertyRegisters).values(
			rows([
				{
					id: sid("property-register", "1-2-301"),
					communityName: "阳光花园小区",
					buildingNo: "1",
					unitNo: "2",
					roomNo: "301",
					ownerName: "张三",
					contactPhone: "13800138001",
					area: "89.50",
					propertyType: "住宅",
					registerDate: "2026-01-15",
					status: "enabled",
				},
				{
					id: sid("property-register", "3-1-502"),
					communityName: "阳光花园小区",
					buildingNo: "3",
					unitNo: "1",
					roomNo: "502",
					ownerName: "王五",
					contactPhone: "13700137003",
					area: "120.00",
					propertyType: "住宅",
					registerDate: "2026-02-20",
					status: "enabled",
				},
				{
					id: sid("property-register", "5-3-1201"),
					communityName: "阳光花园小区",
					buildingNo: "5",
					unitNo: "3",
					roomNo: "1201",
					ownerName: "周八",
					contactPhone: "13400134003",
					area: "145.80",
					propertyType: "住宅",
					registerDate: "2025-11-08",
					status: "enabled",
				},
			]),
		);

		// ── Building Structures ───────────────────────────────────────
		await db.insert(cmBuildingStructures).values(
			rows([
				{
					id: sid("building", "sunshine-1"),
					communityId: sid("community", "sunshine"),
					buildingNo: "1",
					floorCount: 18,
					unitCount: 3,
				},
				{
					id: sid("building", "sunshine-3"),
					communityId: sid("community", "sunshine"),
					buildingNo: "3",
					floorCount: 24,
					unitCount: 2,
				},
				{
					id: sid("building", "sunshine-5"),
					communityId: sid("community", "sunshine"),
					buildingNo: "5",
					floorCount: 32,
					unitCount: 4,
				},
			]),
		);
	},
});
