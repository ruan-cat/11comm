# 项目请求对比分析

**用户信息**、**菜单数据**、和**权限信息**在新旧两个项目内的获取流程，与分析结果。

## 一、新项目（Pure-Admin）数据获取流程分析

### 1. 用户信息获取

**获取时机**：仅在登录时获取

- **接口**：`/login` POST 请求
- **返回数据结构**：
  ```typescript
  export type UserResult = {
  	success: boolean;
  	data: {
  		avatar: string;
  		username: string;
  		nickname: string;
  		roles: Array<string>;
  		permissions: Array<string>;
  		accessToken: string;
  		refreshToken: string;
  		expires: Date;
  	};
  };
  ```

**存储方式**：

- Cookie 存储：token、expires、refreshToken
- localStorage 存储：用户详细信息
- Pinia Store：运行时状态管理

**代码位置**：

- API 定义：`apps/admin/src/api/user.ts`
- 存储逻辑：`apps/admin/src/utils/auth.ts` - `setToken()`
- 状态管理：`apps/admin/src/store/modules/user.ts`

### 2. 菜单数据获取

**获取方式**：支持两种模式

**静态路由模式**（当前使用）：

- 菜单直接从静态路由配置生成
- 调用：`usePermissionStoreHook().handleWholeMenus([])`
- 无需额外的网络请求

**动态路由模式**：

- **接口**：`/get-async-routes` GET 请求
- **触发时机**：路由守卫中检测到 `wholeMenus.length === 0` 时
- **处理函数**：`initRouter()` -> `getAsyncRoutes()` -> `handleAsyncRoutes()`

**代码位置**：

- API 定义：`apps/admin/src/api/routes.ts`
- 处理逻辑：`apps/admin/src/router/utils.ts`
- 状态管理：`apps/admin/src/store/modules/permission.ts`

### 3. 权限信息获取

**三层权限架构**：

1. **登录时获取基础权限**：

   - 角色信息：`roles: Array<string>`
   - 权限信息：`permissions: Array<string>`

2. **路由级权限过滤**：

   ```typescript
   function filterNoPermissionTree(data: RouteComponent[]) {
   	const currentRoles = storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [];
   	const newTree = cloneDeep(data).filter((v: any) => isOneOfArray(v.meta?.roles, currentRoles));
   }
   ```

3. **按钮级权限判断**：
   ```typescript
   export const hasPerms = (value: string | Array<string>): boolean => {
   	const { permissions } = useUserStoreHook();
   	// 权限判断逻辑...
   };
   ```

## 二、旧项目（01s-origin）数据获取流程分析

### 1. 用户信息获取

**获取方式**：按需请求

- **登录时**：仅获取 token 和 refreshToken
- **需要时**：调用 `loadUser()` 方法请求详细信息

**API 接口**：

```typescript
async loadUser() {
  // 发送获取当前用户信息请求
  const data = await Request.requestForm(Request.GET, '/login/current-user', null)
  this.user = data.data
}
```

**存储方式**：

- localStorage：token、refreshToken
- Pinia Store：用户详细信息对象

### 2. 菜单数据获取

**获取方式**：按需请求

- **登录时**：不获取菜单数据
- **需要时**：调用 `loadMenus()` 方法请求

**API 接口**：

```typescript
async loadMenus() {
  // 发送获取菜单请求
  const data = await Request.requestForm(Request.GET, '/login/get-menus', null)
  this.menus = data.data
}
```

**特点**：

- 支持菜单的实时更新
- 减少登录时的网络负担
- 菜单数据与用户权限解耦

### 3. 权限信息获取

**获取方式**：

- 权限信息包含在用户详细信息中
- 通过 `loadUser()` 方法获取最新权限
- 支持权限的动态更新

## 三、对比分析

### 数据获取时机对比

| 数据类型 | 新项目                   | 旧项目   | 优劣分析                         |
| -------- | ------------------------ | -------- | -------------------------------- |
| 用户信息 | 登录时一次性获取         | 按需请求 | 旧项目更灵活，支持实时更新       |
| 菜单数据 | 静态路由或路由守卫中获取 | 按需请求 | 旧项目减少登录负担，支持动态更新 |
| 权限信息 | 登录时获取，静态存储     | 按需请求 | 旧项目支持权限实时变更           |

### 数据实时性对比

**新项目问题**：

1. 用户信息无法实时更新（如头像、昵称变更）
2. 权限变更需要重新登录才能生效
3. 菜单配置更新需要刷新页面

**旧项目优势**：

1. 支持用户信息的实时刷新
2. 权限变更可以立即生效
3. 菜单配置可以动态加载

### 性能对比

**新项目**：

- ✅ 登录后数据立即可用
- ❌ 登录时网络请求较多
- ❌ 数据更新需要重新登录

**旧项目**：

- ✅ 登录速度快
- ✅ 支持数据的按需加载
- ❌ 首次使用功能时需要额外请求

## 四、迁移必要性评估

### 迁移必要性：**强烈建议迁移**

**理由**：

1. **业务需求**：现代应用需要支持权限和菜单的实时更新
2. **用户体验**：避免因权限变更导致的重新登录
3. **系统架构**：支持微服务架构下的权限动态分配
4. **维护成本**：减少因静态权限导致的运维问题

### 不迁移的风险

1. **权限管理问题**：

   - 管理员修改用户权限后，用户需要重新登录
   - 紧急权限回收无法立即生效

2. **菜单管理问题**：

   - 新增菜单需要用户刷新页面
   - 菜单权限调整无法实时反映

