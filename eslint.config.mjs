// @ts-check
import antfu from "@antfu/eslint-config";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default antfu(
	{
		// 基础样式规则
		stylistic: {
			indent: 2,
			quotes: "double",
			semi: true,
		},

		// Vue 支持
		vue: true,

		// 禁用 jsonc 和 yaml
		jsonc: false,
		yaml: false,

		javascript: {
			/**
			 * @see https://eslint.org/docs/latest/use/configure/migration-guide#importing-plugins-and-custom-parsers
			 */
			overrides: {
				"jsdoc/require-description": "error",
				"jsdoc/check-values": "error",
			},
		},

		// 忽略文件
		ignores: ["**/fixtures", "dist", "node_modules", "public"],

		// 格式化工具配置
		formatters: {
			css: true,
			html: true,
			markdown: "prettier",
		},
	},

	// 自定义规则
	{
		rules: {
			"no-console": "off",
			// Vue
			"vue/no-mutating-props": ["error"],
			"vue/multi-word-component-names": "off",
			"vue/attribute-hyphenation": "off",
			"vue/attributes-order": "off",
		},
	},

	// Prettier 配置
	{
		rules: {
			"prettier/prettier": [
				"error",
				{
					usePrettierrc: true,
					singleQuote: false,
					printWidth: 120,
					semi: true,
					jsxSingleQuote: true,
					useTabs: true,
					tabWidth: 2,
					endOfLine: "lf",
					"space-around-alphabet": true,
					"space-around-number": true,
					"no-empty-code-lang": false,
					"no-empty-code": false,
				},
			],
		},
	},

	// 合并 Prettier
	eslintConfigPrettier,
	eslintPluginPrettierRecommended,
);
