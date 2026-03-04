import {
	rpRepairOrders,
	rpRepairOrderHistories,
	rpReturnVisits,
	rpRepairSettings,
	rpRepairTypes,
	rpMandatoryReturnIssues,
	rpPhoneRepairReports,
	type NewRpRepairOrder as InsertRpRepairOrder,
	type NewRpRepairOrderHistory as InsertRpRepairOrderHistory,
	type NewRpReturnVisit as InsertRpReturnVisit,
	type NewRpRepairSetting as InsertRpRepairSetting,
	type NewRpRepairType as InsertRpRepairType,
	type NewRpMandatoryReturnIssue as InsertRpMandatoryReturnIssue,
	type NewRpPhoneRepairReport as InsertRpPhoneRepairReport,
} from "@01s-11comm/type";

import { mockRepairsTodoData } from "../../api/property-manage/repairs-manage/repairs-todo/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql } from "./index";
import { getDb } from "../index";

/**
 * 生成报修管理模块的 SQL
 */
export async function generateRepairsSql(idMap: IdMapRegistry): Promise<SqlStatement[]> {
	const db = await getDb();
	const statements: SqlStatement[] = [];

	// ==========================================
	// 1. 生成 rp_repair_orders (报修工单)
	// ==========================================
	console.log("正在生成 rp_repair_orders SQL...");
	const orderRecords = mockRepairsTodoData.map((item) => {
		const id = idMap.register("rp_repair_orders", item.workOrderNumber);
		return {
			id,
			workOrderNumber: item.workOrderNumber,
			repairType: item.repairType,
			repairSource: "owner", // Mock data missing this field
			reporterName: item.reporter,
			contactPhone: item.contactInfo,
			repairLocation: item.location,
			problemDescription: item.remark || "待处理",
			status: "pending",
			assigner: null,
			assignTime: null,
			repairPerson: null,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: new Date(),
		};
	});

	if (orderRecords.length > 0) {
		const query = db
			.insert(rpRepairOrders as any)
			.values(orderRecords)
			.toSQL();
		statements.push({
			table: "rp_repair_orders",
			sql: toFullSql(query.sql, query.params),
			recordCount: orderRecords.length,
		});
	}

	// ==========================================
	// 2. 生成 rp_repair_types (维修类型)
	// ==========================================
	console.log("正在生成 rp_repair_types SQL...");
	const repairTypeRecords: any[] = [
		{
			id: idMap.register("rp_repair_types", "水管维修"),
			typeName: "水管维修",
			typeDescription: "包括水管漏水、堵塞、破裂等问题",
			sortOrder: 1,
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_types", "电路维修"),
			typeName: "电路维修",
			typeDescription: "包括电路故障、跳闸、短路等问题",
			sortOrder: 2,
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_types", "门窗维修"),
			typeName: "门窗维修",
			typeDescription: "包括门窗损坏、锁具故障、玻璃破损等",
			sortOrder: 3,
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_types", "电梯维修"),
			typeName: "电梯维修",
			typeDescription: "包括电梯故障、困人、异响等问题",
			sortOrder: 4,
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_types", "消防设施"),
			typeName: "消防设施",
			typeDescription: "包括消防栓、灭火器、烟感器等设施维护",
			sortOrder: 5,
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_types", "空调维修"),
			typeName: "空调维修",
			typeDescription: "包括空调不制冷、漏水、异响等问题",
			sortOrder: 6,
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_types", "墙面维修"),
			typeName: "墙面维修",
			typeDescription: "包括墙面开裂、渗水、脱落等问题",
			sortOrder: 7,
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_types", "地面维修"),
			typeName: "地面维修",
			typeDescription: "包括地板损坏、地砖破裂等问题",
			sortOrder: 8,
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_types", "公共设施"),
			typeName: "公共设施",
			typeDescription: "包括路灯、监控、门禁等公共设施维护",
			sortOrder: 9,
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_types", "其他维修"),
			typeName: "其他维修",
			typeDescription: "其他未分类的维修项目",
			sortOrder: 10,
			createTime: new Date(),
			updateTime: new Date(),
		},
	];

	if (repairTypeRecords.length > 0) {
		const query = db
			.insert(rpRepairTypes as any)
			.values(repairTypeRecords)
			.toSQL();
		statements.push({
			table: "rp_repair_types",
			sql: toFullSql(query.sql, query.params),
			recordCount: repairTypeRecords.length,
		});
	}

	// ==========================================
	// 3. 生成 rp_repair_settings (维修设置)
	// ==========================================
	console.log("正在生成 rp_repair_settings SQL...");
	const repairSettingRecords: any[] = [
		{
			id: idMap.register("rp_repair_settings", "维修单-房屋-抢单"),
			settingType: "maintenance",
			dispatchMethod: "grab",
			serviceArea: "house",
			processingTimeLimit: 120, // 2小时
			returnVisitTimeLimit: 1440, // 24小时
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_settings", "维修单-房屋-指派"),
			settingType: "maintenance",
			dispatchMethod: "assign",
			serviceArea: "house",
			processingTimeLimit: 180, // 3小时
			returnVisitTimeLimit: 2880, // 48小时
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_settings", "维修单-公共区域-轮训"),
			settingType: "maintenance",
			dispatchMethod: "rotation",
			serviceArea: "public_area",
			processingTimeLimit: 240, // 4小时
			returnVisitTimeLimit: 1440, // 24小时
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_settings", "维修单-车库-抢单"),
			settingType: "maintenance",
			dispatchMethod: "grab",
			serviceArea: "garage",
			processingTimeLimit: 360, // 6小时
			returnVisitTimeLimit: 2880, // 48小时
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_settings", "保洁单-房屋-指派"),
			settingType: "cleaning",
			dispatchMethod: "assign",
			serviceArea: "house",
			processingTimeLimit: 60, // 1小时
			returnVisitTimeLimit: 720, // 12小时
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_settings", "保洁单-公共区域-轮训"),
			settingType: "cleaning",
			dispatchMethod: "rotation",
			serviceArea: "public_area",
			processingTimeLimit: 120, // 2小时
			returnVisitTimeLimit: 1440, // 24小时
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_settings", "保洁单-车库-抢单"),
			settingType: "cleaning",
			dispatchMethod: "grab",
			serviceArea: "garage",
			processingTimeLimit: 90, // 1.5小时
			returnVisitTimeLimit: 720, // 12小时
			createTime: new Date(),
			updateTime: new Date(),
		},
		{
			id: idMap.register("rp_repair_settings", "维修单-非房屋-指派"),
			settingType: "maintenance",
			dispatchMethod: "assign",
			serviceArea: "non_house",
			processingTimeLimit: 480, // 8小时
			returnVisitTimeLimit: 4320, // 72小时
			createTime: new Date(),
			updateTime: new Date(),
		},
	];

	if (repairSettingRecords.length > 0) {
		const query = db
			.insert(rpRepairSettings as any)
			.values(repairSettingRecords)
			.toSQL();
		statements.push({
			table: "rp_repair_settings",
			sql: toFullSql(query.sql, query.params),
			recordCount: repairSettingRecords.length,
		});
	}

	// ==========================================
	// 4. 生成 rp_phone_repair_reports (电话报修)
	// ==========================================
	console.log("正在生成 rp_phone_repair_reports SQL...");
	const phoneRepairRecords: any[] = [];

	// 生成15条电话报修记录,部分关联工单，部分未关联
	for (let i = 0; i < 15; i++) {
		const shouldLinkOrder = i < 10; // 前10条关联工单
		const orderId =
			shouldLinkOrder && i < orderRecords.length
				? idMap.get("rp_repair_orders", orderRecords[i].workOrderNumber)
				: null;

		phoneRepairRecords.push({
			id: idMap.register("rp_phone_repair_reports", `phone-${i + 1}`),
			orderId: orderId,
			callerPhone: `138${String(i).padStart(8, "0")}`,
			callTime: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000), // 倒序15天
			receiver: i % 3 === 0 ? "客服A" : i % 3 === 1 ? "客服B" : "客服C",
			repairSummary:
				i % 5 === 0
					? "水管漏水，需要紧急处理"
					: i % 5 === 1
						? "电路跳闸，无法正常用电"
						: i % 5 === 2
							? "门锁损坏，无法正常开关"
							: i % 5 === 3
								? "空调不制冷，需要维修"
								: "墙面渗水，需要检查",
			createTime: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000),
			updateTime: new Date(),
		});
	}

	if (phoneRepairRecords.length > 0) {
		const query = db
			.insert(rpPhoneRepairReports as any)
			.values(phoneRepairRecords)
			.toSQL();
		statements.push({
			table: "rp_phone_repair_reports",
			sql: toFullSql(query.sql, query.params),
			recordCount: phoneRepairRecords.length,
		});
	}

	// ==========================================
	// 5. 生成 rp_repair_order_histories (工单历史)
	// ==========================================
	console.log("正在生成 rp_repair_order_histories SQL...");
	const orderHistoryRecords: any[] = [];

	// 为每个工单生成2-3条历史记录
	for (let i = 0; i < orderRecords.length; i++) {
		const orderId = idMap.get("rp_repair_orders", orderRecords[i].workOrderNumber);
		const baseTime = orderRecords[i].createTime || new Date();

		// 创建工单
		orderHistoryRecords.push({
			id: idMap.register("rp_repair_order_histories", `history-${i}-1`),
			orderId: orderId,
			operationType: "create",
			operator: orderRecords[i].reporterName || "系统",
			operationTime: baseTime,
			operationDescription: "创建报修工单",
			createTime: baseTime,
			updateTime: baseTime,
		});

		// 指派工单（部分工单）
		if (i % 2 === 0) {
			const assignTime = new Date(baseTime.getTime() + 30 * 60 * 1000); // 30分钟后
			orderHistoryRecords.push({
				id: idMap.register("rp_repair_order_histories", `history-${i}-2`),
				orderId: orderId,
				operationType: "assign",
				operator: "调度员",
				operationTime: assignTime,
				operationDescription: `指派给维修人员处理`,
				createTime: assignTime,
				updateTime: assignTime,
			});
		}

		// 完成工单（部分工单）
		if (i % 3 === 0) {
			const completeTime = new Date(baseTime.getTime() + 2 * 60 * 60 * 1000); // 2小时后
			orderHistoryRecords.push({
				id: idMap.register("rp_repair_order_histories", `history-${i}-3`),
				orderId: orderId,
				operationType: "complete",
				operator: "维修人员",
				operationTime: completeTime,
				operationDescription: "维修完成，问题已解决",
				createTime: completeTime,
				updateTime: completeTime,
			});
		}
	}

	if (orderHistoryRecords.length > 0) {
		const query = db
			.insert(rpRepairOrderHistories as any)
			.values(orderHistoryRecords)
			.toSQL();
		statements.push({
			table: "rp_repair_order_histories",
			sql: toFullSql(query.sql, query.params),
			recordCount: orderHistoryRecords.length,
		});
	}

	// ==========================================
	// 6. 生成 rp_mandatory_return_issues (强制返修)
	// ==========================================
	console.log("正在生成 rp_mandatory_return_issues SQL...");
	const mandatoryReturnRecords: any[] = [];

	// 为部分工单生成强制返修记录
	for (let i = 0; i < Math.min(10, orderRecords.length); i++) {
		if (i % 4 === 0) {
			// 每4个工单中有1个需要强制返修
			const workOrderNumber = orderRecords[i].workOrderNumber;
			const baseTime = orderRecords[i].createTime || new Date();

			mandatoryReturnRecords.push({
				id: idMap.register("rp_mandatory_return_issues", `mandatory-${i}`),
				workOrderNumber: workOrderNumber,
				mandatoryReason: i % 8 === 0 ? "维修超时未完成，需要强制回单" : "业主投诉维修质量问题，需要重新处理",
				mandatoryTime: new Date(baseTime.getTime() + 4 * 60 * 60 * 1000), // 4小时后
				returnStatus: i % 2 === 0 ? "pending_return" : "returned",
				createTime: new Date(baseTime.getTime() + 4 * 60 * 60 * 1000),
				updateTime: new Date(),
			});
		}
	}

	if (mandatoryReturnRecords.length > 0) {
		const query = db
			.insert(rpMandatoryReturnIssues as any)
			.values(mandatoryReturnRecords)
			.toSQL();
		statements.push({
			table: "rp_mandatory_return_issues",
			sql: toFullSql(query.sql, query.params),
			recordCount: mandatoryReturnRecords.length,
		});
	}

	// ==========================================
	// 7. 生成 rp_return_visits (回访记录)
	// ==========================================
	console.log("正在生成 rp_return_visits SQL...");
	const returnVisitRecords: any[] = [];

	// 为已完成的工单生成回访记录
	for (let i = 0; i < orderRecords.length; i++) {
		if (i % 3 === 0) {
			// 每3个工单中有1个有回访记录
			const orderId = idMap.get("rp_repair_orders", orderRecords[i].workOrderNumber);
			const baseTime = orderRecords[i].createTime || new Date();
			const visitTime = new Date(baseTime.getTime() + 3 * 24 * 60 * 60 * 1000); // 3天后回访

			returnVisitRecords.push({
				id: idMap.register("rp_return_visits", `visit-${i}`),
				orderId: orderId,
				visitor: i % 2 === 0 ? "回访员A" : "回访员B",
				visitorId: null,
				visitTime: visitTime,
				visitMethod: i % 3 === 0 ? "电话" : i % 3 === 1 ? "上门" : "微信",
				satisfactionRating: i % 4 === 0 ? 5 : i % 4 === 1 ? 4 : i % 4 === 2 ? 3 : 5,
				visitStatus: i % 4 === 0 ? "satisfied" : i % 4 === 1 ? "satisfied" : i % 4 === 2 ? "unsatisfied" : "visited",
				visitNote: i % 4 === 2 ? "业主反馈维修质量不满意，需要重新处理" : "业主对维修服务表示满意",
				createTime: visitTime,
				updateTime: new Date(),
			});
		}
	}

	if (returnVisitRecords.length > 0) {
		const query = db
			.insert(rpReturnVisits as any)
			.values(returnVisitRecords)
			.toSQL();
		statements.push({
			table: "rp_return_visits",
			sql: toFullSql(query.sql, query.params),
			recordCount: returnVisitRecords.length,
		});
	}

	return statements;
}
