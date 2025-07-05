import Axios, { type AxiosInstance, type AxiosRequestConfig, type CustomParamsSerializer, AxiosError } from "axios";
import type { PureHttpError, RequestMethods, PureHttpResponse, PureHttpRequestConfig } from "./types.d";
import { stringify } from "qs";
import NProgress from "../progress";
import { getToken, formatToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage } from "element-plus";

// import { useRouter } from "vue-router";
// const router = useRouter();

const VITE_IS_REVERSE_PROXY = import.meta.env?.VITE_IS_REVERSE_PROXY;
const VITE_PROXY_PREFIX = import.meta.env.VITE_PROXY_PREFIX;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
/**
 * 根据是否需要反向代理，配置请求地址
 */
const baseURL = VITE_IS_REVERSE_PROXY === "true" ? VITE_PROXY_PREFIX : VITE_BASE_URL;

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
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

	headers: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": "application/json",
		"X-Requested-With": "XMLHttpRequest",
		/** @see https://segmentfault.com/q/1010000017418619 */
		"Access-Control-Allow-Headers": "Authorization",
	},

	// 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
	paramsSerializer: {
		serialize: stringify as unknown as CustomParamsSerializer,
	},
};

export class PureHttp {
	constructor(isUseAxios: boolean = false) {
		this.isUseAxios = isUseAxios;
		this.baseUrl = baseURL;
		this.httpInterceptorsRequest();
		this.httpInterceptorsResponse();
	}

	/** `token`过期后，暂存待执行的请求 */
	private static requests = [];

	/** 防止重复刷新`token` */
	private static isRefreshing = false;

	/** 初始化配置对象 */
	private static initConfig: PureHttpRequestConfig = {};

	/** 保存当前`Axios`实例对象 */
	private axiosInstance: AxiosInstance = Axios.create(defaultConfig);

	/**
	 * 当前请求实例 是否是 useAxios 函数专用版？
	 * @description
	 * @default false 默认为否。
	 */
	private isUseAxios = false;

	/** 当前请求实例的请求地址 */
	private baseUrl = baseURL;

	/** 当前的 baseUrl 是否是apifox的mock地址？ */

	private isApiFoxBaseUrl() {
		return this.baseUrl.includes("apifoxmock.com");
	}

	/** 重连原始请求 */
	private static retryOriginalRequest(config: PureHttpRequestConfig) {
		return new Promise((resolve) => {
			PureHttp.requests.push((token: string) => {
				config.headers["Authorization"] = formatToken(token);
				resolve(config);
			});
		});
	}

	/** 请求拦截 */
	private httpInterceptorsRequest(): void {
		this.axiosInstance.interceptors.request.use(
			async function onFulfilled(config: PureHttpRequestConfig): Promise<any> {
				// 开启进度条动画
				NProgress.start();

				/**
				 * 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
				 * 但是在本次项目中 是不会传递 beforeRequestCallback 函数的
				 */
				if (typeof config.beforeRequestCallback === "function") {
					config.beforeRequestCallback(config);
					return config;
				}

				if (PureHttp.initConfig.beforeRequestCallback) {
					PureHttp.initConfig.beforeRequestCallback(config);
					return config;
				}

				/**
				 * 请求白名单，放置一些不需要`token`的接口（通过设置请求白名单，防止`token`过期后再请求造成的死循环问题）
				 * TODO: 需要看情况补全全部不需要额外token的接口
				 */
				const whiteList = [
					"/refresh-token",
					"/login",
					// 验证码接口
					"/login/captcha",
					// 登录接口
					"/login/auth-login",
				];

				return whiteList.some((url) => config.url.endsWith(url))
					? config
					: new Promise((resolve) => {
							const data = getToken();
							consola.log(" 检查 token  ", data);

							if (data) {
								const now = new Date().getTime();
								/** @deprecated 不做任何客户端日期的判断处理 不做校验检查 */
								const expired = parseInt(data.expires) - now <= 0;
								/**
								 * 警告 这里无条件的跳过过期处理
								 * 前端不做任何过期处理校验
								 */
								if (false && expired) {
									if (!PureHttp.isRefreshing) {
										PureHttp.isRefreshing = true;
										// token过期刷新
										useUserStoreHook()
											.handRefreshToken({ refreshToken: data.refreshToken })
											.then((res) => {
												const token = res.data.accessToken;
												config.headers["Authorization"] = formatToken(token);
												PureHttp.requests.forEach((cb) => cb(token));
												PureHttp.requests = [];
											})
											.finally(() => {
												PureHttp.isRefreshing = false;
											});
									}
									resolve(PureHttp.retryOriginalRequest(config));
								} else {
									config.headers["Authorization"] = formatToken(data.accessToken);
									resolve(config);
								}
							} else {
								resolve(config);
							}
						});
			},

			function onRejected(error) {
				return Promise.reject(error);
			},
		);
	}

