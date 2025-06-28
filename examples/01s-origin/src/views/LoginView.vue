<!-- 登录页面 -->
<template>
	<el-card class="box-card">
		<el-form :model="formData" status-icon label-width="60px">
			<el-form-item label="账号" prop="username">
				<el-input v-model="formData.username"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="formData.password" type="password"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm()">登录</el-button>
			</el-form-item>
		</el-form>
		<!-- TODO[TEST_CODE]:测试代码后期发布需要删除 -->
		<router-link to="/sample" v-if="showTestLink">进入示例演示页面</router-link>
	</el-card>
	<!-- 验证码组件 -->
	<Verify
		mode="pop"
		:captchaType="captchaType"
		:imgSize="{ width: '400px', height: '200px' }"
		ref="verify"
		@success="handleSuccess"
	></Verify>
</template>

<script setup lang="ts">
import Verify from "@/components/verifition/Verify.vue";
import { ref, reactive } from "vue";
import { login } from "@/apis/login/index";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

// 是否显示示例演示界面连接
const showTestLink = ref(import.meta.env.DEV);

// 是否启用验证码
const enableVerify = ref(!import.meta.env.DEV);

// 获取router对象
const $router = useRouter();

// 定义登录数据对象
const formData = reactive({
	username: "",
	password: "",
});

/**
 * 执行登录
 * @param code 验证码字符串
 */
function doLogin(code: string) {
	// 发送登录请求
	login(
		{
			...formData,
			code: code,
		},
		() => {
			// 跳转到首页
			$router.push("/home");
			// 登录成功提示
			ElMessage.success("登录成功，前往首页");
		},
		() => {
			ElMessage.error("账号或密码错误");
		},
	);
}

// 定义登录提交函数
function submitForm() {
	// 是否启用验证码
	if (!enableVerify.value) {
		doLogin("");
		return;
	}
	// 弹出验证码框
	useVerify("clickWord");
}

// 验证码组件引用
const verify = ref<InstanceType<typeof Verify> | null>(null);

// 验证码类型
const captchaType = ref("");

/**
 * 弹出验证码框
 * @param type 验证码类型 blockPuzzle滑块验证 clickWord点击文字验证
 */
function useVerify(type: string) {
	captchaType.value = type;
	if (verify.value) verify.value.show();
}

/**
 * 验证码验证通过执行登录二次验证逻辑
 * @param res 验证通过信息
 */
function handleSuccess(res: { captchaVerification: string }) {
	doLogin(res.captchaVerification);
}
</script>

<style>
.box-card {
	width: 480px;
	margin: 50px auto;
	padding: 20px;
}
</style>
