import { http } from "@/utils/http";
import { JsonVO } from "@ruan-cat/utils/vueuse";

/** 框架自带的用户信息 */
export type UserResult = {
	success: boolean;
	data: {
		/** 头像 */
		avatar: string;
		/** 用户名 */
		username: string;
		/** 昵称 */
		nickname: string;
		/** 当前登录用户的角色 */
		roles: Array<string>;
		/** 按钮级别权限 */
		permissions: Array<string>;
		/** `token` */
		accessToken: string;
		/** 用于调用刷新`accessToken`的接口时所需的`token` */
		refreshToken: string;
		/** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
		expires: Date;
	};
};

export type RefreshTokenResult = {
	success: boolean;
	data: {
		/** `token` */
		accessToken: string;
		/** 用于调用刷新`accessToken`的接口时所需的`token` */
		refreshToken: string;
		/** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
		expires: Date;
	};
};

export type UserInfo = {
	/** 头像 */
	avatar: string;
	/** 用户名 */
	username: string;
	/** 昵称 */
	nickname: string;
	/** 邮箱 */
	email: string;
	/** 联系电话 */
	phone: string;
	/** 简介 */
	description: string;
};

export type UserInfoResult = {
	success: boolean;
	data: UserInfo;
};

type ResultTable = {
	success: boolean;
	data?: {
		/** 列表数据 */
		list: Array<any>;
		/** 总条目数 */
		total?: number;
		/** 每页显示条目个数 */
		pageSize?: number;
		/** 当前页数 */
		currentPage?: number;
	};
};

/**
 * 授权登录 接口传参
 * @see https://app.apifox.com/link/project/6386631/apis/api-307604116
 */
export interface AuthLoginParams {
	/**
	 * 密码
	 */
	password: string;
	/**
	 * 用户名
	 */
	username: string;
	/**
	 * 验证码
	 * @description 按照后端要求 该字段是必传的
	 */
	code: string;

	/**
	 * 验证码
	 * @description 按照后端要求 该字段是必传的
	 */
	uuid: string;
}

/**
 * 授权登录 响应数据对象
 */
export interface AuthLoginResult {
	/**
	 * 登录客户端ID：comm-app或comm-manager
	 * @deprecated 经过和后端协商 该字段不再使用
	 */
	clientId: string;
	/**
	 * 有效时间
	 * @deprecated 经过和后端协商 该字段不再使用
	 */
	expiresIn: number;
	/**
	 * 刷新令牌
	 */
	refreshToken: string;
	/**
	 * 授权令牌
	 */
	token: string;
	/**
	 * 访问令牌前缀
	 */
	tokenHead: string;
}

/** 登录 */
export const getLogin = (authLoginParams?: AuthLoginParams) => {
	/** 框架原版的登录函数 现在不使用 */
	function originalGetLogin(data?: object) {
		// 原始的登录接口
		return http.request<UserResult>("post", "/login", { data });
	}

	/**
	 * 授权登录
	 * @see https://app.apifox.com/link/project/6386631/apis/api-307604116
	 * @description
	 * 登录是query请求 故传参必须是 params
	 */
	return http.request<JsonVO<AuthLoginResult>>("post", "/login/auth-login", { params: authLoginParams });
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
	return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};

/** 账户设置-个人信息 */
export const getMine = (data?: object) => {
	return http.request<UserInfoResult>("get", "/mine", { data });
};

/** 账户设置-个人安全日志 */
export const getMineLogs = (data?: object) => {
	return http.request<ResultTable>("get", "/mine-logs", { data });
};
