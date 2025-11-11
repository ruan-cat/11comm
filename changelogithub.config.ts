import { defineConfig } from "changelogithub";

import changelogConfig from "./changelog.config.ts";

/**
 * @see https://github.com/antfu/changelogithub
 */
export default defineConfig({
	...changelogConfig,

	// 尝试让工作流自己生成文件
	// 不应该考虑让 changelogithub 来生成 CHANGELOG.md 文件 ， 因为生成日志很难看 不美观
	// output: "CHANGELOG.md",

	// 是否将每条提交信息首字母大写
	capitalize: false,
});
