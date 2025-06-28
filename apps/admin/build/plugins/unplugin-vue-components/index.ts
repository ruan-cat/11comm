import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolver } from "../vite-plugin-autogeneration-import-file/index";

/**
 * 组件导入插件
 * @see https://plus-pro-components.com/ecosystem/resolver.html
 */
import Components from "unplugin-vue-components/vite";
import { PlusProComponentsResolver } from "@plus-pro-components/resolver";

/**
 * 组件自动导入配置
 * 最简单直接的方法：
 * 1. 禁用自动扫描目录
 * 2. 为每个组件创建显式的别名
 */
export default Components({
	version: 3,
	dts: "./types/components.d.ts",
	include: [],
	dirs: [
		// 不生成 不负责。目前此文件夹下面的组件，交给其他的插件实现生成，生成特定的命名规则前缀
	],
	// 禁用所有自动扫描，完全依靠显式导入
	// dirs: [],
	// dirs: ["src/components"],
	// extensions: ["vue", "tsx"],
	// globs: ["src/components/**/*.{vue,tsx}"],
	// deep: true,
	// 别名重命名
	resolvers: [
		/** @see https://plus-pro-components.com/ecosystem/resolver.html */
		PlusProComponentsResolver({ importStyle: "css" }),
		// 为每个Re组件创建别名，避免冲突问题
		{
			type: "component",
			resolve: (name) => {
				// 定义组件映射表
				const componentMap = {
					// 动画选择器组件
					ReAnimateSelector: "@/components/ReAnimateSelector/src/index.vue",
					// 权限认证组件
					ReAuth: "@/components/ReAuth/src/index.vue",
					// 条形码组件
					ReBarcode: "@/components/ReBarcode/src/index.vue",
					// 列组件
					ReCol: "@/components/ReCol/index.vue",
					// 数字计数组件
					ReCountTo: "@/components/ReCountTo/src/index.vue",
					// 裁剪器组件
					ReCropper: "@/components/ReCropper/src/index.tsx",
					// 裁剪预览组件
					ReCropperPreview: "@/components/ReCropperPreview/src/index.vue",
					// 对话框组件
					ReDialog: "@/components/ReDialog/index.ts",
					// 抽屉组件
					ReDrawer: "@/components/ReDrawer/index.ts",
					// 闪烁效果组件
					ReFlicker: "@/components/ReFlicker/index.vue",
					// 翻转效果组件
					ReFlop: "@/components/ReFlop/src/index.vue",
					// 流程图组件
					ReFlowChart: "@/components/ReFlowChart/src/index.vue",
					// 图标组件
					ReIcon: "@/components/ReIcon/src/index.vue",
					// 图片验证组件
					ReImageVerify: "@/components/ReImageVerify/src/index.vue",
					// 地图组件
					ReMap: "@/components/ReMap/src/index.vue",
					// 权限组件
					RePerms: "@/components/RePerms/src/index.vue",
					// 表格工具栏组件
					RePureTableBar: "@/components/RePureTableBar/src/index.vue",
					// 二维码组件
					ReQrcode: "@/components/ReQrcode/src/index.tsx",
					// 无缝滚动组件
					ReSeamlessScroll: "@/components/ReSeamlessScroll/src/index.vue",
					// 分段选择器组件
					ReSegmented: "@/components/ReSegmented/src/index.tsx",
					// 选择器组件
					ReSelector: "@/components/ReSelector/src/index.tsx",
					// 分割面板组件
					ReSplitPane: "@/components/ReSplitPane/index.vue",
					// 文本组件
					ReText: "@/components/ReText/src/index.vue",
					// 树形线条组件
					ReTreeLine: "@/components/ReTreeLine/index.vue",
					// 打字效果组件
					ReTypeit: "@/components/ReTypeit/src/index.tsx",
					// VXE表格工具栏组件
					ReVxeTableBar: "@/components/ReVxeTableBar/src/bar.tsx",
				};

				// 如果是组件映射表中的组件，返回其路径
				if (name in componentMap) {
					return {
						name,
						from: componentMap[name],
					};
				}

				return null;
			},
		},
	],
});
