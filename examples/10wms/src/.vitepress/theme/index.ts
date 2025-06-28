import { defineRuancatPresetTheme } from "@ruan-cat/vitepress-preset-config/theme";

// 全局导入element-plus组件 并全局注册
import elementplus from "element-plus";

import "./style.css";
import "element-plus/dist/index.css";

export default defineRuancatPresetTheme({
	enhanceAppCallBack({ app, router, siteData }) {
		app.use(elementplus);
	},
});
