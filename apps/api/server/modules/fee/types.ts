import type {
	ExpenseItemSettingListItem,
	HouseChargeListItem,
	PageDTO,
	PaymentDetailsFormListItem,
} from "@01s-11comm/type";

export interface LegacyPageQuery {
	page?: number;
	row?: number;
	communityId?: string;
}

export interface AdminPageQuery {
	pageIndex?: number;
	page?: number;
	pageSize?: number;
}

export interface FeeItem {
	feeId: string;
	feeName: string;
	feeType: string;
	feeTypeCdName: string;
	roomId: string;
	roomName: string;
	communityId: string;
	ownerName: string;
	ownerTel: string;
	receivedAmount: number;
	paidAmount: number;
	oweAmount: number;
	startTime: string;
	endTime: string;
	deadlineTime?: string;
	feeFlagName: string;
	state: string;
	stateName: string;
	createTime: string;
	updateTime: string;
}

export interface FeeDetailItem {
	detailId: string;
	feeId: string;
	feeName: string;
	roomId: string;
	roomName: string;
	communityId: string;
	ownerName: string;
	receivedAmount: number;
	payTime: string;
	payMethod: string;
	payState: string;
	createTime: string;
}

export interface OweFeeItem {
	oweFeeId: string;
	feeId: string;
	feeName: string;
	roomId: string;
	roomName: string;
	communityId: string;
	ownerName: string;
	ownerTel: string;
	oweAmount: number;
	startTime: string;
	endTime: string;
	oweDays: number;
	lateFee: number;
	totalAmount: number;
	state: string;
	createTime: string;
}

export interface OweFeeCallableItem {
	amountdOwed: number;
	callableWayName: string;
	createTime: string;
	endTime: string;
	feeId: string;
	feeName: string;
	ownerName: string;
	remark: string;
	staffName: string;
	startTime: string;
}

export interface FeeConfigItem {
	computingFormula: string;
	configId: string;
	feeFlag: string;
	feeName: string;
	feeTypeCd: string;
	isDefault: string;
	valid: number;
}

export interface FeeSummaryReportItem {
	curOweFee: number;
	curReceivableFee: number;
	feeRoomCount: number;
	hisOweFee: number;
	hisReceivedFee: number;
	oweRoomCount: number;
	receivedFee: number;
	roomCount: number;
}

export interface PayFeeDetailReportItem {
	feeId: string;
	feeName: string;
	ownerName: string;
	payMethod: string;
	payTime: string;
	receivedAmount: number;
	roomId: string;
	roomName: string;
	stateName: string;
	collector?: string;
	transactionNo?: string;
}

export interface RoomFeeReportItem {
	feeName: string;
	oweFee: number;
	ownerName: string;
	receivableFee: number;
	receivedFee: number;
	roomId: string;
	roomName: string;
	stateName: string;
}

export interface DataReportItem {
	name: string;
	unit?: string;
	value: number;
}

export interface Paginated<T> {
	list: T[];
	total: number;
	page: number;
	row: number;
}

export type AdminHouseChargeListItem = HouseChargeListItem & {
	houseId: string;
	expenseItem: string;
	receivableAmount: string;
	receivedAmount: string;
	billingPeriod: string;
	billDate: string;
	dueDate: string;
	remark: string;
};

export type AdminHouseChargePage = PageDTO<AdminHouseChargeListItem>;
export type PaymentDetailsFormPage = PageDTO<PaymentDetailsFormListItem>;

export type AdminExpenseItemSettingListItem = ExpenseItemSettingListItem & {
	mobilePayment: string;
	roundingMode: string;
	decimalPlaces: number;
};

export interface ExpenseItemSettingQuery {
	pageIndex: number;
	pageSize: number;
	code?: string;
	expenseItem?: string;
	expenseIdentifier?: string;
	paymentType?: string;
	accountDeduction?: string;
	status?: string;
}

export interface ExpenseItemSettingMutationInput {
	id?: string;
	code?: string;
	feeType?: string;
	expenseItem?: string;
	expenseIdentifier?: string;
	paymentType?: string;
	paymentCycle?: string;
	formula?: string;
	billingUnitPrice?: string | number;
	fixedFee?: string | number;
	accountDeduction?: string | boolean;
	mobilePayment?: string | boolean;
	roundingMode?: string;
	decimalPlaces?: string | number;
	status?: string;
	remark?: string | null;
	unit?: unknown;
	prepaymentPeriod?: unknown;
	prepaidPeriodDays?: unknown;
}

export interface ExpenseItemSettingDeletePolicy {
	id: string;
	success: false;
	allowed: false;
	deleted: false;
	status: "unsupported";
	reason: string;
}

export type AdminExpenseItemSettingPage = PageDTO<AdminExpenseItemSettingListItem>;

// --- Phase7 Batch 6a: 只读极简列表类型 ---

