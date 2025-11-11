import { defineConfig } from "changelogithub";

import { commitTypes } from "@ruan-cat/commitlint-config/src/commit-types.ts";

/**
 * @see https://github.com/antfu/changelogithub
 */
export default defineConfig({
	// 尝试让工作流自己生成文件
	// output: "CHANGELOG.md",

	// TODO: 调研思考 如何在使用 changelogithub 时， 生成 CHANGELOG.md 文件？

	// 是否将每条提交信息首字母大写
	capitalize: false,

	/** @see https://github.com/viapip/ozon-tracker/blob/master/changelogen.config.json */
	types: Object.fromEntries(
		commitTypes.map((commitType) => {
			const { type, description, emoji } = commitType;
			return [
				type,
				{
					title: `${emoji} ${description}`,
					semver: type === "feat" ? "minor" : "patch",
				},
			];
		}),
	),

	templates: {
		commitMessage: "📢 publish: release package v{{newVersion}}",
	},
});
