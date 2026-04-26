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
