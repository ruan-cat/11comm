// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";
import { RouterOrderEnums } from "@/router/enums";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const systemManagementRouter = {
	path: "/system",
	meta: {
		icon: "ri:settings-3-line",
		title: "common.menus.pureSysManagement",
		rank: RouterOrderEnums.system,
	},
	children: [
		{
			path: "/system/user/index",
			name: "SystemUser",
			meta: {
				icon: "ri:admin-line",
				title: "common.menus.pureUser",
				roles: ["admin"],
			},
		},
		{
			path: "/system/role/index",
			name: "SystemRole",
			meta: {
				icon: "ri:admin-fill",
				title: "common.menus.pureRole",
				roles: ["admin"],
			},
		},
		{
			path: "/system/menu/index",
			name: "SystemMenu",
			meta: {
				icon: "ep:menu",
				title: "common.menus.pureSystemMenu",
				roles: ["admin"],
			},
		},
		{
			path: "/system/dept/index",
			name: "SystemDept",
			meta: {
				icon: "ri:git-branch-line",
				title: "common.menus.pureDept",
				roles: ["admin"],
			},
		},
	],
};

const systemMonitorRouter = {
	path: "/monitor",
	meta: {
		icon: "ep:monitor",
		title: "common.menus.pureSysMonitor",
		rank: RouterOrderEnums.monitor,
	},
	children: [
		{
			path: "/monitor/online-user",
			component: "monitor/online/index",
			name: "OnlineUser",
			meta: {
				icon: "ri:user-voice-line",
				title: "common.menus.pureOnlineUser",
				roles: ["admin"],
			},
		},
		{
			path: "/monitor/login-logs",
			component: "monitor/logs/login/index",
			name: "LoginLog",
			meta: {
				icon: "ri:window-line",
				title: "common.menus.pureLoginLog",
				roles: ["admin"],
			},
		},
		{
			path: "/monitor/operation-logs",
			component: "monitor/logs/operation/index",
			name: "OperationLog",
			meta: {
				icon: "ri:history-fill",
				title: "common.menus.pureOperationLog",
				roles: ["admin"],
			},
		},
		{
			path: "/monitor/system-logs",
			component: "monitor/logs/system/index",
			name: "SystemLog",
			meta: {
				icon: "ri:file-search-line",
				title: "common.menus.pureSystemLog",
				roles: ["admin"],
			},
		},
	],
};

const permissionRouter = {
	path: "/permission",
	meta: {
		title: "common.menus.purePermission",
		icon: "ep:lollipop",
		rank: RouterOrderEnums.permission,
	},
	children: [
		{
			path: "/permission/page/index",
			name: "PermissionPage",
			meta: {
				title: "common.menus.purePermissionPage",
				roles: ["admin", "common"],
			},
		},
		{
			path: "/permission/button",
			meta: {
				title: "common.menus.purePermissionButton",
				roles: ["admin", "common"],
			},
			children: [
				{
					path: "/permission/button/router",
					component: "permission/button/index",
					name: "PermissionButtonRouter",
					meta: {
						title: "common.menus.purePermissionButtonRouter",
						auths: ["permission:btn:add", "permission:btn:edit", "permission:btn:delete"],
					},
				},
				{
					path: "/permission/button/login",
					component: "permission/button/perms",
					name: "PermissionButtonLogin",
					meta: {
						title: "common.menus.purePermissionButtonLogin",
					},
				},
			],
		},
	],
};

