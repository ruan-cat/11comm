// 多组件库的国际化和本地项目国际化兼容
import { type I18n, createI18n } from "vue-i18n";
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
		/**
		 * 生成匹配语法的模板 根据语言分区来分别地获取i18n配置文件
		 * @deprecated 匹配语法无法使用变量 只能用 字符串字面量
		 */
		function getGlobTemplate(lang: Langs) {
			return `"../../locales/${lang}/**/*.y(a)?ml"` as const;
		}

		const langsKeyI18nValue = langs.map((lang) => {
			/** @deprecated 根据语言生成的 匹配模板 */
			const globTemplate = getGlobTemplate(lang);

			/** 根据语言来分别获取的 i18n 配置对象 */
			const i18nValue = Object.fromEntries(
				Object.entries(lang === "zh-CN" ? zhCNGlob : enGlob).map(([key, value]: any) => {
					const matched = key.match(/([A-Za-z0-9-_]+)\./i)[1];
					return [matched, value.default];
				}),
			);
			// console.log(` 当前语言 ${lang} 下的配置？ `, i18nValue);
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

/** 获取对象中所有嵌套对象的key键，并将它们用点号分割组成字符串 */
function getObjectKeys(obj) {
	const stack = [];
	const keys: Set<string> = new Set();

	stack.push({ obj, key: "" });

	while (stack.length > 0) {
		const { obj, key } = stack.pop();

		for (const k in obj) {
			const newKey = key ? `${key}.${k}` : k;

			if (obj[k] && isObject(obj[k])) {
				stack.push({ obj: obj[k], key: newKey });
			} else {
				keys.add(key);
			}
		}
	}
	return keys;
}

/** 将展开的key缓存 */
const keysCache: Map<string, Set<string>> = new Map();
const flatI18n = (prefix = "zh-CN") => {
	let cache = keysCache.get(prefix);
	if (!cache) {
		cache = getObjectKeys(siphonI18n(prefix));
		keysCache.set(prefix, cache);
	}
	return cache;
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

	const key = message.match(/(\S*)\./)?.input;

	if (key && flatI18n("zh-CN").has(key)) {
		return i18n.global.t.call(i18n.global.locale, message);
	} else if (!key && Object.hasOwn(siphonI18n("zh-CN"), message)) {
		// 兼容非嵌套形式的国际化写法
		return i18n.global.t.call(i18n.global.locale, message);
	} else {
		return message;
	}
}

/** 此函数只是配合i18n Ally插件来进行国际化智能提示，并无实际意义（只对提示起作用），如果不需要国际化可删除 */
export const $t = (key: string) => key;

export const i18n: I18n = createI18n({
	legacy: false,
	locale: storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace()}locale`)?.locale ?? "zh",
	fallbackLocale: "en",
	messages: localesConfigs,
});

export function useI18n(app: App) {
	app.use(i18n);
}
