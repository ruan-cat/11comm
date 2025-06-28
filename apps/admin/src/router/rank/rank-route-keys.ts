/**
 * 路由路径类型约束
 * @description 基于实际路由配置的所有可能路径常量数组
 */
export const RANK_ROUTE_KEYS = [
	// 一级路由
	"settingManage",
	"devTeam",
	"operationTeam",
	"propertyManage",
	// settingManage 二级路由
	"settingManage.organizeManage",
	"settingManage.systemManage",
	// devTeam 二级路由
	"devTeam.menuManage",
	"devTeam.cacheManage",
	"devTeam.configManage",
	// operationTeam 二级路由
	"operationTeam.systemManage",
	"operationTeam.dataManage",
	"operationTeam.merchantManage",
	"operationTeam.reportConfiguration",
	// propertyManage 二级路由
	"propertyManage.communityManage",
	"propertyManage.contractManage",
	"propertyManage.expenseManage",
	"propertyManage.housePropertyManage",
	"propertyManage.parkingManage",
	"propertyManage.patrolManage",
	"propertyManage.repairsManage",
	"propertyManage.reportManage",
	// settingManage.organizeManage 三级路由
	"settingManage.organizeManage.staffInfo",
	"settingManage.organizeManage.orgInfo",
	"settingManage.organizeManage.workingSchedule",
	"settingManage.organizeManage.schedulingSetting",
	"settingManage.organizeManage.shiftSetting",
	"settingManage.organizeManage.rolePermission",
	"settingManage.organizeManage.dataPermission",
	// settingManage.systemManage 三级路由
	"settingManage.systemManage.changePassword",
	"settingManage.systemManage.systemConfig",
	"settingManage.systemManage.registerProtocol",
	"settingManage.systemManage.initializeCell",
	"settingManage.systemManage.communityConfiguration",
	// devTeam.menuManage 三级路由
	"devTeam.menuManage.catalog",
	"devTeam.menuManage.group",
	"devTeam.menuManage.item",
	// devTeam.cacheManage 三级路由
	"devTeam.cacheManage.refreshCache",
	// devTeam.configManage 三级路由
	"devTeam.configManage.type",
	"devTeam.configManage.item",
	"devTeam.configManage.dictionary",
	"devTeam.configManage.center",
	// operationTeam.systemManage 三级路由
	"operationTeam.systemManage.changePassword",
	"operationTeam.systemManage.systemConfig",
	"operationTeam.systemManage.registerProtocol",
	"operationTeam.systemManage.initializeCell",
	"operationTeam.systemManage.communityConfiguration",
	// operationTeam.dataManage 三级路由
	"operationTeam.dataManage.communityInformation",
	"operationTeam.dataManage.propertyManagementCompany",
	// operationTeam.merchantManage 三级路由
	"operationTeam.merchantManage.merchantInfo",
	"operationTeam.merchantManage.merchantAdmin",
	// operationTeam.reportConfiguration 三级路由
	"operationTeam.reportConfiguration.reportGroup",
	"operationTeam.reportConfiguration.reportInfo",
	"operationTeam.reportConfiguration.reportComponent",
	// propertyManage.communityManage 三级路由
	"propertyManage.communityManage.houseDecoration",
	"propertyManage.communityManage.buildingSpaceStructureDiagram",
	"propertyManage.communityManage.notice",
	"propertyManage.communityManage.propertyRegister",
	"propertyManage.communityManage.handingBusiness",
	"propertyManage.communityManage.my",
	"propertyManage.communityManage.parkingSpaceStructureDiagram",
	// propertyManage.contractManage 三级路由
	"propertyManage.contractManage.change",
	"propertyManage.contractManage.draftContract",
	"propertyManage.contractManage.expire",
	"propertyManage.contractManage.firstParty",
	"propertyManage.contractManage.type",
	// propertyManage.expenseManage 三级路由
	"propertyManage.expenseManage.waterAndElectricityMeterReading",
	"propertyManage.expenseManage.vehicleCharge",
	"propertyManage.expenseManage.reminderForOverduePayments",
	"propertyManage.expenseManage.reprintVoucher",
	"propertyManage.expenseManage.overduePaymentInformation",
	"propertyManage.expenseManage.paymentReview",
	"propertyManage.expenseManage.refundReview",
	"propertyManage.expenseManage.houseCharge",
	"propertyManage.expenseManage.meterReadingType",
	"propertyManage.expenseManage.discountType",
	"propertyManage.expenseManage.expenseSummaryTable",
	"propertyManage.expenseManage.discountApply",
	"propertyManage.expenseManage.discountSetting",
	"propertyManage.expenseManage.contracteCharge",
	"propertyManage.expenseManage.expenseItemSetting",
	"propertyManage.expenseManage.cancelFee",
	// propertyManage.housePropertyManage 三级路由
	"propertyManage.housePropertyManage.house",
	"propertyManage.housePropertyManage.invoice",
	"propertyManage.housePropertyManage.invoiceTitle",
	"propertyManage.housePropertyManage.ownerAccount",
	"propertyManage.housePropertyManage.ownerInformation",
	"propertyManage.housePropertyManage.ownerMember",
	"propertyManage.housePropertyManage.ownersCommittee",
	"propertyManage.housePropertyManage.reserveVenue",
	"propertyManage.housePropertyManage.reserveVenueOrder",
	"propertyManage.housePropertyManage.siteManagement",
	// propertyManage.parkingManage 三级路由
	"propertyManage.parkingManage.carportApply",
	"propertyManage.parkingManage.carportInfo",
	"propertyManage.parkingManage.ownerVehicle",
	"propertyManage.parkingManage.parkingLot",
	// propertyManage.patrolManage 三级路由
	"propertyManage.patrolManage.detail",
	"propertyManage.patrolManage.item",
	"propertyManage.patrolManage.path",
	"propertyManage.patrolManage.plan",
	"propertyManage.patrolManage.point",
	"propertyManage.patrolManage.task",
	// propertyManage.repairsManage 三级路由
	"propertyManage.repairsManage.issues",
	"propertyManage.repairsManage.mandatoryReturnIssue",
	"propertyManage.repairsManage.phoneReportRepairs",
	"propertyManage.repairsManage.repairsHaveDone",
	"propertyManage.repairsManage.repairsSetting",
	"propertyManage.repairsManage.repairsTodo",
	"propertyManage.repairsManage.returnVisit",
	// propertyManage.reportManage 三级路由
	"propertyManage.reportManage.arrearsDetailsList",
	"propertyManage.reportManage.dataStatistics",
	"propertyManage.reportManage.depositReport",
	"propertyManage.reportManage.expenseSummaryTable",
	"propertyManage.reportManage.feeReminder",
	"propertyManage.reportManage.noChargeHouse",
	"propertyManage.reportManage.outstandingFeesAnalysis",
	"propertyManage.reportManage.ownerPaymentDetails",
	"propertyManage.reportManage.patrolReport",
	"propertyManage.reportManage.paymentDetailsForm",
	"propertyManage.reportManage.repairReportForm",
	"propertyManage.reportManage.repairReportsSummaryTable",
	"propertyManage.reportManage.statementExpenses",
] as const;

/**
 * 路由路径类型约束
 * @description 从常量数组派生的类型定义
 */
export type RankRouteKeys = (typeof RANK_ROUTE_KEYS)[number];
