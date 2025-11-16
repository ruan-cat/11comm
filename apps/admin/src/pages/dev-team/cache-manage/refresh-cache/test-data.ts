import type { OptionsType } from "plus-pro-components";

/** 刷新缓存 列表数据 */
export interface 刷新缓存_列表数据 {
	缓存ID: string;
	缓存编码: string;
	名称: string;
}

/** 刷新缓存 列表查询 VO */
export interface 刷新缓存_列表查询_VO {
	缓存ID?: string;
	缓存编码?: string;
	缓存名称?: string;
}

/** 表格数据 */
export const tableData: 刷新缓存_列表数据[] = Array(35)
	.fill(null)
	.map((_, index) => ({
		缓存ID: `CACHE_${(index + 1).toString().padStart(3, "0")}`,
		缓存编码: `REDIS_${(index + 1).toString().padStart(3, "0")}`,
		名称: `缓存项目${index + 1}`,
	}));
