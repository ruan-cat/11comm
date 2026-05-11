import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { adminSuccess } from "../../shared/runtime/response-builder";
import type { DevService } from "./service";
import type {
	AdminConfigCenterListItem,
	AdminDictionaryItemListItem,
	AdminDictionaryListItem,
	AdminDictionaryTypeListItem,
	AdminMenuCatalogListItem,
	AdminMenuGroupListItem,
	AdminMenuItemListItem,
	AdminRefreshCacheListItem,
} from "./types";

export function createAdminDevAdapter(service: DevService) {
	return {
		async listRefreshCache(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			cacheId?: string;
			cacheCode?: string;
			cacheName?: string;
			cacheKey?: string;
			cacheType?: string;
			refreshPolicy?: string;
		}): Promise<JsonVO<PageDTO<AdminRefreshCacheListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listRefreshCache({
				pageIndex,
				pageSize,
				cacheId: blankToUndefined(input.cacheId),
				cacheCode: blankToUndefined(input.cacheCode),
				cacheName: blankToUndefined(input.cacheName),
				cacheKey: blankToUndefined(input.cacheKey),
				cacheType: blankToUndefined(input.cacheType),
				refreshPolicy: blankToUndefined(input.refreshPolicy),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listConfigCenter(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			configName?: string;
			configType?: string;
			configKey?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<AdminConfigCenterListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listConfigCenter({
				pageIndex,
				pageSize,
				configName: blankToUndefined(input.configName),
				configType: blankToUndefined(input.configType),
				configKey: blankToUndefined(input.configKey),
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

		async listDictionary(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			dictionaryName?: string;
			dictionaryCode?: string;
			dictionaryType?: string;
		}): Promise<JsonVO<PageDTO<AdminDictionaryListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listDictionary({
				pageIndex,
				pageSize,
				dictionaryName: blankToUndefined(input.dictionaryName),
				dictionaryCode: blankToUndefined(input.dictionaryCode),
				dictionaryType: blankToUndefined(input.dictionaryType),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listDictionaryItem(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			dictionaryId?: string;
			itemName?: string;
			itemCode?: string;
		}): Promise<JsonVO<PageDTO<AdminDictionaryItemListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listDictionaryItem({
				pageIndex,
				pageSize,
				dictionaryId: blankToUndefined(input.dictionaryId),
				itemName: blankToUndefined(input.itemName),
				itemCode: blankToUndefined(input.itemCode),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listDictionaryType(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			typeName?: string;
			typeCode?: string;
		}): Promise<JsonVO<PageDTO<AdminDictionaryTypeListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listDictionaryType({
				pageIndex,
				pageSize,
				typeName: blankToUndefined(input.typeName),
				typeCode: blankToUndefined(input.typeCode),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listMenuCatalog(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			name?: string;
		}): Promise<JsonVO<PageDTO<AdminMenuCatalogListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listMenuCatalog({
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

		async listMenuGroup(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			groupName?: string;
			groupCode?: string;
		}): Promise<JsonVO<PageDTO<AdminMenuGroupListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listMenuGroup({
				pageIndex,
				pageSize,
				groupName: blankToUndefined(input.groupName),
				groupCode: blankToUndefined(input.groupCode),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listMenuItem(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			catalogId?: string;
			menuName?: string;
			menuCode?: string;
		}): Promise<JsonVO<PageDTO<AdminMenuItemListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listMenuItem({
				pageIndex,
				pageSize,
				catalogId: blankToUndefined(input.catalogId),
				menuName: blankToUndefined(input.menuName),
				menuCode: blankToUndefined(input.menuCode),
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
