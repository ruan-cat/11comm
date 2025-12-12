/**
 * @file 配置中心列表接口
 * @description Configuration center list API
 */

import type { JsonVO } from "@ruan-cat/utils/vueuse";
import type { PageDTO } from "@01s-11comm/type";
import type {
	ConfigCenterListItem,
	ConfigCenterQueryParams,
} from "@01s-11comm/type/src/business/dev-team/config-manage/center";
import { mockConfigCenterData } from "./mock-data";

export default defineEventHandler(
	async (event): Promise<JsonVO<PageDTO<ConfigCenterListItem>>> => {
		const body = await readBody<ConfigCenterQueryParams>(event);
		const { pageIndex = 1, pageSize = 10, ...filters } = body || {};

		/** 数据筛选 */
		let filteredData = [...mockConfigCenterData];

		if (filters.configName) {
			filteredData = filteredData.filter((item) =>
				item.configName.includes(filters.configName!)
			);
		}
		if (filters.configType) {
			filteredData = filteredData.filter(
				(item) => item.configType === filters.configType
			);
		}
		if (filters.status) {
			filteredData = filteredData.filter(
				(item) => item.status === filters.status
			);
		}
		if (filters.configKey) {
			filteredData = filteredData.filter((item) =>
				item.configKey.includes(filters.configKey!)
			);
		}

		/** 分页处理 */
		const total = filteredData.length;
		const startIndex = (pageIndex - 1) * pageSize;
		const pageData = filteredData.slice(startIndex, startIndex + pageSize);

		/** 返回标准格式 */
		return {
			success: true,
			code: 200,
			message: "查询成功",
			data: {
				list: pageData,
				total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(total / pageSize),
			},
			timestamp: Date.now(),
		};
	}
);

