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

export interface FeeService {
	listAdminHouseCharges: FeeRepository["listHouseCharges"];
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

export function createFeeService(repository: FeeRepository): FeeService {
	return {
		listAdminHouseCharges: (params: ListHouseChargesParams) => repository.listHouseCharges(params),
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
