import type { ChangelogConfig } from "changelogen";

import { commitTypes } from "@ruan-cat/commitlint-config/src/commit-types.ts";

/**
 * @see https://github.com/unjs/changelogen
 */
export default {
	// 尝试让工作流自己生成文件
	// output: "CHANGELOG.md",

	/** @see https://github.com/viapip/ozon-tracker/blob/master/changelogen.config.json */
	types: Object.fromEntries(
		commitTypes.map((commitType) => {
			const { type, description, emoji } = commitType;
			return [
				type,
				{
					title: `${emoji} ${description}`,
					// semver: type === "feat" ? "minor" : "patch",
				},
			];
		}),
	),

	templates: {
		commitMessage: "📢 publish: release package v{{newVersion}}",
	},
} satisfies Partial<ChangelogConfig>;
