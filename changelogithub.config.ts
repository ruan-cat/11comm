import { defineConfig } from "changelogithub";

import { commitTypes } from "@ruan-cat/commitlint-config/src/commit-types.ts";

/**
 * @see https://github.com/antfu/changelogithub
 */
export default defineConfig({
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
				},
			];
		}),
	),
});
