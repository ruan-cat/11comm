/**
 * 移除掉 pageIndex 和 pageSize 字段
 * @description
 * 用于定义搜索栏对象时 去除不必要的分页字段
 */
export type RemovePageIndexAndPageSize<T> = Omit<T, "pageIndex" | "pageSize">;
