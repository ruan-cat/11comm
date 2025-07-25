import Cookies from "js-cookie";
import { useUserStoreHook } from "@/store/modules/user";
import { storageLocal, isString, isIncludeAllChildren } from "@pureadmin/utils";

export interface DataInfo<T> {
	/** token */
	accessToken: string;
	/**
	 * `accessToken`的过期时间（时间戳）
	 * @deprecated
	 * 业务变更 本项目不再使用框架自带的过期时间设置功能
	 *
	 * 不做客户端层面的时间检查 token过期的检查逻辑 交给后端服务器检查实现
	 */
	expires?: T;
	/** 用于调用刷新accessToken的接口时所需的token */
	refreshToken: string;
	/** 头像 */
	avatar?: string;
	/** 用户名 */
	username?: string;
	/** 昵称 */
	nickname?: string;
	/** 当前登录用户的角色 */
	roles?: Array<string>;
	/** 当前登录用户的按钮级别权限 */
	permissions?: Array<string>;
}

export const userKey = "user-info";
export const TokenKey = "authorized-token";
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const multipleTabsKey = "multiple-tabs";

/** 获取`token` */
export function getToken(): DataInfo<number> {
	// 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
	/**
	 * FIXME: 无法获得数据 无法存储到有意义的数据 获取的是 localStorage 的数据
	 */
	const res = Cookies.get(TokenKey) ? JSON.parse(Cookies.get(TokenKey)) : storageLocal().getItem(userKey);
	// consola.log(" 获取 token ", res, Cookies.get(TokenKey));
	return res;
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`、`refreshToken`这三条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`avatar`、`username`、`nickname`、`roles`、`permissions`、`refreshToken`、`expires`这七条信息放在key值为`user-info`的localStorage里（利用`multipleTabsKey`当浏览器完全关闭后自动销毁）
 */
export function setToken(data: DataInfo<number>) {
	// consola.log(" 设置 token ", data);
	let expires = 0;
	const { accessToken, refreshToken } = data;
	const { isRemembered, loginDay } = useUserStoreHook();

	// 如果后端直接设置时间戳，将此处代码改为expires = data.expires，然后把上面的DataInfo<Date>改成DataInfo<number>即可
	// expires = new Date(data.expires).getTime();
	// 经过协商沟通 后端返回的值是过期时间的具体时间戳
	expires = data.expires;

	const cookieString = JSON.stringify({ accessToken, expires, refreshToken });

	expires > 0
		? Cookies.set(TokenKey, cookieString, {
				expires: (expires - Date.now()) / 86400000,
			})
		: Cookies.set(TokenKey, cookieString);

	Cookies.set(
		multipleTabsKey,
		"true",
		isRemembered
			? {
					expires: loginDay,
				}
			: {},
	);

	function setUserKey({ avatar, username, nickname, roles, permissions }) {
		useUserStoreHook().SET_AVATAR(avatar);
		useUserStoreHook().SET_USERNAME(username);
		useUserStoreHook().SET_NICKNAME(nickname);
		useUserStoreHook().SET_ROLES(roles);
		useUserStoreHook().SET_PERMS(permissions);
		storageLocal().setItem(userKey, {
			/** 多存储token 因为实际使用时 token无法获取 */
			accessToken,
			refreshToken,
			expires,
			avatar,
			username,
			nickname,
			roles,
			permissions,
		});
	}

	if (data.username && data.roles) {
		const { username, roles } = data;
		setUserKey({
			avatar: data?.avatar ?? "",
			username,
			nickname: data?.nickname ?? "",
			roles,
			permissions: data?.permissions ?? [],
		});
	} else {
		const avatar = storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "";
		const username = storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "";
		const nickname = storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "";
		const roles = storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [];
		const permissions = storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [];
		setUserKey({
			avatar,
			username,
			nickname,
			roles,
			permissions,
		});
	}
}

/** 删除`token`以及key值为`user-info`的localStorage信息 */
export function removeToken() {
	Cookies.remove(TokenKey);
	Cookies.remove(multipleTabsKey);
	storageLocal().removeItem(userKey);
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
	return "Bearer " + token;
};

/** 是否有按钮级别的权限（根据登录接口返回的`permissions`字段进行判断）*/
export const hasPerms = (value: string | Array<string>): boolean => {
	if (!value) return false;
	const allPerms = "*:*:*";
	const { permissions } = useUserStoreHook();
	if (!permissions) return false;
	if (permissions.length === 1 && permissions[0] === allPerms) return true;
	const isAuths = isString(value) ? permissions.includes(value) : isIncludeAllChildren(value, permissions);
	return isAuths ? true : false;
};

/**
 * 设置用户的角色
 * @description
 * 这不是框架自带的函数 是后面增加的
 *
 * 主要用于实现前端层面的用户信息设置
 */
export function setUserRoles(roles: string[]) {
	useUserStoreHook().SET_ROLES(roles);
	storageLocal().setItem(userKey, {
		// 先无条件的获取现有的数据
		...storageLocal().getItem<DataInfo<number>>(userKey),
		// 在用新的角色覆盖
		roles,
	});
}
