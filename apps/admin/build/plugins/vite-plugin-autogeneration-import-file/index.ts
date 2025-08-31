import { createPlugin, getName } from "vite-plugin-autogeneration-import-file";
import { upperFirst } from "lodash-es";

const { autoImport, resolver } = createPlugin();

export { resolver };

import {
	createAutoImportTemplate,
	createDirOptionNameFunction,
	defaultAutoImportTemplate,
	defaultAutoImportTemplateFilename,
	defaultAutoImportTemplatePath,
	pathResolve,
} from "@ruan-cat/utils/vite-plugin-autogeneration-import-file";
import consola from "consola";

export default autoImport([
	// components 目录
	{
		// 文件命名规则
		// name: createDirOptionNameFunction(""),
		name: function name(fileName) {
			/** 从生成函数内获取的文件名称 */
			const fileNameOrigin = getName(fileName);

			/** 被处理的关键词 */
			const keywords = ["Src", "Index"];

			/**
			 * 移除参数内出现的子串
			 * @description
			 * 根据 keywords 数组内的关键词子串 移除掉参数内出现的子串
			 */
			function removeSubString(str: string) {
				let result = str;
				// 遍历所有关键词，移除它们
				keywords.forEach((keyword) => {
					result = result.replace(new RegExp(keyword, "g"), "");
				});
				return result;
			}

			// 移除关键词后首字母大写
			const resFileName = upperFirst(removeSubString(fileNameOrigin));

			// console.warn(" resFileName ? = ", resFileName);
			return <const>`${resFileName}`;
		},

		pattern: [
			// 匹配全部 index.vue 的组件
			"**/index.vue",
			// 匹配全部 tsx 的组件
			"**/*.tsx",
			// 忽略全部的test组件
			"!**/*.test.vue",
			"!**/*-example.vue",
		],
		// 监听的文件夹
		dir: pathResolve("./src/components"),
		// 生成的文件
		// toFile: pathResolve("./types/components-in-components-path.d.ts"),
		toFile: "./types/components-in-components-path.d.ts",
		// 文件生成模板
		template: defaultAutoImportTemplate,
		codeTemplates: [
			{
				key: "//code",
				template: '{{name}}: typeof import("{{path}}")["default"];\n    ',
			},
		],
	},

	// views 目录
	// {
	// 	name: createDirOptionNameFunction("Page"),
	// 	pattern: ["**/*.vue"],
	// 	dir: pathResolve("./src/views"),
	// 	toFile: pathResolve("./types/components-in-views-path.d.ts"),
	// 	template: defaultAutoImportTemplate,
	// 	codeTemplates: [
	// 		{
	// 			key: "//code",
	// 			template: '{{name}}: typeof import("{{path}}")["default"];\n    ',
	// 		},
	// 	],
	// },
]);
