<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, reactive } from "vue";
import Motion from "../utils/motion";
import { message } from "@/utils/message";
import { updateRules } from "../utils/rule";
import type { FormInstance } from "element-plus";
import { useVerifyCode } from "../utils/verifyCode";
import { $t, transformI18n } from "@/plugins/i18n";
import { useUserStoreHook } from "@/store/modules/user";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useAuth } from "@/composables/use-auth";
import { useRouter } from "vue-router";
import Lock from "~icons/ri/lock-fill";
import Iphone from "~icons/ep/iphone";
import User from "~icons/ri/user-3-fill";
import Keyhole from "~icons/ri/shield-keyhole-line";
import { ElMessage } from "element-plus";

const { t } = useI18n();
const router = useRouter();
const checked = ref(false);
const loading = ref(false);

/** 注册方式：phone=手机号注册, email=邮箱注册 */
const registerMethod = ref<"phone" | "email">("email");

const ruleForm = reactive({
	username: "",
	phone: "",
	verifyCode: "",
	password: "",
	repeatPassword: "",
	// 邮箱注册相关
	email: "",
	name: "",
});
const ruleFormRef = ref<FormInstance>();
const { isDisabled, text } = useVerifyCode();
const { register: neonRegister } = useAuth();
const repeatPasswordRule = [
	{
		validator: (rule, value, callback) => {
			if (value === "") {
				callback(new Error(transformI18n($t("common.login.purePassWordSureReg"))));
			} else if (ruleForm.password !== value) {
				callback(new Error(transformI18n($t("common.login.purePassWordDifferentReg"))));
			} else {
				callback();
			}
		},
		trigger: "blur",
	},
];

/** 邮箱注册校验规则 */
const emailRegisterRules = {
	email: [
		{
			required: true,
			message: "请输入邮箱地址",
			trigger: "blur",
		},
		{
			type: "email",
			message: "请输入正确的邮箱地址",
			trigger: "blur",
		},
	],
	name: [
		{
			required: true,
			message: "请输入用户名",
			trigger: "blur",
		},
	],
	password: [
		{
			required: true,
			message: "请输入密码",
			trigger: "blur",
		},
		{
			min: 6,
			message: "密码长度至少为6位",
			trigger: "blur",
		},
	],
	repeatPassword: [
		{
			required: true,
			message: "请确认密码",
			trigger: "blur",
		},
		{
			validator: (rule, value, callback) => {
				if (value === "") {
					callback(new Error("请确认密码"));
				} else if (ruleForm.password !== value) {
					callback(new Error("两次输入的密码不一致"));
				} else {
					callback();
				}
			},
			trigger: "blur",
		},
	],
};

/**
 * 切换注册方式
 */
function switchRegisterMethod(method: "phone" | "email") {
	registerMethod.value = method;
}

/**
 * 使用邮箱注册
 */
async function onEmailRegister(formEl: FormInstance | undefined) {
	if (!formEl) return;
	await formEl.validate(async (valid) => {
		if (valid) {
			if (checked.value) {
				loading.value = true;
				try {
					const success = await neonRegister({
						email: ruleForm.email,
						password: ruleForm.password,
						name: ruleForm.name,
					});
					if (success) {
						ElMessage.success("注册成功");
						// 注册成功后跳转到登录页面
						useUserStoreHook().SET_CURRENTPAGE(0);
					}
				} catch (error) {
					console.error("注册失败:", error);
					ElMessage.error("注册失败，请稍后重试");
				} finally {
					loading.value = false;
				}
			} else {
				message(transformI18n($t("common.login.pureTickPrivacy")), {
					type: "warning",
				});
			}
		}
	});
}

const onUpdate = async (formEl: FormInstance | undefined) => {
	loading.value = true;
	if (!formEl) return;
	await formEl.validate((valid) => {
		if (valid) {
			if (checked.value) {
				// 模拟请求，需根据实际开发进行修改
				setTimeout(() => {
					message(transformI18n($t("common.login.pureRegisterSuccess")), {
						type: "success",
					});
					loading.value = false;
				}, 2000);
			} else {
				loading.value = false;
				message(transformI18n($t("common.login.pureTickPrivacy")), {
					type: "warning",
				});
			}
		} else {
			loading.value = false;
		}
	});
};

function onBack() {
	useVerifyCode().end();
	useUserStoreHook().SET_CURRENTPAGE(0);
}
</script>

