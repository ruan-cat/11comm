/**
 * 认证 API 客户端
 * @description 前端调用认证接口的封装
 */

import { http } from "@/utils/http";
import type { JsonVO } from "@ruan-cat/utils/vueuse";

/**
 * 登录请求参数
 */
export interface AuthSignInParams {
	/** 邮箱 */
	email: string;
	/** 密码 */
	password: string;
}

/**
 * 注册请求参数
 */
export interface AuthSignUpParams {
	/** 邮箱 */
	email: string;
	/** 密码 */
	password: string;
	/** 用户名（可选） */
	name?: string;
}

/**
 * 登录响应数据
 */
export interface AuthSignInResult {
	/** Access Token */
	token: string;
	/** Refresh Token */
	refreshToken: string;
	/** 过期时间戳 */
	expiresIn: number;
	/** Token 前缀 */
	tokenHead: string;
	/** 客户端 ID */
	clientId: string;
}

/**
 * 当前用户信息
 */
export interface AuthCurrentUser {
	/** 用户 ID */
	id: string;
	/** 邮箱 */
	email: string;
	/** 用户名 */
	name: string | null;
	/** 角色 */
	role: string;
	/** 组织 ID */
	organizationId: string | null;
	/** 小区 ID */
	communityId: string | null;
	/** 元数据 */
	metadata: Record<string, any>;
}

/**
 * 登录
 */
export const signIn = (data: AuthSignInParams) => {
	return http.request<JsonVO<AuthSignInResult>>("post", "/api/auth/sign-in", { data });
};

/**
 * 注册
 */
export const signUp = (data: AuthSignUpParams) => {
	return http.request<JsonVO<AuthSignInResult>>("post", "/api/auth/sign-up", { data });
};

/**
 * 登出
 */
export const signOut = () => {
	return http.request<JsonVO<null>>("post", "/api/auth/sign-out", {});
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
	return http.request<JsonVO<AuthCurrentUser>>("get", "/api/auth/me", {});
};

/**
 * 刷新 Token
 */
export const refreshToken = () => {
	return http.request<JsonVO<{ token: string; expiresIn: number; tokenHead: string }>>("post", "/api/auth/refresh", {});
};

/**
 * OAuth 登录跳转
 */
export const oauthSignIn = (provider: "google" | "github" | "vercel") => {
	// 方式一：服务端重定向
	window.location.href = `/api/auth/oauth/${provider}`;
};

/**
 * 获取 OAuth 登录 URL（用于弹窗方式）
 */
export const getOAuthUrl = (provider: string) => {
	return `/api/auth/oauth/${provider}`;
};
