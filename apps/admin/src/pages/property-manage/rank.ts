import type { RoutesRankConfig } from "router/rank";

export const routesRank: RoutesRankConfig = {
	/** 小区 */
	communityManage: {
		rank: 100,
		children: {
			/** 我的 */
			my: 10,

			/** 业务受理 */
			handingBusiness: 20,

			/** 房屋装修 */
			houseDecoration: 30,

			/** 楼栋结构图 */
			buildingSpaceStructureDiagram: 40,

			/** 车位结构图 */
			parkingSpaceStructureDiagram: 50,

			/** 产权登记 */
			propertyRegister: 60,

			/** 小区公示 */
			notice: 70,
		},
	},

	/** 房产管理 */
	housePropertyManage: {
		rank: 200,
		children: {
			/** 房屋管理 */
			house: 10,

			/** 业主信息 */
			ownerInformation: 15,

			/** 业主成员 */
			ownerMember: 20,

			/** 业主账户 */
			ownerAccount: 25,

			/** 场地管理 */
			siteManagement: 30,

			/** 场地预约 */
			reserveVenue: 35,

			/** 预约场馆订单 */
			reserveVenueOrder: 40,

			/** 业委会 */
			ownersCommittee: 45,

			/** 发票抬头 */
			invoiceTitle: 50,

			/** 发票 */
			invoice: 55,
		},
	},

	/** 停车管理 */
	parkingManage: {
		rank: 300,
		children: {
			/** 车位申请 */
			carportApply: 10,
			/** 车位信息 */
			carportInfo: 20,
			/** 业主车辆 */
			ownerVehicle: 30,
			/** 停车场管理 */
			parkingLot: 40,
		},
	},

	/** 合同管理 */
	contractManage: {
		rank: 400,
		children: {
			/** 合同类型 */
			type: 10,

			/** 合同甲方 */
			firstParty: 20,

			/** 起草合同 */
			draftContract: 30,

			/** 合同变更 */
			change: 40,

			/** 到期合同 */
			expire: 50,
		},
	},

	/** 费用管理 */
	expenseManage: {
		rank: 500,
		children: {
			/** 费用项目设置 */
			expenseItemSetting: 10,

			/** 抄表类型 */
			meterReadingType: 15,

			/** 水电抄表 */
			waterAndElectricityMeterReading: 20,

			/** 折扣设置 */
			discountSetting: 25,

			/** 房屋收费 */
			houseCharge: 30,

			/** 车辆收费 */
			vehicleCharge: 35,

			/** 合同收费 */
			contracteCharge: 40,

			/** 优惠类型 */
			discountType: 45,

			/** 优惠申请 */
			discountApply: 50,

			/** 补打收据 */
			reprintVoucher: 55,

			/** 缴费审核 */
			paymentReview: 60,

			/** 退费审核 */
			refundReview: 65,

			/** 取消费用 */
			cancelFee: 70,

			/** 欠费信息 */
			overduePaymentInformation: 75,

			/** 欠费催缴 */
			reminderForOverduePayments: 80,

			/** 费用汇总表 */
			expenseSummaryTable: 85,
		},
	},

	/** 报修管理 */
	repairsManage: {
		rank: 600,
		children: {
			/** 报修设置 */
			repairsSetting: 10,

			/** 电话报修 */
			phoneReportRepairs: 20,

			/** 工单池 */
			issues: 30,

			/** 报修待办 */
			repairsTodo: 40,

			/** 报修已办 */
			repairsHaveDone: 50,

			/** 报修回访 */
			returnVisit: 60,

			/** 强制回单 */
			mandatoryReturnIssue: 70,
		},
	},

	/** 巡检管理 */
	patrolManage: {
		rank: 700,
		children: {
			/** 巡检项目 */
			item: 10,

			/** 巡检点 */
			point: 20,

			/** 巡检路线 */
			path: 30,

			/** 巡检计划 */
			plan: 40,

			/** 巡检任务 */
			task: 50,

			/** 巡检明细 */
			detail: 60,
		},
	},

	/** 报表管理 */
	reportManage: {
		rank: 800,
		children: {
			/** 数据统计 */
			dataStatistics: 10,

			/** 费用汇总表 */
			expenseSummaryTable: 15,

			/** 费用明细表 */
			statementExpenses: 20,

			/** 费用提醒 */
			feeReminder: 25,

			/** 欠费明细表 */
			arrearsDetailsList: 30,

			/** 缴费明细表 */
			paymentDetailsForm: 35,

			/** 业主缴费明细 */
			ownerPaymentDetails: 40,

			/** 未收费房屋 */
			noChargeHouse: 45,

			/** 欠费分析 */
			outstandingFeesAnalysis: 50,

			/** 押金报表 */
			depositReport: 55,

			/** 报修汇总表 */
			repairReportsSummaryTable: 60,

			/** 维修报告表 */
			repairReportForm: 65,

			/** 巡检报表 */
			patrolReport: 70,
		},
	},
};
