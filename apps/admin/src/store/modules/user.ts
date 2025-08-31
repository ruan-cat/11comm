import { defineStore } from "pinia";
import { type userType, store, router, resetRouter, routerArrays, storageLocal } from "../utils";
import { type UserResult, type RefreshTokenResult, getLogin, refreshTokenApi } from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";

import { ElMessage } from "element-plus";

export const useUserStore = defineStore("pure-user", {
	state: (): userType => ({
		// 头像
		avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
		// 用户名
		username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
		// 昵称
		nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
		// 页面级别权限
		roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
		// 按钮级别权限
		permissions: storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
		/**
		 * 前端生成的验证码（按实际需求替换）
		 * @deprecated
		 * 在本项目内 不再使用前端生成的验证码 该配置事实上无意义了
		 * @description
		 */
		verifyCode: "",
		// 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
		currentPage: 0,
		// 是否勾选了登录页的免登录
		isRemembered: false,
		// 登录页的免登录存储几天，默认7天
		loginDay: 7,
	}),
	actions: {
		/** 存储头像 */
		SET_AVATAR(avatar: string) {
			this.avatar = avatar;
		},
		/** 存储用户名 */
		SET_USERNAME(username: string) {
			this.username = username;
		},
		/** 存储昵称 */
		SET_NICKNAME(nickname: string) {
			this.nickname = nickname;
		},
		/** 存储角色 */
		SET_ROLES(roles: Array<string>) {
			this.roles = roles;
		},
		/** 存储按钮级别权限 */
		SET_PERMS(permissions: Array<string>) {
			this.permissions = permissions;
		},
		/** 存储前端生成的验证码 */
		SET_VERIFYCODE(verifyCode: string) {
			this.verifyCode = verifyCode;
		},
		/** 存储登录页面显示哪个组件 */
		SET_CURRENTPAGE(value: number) {
			this.currentPage = value;
		},
		/** 存储是否勾选了登录页的免登录 */
		SET_ISREMEMBERED(bool: boolean) {
			this.isRemembered = bool;
		},
		/** 设置登录页的免登录存储几天 */
		SET_LOGINDAY(value: number) {
			this.loginDay = Number(value);
		},

		/** 登入 */
		async loginByUsername(data: AuthLoginParams) {
			// TODO: 返回值需要重设类型 目前登录后 还需要获取到足量的用户数据后 才能返回用户信息
			return new Promise<UserResult>((resolve, reject) => {
				/** 框架原版的登录处理函数 */
				function originalGetLogin(data) {
					getLogin(data)
						.then((data) => {
							// @ts-ignore
							if (data?.success) setToken(data.data);
							// @ts-ignore
							resolve(data);
						})
						.catch((error) => {
							reject(error);
						});
				}

				/** 处理登录逻辑 对接01s接口的处理逻辑 */
				function handleLogin(data: AuthLoginParams) {
					getLogin(data)
						.then((res) => {
							const code = res.code;

							// 如果接口失败
							if (code !== HttpCode.SUCCESS) {
								// 待优化 以下逻辑可以在 响应拦截 内实现统一封装
								const httpCodeMessageMapValue: HttpCodeMessageMapValue = HttpCodeMessageMap[code];
								const { message } = httpCodeMessageMapValue;
								ElMessage.error(message);
								ElMessage.error(res.message);
								reject(res);
							}

							// 如果接口成功
							if (code === HttpCode.SUCCESS) {
								// @ts-ignore 警告 此处只能设置少量的字段 大多数的字段无法设置 需要改动一下框架
								const { clientId, refreshToken, token, expiresIn, tokenHead } = res.data;
								setToken({
									// 登录成功后 必须存储 token
									accessToken: token,
									// 登录成功后 必须存储 refreshToken
									refreshToken,
									// 业务变更 和后端协商 前端不再存储过期时间
									// 但是为了避免错误，我们设置一个默认的过期时间
									// expires: expiresIn,
								});

								console.log(" 登录成功，token已存储:", { accessToken: token, refreshToken });

								// TODO: 这些用户信息要去别的地方设置
								// avatar,
								// username,
								// nickname,
								// roles,
								// permissions,
							}
							// TODO: 请求用户数据 获取到用户信息后 需要重新设置用户信息

							// @ts-ignore 警告 此处返回值不满足 UserResult 的类型
							resolve(res);
						})
						.catch((error) => {
							reject(error);
						});
				}

				handleLogin(data);
			});
		},

		/** 前端登出（不调用接口） */
		logOut() {
			this.username = "";
			this.roles = [];
			this.permissions = [];
			removeToken();
			useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
			resetRouter();
			router.push("/login");
		},

		/** 刷新`token` */
		async handRefreshToken(data) {
			return new Promise<RefreshTokenResult>((resolve, reject) => {
				// TODO: 对接刷新token的接口
				refreshTokenApi(data)
					.then((data) => {
						if (data) {
							setToken(data.data);
							resolve(data);
						}
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
	},
});

export function useUserStoreHook() {
	return useUserStore(store);
}