3. **用户体验问题**：
   - 用户信息更新不及时
   - 系统响应性差

## 五、具体迁移方案

### 第一阶段：API 接口扩展

在 `apps/admin/src/api/user.ts` 中添加：

```typescript
/** 获取当前用户详细信息 */
export const getCurrentUser = (data?: object) => {
	return http.request<UserInfoResult>("get", "/login/current-user", { data });
};

/** 获取用户菜单 */
export const getUserMenus = (data?: object) => {
	return http.request<MenuResult>("get", "/login/get-menus", { data });
};

/** 刷新用户权限 */
export const refreshUserPermissions = (data?: object) => {
	return http.request<PermissionResult>("get", "/login/refresh-permissions", { data });
};
```

### 第二阶段：类型定义

创建 `apps/admin/src/types/user/User.ts`：

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
	lastLoginTime?: string;
	status?: number;
}

export interface Menu {
	id: string;
	name: string;
	path: string;
	icon?: string;
	sort?: number;
	children?: Array<Menu>;
	meta?: {
		title: string;
		roles?: Array<string>;
		permissions?: Array<string>;
		hidden?: boolean;
	};
}
```

### 第三阶段：Store 增强

修改 `apps/admin/src/store/modules/user.ts`：

```typescript
export const useUserStore = defineStore("pure-user", {
	state: (): userType & {
		// 旧项目状态
		loaded: boolean;
		user: UserInfo | null;
		menus: Array<Menu>;
	} => ({
		// 保留现有状态...

		// 新增状态
		loaded: false,
		user: null,
		menus: [],
	}),

	getters: {
		// 新增 getters
		isLoaded: (state) => state.loaded,
		getUser: (state) => state.user,
		getMenus: (state) => state.menus,
	},

	actions: {
		// 保留现有 actions...

		/** 加载用户详细信息 */
		async loadUser() {
			try {
				const data = await getCurrentUser();
				this.user = data.data;

				// 同步更新 Pure-Admin 的用户信息字段
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

		/** 刷新权限信息 */
		async refreshPermissions() {
			try {
				const data = await refreshUserPermissions();
				if (data.data) {
					this.SET_ROLES(data.data.roles || []);
					this.SET_PERMS(data.data.permissions || []);
				}
			} catch (error) {
				console.error("刷新权限失败:", error);
				throw error;
			}
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
```

### 第四阶段：登录流程改造

修改 `apps/admin/src/views/login/index.vue`：

```typescript
const onLogin = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate((valid) => {
		if (valid) {
			loading.value = true;

			async function integratedLogin() {
				try {
					// 1. 执行登录
					const res = await useUserStoreHook().loginByUsername({
						username: ruleForm.username,
						password: ruleForm.password,
						verifyCode: ruleForm.verifyCode,
					});

					if (res.success) {
						// 2. 加载用户详细信息和菜单数据
						await Promise.all([useUserStoreHook().loadUser(), useUserStoreHook().loadMenus()]);

						useUserStoreHook().setLoaded(true);

						// 3. 处理路由和权限
						usePermissionStoreHook().handleWholeMenus(useUserStoreHook().getMenus);
						addPathMatch();

						// 4. 跳转到首页
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

### 第五阶段：提供数据刷新接口

在组件中提供刷新方法：

```typescript
// 在需要的组件中
import { useUserStoreHook } from "@/store/modules/user";

export const useDataRefresh = () => {
	const userStore = useUserStoreHook();

	/** 刷新用户信息 */
	const refreshUserInfo = async () => {
		await userStore.loadUser();
	};

	/** 刷新菜单 */
	const refreshMenus = async () => {
		await userStore.loadMenus();
		usePermissionStoreHook().handleWholeMenus(userStore.getMenus);
	};

	/** 刷新权限 */
	const refreshPermissions = async () => {
		await userStore.refreshPermissions();
	};

	/** 全量刷新 */
	const refreshAll = async () => {
		await Promise.all([refreshUserInfo(), refreshMenus(), refreshPermissions()]);
	};

	return {
		refreshUserInfo,
		refreshMenus,
		refreshPermissions,
		refreshAll,
	};
};
```

## 六、实施建议

### 实施优先级

1. **高优先级**：用户信息和权限的按需加载
2. **中优先级**：菜单数据的动态加载
3. **低优先级**：数据缓存和性能优化

### 实施步骤

1. **第一步**：创建 API 接口和类型定义
2. **第二步**：扩展用户 Store，添加按需加载方法
3. **第三步**：修改登录流程，集成数据加载逻辑
4. **第四步**：提供数据刷新组合函数
5. **第五步**：测试和优化

### 注意事项

1. **向后兼容**：确保现有功能不受影响
2. **错误处理**：妥善处理网络请求失败的情况
3. **性能考虑**：避免频繁的数据请求
4. **缓存策略**：合理使用缓存减少网络负担
5. **用户反馈**：提供加载状态和错误提示

## 七、预期效果

迁移完成后，系统将具备以下能力：

1. **实时权限管理**：管理员修改权限后立即生效
2. **动态菜单更新**：新增或修改菜单无需刷新页面
3. **用户信息同步**：支持用户信息的实时更新
4. **更好的用户体验**：减少重新登录的需求
5. **灵活的数据管理**：支持按需加载和实时刷新

通过这次迁移，新项目将在保持现有架构优势的基础上，获得旧项目灵活的数据管理能力，为后续的功能扩展和维护奠定良好基础。
