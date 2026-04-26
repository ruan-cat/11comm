import type {
	DataReportQuery,
	FeeConfigQuery,
	FeeDetailQuery,
	FeeRepository,
	LegacyFeeQuery,
	ListHouseChargesParams,
	NativePaymentInput,
	OweFeeCallableQuery,
	OweFeeQuery,
	PayFeeDetailQuery,
	ReportQuery,
	RoomFeeReportQuery,
	WriteOweFeeCallableInput,
} from "./repository";
import type { ExpenseItemSettingMutationInput, ExpenseItemSettingQuery } from "./types";

export interface FeeService {
	listAdminHouseCharges: FeeRepository["listHouseCharges"];
	getHouseChargeDetail: (id: string) => ReturnType<FeeRepository["getHouseChargeDetail"]>;
	listExpenseItemSettings: (params: ExpenseItemSettingQuery) => ReturnType<FeeRepository["listExpenseItemSettings"]>;
	getExpenseItemSettingDetail: (id: string) => ReturnType<FeeRepository["getExpenseItemSettingDetail"]>;
	createExpenseItemSetting: (
		input: ExpenseItemSettingMutationInput,
	) => ReturnType<FeeRepository["createExpenseItemSetting"]>;
	updateExpenseItemSetting: (
		input: ExpenseItemSettingMutationInput & { id: string },
	) => ReturnType<FeeRepository["updateExpenseItemSetting"]>;
	deleteExpenseItemSetting: (id: string) => ReturnType<FeeRepository["deleteExpenseItemSetting"]>;
	listLegacyFees: (params: LegacyFeeQuery) => ReturnType<FeeRepository["listLegacyFees"]>;
	listFeeDetails: (params: FeeDetailQuery) => ReturnType<FeeRepository["listFeeDetails"]>;
	listOweFees: (params: OweFeeQuery) => ReturnType<FeeRepository["listOweFees"]>;
	createNativeQrcodePayment: (params: NativePaymentInput) => ReturnType<FeeRepository["createNativeQrcodePayment"]>;
	listOweFeeCallables: (params: OweFeeCallableQuery) => ReturnType<FeeRepository["listOweFeeCallables"]>;
	writeOweFeeCallable: (params: WriteOweFeeCallableInput) => ReturnType<FeeRepository["writeOweFeeCallable"]>;
	saveRoomCreateFee: (params: Record<string, unknown>) => ReturnType<FeeRepository["saveRoomCreateFee"]>;
	listFeeConfigs: (params: FeeConfigQuery) => ReturnType<FeeRepository["listFeeConfigs"]>;
	getFeeSummaryReport: (params: ReportQuery) => ReturnType<FeeRepository["getFeeSummaryReport"]>;
	getPayFeeDetailReport: (params: PayFeeDetailQuery) => ReturnType<FeeRepository["getPayFeeDetailReport"]>;
	getRoomFeeReport: (params: RoomFeeReportQuery) => ReturnType<FeeRepository["getRoomFeeReport"]>;
	getDataReport: (params: DataReportQuery) => ReturnType<FeeRepository["getDataReport"]>;
}

export class FeeValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "FeeValidationError";
	}
}

export function createFeeService(repository: FeeRepository): FeeService {
	return {
		listAdminHouseCharges: (params: ListHouseChargesParams) => repository.listHouseCharges(params),
		async getHouseChargeDetail(id) {
			requireId(id);
			const detail = await repository.getHouseChargeDetail(id);
			if (!detail) {
				throw new Error(`House charge not found: ${id}`);
			}

			return detail;
		},
		listExpenseItemSettings: (params) => repository.listExpenseItemSettings(params),
		async getExpenseItemSettingDetail(id) {
			requireId(id);
			const detail = await repository.getExpenseItemSettingDetail(id);
			if (!detail) {
				throw new Error(`Expense item setting not found: ${id}`);
			}

			return detail;
		},
		createExpenseItemSetting: (input) => {
			requireExpenseItemSettingCreate(input);
			return repository.createExpenseItemSetting(input);
		},
		updateExpenseItemSetting: (input) => {
			requireId(input.id);
			return repository.updateExpenseItemSetting(input);
		},
		deleteExpenseItemSetting: (id) => {
			requireId(id);
			return repository.deleteExpenseItemSetting(id);
		},
		listLegacyFees: (params) => repository.listLegacyFees(params),
		listFeeDetails: (params) => repository.listFeeDetails(params),
		listOweFees: (params) => repository.listOweFees(params),
		createNativeQrcodePayment: (params) => repository.createNativeQrcodePayment(params),
		listOweFeeCallables: (params) => repository.listOweFeeCallables(params),
		writeOweFeeCallable: (params) => repository.writeOweFeeCallable(params),
		saveRoomCreateFee: (params) => repository.saveRoomCreateFee(params),
		listFeeConfigs: (params) => repository.listFeeConfigs(params),
		getFeeSummaryReport: (params) => repository.getFeeSummaryReport(params),
		getPayFeeDetailReport: (params) => repository.getPayFeeDetailReport(params),
		getRoomFeeReport: (params) => repository.getRoomFeeReport(params),
		getDataReport: (params) => repository.getDataReport(params),
	};
}

function requireId(id: unknown): asserts id is string {
	if (typeof id !== "string" || id.trim() === "") {
		throw new FeeValidationError("id is required");
	}
}

function requireExpenseItemSettingCreate(input: ExpenseItemSettingMutationInput): void {
	const missing = [];
	if (!input.code || String(input.code).trim() === "") {
		missing.push("code");
	}
	if (!input.feeType || String(input.feeType).trim() === "") {
		missing.push("feeType");
	}
	if (!input.expenseItem || String(input.expenseItem).trim() === "") {
		missing.push("expenseItem");
	}

	if (missing.length > 0) {
		throw new FeeValidationError(`${missing.join(", ")} required`);
	}
}
