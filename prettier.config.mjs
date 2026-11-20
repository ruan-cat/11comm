import * as prettierPluginOxc from "@prettier/plugin-oxc";

/** @type {import("prettier").Config} */
const config = {
	plugins: ["prettier-plugin-lint-md"],
	overrides: [
		// .vscode 下的扩展推荐与工作区设置是 JSONC（保留注释），走 jsonc parser，禁止尾逗号
		{
			files: [".vscode/extensions.json", ".vscode/settings.json"],
			parser: "jsonc",
			trailingComma: "none",
		},
		{
			files: "**/*.{js,mjs,cjs,jsx}",
			parser: "oxc",
			plugins: [prettierPluginOxc],
		},
		{
			files: "**/*.{ts,mts,cts,tsx}",
			parser: "oxc-ts",
			plugins: [prettierPluginOxc],
		},
	],
	printWidth: 120,
	semi: true,
	singleQuote: false,
	jsxSingleQuote: true,
	useTabs: true,
	tabWidth: 2,
	endOfLine: "lf",
	"space-around-alphabet": true,
	"space-around-number": true,
	"no-empty-code-lang": false,
	"no-empty-code": false,
};

export default config;
