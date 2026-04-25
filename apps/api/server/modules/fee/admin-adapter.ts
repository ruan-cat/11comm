import type { JsonVO, PageDTO, PaymentDetailsFormListItem } from "@01s-11comm/type";
import type { AdminHouseChargeListItem } from "./types";
import type { FeeService } from "./service";
import { adminSuccess } from "../../shared/runtime/response-builder";
import { toPaymentDetailsFormItem } from "./repository";

export function createAdminFeeAdapter(service: FeeService) {
	return {
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

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function blankToUndefined(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}
