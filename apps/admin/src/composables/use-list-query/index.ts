/**
 * @file 列表查询通用 Hook
 * @description 基于 TanStack Query 的列表数据获取 Hook，提供统一的分页、筛选、缓存功能
 */

import { useQuery, type UseQueryReturnType, keepPreviousData } from "@tanstack/vue-query";
import { ref, computed, watch, type Ref, type ComputedRef } from "vue";
import type { JsonVO, PageDTO, BaseListQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_INDEX } from "@01s-11comm/type";
import { http } from "@/utils/http";

/**
 * useListQuery 配置选项
 * useListQuery configuration options
 */
export interface UseListQueryOptions<TItem, TParams extends BaseListQueryParams = BaseListQueryParams> {
	/** 查询键前缀 Query key prefix */
	queryKeyPrefix: string;
	/** API 接口路径 API endpoint path */
	apiUrl: string;
	/** 初始查询参数 Initial query parameters */
	initialParams?: Partial<TParams>;
	/** 是否立即执行查询 Enable query immediately */
	enabled?: boolean | Ref<boolean>;
	/** 数据保持新鲜时间（毫秒） Stale time in milliseconds */
	staleTime?: number;
}

/**
 * useListQuery 返回值类型
 * useListQuery return type
 */
export interface UseListQueryReturn<TItem, TParams extends BaseListQueryParams = BaseListQueryParams> {
	/** 表格数据列表 Table data list */
	tableData: Ref<TItem[]>;
	/** 数据总数 Total count */
	total: Ref<number>;
	/** 当前页码 Current page */
	pageIndex: Ref<number>;
	/** 每页大小 Page size */
	pageSize: Ref<number>;
	/** 总页数 Total pages */
	totalPages: ComputedRef<number>;
	/** 查询参数 Query parameters */
	queryParams: Ref<TParams>;
	/** 是否正在加载 Loading state */
	isLoading: Ref<boolean>;
	/** 是否正在获取数据 Fetching state */
	isFetching: Ref<boolean>;
	/** 错误信息 Error message */
	error: Ref<Error | null>;
	/** 执行查询 Execute query */
	doFetch: () => Promise<void>;
	/** 更新查询参数 Update query parameters */
	updateParams: (params: Partial<TParams>) => void;
	/** 重置查询参数 Reset query parameters */
	resetParams: () => void;
	/** 原始 Query 对象 Original query object */
	tanStackQueryObject: UseQueryReturnType<JsonVO<PageDTO<TItem>>, Error>;
}

/**
 * 列表查询通用 Hook
 * @description 提供统一的列表数据获取、分页、筛选功能
 * @param options 配置选项
 * @returns 列表查询返回值
 */
export function useListQuery<TItem, TParams extends BaseListQueryParams>(
	options: UseListQueryOptions<TItem, TParams>,
): UseListQueryReturn<TItem, TParams> {
	const { queryKeyPrefix, apiUrl, initialParams, enabled = true, staleTime = 5 * 60 * 1000 } = options;

	/** 初始参数对象 */
	const defaultParams: TParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
		...initialParams,
	} as TParams;

	/** 查询参数 */
	const queryParams = ref<TParams>({ ...defaultParams }) as Ref<TParams>;

	/** 表格数据 */
	const tableData = ref<TItem[]>([]) as Ref<TItem[]>;

	/** 数据总数 */
	const total = ref<number>(0);

	/** 当前页码 */
	const pageIndex = computed({
		get: () => queryParams.value.pageIndex,
		set: (val) => {
			queryParams.value.pageIndex = val;
		},
	});

	/** 每页大小 */
	const pageSize = computed({
		get: () => queryParams.value.pageSize,
		set: (val) => {
			queryParams.value.pageSize = val;
		},
	});

	/** 总页数 */
	const totalPages = computed(() => {
		return Math.ceil(total.value / queryParams.value.pageSize);
	});

	/** 查询键 */
	const queryKey = computed(() => [queryKeyPrefix, JSON.stringify(queryParams.value)] as const);

	/** TanStack Query 查询 */
	const tanStackQueryObject = useQuery({
		queryKey: queryKey.value,
		queryFn: async (): Promise<JsonVO<PageDTO<TItem>>> => {
			const response = await http.post<JsonVO<PageDTO<TItem>>, TParams>(apiUrl, { data: queryParams.value });
			return (
				response ??
				({
					code: 500,
					message: "请求失败",
					data: { list: [], total: 0, pageIndex: 1, pageSize: 10, totalPages: 0 },
				} as JsonVO<PageDTO<TItem>>)
			);
		},
		enabled: enabled as boolean,
		placeholderData: keepPreviousData,
		staleTime,
	});

	const { data, isLoading, isError, isFetching, error, refetch } = tanStackQueryObject;

	/** 监听数据变化，更新表格数据 */
	watch(
		data,
		(newData) => {
			if (newData?.code === 200 && newData.data) {
				tableData.value = newData.data.list || [];
				total.value = newData.data.total || 0;
			}
		},
		{ immediate: true, deep: true },
	);

	/** 监听参数变化时更新 queryKey */
	// 根据 queryKey 完成自动监听与触发
	// watch(
	// 	queryParams,
	// 	() => {
	// 		console.log("参数变化了 开始请求", queryParams.value);
	// 		query.refetch();
	// 	},
	// 	{ deep: true },
	// );

	/** 更新查询参数 */
	function updateParams(params: Partial<TParams>) {
		queryParams.value = {
			...queryParams.value,
			...params,
		};
	}

	/**
	 * 重置查询参数
	 * @description 用于搜索栏的重置按钮
	 */
	function resetParams() {
		queryParams.value = { ...defaultParams };
	}

	/**
	 * 执行查询
	 * @description
	 */
	async function doFetch() {
		await refetch();
	}

	return {
		tableData,
		total,
		pageIndex,
		pageSize,
		totalPages,
		queryParams,
		isLoading,
		isFetching,
		error,
		doFetch,
		updateParams,
		resetParams,
		tanStackQueryObject,
	};
}

export default useListQuery;
