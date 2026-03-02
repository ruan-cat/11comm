/**
 * 认证状态管理 Composable
 * @description 处理用户登录、登出、Token 存储和刷新
 */

import { ref, computed } from "vue";
import { signIn, signUp, signOut, getCurrentUser, refreshToken, oauthSignIn } from "@/api/auth";
import type { AuthSignInParams, AuthSignUpParams, AuthCurrentUser } from "@/api/auth";
import { removeToken, setToken, getToken } from "@/utils/auth";
import type { DataInfo } from "@/utils/auth";
import { ElMessage } from "element-plus";

/** 认证状态 */
const isAuthenticated = ref(false);
const isLoading = ref(false);
const currentUser = ref<AuthCurrentUser | null>(null);
const tokenExpiration = ref<number>(0);

/** Token 刷新定时器 */
let refreshTokenTimer: ReturnType<typeof setInterval> | null = null;

// ==========================================
// 模块级辅助函数（供 initAuth 使用）
// ==========================================

function _stopRefreshTokenTimer() {
	if (refreshTokenTimer) {
		clearInterval(refreshTokenTimer);
		refreshTokenTimer = null;
	}
}

async function _fetchCurrentUser() {
	try {
		const res = await getCurrentUser();
		if (res.success) {
			currentUser.value = res.data;
		} else if (res.code === 401) {
			removeToken();
			isAuthenticated.value = false;
			currentUser.value = null;
			tokenExpiration.value = 0;
			_stopRefreshTokenTimer();
		}
	} catch (error) {
		console.error("[useAuth] Fetch user error:", error);
	}
}

function _startRefreshTokenTimer() {
	_stopRefreshTokenTimer();
	refreshTokenTimer = setInterval(
		async () => {
			const expiresIn = tokenExpiration.value - Date.now();
			if (expiresIn < 5 * 60 * 1000 && expiresIn > 0) {
				try {
					const res = await refreshToken();
					if (res.success) {
						const existingToken = getToken();
						setToken({
							accessToken: res.data.token,
							refreshToken: existingToken?.refreshToken ?? "",
							expires: res.data.expiresIn,
						} as DataInfo<number>);
						tokenExpiration.value = res.data.expiresIn;
					}
				} catch (error) {
					console.error("[useAuth] Refresh token error:", error);
				}
			}
		},
		10 * 60 * 1000,
	);
}

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
			if (res.success) {
				const data = res.data;
				/** 保存 Token */
				setToken({
					accessToken: data.token,
					refreshToken: data.refreshToken,
					expires: data.expiresIn,
				} as DataInfo<number>);
				tokenExpiration.value = data.expiresIn;
				isAuthenticated.value = true;

				/** 获取用户信息 */
				await fetchCurrentUser();

				/** 启动 Token 刷新定时器 */
				startRefreshTokenTimer();

				ElMessage.success("登录成功");
				return true;
			} else {
				ElMessage.error(res.message || "登录失败");
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
			if (res.success) {
				const data = res.data;
				if (data) {
					/** 保存 Token */
					setToken({
						accessToken: data.token,
						refreshToken: data.refreshToken,
						expires: data.expiresIn,
					} as DataInfo<number>);
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
				ElMessage.error(res.message || "注册失败");
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
		await _fetchCurrentUser();
	}

	/**
	 * 刷新 Token
	 */
	async function refreshTokenHandler() {
		try {
			const res = await refreshToken();
			if (res.success) {
				const data = res.data;
				const existingToken = getToken();
				setToken({
					accessToken: data.token,
					refreshToken: existingToken?.refreshToken ?? "",
					expires: data.expiresIn,
				} as DataInfo<number>);
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
		_startRefreshTokenTimer();
	}

	/**
	 * 停止 Token 刷新定时器
	 */
	function stopRefreshTokenTimer() {
		_stopRefreshTokenTimer();
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
		_fetchCurrentUser();
		_startRefreshTokenTimer();
	}
}
