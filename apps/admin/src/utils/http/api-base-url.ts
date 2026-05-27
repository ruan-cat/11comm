export interface AdminApiBaseEnv {
	VITE_IS_REVERSE_PROXY?: string;
	VITE_PROXY_PREFIX?: string;
	VITE_BASE_URL?: string;
	VITE_11COMM_API_BASE_URL?: string;
	VITE_11COMM_API_PROXY_PREFIX?: string;
	VITE_11COMM_API_USE_PROXY?: string;
	VITE_11COMM_API_SHADOW_ENABLE?: string;
	VITE_11COMM_API_STANDALONE_ENABLE?: string;
}

export function resolveAdminApiBaseUrl(env: AdminApiBaseEnv): string {
	if (env.VITE_IS_REVERSE_PROXY === "true") {
		return env.VITE_PROXY_PREFIX || "";
	}

	return env.VITE_BASE_URL || "";
}

export function resolveAdminShadowApiBaseUrl(env: AdminApiBaseEnv): string {
	if (env.VITE_11COMM_API_USE_PROXY === "true") {
		return env.VITE_11COMM_API_PROXY_PREFIX || "/api-shadow";
	}

	return env.VITE_11COMM_API_BASE_URL || "";
}

export function isAdminApiShadowEnabled(env: AdminApiBaseEnv): boolean {
	return env.VITE_11COMM_API_SHADOW_ENABLE === "true";
}

export function isAdminApiStandaloneEnabled(env: AdminApiBaseEnv): boolean {
	return env.VITE_11COMM_API_STANDALONE_ENABLE === "true";
}

export function resolveAdminApiRequestUrl(path: string, env: AdminApiBaseEnv): string {
	/**
	 * 该开关用于 shadow-off/fallback drill 与最终独立 apps/api 切换，
	 * 不代表旧 fallback 语义；base URL 缺失时保守保留原始相对路径。
	 */
	if (!isAdminApiShadowEnabled(env) && isAdminApiStandaloneEnabled(env) && env.VITE_11COMM_API_BASE_URL) {
		return `${env.VITE_11COMM_API_BASE_URL}${path}`;
	}

	if (!isAdminApiShadowEnabled(env)) {
		return path;
	}

	return `${resolveAdminShadowApiBaseUrl(env)}${path}`;
}