const frameRouter = {
	path: "/iframe",
	meta: {
		icon: "ri:links-fill",
		title: "common.menus.pureExternalPage",
		rank: RouterOrderEnums.frame,
	},
	children: [
		{
			path: "/iframe/embedded",
			meta: {
				title: "common.menus.pureEmbeddedDoc",
			},
			children: [
				{
					path: "/iframe/colorhunt",
					name: "FrameColorHunt",
					meta: {
						title: "common.menus.pureColorHuntDoc",
						frameSrc: "https://colorhunt.co/",
						keepAlive: true,
						roles: ["admin", "common"],
					},
				},
				{
					path: "/iframe/uigradients",
					name: "FrameUiGradients",
					meta: {
						title: "common.menus.pureUiGradients",
						frameSrc: "https://uigradients.com/",
						keepAlive: true,
						roles: ["admin", "common"],
					},
				},
				{
					path: "/iframe/ep",
					name: "FrameEp",
					meta: {
						title: "common.menus.pureEpDoc",
						frameSrc: "https://element-plus.org/zh-CN/",
						keepAlive: true,
						roles: ["admin", "common"],
					},
				},
				{
					path: "/iframe/tailwindcss",
					name: "FrameTailwindcss",
					meta: {
						title: "common.menus.pureTailwindcssDoc",
						frameSrc: "https://tailwindcss.com/docs/installation",
						keepAlive: true,
						roles: ["admin", "common"],
					},
				},
				{
					path: "/iframe/vue3",
					name: "FrameVue",
					meta: {
						title: "common.menus.pureVueDoc",
						frameSrc: "https://cn.vuejs.org/",
						keepAlive: true,
						roles: ["admin", "common"],
					},
				},
				{
					path: "/iframe/vite",
					name: "FrameVite",
					meta: {
						title: "common.menus.pureViteDoc",
						frameSrc: "https://cn.vitejs.dev/",
						keepAlive: true,
						roles: ["admin", "common"],
					},
				},
				{
					path: "/iframe/pinia",
					name: "FramePinia",
					meta: {
						title: "common.menus.purePiniaDoc",
						frameSrc: "https://pinia.vuejs.org/zh/index.html",
						keepAlive: true,
						roles: ["admin", "common"],
					},
				},
				{
					path: "/iframe/vue-router",
					name: "FrameRouter",
					meta: {
						title: "common.menus.pureRouterDoc",
						frameSrc: "https://router.vuejs.org/zh/",
						keepAlive: true,
						roles: ["admin", "common"],
					},
				},
			],
		},
		{
			path: "/iframe/external",
			meta: {
				title: "common.menus.pureExternalDoc",
			},
			children: [
				{
					path: "/external",
					name: "https://pure-admin.cn/",
					meta: {
						title: "common.menus.pureExternalLink",
						roles: ["admin", "common"],
					},
				},
				{
					path: "/pureUtilsLink",
					name: "https://pure-admin-utils.netlify.app/",
					meta: {
						title: "common.menus.pureUtilsLink",
						roles: ["admin", "common"],
					},
				},
			],
		},
	],
};

const tabsRouter = {
	path: "/tabs",
	meta: {
		icon: "ri:bookmark-2-line",
		title: "common.menus.pureTabs",
		rank: RouterOrderEnums.tabs,
	},
	children: [
		{
			path: "/tabs/index",
			name: "Tabs",
			meta: {
				title: "common.menus.pureTabs",
				roles: ["admin", "common"],
			},
		},
		// query 传参模式
		{
			path: "/tabs/query-detail",
			name: "TabQueryDetail",
			meta: {
				// 不在menu菜单中显示
				showLink: false,
				activePath: "/tabs/index",
				roles: ["admin", "common"],
			},
		},
		// params 传参模式
		{
			path: "/tabs/params-detail/:id",
			component: "params-detail",
			name: "TabParamsDetail",
			meta: {
				// 不在menu菜单中显示
				showLink: false,
				activePath: "/tabs/index",
				roles: ["admin", "common"],
			},
		},
	],
};

export default defineFakeRoute([
	{
		url: "/get-async-routes",
		method: "get",
		response: () => {
			return {
				success: true,
				data: [systemManagementRouter, systemMonitorRouter, permissionRouter, frameRouter, tabsRouter],
			};
		},
	},
]);
