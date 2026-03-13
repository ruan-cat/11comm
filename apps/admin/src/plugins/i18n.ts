// 多组件库的国际化和本地项目国际化兼容
import { createI18n } from "vue-i18n";
import type { App, WritableComputedRef } from "vue";
import { responsiveStorageNameSpace } from "@/config";
import { storageLocal, isObject } from "@pureadmin/utils";

// element-plus国际化
import enLocale from "element-plus/es/locale/lang/en";
import zhLocale from "element-plus/es/locale/lang/zh-cn";

/**
 * 语言表
 * @description
 * 和目录强耦合的语言表
 */
const langs = ["zh-CN", "en"] as const;
type Langs = (typeof langs)[number];

const zhCNGlob = import.meta.glob("../../locales/zh-CN/**/*.y(a)?ml", {
	eager: true,
});
const enGlob = import.meta.glob("../../locales/en/**/*.y(a)?ml", {
	eager: true,
});

/**
 * 提取国际化文件的命名空间
 * @description 例如 `../../locales/zh-CN/dev-team.yaml` -> `dev-team`
 */
function getLocaleFileNamespace(filePath: string) {
	const matched = filePath.match(/([A-Za-z0-9-_]+)\./i);
	return matched?.[1] ?? "";
}

/**
 * 规范化文件命名空间
 * @description 例如 `dev-team` -> `devTeam`
 */
function normalizeLocaleNamespace(namespace: string) {
	return namespace.replace(/[-_]+([A-Za-z0-9])/g, (_, char: string) => {
		return char.toUpperCase();
	});
}

/**
 * 深度合并国际化消息对象
 */
function mergeLocaleMessages(target: Record<string, any>, source: Record<string, any>) {
	for (const [key, value] of Object.entries(source)) {
		if (isObject(target[key]) && isObject(value)) {
			target[key] = mergeLocaleMessages(
				target[key] as Record<string, any>,
				value as Record<string, any>,
			);
			continue;
		}

		target[key] = value;
	}

	return target;
}

/**
 * 解析单个国际化文件的命名空间和内容
 * @description 兼容项目里“文件名一层 + 内容再包一层命名空间”的旧写法
 */
function resolveLocaleModuleEntry(filePath: string, localeModule: Record<string, any>) {
	const fileNamespace = getLocaleFileNamespace(filePath);
	const normalizedFileNamespace = normalizeLocaleNamespace(fileNamespace);
	const entries = Object.entries(localeModule);

	if (entries.length === 1) {
		const [nestedNamespace, nestedMessages] = entries[0];
		if (
			nestedNamespace === normalizedFileNamespace ||
			normalizedFileNamespace.startsWith(nestedNamespace)
		) {
			return [nestedNamespace, nestedMessages] as const;
		}
	}

	return [fileNamespace, localeModule] as const;
}

/**
 * 构建按命名空间归并后的国际化消息
 */
function buildLocaleMessagesByNamespace(localeGlob: Record<string, any>) {
	return Object.entries(localeGlob).reduce(
		(acc, [filePath, localeModule]: [string, any]) => {
			const [namespace, messages] = resolveLocaleModuleEntry(filePath, localeModule.default);
			const prevMessages = acc[namespace];

			acc[namespace] =
				isObject(prevMessages) && isObject(messages)
					? mergeLocaleMessages(
							prevMessages as Record<string, any>,
							messages as Record<string, any>,
						)
					: messages;

			return acc;
		},
		{} as Record<string, any>,
	);
}

const siphonI18n = (function () {
	/** @deprecated */
	function getOldCache() {
		// 仅初始化一次国际化配置
		const cache = Object.fromEntries(
			Object.entries(import.meta.glob("../../locales/**/*.y(a)?ml", { eager: true })).map(([key, value]: any) => {
				const matched = key.match(/([A-Za-z0-9-_]+)\./i)[1];
				return [matched, value.default];
			}),
		);
		return cache;
	}

	function getNewCache() {
		const langsKeyI18nValue = langs.map((lang) => {
			/** 根据语言来分别获取并归并的 i18n 配置对象 */
			const i18nValue = buildLocaleMessagesByNamespace(
				lang === "zh-CN" ? zhCNGlob : enGlob,
			);
			return [lang, i18nValue] as const;
		});

		const cache = Object.fromEntries(langsKeyI18nValue);
		return cache;
	}

	const cache = getNewCache();
	return (prefix = "zh-CN") => {
		return cache[prefix];
	};
})();

export const localesConfigs = {
	zh: {
		...siphonI18n("zh-CN"),
		...zhLocale,
	},
	en: {
		...siphonI18n("en"),
		...enLocale,
	},
};

/**
 * 国际化转换工具函数（自动读取根目录locales文件夹下文件进行国际化匹配）
 * @param message message
 * @returns 转化后的message
 */
export function transformI18n(message: any = "") {
	if (!message) {
		return "";
	}

	// 处理存储动态路由的title,格式 {zh:"",en:""}
	if (typeof message === "object") {
		const locale: string | WritableComputedRef<string> | any = i18n.global.locale;
		return message[locale?.value];
	}

	if (!i18n.global.te(message)) {
		return message;
	}

	const translatedMessage = i18n.global.t(message);
	return translatedMessage === message ? message : translatedMessage;
}

/** 此函数只是配合i18n Ally插件来进行国际化智能提示，并无实际意义（只对提示起作用），如果不需要国际化可删除 */
export const $t = (key: string) => key;

export const i18n = createI18n({
	legacy: false,
	locale: storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace()}locale`)?.locale ?? "zh",
	fallbackLocale: "en",
	messages: localesConfigs,
});

export function useI18n(app: App) {
	app.use(i18n);
}
