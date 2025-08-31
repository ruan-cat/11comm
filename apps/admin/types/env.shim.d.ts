/// <reference types="vite/client" />

/**
 * 这个是之前01星球项目用的环境变量配置
 * @description
 * 不做进一步的拓展了 保留原有的配置
 *
 * 不做外部导出 要求外部以全量导入的形式使用本类型
 */
interface ImportMetaEnv {
	/** 应用端口 */
	VITE_APP_PORT: number;

	/** API 基础路径(代理前缀) */
	VITE_APP_BASE_API: string;

	/** API 地址 */
	VITE_APP_API_URL: string;

	/** api地址 */
	VITE_API_URL: string;

	/** 验证码url */
	VITE_CAPTCHA_URL: string;

	/**
	 * 验证码前缀
	 * @deprecated
	 * 不使用多余的前缀
	 */
	VITE_CAPTCHA_PREFIX: string;

	/** 前端应用 客户端id */
	VITE_CLIENT_ID: string;

	/** 应用标题 */
	VITE_APP_TITLE: string;
}

/**
 * 在其他01s项目内 共享的环境变量类型
 * @description
 * 警告 在 pure-admin 项目内 有自己的环境变量定义类型 这里无法让对方类型继承类型
 *
 * 全局查询 ViteEnv 类型 并手动增加字段
 */
interface ImportMetaEnv {
	/**
	 * 应用端口
	 * @example
	 * "8080"
	 */
	VITE_APP_PORT: `${number}`;

	/**
	 * API 基础路径(代理前缀)
	 * @example
	 * "/dev-api"
	 */
	VITE_PROXY_PREFIX: string;

	/**
	 * API 地址。即接口请求最终的服务器地址。
	 * @example
	 * "https://pcapi-xiaotuxian-front-devtest.itheima.net"
	 */
	VITE_BASE_URL: string;

	/** 是否要反向代理？ */
	VITE_IS_REVERSE_PROXY?: `${boolean}`;

	/** 是否开启 Mock 服务 */
	VITE_MOCK_DEV_SERVER?: `${boolean}`;

	/** 临时token */
	VITE_temp_token?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
