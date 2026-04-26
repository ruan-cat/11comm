import type { JsonVO, PageDTO, PaymentDetailsFormListItem } from "@01s-11comm/type";
import type {
	AdminExpenseItemSettingListItem,
	AdminExpenseItemSettingPage,
	AdminHouseChargeListItem,
	ExpenseItemSettingDeletePolicy,
	ExpenseItemSettingMutationInput,
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
			const pageIndex = toNumber(input.pageIndex ?? input.page, 1);
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
			const pageIndex = toNumber(input.pageIndex ?? input.page, 1);
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
			return withValidation(async () => adminSuccess(await service.createExpenseItemSetting(input), "保存成功"));
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
					"保存成功",
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
