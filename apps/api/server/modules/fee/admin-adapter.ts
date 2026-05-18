import type { JsonVO, PageDTO, PaymentDetailsFormListItem } from "@01s-11comm/type";
import type {
	AdminExpenseItemSettingListItem,
	AdminExpenseSummaryTableListItem,
	AdminReportExpenseSummaryTableListItem,
	AdminMeterReadingTypeListItem,
	AdminRefundReviewListItem,
	ArrearsDetailsListItem,
	CancelFeeListItem,
	ContracteChargeListItem,
	DiscountApplyListItem,
	DataStatisticsListItem,
	DepositReportListItem,
	DiscountSettingListItem,
	DiscountTypeListItem,
	FeeReminderListItem,
	NoChargeHouseListItem,
	OutstandingFeesAnalysisListItem,
	PatrolReportListItem,
	ReminderForOverduePaymentListItem,
	ReprintVoucherListItem,
	AdminExpenseItemSettingPage,
	AdminHouseChargeListItem,
	ExpenseItemSettingDeletePolicy,
	ExpenseItemSettingMutationInput,
	OverduePaymentInformationListItem,
	PaymentReviewListItem,
	VehicleChargeListItem,
	WaterAndElectricityMeterReadingListItem,
	OwnerPaymentDetailsListItem,
	RepairReportFormListItem,
	RepairReportsSummaryTableListItem,
	StatementExpensesListItem,
} from "./types";
import { FeeValidationError, type FeeService } from "./service";
import { adminSuccess } from "../../shared/runtime/response-builder";
import { toPaymentDetailsFormItem } from "./repository";

