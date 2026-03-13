import { computed } from "vue";
import type { PlusSearchProps } from "plus-pro-components";
import { i18n, transformI18n } from "@/plugins/i18n";

/**
 * 动态 i18n 配置工具
 * 只处理“配置对象需要随语言切换刷新”的结构性问题，不在这里二次封装 `$t`。
 * 组件内必须直接写 `$t("xxx.xxx")`，以便 VSCode i18n 插件正确识别映射关系。
 */
export function useI18nConfig() {
	const locale = computed(() => i18n.global.locale.value);

	/**
	 * `PlusSearch` 标准按钮文案。
	 * 这是固定用途的公共 computed，不是对 `$t` 的通用二次封装。
	 */
	const plusSearchButtonTexts = computed(() => {
		void locale.value;
		return {
			searchText: i18n.global.t("common.buttons.search"),
			resetText: i18n.global.t("common.buttons.reset"),
		};
	});

	/** 让配置型 computed 显式依赖当前语言，切换语言时自动重算。 */
	function withLocale<T>(factory: () => T) {
		return computed(() => {
			void locale.value;
			return factory();
		});
	}

	/**
	 * 包装表头渲染结构。
	 * 新代码应传入已翻译好的文本，例如 `createHeaderRenderer(transformI18n($t("xxx")))`。
	 */
	function createHeaderRenderer(label: string) {
		return () => {
			void locale.value;
			return transformI18n(label);
		};
	}

	/** 构建带搜索区默认结构的 `PlusSearchProps`。 */
	function searchProps(
		defaultValues: PlusSearchProps["defaultValues"],
		overrides: Partial<PlusSearchProps> = {},
	) {
		return withLocale<PlusSearchProps>(() => ({
			defaultValues,
			columns: [],
			labelWidth: 140,
			labelPosition: "right",
			showNumber: 3,
			...overrides,
		}));
	}

	return {
		locale,
		withLocale,
		createHeaderRenderer,
		plusSearchButtonTexts,
		searchProps,
	};
}