export interface ReminderForOverduePaymentListItem {
	id: string;
	name: string;
	status: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ReprintVoucherListItem {
	id: string;
	name: string;
	status: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ReminderForOverduePaymentsQuery {
	page: number;
	pageSize: number;
	name?: string;
}

export interface ReprintVouchersQuery {
	page: number;
	pageSize: number;
	name?: string;
}

// --- Phase7 Batch 6a: expense-summary-table ---

export interface AdminExpenseSummaryTableListItem {
	id: string;
	time: string;
	expenseItemId: string;
	expenseItemName: string;
	receivableAmount: string;
	actualAmount: string;
	status: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

// --- Phase7 Batch 6a: refund-review ---

export interface AdminRefundReviewListItem {
	id: string;
	chargeId: string;
	chargeType: string;
	refundReason: string;
	refundAmount: string;
	applyTime: string;
	applicant: string;
	status: string;
	reviewer: string;
	reviewTime: string;
	reviewOpinion: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

// --- Phase7 Batch 6a: meter-reading-type ---

export interface AdminMeterReadingTypeListItem {
	id: string;
	typeName: string;
	typeCode: string;
	unitPrice: string;
	billingMethod: string;
	status: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

// --- Phase7 Batch 6b: vehicle-charge ---

export interface VehicleChargeListItem {
	id: string;
	name: string;
	status: string;
	remark?: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListVehicleChargesParams {
	pageIndex: number;
	pageSize: number;
	ownerName?: string;
	status?: string;
	sortBy?: "createTime" | "updateTime";
	sortOrder?: "asc" | "desc";
}

// --- Phase7 Batch 6b: water-and-electricity-meter-reading ---

export interface WaterAndElectricityMeterReadingListItem {
	meterId: string;
	meterType: string;
	objectName: string;
	lastReading: string;
	currentReading: string;
	lastReadingTime: string;
	currentReadingTime: string;
	createTime: string;
	updateTime: string;
}

export interface ListWaterAndElectricityMeterReadingsParams {
	pageIndex: number;
	pageSize: number;
	meterId?: string;
	meterType?: string;
	sortBy?: "createTime" | "updateTime";
	sortOrder?: "asc" | "desc";
}

// --- Phase7 Batch 6b: overdue-payment-information ---

export interface OverduePaymentInformationListItem {
	id: string;
	chargeObject: string;
	ownerName: string;
	phoneNumber: string;
	startTime: string;
	endTime: string;
	totalAmount: string;
	status: string;
	remark?: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListOverduePaymentInformationParams {
	pageIndex: number;
	pageSize: number;
	chargeObject?: string;
	ownerName?: string;
	phoneNumber?: string;
	startTime?: string;
	endTime?: string;
	sortBy?: "createTime" | "updateTime";
	sortOrder?: "asc" | "desc";
}

// --- Phase7 Batch 6b: payment-review ---

export interface PaymentReviewListItem {
	id: string;
	paymentId: string;
	reviewer: string;
	reviewOpinion?: string | null;
	reviewResult: string;
	reviewTime: string;
	remark?: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListPaymentReviewsParams {
	pageIndex: number;
	pageSize: number;
	reviewer?: string;
	reviewResult?: string;
	sortBy?: "createTime" | "updateTime";
	sortOrder?: "asc" | "desc";
}

// --- Phase7 P1: report-manage ---

export interface ArrearsDetailsListItem {
	id: string;
	building: string;
	expenseItem: string;
	outstandingTotal: string;
	periodStart: string;
	periodEnd: string;
	owner: string;
	ownerPhone: string;
	area: string;
	arrearsDuration: string;
	remark?: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListArrearsDetailsListParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
	status?: string;
}

export interface DataStatisticsListItem {
	id: string;
	name: string;
	status: string;
	remark?: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListDataStatisticsParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
	status?: string;
}

export interface DepositReportListItem {
	id: string;
	name: string;
	status: string;
	remark?: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListDepositReportParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
	status?: string;
}

// --- Phase7 P1 report-manage: fee-reminder ---

export interface FeeReminderListItem {
	id: string;
	name: string;
	status: string;
	remark?: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListFeeReminderParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
	status?: string;
}

// --- Phase7 P1 report-manage: no-charge-house ---

export interface NoChargeHouseListItem {
	id: string;
	houseNumberContractName: string;
	ownerName: string;
	community: string;
	building: string;
	unit: string;
	ownerPhone: string;
	remark?: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListNoChargeHouseParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
}

// --- Phase7 P1 report-manage: outstanding-fees-analysis ---

export interface OutstandingFeesAnalysisListItem {
	id: string;
	feeItem: string;
	totalUncollectedAmount: string;
	latestReceivableMonth: string;
	statisticsTime: string;
	unit: string;
	houseNumberContractName: string;
	ownerName: string;
	ownerPhone: string;
	currentUncollectedAmount: string;
	historicalUncollectedAmount: string;
	remark?: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListOutstandingFeesAnalysisParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
}

// --- Phase7 P1 report-manage: patrol-report ---

export interface PatrolReportListItem {
	id: string;
	patrolName: string;
	patrolLevel: string;
	patrolType: string;
	status: string;
	abnormalCount: number;
	community: string;
	responsiblePerson: string;
	remark?: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListPatrolReportParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
}
