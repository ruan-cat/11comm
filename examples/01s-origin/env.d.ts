// 把node_modules里面的vite文件夹里面的client客户端类型声明文件导入到这个文件里
/// <reference types="vite/client" />

// .env 环境变量声明
interface ImportMetaEnv {
	/** 应用标题 */
	readonly VITE_APP_TITLE: string;
	/** 后端接口请求地址 */
	readonly VITE_API_URL: string;
	/** 验证码请求地址 */
	readonly VITE_CAPTCHA_URL: string;
	/** 验证码请求前缀 */
	readonly VITE_CAPTCHA_PREFIX: string;
}

declare module "*.vue" {
	import { DefineComponent } from "vue";
	const component: DefineComponent<{}, {}, any>;
	export default component;
}
