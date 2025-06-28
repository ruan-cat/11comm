import qs from "qs";
import axios, { AxiosError } from "axios";

/**
 * 获取出货未上架查询参数
 * @description
 * 查询出货未上架商品的筛选条件
 */
export interface GetNoUpGoodsParams {
	/**
	 * 储位
	 */
	bin_id?: string;
	/**
	 * 客户编码
	 */
	cus_code?: string;
	/**
	 * 商品编码
	 */
	goods_id?: string;
	/**
	 * 查询页码
	 */
	pageIndex?: number;
	/**
	 * 查询条数
	 */
	pageSize?: number;
	/**
	 * 商品名称
	 */
	shp_ming_cheng?: string;
	/**
	 * 托盘
	 */
	tin_id?: string;
	/**
	 * 客户名称
	 */
	zhong_wen_qch?: string;
}

/**
 * 收货未上架-返回数据
 */
export interface NoUpGoodsDTO {
	/**
	 * 储位
	 */
	bin_id: string;
	/**
	 * 保质期
	 */
	bzhi_qi: string;
	/**
	 * 收货日期
	 */
	create_date: string;
	/**
	 * 客户编码
	 */
	cus_code: string;
	/**
	 * 商品编码
	 */
	goods_id: string;
	/**
	 * 库存状态
	 */
	kucunsta: string;
	/**
	 * 生产日期
	 */
	pro_data: string;
	/**
	 * 数量
	 */
	qm_ok_quat: string;
	/**
	 * 商品单位
	 */
	shl_dan_wei: string;
	/**
	 * 商品名称
	 */
	shp_ming_cheng: string;
	/**
	 * 托盘
	 */
	tin_id: string;
	/**
	 * 客户名称
	 */
	zhong_wen_qch: string;
}

function createAxiosInstance() {
	const VITE_IS_REVERSE_PROXY = import.meta.env?.VITE_IS_REVERSE_PROXY;
	const VITE_PROXY_PREFIX = import.meta.env.VITE_PROXY_PREFIX;
	const VITE_BASE_URL = "https://m1.apifoxmock.com/m1/6142648-5834505-default";
	/**
	 * 根据是否需要反向代理，配置请求地址
	 */
	const baseURL = VITE_IS_REVERSE_PROXY === "true" ? VITE_PROXY_PREFIX : VITE_BASE_URL;

	const instance = axios.create({
		baseURL,

		/** 请求超时时间 */
		timeout: 10000,

		/** 允许跨域 */
		withCredentials: true,

		/**
		 * 在 vitest 内做接口请求时，会使用node环境内的环境变量
		 * 比如 HTTPS_PROXY 变量。这里设置为false，不使用代理。
		 */
		proxy: false,
	});

	// 使用qs序列化参数params参数
	instance.defaults.paramsSerializer = function (params) {
		return qs.stringify(params);
	};

	return instance;
}

const axiosInstance = createAxiosInstance();

/**
 * 获取出货未上架
 * @description
 * 查询出货未上架的商品列表
 */
export function getNoUpGoods<T = NoUpGoodsDTO[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetNoUpGoodsParams>({
		url: "/daycheck/no-up/get-no-up-goods",
		options,
		httpParamWay: "query",
		instance: axiosInstance,
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
	});
}
