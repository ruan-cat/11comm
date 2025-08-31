import { reactive } from "vue";
import { isPhone } from "@pureadmin/utils";
import type { FormRules } from "element-plus";
import { $t, transformI18n } from "@/plugins/i18n";
import { useUserStoreHook } from "@/store/modules/user";

/** 6位数字验证码正则 */
export const REGEXP_SIX = /^\d{6}$/;

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
export const REGEXP_PWD =
	/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

/** 登录校验 */
const loginRules = reactive<FormRules>({
	password: [
		{
			validator: (rule, value, callback) => {
				if (value === "") {
					callback(new Error(transformI18n($t("common.login.purePassWordReg"))));
				}

				// 业务变更 框架原本的逻辑是要校验密码复杂度的 现在实际对接01s接口时 不需要准备好过于复杂的密码
				// if (!REGEXP_PWD.test(value)) {
				// 	callback(new Error(transformI18n($t("common.login.purePassWordRuleReg"))));
				// } else
				else {
					callback();
				}
			},
			trigger: "blur",
		},
	],

	/**
	 * @description
	 * 前端验证码 校验配置
	 * @deprecated
	 * 该配置无意义 前端不需要验证前端自己生成的验证码了
	 */
	// verifyCode: [
	// 	{
	// 		validator: (rule, value, callback) => {
	// 			if (value === "") {
	// 				callback(new Error(transformI18n($t("common.login.pureVerifyCodeReg"))));
	// 			} else if (useUserStoreHook().verifyCode !== value) {
	// 				callback(new Error(transformI18n($t("common.login.pureVerifyCodeCorrectReg"))));
	// 			} else {
	// 				callback();
	// 			}
	// 		},
	// 		trigger: "blur",
	// 	},
	// ],
});

/** 手机登录校验 */
const phoneRules = reactive<FormRules>({
	phone: [
		{
			validator: (rule, value, callback) => {
				if (value === "") {
					callback(new Error(transformI18n($t("common.login.purePhoneReg"))));
				} else if (!isPhone(value)) {
					callback(new Error(transformI18n($t("common.login.purePhoneCorrectReg"))));
				} else {
					callback();
				}
			},
			trigger: "blur",
		},
	],
	verifyCode: [
		{
			validator: (rule, value, callback) => {
				if (value === "") {
					callback(new Error(transformI18n($t("common.login.pureVerifyCodeReg"))));
				} else if (!REGEXP_SIX.test(value)) {
					callback(new Error(transformI18n($t("common.login.pureVerifyCodeSixReg"))));
				} else {
					callback();
				}
			},
			trigger: "blur",
		},
	],
});

/** 忘记密码校验 */
const updateRules = reactive<FormRules>({
	phone: [
		{
			validator: (rule, value, callback) => {
				if (value === "") {
					callback(new Error(transformI18n($t("common.login.purePhoneReg"))));
				} else if (!isPhone(value)) {
					callback(new Error(transformI18n($t("common.login.purePhoneCorrectReg"))));
				} else {
					callback();
				}
			},
			trigger: "blur",
		},
	],
	verifyCode: [
		{
			validator: (rule, value, callback) => {
				if (value === "") {
					callback(new Error(transformI18n($t("common.login.pureVerifyCodeReg"))));
				} else if (!REGEXP_SIX.test(value)) {
					callback(new Error(transformI18n($t("common.login.pureVerifyCodeSixReg"))));
				} else {
					callback();
				}
			},
			trigger: "blur",
		},
	],
	password: [
		{
			validator: (rule, value, callback) => {
				if (value === "") {
					callback(new Error(transformI18n($t("common.login.purePassWordReg"))));
				} else if (!REGEXP_PWD.test(value)) {
					callback(new Error(transformI18n($t("common.login.purePassWordRuleReg"))));
				} else {
					callback();
				}
			},
			trigger: "blur",
		},
	],
});

export { loginRules, phoneRules, updateRules };