	/** 响应拦截 */
	private httpInterceptorsResponse(): void {
		// consola.log(" httpInterceptorsResponse 初始化了几次？ this.isUseAxios=  ", this.isUseAxios);
		const instance = this.axiosInstance;

		instance.interceptors.response.use(
			/**
			 * function onFulfilled
			 * 这个函数没办法使用function写法 只能用箭头函数
			 * 因为要使用实例专属的字段 使用this
			 */
			async (response: PureHttpResponse) => {
				// consola.log(" ?  this.isUseAxios ", this.isUseAxios);
				const $config = response.config;

				// 关闭进度条动画
				NProgress.done();

				// 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
				if (typeof $config.beforeResponseCallback === "function") {
					$config.beforeResponseCallback(response);
					return response.data;
				}

				if (PureHttp.initConfig.beforeResponseCallback) {
					PureHttp.initConfig.beforeResponseCallback(response);
					return response.data;
				}

				// 如果不是useAxios函数专用版 那就直接返回解包后的数据
				if (!this.isUseAxios) {
					return response.data;
				}

				//
				/**
				 * 否则就是 useAxios 函数专用版
				 * 需要减少相应解包 并对此增加01s项目集的通用相应处理
				 */
				else {
					/**
					 * 不解包的原始数据
					 * @description
					 * useAxios 会默认解包一层数据 所以本回调函数在任何情况下，均不应该默认解包一次
					 *
					 * 在成功的回调内 不做解包数据
					 *
					 * 在业务失败的回调内 解包数据
					 */
					const _nowrapData = response;

					/** 业务失败后 直接返回的数据 */
					const _data = response.data as JsonVO<any>;

					// 警告 文件请求接口没有返回以下信息 可能会导致错误
					const { data = {}, message = "" } = _data;
					let { code } = _data;
					/**
					 * 检查当前的请求地址是否是apifox的地址
					 * 如果是 那么就固定返回 成功 。
					 * 因为在apifox接口内 C++ 组的code约束是一个带有范围的整型变量。故返回的都是不确定的code值。
					 */
					code = this.isApiFoxBaseUrl() ? HttpCode.SUCCESS : code;

					consola.log(" ??? code ", code, HttpCode.SUCCESS, _data);

					// 警告 有可能会出现意料之外的code码 这个看情况处理 前端不做校验了
					const httpCodeMessageMapValue: HttpCodeMessageMapValue = HttpCodeMessageMap[code];
					const { message: stdMessage, type } = httpCodeMessageMapValue;
					const isSuccess = isHttpStatusSuccess(type);

					// HTTP响应状态码正常
					if (response.status === 200) {
						if ("code" in response.data) {
							// 成功就直接返回
							if (isSuccess) {
								return Promise.resolve(_nowrapData);
							}

							// 否则失败就同时输出预设的文本
							// 警告 这里的文本没有经过任何 i18n 处理
							else {
								// 显示操作失败提示
								ElMessage.error(stdMessage);

								// 如果是未授权的情况 接口token过期
								if (code === HttpCode.UNAUTHORIZED) {
									//判断是否是超时
									if (typeof _data.data === "string" && _data.data.indexOf("Jwt expired at") >= 0) {
										// 刷新凭证
										// await store.reloadToken();

										// 获取当前的token 包括全局存储的 refreshToken
										const data = getToken();
										// token 过期刷新
										await useUserStoreHook().handRefreshToken({ refreshToken: data.refreshToken });

										// 设置为未加载
										// store.setLoaded(false);
										// TODO: 去检查本框架是否有重新加载用户信息的处理逻辑？ 看看是什么情况下 重新加载用户数据的？

										// 跳转到主页
										// router.push("/home");
									} else {
										// 没有登录或登录已失效 跳转到登录页
										// router.push("/");

										// 重置数据
										// store.resetSaveData();
										// 重置数据
										removeToken();
									}
								}

								// 将数据继续传递下去
								return Promise.reject(_data);
							}
						}
					}

					// 接口404的情况
					else if (response.status === 404) {
						ElMessage.warning("404访问页面不存在");
						return Promise.reject(_data);
					}

					// 其他情况
					else {
						return Promise.reject(_data);
					}
				}
			},

			function onRejected(error: PureHttpError) {
				if (
					isConditionsSome([() => error.code === AxiosError.ECONNABORTED, () => error.code === AxiosError.ERR_NETWORK])
				) {
					ElMessage.error("连接服务器失败!!!");
				}

				const $error = error;
				$error.isCancelRequest = Axios.isCancel($error);
				// 关闭进度条动画
				NProgress.done();
				// 所有的响应异常 区分来源为取消请求/非取消请求
				return Promise.reject($error);
			},
		);
	}

	/** 通用请求工具函数 */
	public request<T>(
		method: RequestMethods,
		url: string,
		param?: AxiosRequestConfig,
		axiosConfig?: PureHttpRequestConfig,
	): Promise<T> {
		const config = {
			method,
			url,
			...param,
			...axiosConfig,
		} as PureHttpRequestConfig;

		// 单独处理自定义请求/响应回调
		return new Promise((resolve, reject) => {
			this.axiosInstance
				.request(config)
				.then((response: undefined) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	/** 单独抽离的`post`工具函数 */
	public post<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: PureHttpRequestConfig): Promise<T> {
		return this.request<T>("post", url, params, config);
	}

	/** 单独抽离的`get`工具函数 */
	public get<T, P>(url: string, params?: AxiosRequestConfig<P>, config?: PureHttpRequestConfig): Promise<T> {
		return this.request<T>("get", url, params, config);
	}

	/**
	 * 获得接口请求实例
	 * @description
	 * 其他请求工具需要使用该示例
	 */
	public getInstance() {
		return this.axiosInstance;
	}
}

export const http = new PureHttp();
