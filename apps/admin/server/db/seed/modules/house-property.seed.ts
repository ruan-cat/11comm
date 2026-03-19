import {
	hpOwners,
	hpSiteManagements,
	hpReserveVenues,
	hpOwnersCommittees,
	hpHouses,
	hpOwnerMembers,
	hpOwnerAccounts,
	hpInvoiceTitles,
	hpInvoices,
	hpReserveVenueOrders,
} from "@01s-11comm/type";
import { defineSeed, sid, rows } from "../helpers";

export default defineSeed({
	name: "house-property",
	dependencies: ["community"],
	seed: async (db) => {
		const communityId = sid("community", "sunshine");

		// --- hpOwners ---
		await db.insert(hpOwners).values(
			rows([
				{
					id: sid("owner", "zhangsan"),
					name: "张三",
					phone: "13800138001",
					gender: "male",
					idCard: "110101199001011234",
					emergencyContact: "张母",
					address: "阳光花园A栋101室",
				},
				{
					id: sid("owner", "lisi"),
					name: "李四",
					phone: "13800138002",
					gender: "female",
					idCard: "110101199202022345",
					emergencyContact: "李父",
					address: "阳光花园A栋102室",
				},
				{
					id: sid("owner", "wangwu"),
					name: "王五",
					phone: "13800138003",
					gender: "male",
					idCard: "110101198803033456",
					emergencyContact: "王妻",
					address: "阳光花园B栋201室",
				},
			]),
		);

		// --- hpSiteManagements ---
		await db.insert(hpSiteManagements).values(
			rows([
				{
					id: sid("site", "meeting-room-a"),
					siteName: "A座会议室",
					location: "A座1层",
					manager: "陈管理",
				},
				{
					id: sid("site", "gym-b"),
					siteName: "B座健身房",
					location: "B座负1层",
					manager: "刘管理",
				},
				{
					id: sid("site", "swimming-pool"),
					siteName: "游泳馆",
					location: "C区独立馆",
					manager: "赵管理",
				},
			]),
		);

		// --- hpReserveVenues ---
		await db.insert(hpReserveVenues).values(
			rows([
				{
					id: sid("venue", "basketball-court"),
					venueName: "篮球场",
					venueType: "sports",
					capacity: 20,
					openTime: "08:00-22:00",
					chargeStandard: "50元/小时",
					status: "enabled",
				},
				{
					id: sid("venue", "banquet-hall"),
					venueName: "宴会厅",
					venueType: "banquet",
					capacity: 100,
					openTime: "09:00-21:00",
					chargeStandard: "200元/小时",
					status: "enabled",
				},
			]),
		);

		// --- hpOwnersCommittees ---
		await db.insert(hpOwnersCommittees).values(
			rows([
				{
					id: sid("committee", "chairman"),
					committeeName: "第一届业委会",
					fullName: "赵主任",
					gender: "male",
					position: "主任",
					tenure: "2024-2027",
					status: "enabled",
				},
				{
					id: sid("committee", "vice-chairman"),
					committeeName: "第一届业委会",
					fullName: "钱副主任",
					gender: "female",
					position: "副主任",
					tenure: "2024-2027",
					status: "enabled",
				},
				{
					id: sid("committee", "member-sun"),
					committeeName: "第一届业委会",
					fullName: "孙委员",
					gender: "male",
					position: "委员",
					tenure: "2024-2027",
					status: "enabled",
				},
			]),
		);

		// --- hpHouses ---
		await db.insert(hpHouses).values(
			rows([
				{
					id: sid("house", "A-101"),
					communityId,
					houseNumber: "A-101",
					buildingNo: "A",
					unitNo: "1",
					floor: 1,
					roomNo: "101",
					buildingArea: "120.50",
					usableArea: "98.00",
					houseType: "residential",
					status: "enabled",
				},
				{
					id: sid("house", "A-102"),
					communityId,
					houseNumber: "A-102",
					buildingNo: "A",
					unitNo: "1",
					floor: 1,
					roomNo: "102",
					buildingArea: "95.00",
					usableArea: "78.00",
					houseType: "residential",
					status: "enabled",
				},
				{
					id: sid("house", "B-201"),
					communityId,
					houseNumber: "B-201",
					buildingNo: "B",
					unitNo: "2",
					floor: 2,
					roomNo: "201",
					buildingArea: "140.00",
					usableArea: "115.00",
					houseType: "residential",
					status: "enabled",
				},
			]),
		);

		// --- hpOwnerMembers ---
		await db.insert(hpOwnerMembers).values(
			rows([
				{
					id: sid("owner-member", "zhangsan-wife"),
					ownerId: sid("owner", "zhangsan"),
					name: "张妻",
					memberType: "family_member",
					phone: "13900139001",
					gender: "female",
					idCard: "110101199105051111",
					homeAddress: "阳光花园A栋101室",
				},
				{
					id: sid("owner-member", "lisi-son"),
					ownerId: sid("owner", "lisi"),
					name: "李子",
					memberType: "family_member",
					phone: "13900139002",
					gender: "male",
					idCard: "110101201506062222",
					homeAddress: "阳光花园A栋102室",
				},
				{
					id: sid("owner-member", "wangwu-mother"),
					ownerId: sid("owner", "wangwu"),
					name: "王母",
					memberType: "family_member",
					phone: "13900139003",
					gender: "female",
					idCard: "110101196007073333",
					homeAddress: "阳光花园B栋201室",
				},
			]),
		);

		// --- hpOwnerAccounts ---
		await db.insert(hpOwnerAccounts).values(
			rows([
				{
					id: sid("owner-account", "zhangsan-acc"),
					ownerId: sid("owner", "zhangsan"),
					accountNo: "ACC-001",
					accountType: "general",
					balance: "0.00",
				},
				{
					id: sid("owner-account", "lisi-acc"),
					ownerId: sid("owner", "lisi"),
					accountNo: "ACC-002",
					accountType: "general",
					balance: "0.00",
				},
				{
					id: sid("owner-account", "wangwu-acc"),
					ownerId: sid("owner", "wangwu"),
					accountNo: "ACC-003",
					accountType: "general",
					balance: "0.00",
				},
			]),
		);

		// --- hpInvoiceTitles ---
		await db.insert(hpInvoiceTitles).values(
			rows([
				{
					id: sid("invoice-title", "zhangsan-personal"),
					ownerId: sid("owner", "zhangsan"),
					titleName: "张三",
					taxpayerNo: null,
				},
				{
					id: sid("invoice-title", "lisi-personal"),
					ownerId: sid("owner", "lisi"),
					titleName: "李四",
					taxpayerNo: null,
				},
			]),
		);

		// --- hpInvoices ---
		await db.insert(hpInvoices).values(
			rows([
				{
					id: sid("invoice", "inv-2024-001"),
					invoiceNo: "INV-2024-001",
					invoiceType: "normal",
					amount: "1000.00",
					code: "INV-2024-001",
					ownerName: "张三",
					applicant: "张三",
					invoiceTitle: "张三",
					auditStatus: "approved",
				},
				{
					id: sid("invoice", "inv-2024-002"),
					invoiceNo: "INV-2024-002",
					invoiceType: "normal",
					amount: "500.00",
					code: "INV-2024-002",
					ownerName: "李四",
					applicant: "李四",
					invoiceTitle: "李四",
					auditStatus: "pending",
				},
			]),
		);

		// --- hpReserveVenueOrders ---
		await db.insert(hpReserveVenueOrders).values(
			rows([
				{
					id: sid("venue-order", "order-001"),
					venueId: sid("venue", "basketball-court"),
					booker: "张三",
					contactPhone: "13800138001",
					timeSlot: "14:00-16:00",
					status: "confirmed",
					reservationTime: new Date("2024-06-15T10:00:00"),
					startTime: new Date("2024-06-15T14:00:00"),
					endTime: new Date("2024-06-15T16:00:00"),
					numberOfUsers: 10,
				},
				{
					id: sid("venue-order", "order-002"),
					venueId: sid("venue", "banquet-hall"),
					booker: "王五",
					contactPhone: "13800138003",
					timeSlot: "18:00-21:00",
					status: "confirmed",
					reservationTime: new Date("2024-06-20T09:00:00"),
					startTime: new Date("2024-06-20T18:00:00"),
					endTime: new Date("2024-06-20T21:00:00"),
					numberOfUsers: 50,
				},
			]),
		);
	},
});
