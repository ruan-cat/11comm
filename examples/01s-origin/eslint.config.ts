import pluginVue from "eslint-plugin-vue";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import pluginVitest from "@vitest/eslint-plugin";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
	// 文件匹配规则
	{
		name: "app/files-to-lint",
		// 检查所有TS/Vue文件
		files: ["**/*.{ts,mts,tsx,vue}"],
	},
	// 忽略规则
	{
		name: "app/files-to-ignore",
		ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**", "src/components/verifition"],
	},
	// Vue基础规则集
	pluginVue.configs["flat/essential"],
	// TS推荐规则集
	vueTsConfigs.recommended,
	// Vitest测试相关规则
	{
		...pluginVitest.configs.recommended,
		files: ["src/**/__tests__/*", "tests/**/*"],
	},
	// 跳过格式化规则
	skipFormatting,
	// Global rules
	{
		rules: {
			"no-console": "off",
			"no-debugger": "off",
			"no-alert": "off",
			"no-unused-vars": "off",
			"no-undef": "off",
			"no-unused-expressions": "off",
			"no-restricted-syntax": "off",
		},
	},
	// Vue specific rules
	{
		files: ["**/*.vue"],
		rules: {
			// 禁止直接修改props
			"vue/no-mutating-props": "error",
			// 允许单单词组件名
			"vue/multi-word-component-names": "off",
			// 允许驼峰式属性名
			"vue/attribute-hyphenation": "off",
			// 允许任意属性顺序
			"vue/attributes-order": "off",
		},
	},
	// TS specific rules
	{
		files: ["**/*.{ts,vue}"],
		rules: {
			// 允许使用any类型
			"@typescript-eslint/no-explicit-any": "off",
			// 允许空对象类型
			"@typescript-eslint/no-empty-object-type": "off",
		},
	},
);