<template>
	<!-- 注册方式切换 -->
	<div class="w-full flex justify-center mb-4">
		<el-button :type="registerMethod === 'email' ? 'primary' : 'default'" link @click="switchRegisterMethod('email')">
			邮箱注册
		</el-button>
		<el-button :type="registerMethod === 'phone' ? 'primary' : 'default'" link @click="switchRegisterMethod('phone')">
			手机号注册
		</el-button>
	</div>

	<!-- 邮箱注册表单 -->
	<el-form
		v-if="registerMethod === 'email'"
		ref="ruleFormRef"
		:model="ruleForm"
		:rules="emailRegisterRules"
		size="large"
	>
		<Motion>
			<el-form-item prop="email">
				<el-input v-model="ruleForm.email" clearable placeholder="邮箱地址" :prefix-icon="useRenderIcon(User)" />
			</el-form-item>
		</Motion>

		<Motion :delay="100">
			<el-form-item prop="name">
				<el-input v-model="ruleForm.name" clearable placeholder="用户名" :prefix-icon="useRenderIcon(User)" />
			</el-form-item>
		</Motion>

		<Motion :delay="150">
			<el-form-item prop="password">
				<el-input
					v-model="ruleForm.password"
					clearable
					show-password
					placeholder="密码"
					:prefix-icon="useRenderIcon(Lock)"
				/>
			</el-form-item>
		</Motion>

		<Motion :delay="200">
			<el-form-item :rules="emailRegisterRules.repeatPassword" prop="repeatPassword">
				<el-input
					v-model="ruleForm.repeatPassword"
					clearable
					show-password
					placeholder="确认密码"
					:prefix-icon="useRenderIcon(Lock)"
				/>
			</el-form-item>
		</Motion>

		<Motion :delay="250">
			<el-form-item>
				<el-checkbox v-model="checked">
					{{ t("common.login.pureReadAccept") }}
				</el-checkbox>
				<el-button link type="primary">
					{{ t("common.login.purePrivacyPolicy") }}
				</el-button>
			</el-form-item>
		</Motion>

		<Motion :delay="300">
			<el-form-item>
				<el-button
					class="w-full"
					size="default"
					type="primary"
					:loading="loading"
					@click="onEmailRegister(ruleFormRef)"
				>
					{{ t("common.login.pureDefinite") }}
				</el-button>
			</el-form-item>
		</Motion>

		<Motion :delay="350">
			<el-form-item>
				<el-button class="w-full" size="default" @click="onBack">
					{{ t("common.login.pureBack") }}
				</el-button>
			</el-form-item>
		</Motion>
	</el-form>

	<!-- 手机号注册表单 -->
	<el-form v-else ref="ruleFormRef" :model="ruleForm" :rules="updateRules" size="large">
		<Motion>
			<el-form-item
				:rules="[
					{
						required: true,
						message: transformI18n($t('common.login.pureUsernameReg')),
						trigger: 'blur',
					},
				]"
				prop="username"
			>
				<el-input
					v-model="ruleForm.username"
					clearable
					:placeholder="t('common.login.pureUsername')"
					:prefix-icon="useRenderIcon(User)"
				/>
			</el-form-item>
		</Motion>

		<Motion :delay="100">
			<el-form-item prop="phone">
				<el-input
					v-model="ruleForm.phone"
					clearable
					:placeholder="t('common.login.purePhone')"
					:prefix-icon="useRenderIcon(Iphone)"
				/>
			</el-form-item>
		</Motion>

		<Motion :delay="150">
			<el-form-item prop="verifyCode">
				<div class="w-full flex justify-between">
					<el-input
						v-model="ruleForm.verifyCode"
						clearable
						:placeholder="t('common.login.pureSmsVerifyCode')"
						:prefix-icon="useRenderIcon(Keyhole)"
					/>
					<el-button :disabled="isDisabled" class="ml-2!" @click="useVerifyCode().start(ruleFormRef, 'phone')">
						{{ text.length > 0 ? text + t("common.login.pureInfo") : t("common.login.pureGetVerifyCode") }}
					</el-button>
				</div>
			</el-form-item>
		</Motion>

		<Motion :delay="200">
			<el-form-item prop="password">
				<el-input
					v-model="ruleForm.password"
					clearable
					show-password
					:placeholder="t('common.login.purePassword')"
					:prefix-icon="useRenderIcon(Lock)"
				/>
			</el-form-item>
		</Motion>

		<Motion :delay="250">
			<el-form-item :rules="repeatPasswordRule" prop="repeatPassword">
				<el-input
					v-model="ruleForm.repeatPassword"
					clearable
					show-password
					:placeholder="t('common.login.pureSure')"
					:prefix-icon="useRenderIcon(Lock)"
				/>
			</el-form-item>
		</Motion>

		<Motion :delay="300">
			<el-form-item>
				<el-checkbox v-model="checked">
					{{ t("common.login.pureReadAccept") }}
				</el-checkbox>
				<el-button link type="primary">
					{{ t("common.login.purePrivacyPolicy") }}
				</el-button>
			</el-form-item>
		</Motion>

		<Motion :delay="350">
			<el-form-item>
				<el-button class="w-full" size="default" type="primary" :loading="loading" @click="onUpdate(ruleFormRef)">
					{{ t("common.login.pureDefinite") }}
				</el-button>
			</el-form-item>
		</Motion>

		<Motion :delay="400">
			<el-form-item>
				<el-button class="w-full" size="default" @click="onBack">
					{{ t("common.login.pureBack") }}
				</el-button>
			</el-form-item>
		</Motion>
	</el-form>
</template>
