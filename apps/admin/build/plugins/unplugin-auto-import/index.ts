// 自动导入插件
import AutoImport from "unplugin-auto-import/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";

/** 自动导入插件 */
export default AutoImport({
	imports: [
		VueRouterAutoImports,
		"@vueuse/core",
		"vue",
		"pinia",
		{ "@vueuse/integrations/useAxios": ["useAxios"] },
		{ "@ruan-cat/utils": ["isConditionsEvery", "isConditionsSome"] },
		{ "@antfu/utils": ["sleep"] },
		{ consola: ["consola"] },

		{
			from: "vue-router",
			imports: [
				// 路由名称 在本项目内特指具名路由的名称
				"RouteRecordName",
			],
			type: true,
		},

		{
			from: "@ruan-cat/utils",
			imports: ["Prettify", "ToNumberLike"],
			type: true,
		},

		// 导入二次封装时使用的vueuse类型
		{
			from: "@ruan-cat/utils/vueuse",
			imports: [
				"KeyHelper",
				"UseAxiosOptions",
				"UseAxiosWrapperParams",
				"KeyAxiosRequestConfig",
				"RemoveUrlMethod",
				"CreateAxiosRequestConfig",
			],
			type: true,
		},

		// useAxios-for-01s 类型
		{
			type: true,
			from: "@ruan-cat/utils/vueuse/useAxios-for-01s/index.ts",
			imports: [
				"ParamsPathKey",
				"ParamsQueryKey",
				"ParamsBodyKey",
				"HttpParamWay",
				"AxiosRequestConfigBaseKey",
				"UseAxiosOptionsJsonVO",
				"UseAxiosOptionsImmediate",
				"HttpStatus",
				"HttpCodeMessageMapValue",
				"JsonVO",
				"PageDTO",
			],
		},

		// useAxios-for-01s 函数与变量
		{
			"@ruan-cat/utils/vueuse/useAxios-for-01s/index.ts": [
				"UpType",
				"HttpCode",
				"MapContentTypeUpType",
				"isHttpStatusSuccess",
				"HttpCodeMessageMap",
				"useRequestIn01s",
			],
		},

		{
			from: "type-plus",
			imports: ["RequiredPick", "PartialPick"],
			type: true,
		},

		{
			"lodash-es": ["isUndefined", "isEmpty", "cloneDeep", "merge", "uniqueId"],
		},

		// 全局导入 表格组件
		{
			"@pureadmin/table": ["PureTable"],
		},
		// 全局导入 表格组件类型
		{
			from: "@pureadmin/table",
			// TODO: 后续逐步补充表格组件所需要的类型
			imports: [
				// 表格列每一项的表列配置
				"TableColumns",
				// 表格组件整体的props配置
				"PureTableProps",
				// 表格组件 分页配置
				"PaginationProps",
			],
			type: true,
		},

		// 全局导入 框架自带的工具
		{
			"@pureadmin/utils": [
				// https://pure-admin-utils.netlify.app/utils/device/device#devicedetection
				"deviceDetection",
			],
		},

		// 全局导入 表单组件类型
		{
			from: "plus-pro-components",
			imports: [
				// 通用的整体表单值的类型 用于拓展变量为满足表单交互的类型
				"FieldValues",
				// 表单每一项的表列配置
				"PlusColumn",
				// 搜索栏 组件类型
				"PlusSearchProps",
			],
			type: true,
		},
	],

	ignore: ["vue-router"],

	/**
	 * @see https://github.com/unplugin/unplugin-auto-import/issues/475#issuecomment-2296845313
	 */
	dirs: [
		"!src/views/**/svg/**",
		// 警告 不要写太大的匹配范围 会导致一大堆的冗余导入
		// { glob: "src/**/*", types: true },
		// 手动导入 插件
		{ glob: "src/plugins/**/*" },
		// 工具
		{ glob: "src/utils/**/*" },
		// 配置
		{ glob: "src/config/**/*" },
		// api接口
		{ glob: "src/api/**/*.ts" },
		// 路由 工具
		{ glob: "src/router/utils.ts" },
		// 路由 排序
		{ glob: "src/router/rank/**/*.ts" },
		// 不匹配测试用例代码
		"!src/router/rank/**/*.test.ts",
		// 不匹配测试用例代码
		"!src/api/**/*.test.ts",
		// 组合式api
		{ glob: "src/composables/**/*.ts", types: true },
		// 警告 这里手动忽略 use-request/useRequestIn01s 目录下的文件 避免出现重复导入
		"!src/composables/use-request/useRequestIn01s/**/*",
		/**
		 * 手动导入 组件内部对外暴露出来的类型
		 * 只导入index.ts文件暴露出来的类型 避免出现重复识别
		 */
		{ glob: "src/components/RePureTableBar/**/index.ts", types: true },
		{ glob: "src/components/ReDialog/**/index.ts", types: true },
		{ glob: "src/components/ReTreeLineIcon/**/index.ts", types: true },
	],

	dts: "./types/auto-imports.d.ts",

	// 警告 不需要补充安装element-plus 本框架已经手写实现了全局导入
	// resolvers: [ElementPlusResolver()],
});
