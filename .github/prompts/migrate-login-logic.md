# 登录后处理逻辑迁移方案

## 问题分析

### 旧项目登录流程

1. 用户登录成功后，调用 `$store.setToken(res.data)` 存储 token
2. 登录成功回调中跳转到首页
3. **关键差异**：旧项目没有在登录时立即请求用户信息和菜单数据，而是在需要时才请求

### 新项目登录流程

1. 登录成功后，调用 `setToken()` 存储用户信息
2. 调用 `usePermissionStoreHook().handleWholeMenus([])` 处理菜单
3. 调用 `addPathMatch()` 添加路由匹配
4. 直接跳转到首页

## 迁移方案

### 方案一：修改登录页面逻辑（推荐）

修改 `apps/admin/src/views/login/index.vue` 中的登录逻辑：

```typescript
const onLogin = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate((valid) => {
		if (valid) {
			loading.value = true;

			// 整合旧项目的登录逻辑
			async function integratedLogin() {
				try {
					// 1. 调用登录接口
					const res = await useUserStoreHook().loginByUsername({
						username: ruleForm.username,
						password: ruleForm.password,
						verifyCode: ruleForm.verifyCode,
					});

					if (res.success) {
						// 2. 设置 token（这一步在 loginByUsername 中已完成）
						// setToken(res.data);

						// 3. 加载用户信息和菜单数据（新增逻辑）
						await useUserStoreHook().loadUser();
						await useUserStoreHook().loadMenus();
						useUserStoreHook().setLoaded(true);

						// 4. 处理路由和权限
						usePermissionStoreHook().handleWholeMenus(useUserStoreHook().getMenus);
						addPathMatch();

						// 5. 跳转到首页
						router.push(getTopMenu(true).path);
						message(t("common.login.pureLoginSuccess"), { type: "success" });
					} else {
						message(t("common.login.pureLoginFail"), { type: "error" });
					}
				} catch (error) {
					console.error("登录失败:", error);
					message(t("common.login.pureLoginFail"), { type: "error" });
				} finally {
					loading.value = false;
				}
			}

			integratedLogin();
		}
	});
};
```

### 方案二：修改用户 Store 的登录方法

修改 `apps/admin/src/store/modules/user.ts` 中的 `loginByUsername` 方法：

```typescript
/** 登入 */
async loginByUsername(data) {
	return new Promise<UserResult>((resolve, reject) => {
		getLogin(data)
			.then(async (data) => {
				if (data?.success) {
					// 1. 设置 token
					setToken(data.data);

					// 2. 登录成功后自动加载用户和菜单数据（新增逻辑）
					try {
						await this.loadUser();
						await this.loadMenus();
						this.setLoaded(true);

						// 3. 处理权限和路由
						usePermissionStoreHook().handleWholeMenus(this.menus);
						addPathMatch();
					} catch (error) {
						console.error("加载用户信息或菜单失败:", error);
						// 即使加载失败，也不影响登录流程
					}
				}
				resolve(data);
			})
			.catch((error) => {
				reject(error);
			});
	});
},
```

### 方案三：在路由守卫中处理（保持现有逻辑）

如果希望保持登录页面的简洁性，可以在路由守卫中处理用户信息和菜单的加载。

修改 `apps/admin/src/router/index.ts` 中的路由守卫：

```typescript
// 在路由守卫的刷新逻辑中添加
function newInitRouter() {
	// 检查是否需要加载用户信息和菜单
	const userStore = useUserStoreHook();
	if (!userStore.isLoaded) {
		// 加载用户信息和菜单数据
		Promise.all([userStore.loadUser(), userStore.loadMenus()])
			.then(() => {
				userStore.setLoaded(true);
				// 使用加载的菜单数据处理路由
				usePermissionStoreHook().handleWholeMenus(userStore.getMenus);
			})
			.catch((error) => {
				console.error("加载用户信息或菜单失败:", error);
				// 使用默认的空菜单
				usePermissionStoreHook().handleWholeMenus([]);
			});
	} else {
		// 已加载，使用现有菜单数据
		usePermissionStoreHook().handleWholeMenus(userStore.getMenus);
	}

	addPathMatch();
	// 其余逻辑保持不变...
}
```

## 需要创建的 API 接口

为了支持旧项目的逻辑，需要在新项目中创建对应的 API 接口：

### 1. 创建用户信息接口

在 `apps/admin/src/api/user.ts` 中添加：

```typescript
/** 获取当前用户信息 */
export const getCurrentUser = (data?: object) => {
	return http.request<UserInfoResult>("get", "/login/current-user", { data });
};

/** 获取用户菜单 */
export const getUserMenus = (data?: object) => {
	return http.request<MenuResult>("get", "/login/get-menus", { data });
};

// 定义菜单结果类型
export type MenuResult = {
	success: boolean;
	data: Array<Menu>;
};
```

### 2. 创建类型定义

在 `apps/admin/src/types/user/User.ts` 中定义：

```typescript
export interface UserInfo {
	id: string;
	username: string;
	nickname: string;
	avatar: string;
	email?: string;
	phone?: string;
	roles?: Array<string>;
	permissions?: Array<string>;
}

export interface Menu {
	id: string;
	name: string;
	path: string;
	icon?: string;
	children?: Array<Menu>;
	meta?: {
		title: string;
		roles?: Array<string>;
		permissions?: Array<string>;
	};
}
```

### 3. 修改用户 Store

确保用户 Store 包含旧项目的方法：

```typescript
// 在 apps/admin/src/store/modules/user.ts 中添加
import { getCurrentUser, getUserMenus } from "@/api/user";

// 在 actions 中添加
/** 加载用户信息 */
async loadUser() {
	try {
		const data = await getCurrentUser();
		this.user = data.data;

		// 同步更新 Pure-Admin 的用户信息
		if (data.data) {
			this.SET_USERNAME(data.data.username || "");
			this.SET_NICKNAME(data.data.nickname || "");
			this.SET_AVATAR(data.data.avatar || "");
			if (data.data.roles) this.SET_ROLES(data.data.roles);
			if (data.data.permissions) this.SET_PERMS(data.data.permissions);
		}
	} catch (error) {
		console.error("加载用户信息失败:", error);
		throw error;
	}
},

/** 加载菜单数据 */
async loadMenus() {
	try {
		const data = await getUserMenus();
		this.menus = data.data;
	} catch (error) {
		console.error("加载菜单失败:", error);
		throw error;
	}
},
```

## 推荐实施方案

**推荐使用方案一**，原因如下：

1. **逻辑清晰**：登录成功后立即加载必要数据，符合用户预期
2. **错误处理**：可以在登录阶段就处理数据加载失败的情况
3. **性能优化**：避免在路由守卫中重复检查和加载
4. **维护性好**：登录相关逻辑集中在登录页面，便于维护

## 实施步骤

1. **第一步**：创建必要的 API 接口和类型定义
2. **第二步**：修改用户 Store，添加 `loadUser` 和 `loadMenus` 方法
3. **第三步**：修改登录页面逻辑，在登录成功后调用数据加载方法
4. **第四步**：测试登录流程，确保数据正确加载
5. **第五步**：处理错误情况，确保即使数据加载失败也不影响基本功能

## 注意事项

1. **向后兼容**：确保新逻辑不影响现有的静态路由功能
2. **错误处理**：妥善处理网络请求失败的情况
3. **加载状态**：使用 `loaded` 标志避免重复加载
4. **权限同步**：确保从后端加载的权限信息能正确更新到 Pure-Admin 的权限系统中
5. **菜单处理**：确保后端返回的菜单格式与 Pure-Admin 的菜单系统兼容
