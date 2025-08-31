import { vi } from "vitest";

// 模拟环境变量
Object.assign(process.env, {
	VITE_ROUTER_HISTORY: "html5,/",
	VITE_PUBLIC_PATH: "/",
});

// 模拟路由相关的函数
vi.mock("@/store/modules/user", () => ({
	useUserStoreHook: () => ({
		handRefreshToken: vi.fn(() =>
			Promise.resolve({
				data: { accessToken: "mock-token" },
			}),
		),
	}),
}));

// 模拟认证相关的函数
vi.mock("@/utils/auth", () => ({
	getToken: vi.fn(() => ({
		accessToken: "mock-token",
		refreshToken: "mock-refresh-token",
		expires: (Date.now() + 86400000).toString(), // 24小时后过期
	})),
	formatToken: vi.fn((token: string) => `Bearer ${token}`),
}));

// 模拟进度条
vi.mock("@/utils/progress", () => ({
	default: {
		start: vi.fn(),
		done: vi.fn(),
	},
}));

// 模拟 Element Plus 消息提示
vi.mock("element-plus", () => ({
	ElMessage: {
		error: vi.fn(),
		success: vi.fn(),
		warning: vi.fn(),
		info: vi.fn(),
	},
}));

// 如果需要模拟路由相关的工具函数
vi.mock("@/router/utils", () => ({
	getHistoryMode: vi.fn(() => ({
		// 返回一个模拟的路由历史模式对象
	})),
}));
