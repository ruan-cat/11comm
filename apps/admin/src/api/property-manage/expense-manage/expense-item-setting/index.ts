/**
 * @file expense-item-setting API Hook
 * @description ExpenseItemSetting API hooks using TanStack Query
 */

import { useListQuery } from "@/composables/use-list-query";
import { http } from "@/utils/http";
import { isAdminApiShadowEnabled, resolveAdminShadowApiBaseUrl } from "@/utils/http/api-base-url";
import type { ExpenseItemSettingListItem, ExpenseItemSettingQueryParams, JsonVO } from "@01s-11comm/type";

/** API 路径前缀 */
const API_PREFIX = "/api/property-manage/expense-manage/expense-item-setting";

/** API 路径 */
const LIST_API_URL = resolvePhase5ApiUrl(`${API_PREFIX}/list`);
const DETAIL_API_URL = resolvePhase5ApiUrl(`${API_PREFIX}/detail`);
const CREATE_API_URL = resolvePhase5ApiUrl(`${API_PREFIX}/create`);
const UPDATE_API_URL = resolvePhase5ApiUrl(`${API_PREFIX}/update`);
const DELETE_API_URL = resolvePhase5ApiUrl(`${API_PREFIX}/delete`);

/** 查询键前缀 */
const QUERY_KEY_PREFIX = "expenseItemSetting";

export interface ExpenseItemSettingDetailPayload {
	id: string;
}

export type ExpenseItemSettingDetailVO = ExpenseItemSettingListItem & {
	mobilePayment?: string;
	roundingMode?: string;
	decimalPlaces?: number;
};

export interface ExpenseItemSettingCreatePayload {
	code?: string;
	feeType?: string;
	expenseItem?: string;
	expenseIdentifier?: string;
	paymentType?: string;
	paymentCycle?: string;
	prepaymentPeriod?: string;
	unit?: string;
	accountDeduction?: string | boolean;
	mobilePayment?: string | boolean;
	roundingMode?: string;
	decimalPlaces?: string | number;
	status?: string;
	formula?: string;
	billingUnitPrice?: string | number;
	fixedFee?: string | number;
	remark?: string | null;
}

export type ExpenseItemSettingUpdatePayload = ExpenseItemSettingCreatePayload & {
	id: string;
};

export interface ExpenseItemSettingDeletePayload {
	id: string;
}

export interface ExpenseItemSettingDeleteResult {
	id: string;
	success: false;
	allowed: false;
	deleted: false;
	status: "unsupported";
	reason: string;
}

/**
 * expense-item-setting列表查询 Hook
 * ExpenseItemSetting list query hook
 * @param initialParams - Initial query parameters for filtering the list
 */
export function useExpenseItemSettingListQuery(initialParams: Partial<ExpenseItemSettingQueryParams>) {
	return useListQuery<ExpenseItemSettingListItem, ExpenseItemSettingQueryParams>({
		queryKeyPrefix: QUERY_KEY_PREFIX,
		apiUrl: LIST_API_URL,
		initialParams,
	});
}

export function getExpenseItemSettingDetail(payload: ExpenseItemSettingDetailPayload) {
	return http.post<JsonVO<ExpenseItemSettingDetailVO | null>, ExpenseItemSettingDetailPayload>(DETAIL_API_URL, {
		data: payload,
	});
}

export function createExpenseItemSetting(payload: ExpenseItemSettingCreatePayload) {
	return http.post<JsonVO<ExpenseItemSettingDetailVO | null>, ExpenseItemSettingCreatePayload>(CREATE_API_URL, {
		data: payload,
	});
}

export function updateExpenseItemSetting(payload: ExpenseItemSettingUpdatePayload) {
	return http.post<JsonVO<ExpenseItemSettingDetailVO | null>, ExpenseItemSettingUpdatePayload>(UPDATE_API_URL, {
		data: payload,
	});
}

export function deleteExpenseItemSetting(payload: ExpenseItemSettingDeletePayload) {
	return http.post<JsonVO<ExpenseItemSettingDeleteResult | null>, ExpenseItemSettingDeletePayload>(
		DELETE_API_URL,
		{
			data: payload,
		},
		{
			validateStatus: () => true,
		},
	);
}

function resolvePhase5ApiUrl(path: string): string {
	if (!isAdminApiShadowEnabled(import.meta.env)) {
		return path;
	}

	return `${resolveAdminShadowApiBaseUrl(import.meta.env)}${path}`;
}

export default useExpenseItemSettingListQuery;
