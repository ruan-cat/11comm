# Pure-Admin 用户信息存储迁移方案

## 需求背景

将原始项目 `examples/01s-origin` 中的用户存储逻辑迁移到当前 Pure-Admin 框架 `apps/admin` 中，保留两者的核心功能。

## 两个项目的用户存储对比

### 原始项目 (`examples/01s-origin`)

```typescript
// examples/01s-origin/src/stores/user.ts
import { defineStore } from "pinia";
import Request from "@/apis/request";
import type { Menu, UserInfo } from "@/types/user/User";

export const userStore = defineStore("user", {
	state: () => ({
		// 记录token
		token: null as string | null,
		// 记录refreshToken
		refreshToken: null as string | null,
		// 保存一个标识信息，指示登陆后需要加载的初始化数据是否完成
		loaded: false,
		// 保存当前用户
		user: null as UserInfo | null,
		// 菜单数据
		menus: [] as Array<Menu>,
	}),
	// getters 和 actions...
});
```

特点：

- 直接使用 localStorage 存储 token 和 refreshToken
- 有单独的用户详细信息对象 (user) 和菜单数据 (menus)
- 使用 loaded 标志跟踪初始化状态

### 当前项目 (Pure-Admin)

```typescript
// apps/admin/src/store/modules/user.ts
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
		// 其他状态...
	}),
	// actions...
});
```

特点：

- 使用 Cookie + localStorage 双层存储机制
- 用户信息分散在多个属性中 (avatar, username, roles 等)
- 使用 `storageLocal()` 工具函数操作 localStorage

## 迁移方案

修改 `apps/admin/src/store/modules/user.ts` 文件如下：

```typescript
import { defineStore } from "pinia";
import { type userType, store, router, resetRouter, routerArrays, storageLocal } from "../utils";
import { type UserResult, type RefreshTokenResult, getLogin, refreshTokenApi } from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";
import Request from "@/apis/request";
import type { Menu, UserInfo } from "@/types/user/User";

export const useUserStore = defineStore("pure-user", {
	state: (): userType & {
		// 从原始项目迁移的属性
		loaded: boolean;
		user: UserInfo | null;
		menus: Array<Menu>;
	} => ({
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
		// 前端生成的验证码（按实际需求替换）
		verifyCode: "",
		// 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
		currentPage: 0,
		// 是否勾选了登录页的免登录
		isRemembered: false,
		// 登录页的免登录存储几天，默认7天
		loginDay: 7,

		// 从原始项目迁移的状态
		loaded: false,
		user: null,
		menus: [],
	}),
	getters: {
		// 从原始项目迁移的 getters
		isLoaded: (state) => state.loaded,
		getUser: (state) => state.user,
		getMenus: (state) => state.menus,
	},
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
		async loginByUsername(data) {
			return new Promise<UserResult>((resolve, reject) => {
				getLogin(data)
					.then(async (data) => {
						if (data?.success) {
							setToken(data.data);
							// 登录成功后加载用户和菜单数据
							await this.loadUser();
							await this.loadMenus();
							this.setLoaded(true);
						}
						resolve(data);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		/** 前端登出（不调用接口） */
		logOut() {
			this.username = "";
			this.roles = [];
			this.permissions = [];

			// 重置从原始项目迁移的数据
			this.resetSaveData();

			removeToken();
			useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
			resetRouter();
			router.push("/login");
		},
		/** 刷新`token` */
		async handRefreshToken(data) {
			return new Promise<RefreshTokenResult>((resolve, reject) => {
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

		// 从原始项目迁移的 actions
		/** 加载用户信息 */
		async loadUser() {
			// 发送获取当前用户信息请求
			const data = await Request.requestForm(Request.GET, "/login/current-user", null);
			this.user = data.data;

			// 同步更新 Pure-Admin 的用户信息
			if (data.data) {
				this.SET_USERNAME(data.data.username || "");
				this.SET_NICKNAME(data.data.nickname || "");
				this.SET_AVATAR(data.data.avatar || "");
				// 如果原始项目有角色和权限信息，也需要同步更新
				if (data.data.roles) this.SET_ROLES(data.data.roles);
				if (data.data.permissions) this.SET_PERMS(data.data.permissions);
			}
		},

		/** 加载菜单数据 */
		async loadMenus() {
			// 发送获取菜单请求
			const data = await Request.requestForm(Request.GET, "/login/get-menus", null);
			this.menus = data.data;
		},

		/** 设置加载状态 */
		setLoaded(loaded: boolean) {
			this.loaded = loaded;
		},

		/** 重置数据 */
		resetSaveData() {
			this.loaded = false;
			this.user = null;
			this.menus = [];
		},
	},
});

export function useUserStoreHook() {
	return useUserStore(store);
}
```

## 主要改动说明

1. **状态整合**：

   - 添加了原始项目的 `loaded`、`user`、`menus` 状态
   - 保留了 Pure-Admin 的所有原有状态

2. **Getters 添加**：

   - 添加了原始项目的 `isLoaded`、`getUser`、`getMenus` getters
   - 不需要添加 `getToken` getter，因为 Pure-Admin 已有类似功能

3. **Actions 整合**：

   - 保留了 Pure-Admin 的所有原有方法
   - 添加了原始项目的 `loadUser`、`loadMenus`、`setLoaded`、`resetSaveData` 方法
   - 修改了 `loginByUsername` 方法，成功后自动加载用户和菜单数据
   - 修改了 `logOut` 方法，确保清除所有状态

4. **存储机制适配**：

   - 原始项目直接使用 localStorage，而 Pure-Admin 使用 `setToken` 和 `storageLocal`
   - 在 `loadUser` 方法中，同步更新 Pure-Admin 的用户信息字段

5. **类型声明适配**：
   - 需要导入原始项目的 `Menu` 和 `UserInfo` 类型
   - 扩展 `userType` 类型，包含新增的状态字段

## 实施注意事项

1. 确保已从原始项目导入 `Request` 服务和相关类型定义
2. 可能需要调整 API 路径以匹配当前项目的后端接口
3. 根据实际需求可能需要进一步调整数据结构和方法实现
4. 如果原始项目的用户信息结构与当前项目差异较大，需要在 `loadUser` 方法中增加适配逻辑

## 迁移后效果

迁移完成后，新的用户存储模块将具备以下能力：

- 保留 Pure-Admin 的 Cookie + localStorage 双层存储机制
- 集成原始项目的用户详细信息和菜单数据管理
- 登录成功后自动加载用户信息和菜单数据
- 支持原有的角色和权限管理功能
