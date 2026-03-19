import {
	rpRepairOrders,
	rpRepairTypes,
	rpRepairSettings,
	rpPhoneRepairReports,
	rpRepairOrderHistories,
	rpMandatoryReturnIssues,
	rpReturnVisits,
} from "@01s-11comm/type";
import { defineSeed, sid, rows } from "../helpers";

export default defineSeed({
	name: "repairs",
	dependencies: ["house-property", "setting"],
	async seed(db) {
		await db.insert(rpRepairTypes).values(
			rows([
				{ id: sid("repair-type", "plumbing"), typeName: "水管维修", typeDescription: "水管漏水、堵塞等", sortOrder: 1 },
				{
					id: sid("repair-type", "electrical"),
					typeName: "电路维修",
					typeDescription: "线路故障、跳闸等",
					sortOrder: 2,
				},
				{
					id: sid("repair-type", "door-window"),
					typeName: "门窗维修",
					typeDescription: "门窗损坏、密封不严等",
					sortOrder: 3,
				},
				{ id: sid("repair-type", "elevator"), typeName: "电梯维修", typeDescription: "电梯故障、异响等", sortOrder: 4 },
				{ id: sid("repair-type", "fire"), typeName: "消防设施", typeDescription: "消防设施损坏或过期", sortOrder: 5 },
			]),
		);

		await db.insert(rpRepairSettings).values(
			rows([
				{
					id: sid("repair-setting", "1"),
					settingType: "maintenance",
					dispatchMethod: "assign",
					serviceArea: "house",
					processingTimeLimit: 48,
				},
				{
					id: sid("repair-setting", "2"),
					settingType: "cleaning",
					dispatchMethod: "grab",
					serviceArea: "public_area",
					processingTimeLimit: 24,
				},
			]),
		);

		await db.insert(rpRepairOrders).values(
			rows([
				{
					id: sid("repair-order", "1"),
					workOrderNumber: "RT202401150001",
					repairType: "水管维修",
					repairSource: "owner",
					reporterName: "张三",
					contactPhone: "13800138001",
					repairLocation: "A-101 厨房",
					problemDescription: "厨房水龙头漏水",
					status: "completed",
				},
				{
					id: sid("repair-order", "2"),
					workOrderNumber: "RT202401160002",
					repairType: "电路维修",
					repairSource: "owner",
					reporterName: "李四",
					contactPhone: "13800138002",
					repairLocation: "A-102 客厅",
					problemDescription: "客厅灯具不亮",
					status: "processing",
				},
				{
					id: sid("repair-order", "3"),
					workOrderNumber: "RT202401170003",
					repairType: "门窗维修",
					repairSource: "owner",
					reporterName: "王五",
					contactPhone: "13800138003",
					repairLocation: "B-201 阳台",
					problemDescription: "阳台推拉门卡滞",
					status: "pending",
				},
			]),
		);

		await db.insert(rpPhoneRepairReports).values(
			rows([
				{
					id: sid("phone-report", "1"),
					orderId: sid("repair-order", "1"),
					callerPhone: "13800138001",
					receiver: "客服小刘",
					repairSummary: "业主反映厨房水龙头漏水，需要上门维修",
				},
				{
					id: sid("phone-report", "2"),
					orderId: sid("repair-order", "2"),
					callerPhone: "13800138002",
					receiver: "客服小王",
					repairSummary: "业主反映客厅灯具不亮，疑似线路问题",
				},
			]),
		);

		await db.insert(rpRepairOrderHistories).values(
			rows([
				{
					id: sid("repair-history", "1"),
					orderId: sid("repair-order", "1"),
					operationType: "create",
					operator: "系统",
					operationTime: new Date("2024-01-15 10:00:00"),
					operationDescription: "工单创建",
				},
				{
					id: sid("repair-history", "2"),
					orderId: sid("repair-order", "1"),
					operationType: "assign",
					operator: "王五",
					operationTime: new Date("2024-01-15 10:30:00"),
					operationDescription: "派单给维修工王五",
				},
				{
					id: sid("repair-history", "3"),
					orderId: sid("repair-order", "2"),
					operationType: "create",
					operator: "系统",
					operationTime: new Date("2024-01-16 09:00:00"),
					operationDescription: "工单创建",
				},
			]),
		);

		await db
			.insert(rpMandatoryReturnIssues)
			.values(
				rows([
					{
						id: sid("mandatory-return", "1"),
						workOrderNumber: "RT202401150001",
						mandatoryReason: "维修后再次出现漏水",
						returnStatus: "pending_return",
					},
				]),
			);

		await db
			.insert(rpReturnVisits)
			.values(
				rows([
					{
						id: sid("return-visit", "1"),
						orderId: sid("repair-order", "1"),
						visitor: "客服小刘",
						visitTime: new Date("2024-01-18"),
						visitMethod: "phone",
						satisfactionRating: 5,
						visitStatus: "visited",
						visitNote: "维修及时，业主满意",
					},
				]),
			);
	},
});
