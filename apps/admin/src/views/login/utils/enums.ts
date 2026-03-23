/** 文案一律用 titleKey，在页面内通过 useI18n().t() 解析，避免模块顶层 $t 未就绪或语言切换不生效 */

const operates = [
	{
		titleKey: "common.login.purePhoneLogin",
	},
	{
		titleKey: "common.login.pureQRCodeLogin",
	},
	{
		titleKey: "common.login.pureRegister",
	},
];

const thirdParty = [
	{
		titleKey: "common.login.pureGoogleLogin",
		icon: "google",
		provider: "google",
	},
	{
		titleKey: "common.login.pureGithubLogin",
		icon: "github",
		provider: "github",
	},
	{
		titleKey: "common.login.pureWeChatLogin",
		icon: "wechat",
	},
	{
		titleKey: "common.login.pureAlipayLogin",
		icon: "alipay",
	},
	{
		titleKey: "common.login.pureQQLogin",
		icon: "qq",
	},
	{
		titleKey: "common.login.pureWeiBoLogin",
		icon: "weibo",
	},
];

export { operates, thirdParty };