export function createAdminFeeAdapter(service: FeeService) {
	return {
		async getHouseChargeDetail(input: { id?: unknown }): Promise<JsonVO<AdminHouseChargeListItem | null>> {
			return withValidation(async () => adminSuccess(await service.getHouseChargeDetail(toTrimmedString(input.id))));
		},
		async listHouseCharges(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			expenseItem?: string;
			billingPeriod?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<AdminHouseChargeListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listAdminHouseCharges({
				pageIndex,
				pageSize,
				expenseItem: blankToUndefined(input.expenseItem),
				billingPeriod: blankToUndefined(input.billingPeriod),
				status: blankToUndefined(input.status),
			});

			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listExpenseItemSettings(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			code?: string;
			expenseItem?: string;
			expenseIdentifier?: string;
			paymentType?: string;
			accountDeduction?: string;
			status?: string;
		}): Promise<JsonVO<AdminExpenseItemSettingPage>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listExpenseItemSettings({
				pageIndex,
				pageSize,
				code: blankToUndefined(input.code),
				expenseItem: blankToUndefined(input.expenseItem),
				expenseIdentifier: blankToUndefined(input.expenseIdentifier),
				paymentType: blankToUndefined(input.paymentType),
				accountDeduction: blankToUndefined(input.accountDeduction),
				status: blankToUndefined(input.status),
			});

			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async getExpenseItemSettingDetail(input: {
			id?: unknown;
		}): Promise<JsonVO<AdminExpenseItemSettingListItem | null>> {
			return withValidation(async () =>
				adminSuccess(await service.getExpenseItemSettingDetail(toTrimmedString(input.id))),
			);
		},
		async createExpenseItemSetting(
			input: ExpenseItemSettingMutationInput,
		): Promise<JsonVO<AdminExpenseItemSettingListItem | null>> {
			return withValidation(async () => adminSuccess(await service.createExpenseItemSetting(input), "淇濆瓨鎴愬姛"));
		},
		async updateExpenseItemSetting(
			input: ExpenseItemSettingMutationInput,
		): Promise<JsonVO<AdminExpenseItemSettingListItem | null>> {
			return withValidation(async () =>
				adminSuccess(
					await service.updateExpenseItemSetting({
						...input,
						id: toTrimmedString(input.id),
					}),
					"淇濆瓨鎴愬姛",
				),
			);
		},
		async deleteExpenseItemSetting(input: { id?: unknown }): Promise<JsonVO<ExpenseItemSettingDeletePolicy | null>> {
			return withValidation(async () => {
				const result = await service.deleteExpenseItemSetting(toTrimmedString(input.id));

				return {
					success: false,
					code: 405,
					message: result.reason,
					data: result,
				};
			});
		},
		async listPaymentDetailsForm(input: {
			pageIndex?: number;
			pageSize?: number;
			name?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<PaymentDetailsFormListItem>>> {
			const pageIndex = toNumber(input.pageIndex, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.getPayFeeDetailReport({
				page: pageIndex,
				row: pageSize,
				communityId: "COMM_001",
				name: blankToUndefined(input.name),
				status: blankToUndefined(input.status),
			});

			return adminSuccess({
				list: result.list.map(toPaymentDetailsFormItem),
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listReminderForOverduePayments(input: {
			page?: number;
			pageSize?: number;
			name?: string;
		}): Promise<JsonVO<PageDTO<ReminderForOverduePaymentListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listReminderForOverduePayments({
				page: pageIndex,
				pageSize: pageSize,
				name: blankToUndefined(input.name),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listReprintVouchers(input: {
			page?: number;
			pageSize?: number;
			name?: string;
		}): Promise<JsonVO<PageDTO<ReprintVoucherListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listReprintVouchers({
				page: pageIndex,
				pageSize: pageSize,
				name: blankToUndefined(input.name),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listExpenseSummaryTables(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			time?: string;
			expenseItemId?: string;
			expenseItemName?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<AdminExpenseSummaryTableListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listExpenseSummaryTables({
				pageIndex,
				pageSize,
				time: blankToUndefined(input.time),
				expenseItemId: blankToUndefined(input.expenseItemId),
				expenseItemName: blankToUndefined(input.expenseItemName),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listReportExpenseSummaryTables(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			houseNumberContractName?: string;
			ownerName?: string;
			ownerPhone?: string;
			time?: string;
			expenseItemName?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<AdminReportExpenseSummaryTableListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listReportExpenseSummaryTables({
				pageIndex,
				pageSize,
				houseNumberContractName: blankToUndefined(input.houseNumberContractName),
				ownerName: blankToUndefined(input.ownerName),
				ownerPhone: blankToUndefined(input.ownerPhone),
				time: blankToUndefined(input.time),
				expenseItemName: blankToUndefined(input.expenseItemName),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listRefundReviews(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			applicant?: string;
			status?: string;
			sortBy?: "createTime" | "updateTime";
			sortOrder?: "asc" | "desc";
		}): Promise<JsonVO<PageDTO<AdminRefundReviewListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listRefundReviews({
				pageIndex,
				pageSize,
				applicant: blankToUndefined(input.applicant),
				status: blankToUndefined(input.status),
				sortBy: input.sortBy,
				sortOrder: input.sortOrder,
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listMeterReadingTypes(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			typeName?: string;
			typeCode?: string;
			status?: string;
			sortBy?: "createTime" | "updateTime";
			sortOrder?: "asc" | "desc";
		}): Promise<JsonVO<PageDTO<AdminMeterReadingTypeListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listMeterReadingTypes({
				pageIndex,
				pageSize,
				typeName: blankToUndefined(input.typeName),
				typeCode: blankToUndefined(input.typeCode),
				status: blankToUndefined(input.status),
				sortBy: input.sortBy,
				sortOrder: input.sortOrder,
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listOverduePaymentInformation(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			chargeObject?: string;
			ownerName?: string;
			phoneNumber?: string;
			startTime?: string;
			endTime?: string;
			sortBy?: "createTime" | "updateTime";
			sortOrder?: "asc" | "desc";
		}): Promise<JsonVO<PageDTO<OverduePaymentInformationListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 10);
			const result = await service.listOverduePaymentInformation({
				pageIndex,
				pageSize,
				chargeObject: blankToUndefined(input.chargeObject),
				ownerName: blankToUndefined(input.ownerName),
				phoneNumber: blankToUndefined(input.phoneNumber),
				startTime: blankToUndefined(input.startTime),
				endTime: blankToUndefined(input.endTime),
				sortBy: input.sortBy,
				sortOrder: input.sortOrder,
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listVehicleCharges(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			ownerName?: string;
			status?: string;
			sortBy?: "createTime" | "updateTime";
			sortOrder?: "asc" | "desc";
		}): Promise<JsonVO<PageDTO<VehicleChargeListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listVehicleCharges({
				pageIndex,
				pageSize,
				ownerName: blankToUndefined(input.ownerName),
				status: blankToUndefined(input.status),
				sortBy: input.sortBy,
				sortOrder: input.sortOrder,
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listWaterAndElectricityMeterReading(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			meterId?: string;
			meterType?: string;
			sortBy?: "createTime" | "updateTime";
			sortOrder?: "asc" | "desc";
		}): Promise<JsonVO<PageDTO<WaterAndElectricityMeterReadingListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listWaterAndElectricityMeterReadings({
				pageIndex,
				pageSize,
				meterId: blankToUndefined(input.meterId),
				meterType: blankToUndefined(input.meterType),
				sortBy: input.sortBy,
				sortOrder: input.sortOrder,
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listPaymentReviews(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			reviewer?: string;
			reviewResult?: string;
			sortBy?: "createTime" | "updateTime";
			sortOrder?: "asc" | "desc";
		}): Promise<JsonVO<PageDTO<PaymentReviewListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listPaymentReviews({
				pageIndex,
				pageSize,
				reviewer: blankToUndefined(input.reviewer),
				reviewResult: blankToUndefined(input.reviewResult),
				sortBy: input.sortBy,
				sortOrder: input.sortOrder,
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listArrearsDetailsList(input: {
			pageIndex?: number;
			pageSize?: number;
			name?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<ArrearsDetailsListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listArrearsDetailsList({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listDataStatistics(input: {
			pageIndex?: number;
			pageSize?: number;
			name?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<DataStatisticsListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listDataStatistics({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listDepositReport(input: {
			pageIndex?: number;
			pageSize?: number;
			name?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<DepositReportListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listDepositReport({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listFeeReminder(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			name?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<FeeReminderListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listFeeReminder({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listNoChargeHouse(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			name?: string;
		}): Promise<JsonVO<PageDTO<NoChargeHouseListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listNoChargeHouse({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listOutstandingFeesAnalysis(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			name?: string;
		}): Promise<JsonVO<PageDTO<OutstandingFeesAnalysisListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listOutstandingFeesAnalysis({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listPatrolReport(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			name?: string;
		}): Promise<JsonVO<PageDTO<PatrolReportListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listPatrolReport({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listDiscountSettings(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			applicableItem?: string;
			discountType?: string;
			status?: string;
			sortBy?: "createTime" | "updateTime";
			sortOrder?: "asc" | "desc";
		}): Promise<JsonVO<PageDTO<DiscountSettingListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listDiscountSettings({
				pageIndex,
				pageSize,
				applicableItem: blankToUndefined(input.applicableItem),
				discountType: blankToUndefined(input.discountType),
				status: blankToUndefined(input.status),
				sortBy: input.sortBy,
				sortOrder: input.sortOrder,
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listDiscountTypes(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			discountName?: string;
			discountType?: string;
			status?: string;
			sortBy?: "createTime" | "updateTime";
			sortOrder?: "asc" | "desc";
		}): Promise<JsonVO<PageDTO<DiscountTypeListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listDiscountTypes({
				pageIndex,
				pageSize,
				discountName: blankToUndefined(input.discountName),
				discountType: blankToUndefined(input.discountType),
				status: blankToUndefined(input.status),
				sortBy: input.sortBy,
				sortOrder: input.sortOrder,
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listCancelFees(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			chargeId?: string;
			chargeType?: string;
			employee?: string;
			cancelReason?: string;
			auditStatus?: string;
			sortBy?: "createTime" | "updateTime";
			sortOrder?: "asc" | "desc";
		}): Promise<JsonVO<PageDTO<CancelFeeListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listCancelFees({
				pageIndex,
				pageSize,
				chargeId: blankToUndefined(input.chargeId),
				chargeType: blankToUndefined(input.chargeType),
				employee: blankToUndefined(input.employee),
				cancelReason: blankToUndefined(input.cancelReason),
				auditStatus: blankToUndefined(input.auditStatus),
				sortBy: input.sortBy,
				sortOrder: input.sortOrder,
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listContracteCharges(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			contractNumber?: string;
			expenseItem?: string;
			status?: string;
			sortBy?: "createTime" | "updateTime";
			sortOrder?: "asc" | "desc";
		}): Promise<JsonVO<PageDTO<ContracteChargeListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listContracteCharges({
				pageIndex,
				pageSize,
				contractNumber: blankToUndefined(input.contractNumber),
				expenseItem: blankToUndefined(input.expenseItem),
				status: blankToUndefined(input.status),
				sortBy: input.sortBy,
				sortOrder: input.sortOrder,
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listDiscountApplies(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			applicant?: string;
			applicationType?: string;
			auditStatus?: string;
			sortBy?: "createTime" | "updateTime";
			sortOrder?: "asc" | "desc";
		}): Promise<JsonVO<PageDTO<DiscountApplyListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listDiscountApplies({
				pageIndex,
				pageSize,
				applicant: blankToUndefined(input.applicant),
				applicationType: blankToUndefined(input.applicationType),
				auditStatus: blankToUndefined(input.auditStatus),
				sortBy: input.sortBy,
				sortOrder: input.sortOrder,
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listOwnerPaymentDetails(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			houseNumberContractName?: string;
			ownerName?: string;
			ownerPhone?: string;
			feeCategory?: string;
			feeItem?: string;
			community?: string;
			year?: string;
		}): Promise<JsonVO<PageDTO<OwnerPaymentDetailsListItem>>> {
			const pageIndex = toNumber(input.page ?? input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listOwnerPaymentDetails({
				pageIndex,
				pageSize,
				houseNumberContractName: blankToUndefined(input.houseNumberContractName),
				ownerName: blankToUndefined(input.ownerName),
				ownerPhone: blankToUndefined(input.ownerPhone),
				feeCategory: blankToUndefined(input.feeCategory),
				feeItem: blankToUndefined(input.feeItem),
				community: blankToUndefined(input.community),
				year: blankToUndefined(input.year),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listRepairReportForm(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			repairType?: string;
			repairStatus?: string;
			urgencyLevel?: string;
			reporter?: string;
			reporterPhone?: string;
			community?: string;
			reportTimeStart?: string;
			reportTimeEnd?: string;
			feeStatus?: string;
		}): Promise<JsonVO<PageDTO<RepairReportFormListItem>>> {
			const pageIndex = toNumber(input.page ?? input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listRepairReportForm({
				pageIndex,
				pageSize,
				repairType: blankToUndefined(input.repairType),
				repairStatus: blankToUndefined(input.repairStatus),
				urgencyLevel: blankToUndefined(input.urgencyLevel),
				reporter: blankToUndefined(input.reporter),
				reporterPhone: blankToUndefined(input.reporterPhone),
				community: blankToUndefined(input.community),
				reportTimeStart: blankToUndefined(input.reportTimeStart),
				reportTimeEnd: blankToUndefined(input.reportTimeEnd),
				feeStatus: blankToUndefined(input.feeStatus),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listRepairReportsSummaryTable(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			repairType?: string;
			repairStatus?: string;
			urgencyLevel?: string;
			community?: string;
			statisticsStartTime?: string;
			statisticsEndTime?: string;
		}): Promise<JsonVO<PageDTO<RepairReportsSummaryTableListItem>>> {
			const pageIndex = toNumber(input.page ?? input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listRepairReportsSummaryTable({
				pageIndex,
				pageSize,
				repairType: blankToUndefined(input.repairType),
				repairStatus: blankToUndefined(input.repairStatus),
				urgencyLevel: blankToUndefined(input.urgencyLevel),
				community: blankToUndefined(input.community),
				statisticsStartTime: blankToUndefined(input.statisticsStartTime),
				statisticsEndTime: blankToUndefined(input.statisticsEndTime),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
		async listStatementExpenses(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			community?: string;
			houseContractName?: string;
			ownerName?: string;
			expenseType?: string;
			expenseItem?: string;
			expenseStatus?: string;
			paymentMethod?: string;
			billingPeriod?: string;
		}): Promise<JsonVO<PageDTO<StatementExpensesListItem>>> {
			const pageIndex = toNumber(input.page ?? input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listStatementExpenses({
				pageIndex,
				pageSize,
				community: blankToUndefined(input.community),
				houseContractName: blankToUndefined(input.houseContractName),
				ownerName: blankToUndefined(input.ownerName),
				expenseType: blankToUndefined(input.expenseType),
				expenseItem: blankToUndefined(input.expenseItem),
				expenseStatus: blankToUndefined(input.expenseStatus),
				paymentMethod: blankToUndefined(input.paymentMethod),
				billingPeriod: blankToUndefined(input.billingPeriod),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
	};
}

async function withValidation<T>(operation: () => Promise<JsonVO<T>>): Promise<JsonVO<T | null>> {
	try {
		return await operation();
	} catch (error) {
		if (error instanceof FeeValidationError) {
			return adminInputFailure(error.message);
		}

		throw error;
	}
}

function adminInputFailure(message: string): JsonVO<null> {
	return {
		success: false,
		code: 400,
		message: `invalid request: ${message}`,
		data: null,
	};
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function toTrimmedString(value: unknown): string {
	if (value === undefined || value === null) {
		return "";
	}
	return `${value}`.trim();
}

function blankToUndefined(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}
