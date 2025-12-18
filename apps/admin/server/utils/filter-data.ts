/**
 * 通用数据筛选工具函数
 * 用于根据查询参数对数据列表进行筛选
 *
 * @template TItem - 数据项的类型
 * @template TFilters - 筛选条件的类型，必须是 TItem 的部分字段
 *
 * @param data - 原始数据数组
 * @param filters - 筛选条件对象
 * @returns 筛选后的数据数组
 *
 * @example
 * ```typescript
 * const filteredData = filterDataByQuery(
 *   mockConfigCenterData,
 *   { configType: "系统配置", status: "启用" }
 * );
 * ```
 *
 * 筛选规则：
 * - 字符串字段：使用 `.includes()` 进行模糊匹配
 * - 其他字段（枚举、数字等）：使用 `===` 进行精确匹配
 * - 自动忽略空值、null 和 undefined
 * - 多个条件使用 AND 逻辑
 */
export function filterDataByQuery<TItem, TFilters extends Partial<TItem> = Partial<TItem>>(
	data: readonly TItem[],
	filters: TFilters,
): TItem[] {
	// 使用通用筛选模式遍历所有筛选字段
	let filteredData = [...data];

	(Object.keys(filters) as Array<keyof TFilters>).forEach((key) => {
		const filterValue = filters[key];

		// 忽略空值、null 和 undefined
		if (filterValue !== undefined && filterValue !== null && filterValue !== "") {
			filteredData = filteredData.filter((item) => {
				const itemValue = item[key as keyof TItem];

				// 字符串字段使用模糊匹配
				if (typeof itemValue === "string" && typeof filterValue === "string") {
					return itemValue.includes(filterValue);
				}

				// 其他字段(枚举等)使用精确匹配
				// 使用类型断言确保类型兼容性
				return itemValue === (filterValue as unknown as TItem[keyof TItem]);
			});
		}
	});

	return filteredData;
}
