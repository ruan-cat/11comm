import { $t } from "@/plugins/i18n";

const operates = [
	{
		title: $t("common.login.purePhoneLogin"),
	},
	{
		title: $t("common.login.pureQRCodeLogin"),
	},
	{
		title: $t("common.login.pureRegister"),
	},
];

const thirdParty = [
	{
		title: $t("common.login.pureWeChatLogin"),
		icon: "wechat",
	},
	{
		title: $t("common.login.pureAlipayLogin"),
		icon: "alipay",
	},
	{
		title: $t("common.login.pureQQLogin"),
		icon: "qq",
	},
	{
		title: $t("common.login.pureWeiBoLogin"),
		icon: "weibo",
	},
];

export { operates, thirdParty };
