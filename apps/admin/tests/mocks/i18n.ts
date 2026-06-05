import type { App } from "vue";

/** Vitest 默认单测只需要稳定翻译占位，避免加载真实 YAML locale。 */
export function transformI18n(message: unknown = "") {
	if (!message) {
		return "";
	}

	if (typeof message === "object") {
		const localeMessage = message as Record<string, string>;
		return localeMessage.zh ?? localeMessage["zh-CN"] ?? localeMessage.en ?? "";
	}

	return String(message);
}

/** 测试环境保留 key 原样，方便断言业务代码传入的 i18n key。 */
export const $t = (key: string) => key;

/** 只提供单测中用到的最小 i18n shape。 */
export const i18n = {
	global: {
		locale: { value: "zh" },
		te: () => false,
		t: (key: string) => key,
	},
};

/** 测试环境不需要向 Vue app 安装真实 i18n 插件。 */
export function useI18n(_app: App) {}
