/**
 * 认证状态管理 Composable
 * @description 处理用户登录、登出、Token 存储和刷新
 */

import { ref, computed } from "vue";
import { signIn, signUp, signOut, getCurrentUser, refreshToken, oauthSignIn } from "@/api/auth";
import type { AuthSignInParams, AuthSignUpParams, AuthCurrentUser, AuthSignInResult } from "@/api/auth";
import { removeToken, setToken, getToken } from "@/utils/auth";
import { ElMessage } from "element-plus";

/** 认证状态 */
const isAuthenticated = ref(false);
const isLoading = ref(false);
const currentUser = ref<AuthCurrentUser | null>(null);
const tokenExpiration = ref<number>(0);

/** Token 刷新定时器 */
let refreshTokenTimer: ReturnType<typeof setInterval> | null = null;

/**
 * 初始化认证状态
 * @description 从 localStorage 恢复登录状态
 */
export function useAuth() {
	/** 从 localStorage 获取 Token */
	const token = getToken();

	if (token) {
		isAuthenticated.value = true;
		/** 尝试获取当前用户信息 */
		fetchCurrentUser();
	}

	/** 计算属性 */
	const isLoggedIn = computed(() => isAuthenticated.value);
	const user = computed(() => currentUser.value);
	const isLoadingAuth = computed(() => isLoading.value);

	/**
	 * 登录
	 */
	async function login(params: AuthSignInParams) {
		isLoading.value = true;
		try {
			const res = await signIn(params);
			if (res.data?.success) {
				const data = res.data.data;
				/** 保存 Token */
				setToken(data.token);
				tokenExpiration.value = data.expiresIn;
				isAuthenticated.value = true;

				/** 获取用户信息 */
				await fetchCurrentUser();

				/** 启动 Token 刷新定时器 */
				startRefreshTokenTimer();

				ElMessage.success("登录成功");
				return true;
			} else {
				ElMessage.error(res.data?.message || "登录失败");
				return false;
			}
		} catch (error: any) {
			console.error("[useAuth] Login error:", error);
			ElMessage.error(error?.message || "登录失败，请稍后重试");
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	/**
	 * 注册
	 */
	async function register(params: AuthSignUpParams) {
		isLoading.value = true;
		try {
			const res = await signUp(params);
			if (res.data?.success) {
				const data = res.data.data;
				if (data) {
					/** 保存 Token */
					setToken(data.token);
					tokenExpiration.value = data.expiresIn;
					isAuthenticated.value = true;

					/** 获取用户信息 */
					await fetchCurrentUser();

					/** 启动 Token 刷新定时器 */
					startRefreshTokenTimer();
				}

				ElMessage.success("注册成功");
				return true;
			} else {
				ElMessage.error(res.data?.message || "注册失败");
				return false;
			}
		} catch (error: any) {
			console.error("[useAuth] Register error:", error);
			ElMessage.error(error?.message || "注册失败，请稍后重试");
			return false;
		} finally {
			isLoading.value = false;
		}
	}

	/**
	 * 登出
	 */
	async function logout() {
		try {
			await signOut();
		} catch (error) {
			console.error("[useAuth] Sign out error:", error);
		} finally {
			/** 清除本地状态 */
			removeToken();
			isAuthenticated.value = false;
			currentUser.value = null;
			tokenExpiration.value = 0;

			/** 停止 Token 刷新定时器 */
			stopRefreshTokenTimer();

			ElMessage.success("已退出登录");
		}
	}

	/**
	 * 获取当前用户信息
	 */
	async function fetchCurrentUser() {
		try {
			const res = await getCurrentUser();
			if (res.data?.success) {
				currentUser.value = res.data.data;
			} else {
				/** 如果获取用户信息失败，可能是 Token 过期 */
				if (res.data?.code === 401) {
					await logout();
				}
			}
		} catch (error) {
			console.error("[useAuth] Fetch user error:", error);
		}
	}

	/**
	 * 刷新 Token
	 */
	async function refreshTokenHandler() {
		try {
			const res = await refreshToken();
			if (res.data?.success) {
				const data = res.data.data;
				setToken(data.token);
				tokenExpiration.value = data.expiresIn;
				return true;
			}
		} catch (error) {
			console.error("[useAuth] Refresh token error:", error);
			/** 刷新失败，需要重新登录 */
			await logout();
		}
		return false;
	}

	/**
	 * 启动 Token 刷新定时器
	 * @description 在 Token 过期前 5 分钟自动刷新
	 */
	function startRefreshTokenTimer() {
		stopRefreshTokenTimer();

		/** 每 10 分钟检查一次是否需要刷新 */
		refreshTokenTimer = setInterval(
			async () => {
				const expiresIn = tokenExpiration.value - Date.now();
				/** 如果 Token 将在 5 分钟内过期，则刷新 */
				if (expiresIn < 5 * 60 * 1000 && expiresIn > 0) {
					await refreshTokenHandler();
				}
			},
			10 * 60 * 1000,
		);
	}

	/**
	 * 停止 Token 刷新定时器
	 */
	function stopRefreshTokenTimer() {
		if (refreshTokenTimer) {
			clearInterval(refreshTokenTimer);
			refreshTokenTimer = null;
		}
	}

	/**
	 * OAuth 登录
	 */
	function loginWithOAuth(provider: "google" | "github" | "vercel") {
		oauthSignIn(provider);
	}

	/**
	 * 检查 Token 是否即将过期
	 */
	function isTokenExpiringSoon(): boolean {
		return tokenExpiration.value - Date.now() < 5 * 60 * 1000;
	}

	return {
		/** 状态 */
		isLoggedIn,
		user,
		isLoadingAuth,

		/** 方法 */
		login,
		register,
		logout,
		fetchCurrentUser,
		refreshTokenHandler,
		loginWithOAuth,
		isTokenExpiringSoon,
	};
}

/**
 * 初始化认证（应用启动时调用）
 */
export function initAuth() {
	const token = getToken();
	if (token) {
		isAuthenticated.value = true;
		fetchCurrentUser();
		startRefreshTokenTimer();
	}
}
