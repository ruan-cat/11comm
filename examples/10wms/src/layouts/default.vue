<script lang="ts" setup>
import type { TabPaneName } from "element-plus";

// import { useUserStore } from "stores/user";
// import { useTabStore } from "@/stores/tab";
// import { useRouterToMenuItem } from "composables/use-routers-to-menu-item/index";

import { updateNoticeStatusAPI } from "@/apis/notice-remind";
import { Expand, Fold } from "@element-plus/icons-vue";

import { storeToRefs } from "pinia";

import { computed, ref } from "vue";
import ChangePasswordDialog from "./components/ChangePasswordDialog.vue";
import HomeStyleDialog from "./components/HomeStyleDialog.vue";
import LogoutDialog from "./components/LogoutDialog.vue";

import noticeDetail from "./components/notice-detail.vue";
import SystemMessageDialog from "./components/SystemMessageDialog.vue";
import TotalDialog from "./components/totalDialog.vue";
// 控制弹框
const dialogVisible = ref(false);
// 用来控制进入哪个dialog
const status = ref(0);

const sampleRouterStore = useSampleRouterStore();
const { isShowSamplePageMenus } = storeToRefs(sampleRouterStore);

const userStore = useUserStore();
const router = useRouter();

console.log(` ? 检查getRoutes扁平化数组的结果`, getRoutes());

/** 来自自动路由数组 生成的菜单 */
const menuFromRouter = useRouterToMenuItem({
	routes: getRoutes(),
	isSampleMenu: isShowSamplePageMenus,
});

const { getMenus } = storeToRefs(userStore);

const tabStore = useTabStore();
const { activeTab, tabs } = storeToRefs(tabStore); // 当前激活的选项卡,标签选项数组
const { setActiveTab, setTabs, addTab, extractMinimalMenus } = tabStore;

/** 菜单数据 */
const menus = computed(() => [
	// 警告 不使用异步接口返回的数据 目前全部使用本地的静态数据 不考虑从后端获取菜单
	// ...getMenus.value,
	...menuFromRouter.value,
]);

const isCollapse = ref(false);

function toggleCollapse() {
	isCollapse.value = !isCollapse.value;
}

/** 所有没有子菜单的菜单项 */
const minimalTabs = ref(extractMinimalMenus(menus.value));

function handleMenuSelect(menu: string) {
	// 检查tabs中是否已存在该menu对应的tab
	const existingTab = tabs.value.find((tab) => tab.href === menu);
	if (!existingTab) {
		// 获取当前菜单项信息
		const menuItem = minimalTabs.value.find((item) => item.href === menu);
		if (menuItem?.href !== "/home") {
			// 将非首页菜单项信息添加到tabs数组中
			addTab(menuItem as MenuItem);
		}
	}
	setActiveTab(menu);
}

function removeTab(tabName: TabPaneName) {
	// 1. 查找目标标签页索引
	const tabIndex = tabs.value.findIndex((tab) => tab.href === tabName);
	if (tabIndex === -1) return;
	// 2. 预先计算要切换的标签页（在删除前）
	let nextTab: MenuItem | null = null;
	if (tabs.value.length > 1) {
		nextTab =
			tabs.value[
				// 如果是最后一个标签页，取前一个；否则取后一个
				tabIndex === tabs.value.length - 1 ? tabIndex - 1 : tabIndex + 1
			];
	}
	// 3. 执行删除操作
	tabs.value.splice(tabIndex, 1);
	// 4. 处理路由跳转
	if (activeTab.value === tabName) {
		// 存在有效标签页时跳转
		if (nextTab?.href) {
			setActiveTab(nextTab.href);
			router.push(nextTab.href);
		}
		// 完全无标签页时
		else {
			setActiveTab("/home");
			router.push("/home"); // 跳转默认路由
		}
	}
}

function handleTabChange(tab: TabPaneName) {
	setActiveTab(tab);
	router.push(tab as string);
}

function handleCommand(command: string, tabName: string) {
	switch (command) {
		case "refresh":
			router.go(0);
			break;
		case "close": {
			removeTab(tabName);
			break;
		}
		case "closeAll": {
			setTabs([]);
			activeTab.value = "/home";
			router.push("/home"); // 跳转默认路由
			break;
		}
		case "closeElse": {
			const currentTab = tabs.value.find((t) => t.href === tabName);
			if (!currentTab) return;
			// 过滤保留当前标签和首页
			tabs.value = tabs.value.filter((t) => t.href === tabName || t.href === "/home");
			setActiveTab(tabName);
			router.push(tabName);
			break;
		}
		case "closeRight": {
			const currentIndex = tabs.value.findIndex((t) => t.href === tabName);
			if (currentIndex === -1) return;
			activeTab.value = tabName;
			// 保留当前及左侧标签（slice含头不含尾）
			tabs.value = tabs.value.slice(0, currentIndex + 1);
			break;
		}
		case "closeLeft": {
			const currentIndex = tabs.value.findIndex((t) => t.href === tabName);
			if (currentIndex === -1) return;
			activeTab.value = tabName;
			// 保留当前及右侧标签
			tabs.value = tabs.value.slice(currentIndex);
			break;
		}
	}
}

// 传递的标题
const dialogTitle = ref("");
// 传递的noticeId
const noticeId = ref();

// 页面加载时读取风格
onMounted(() => {
	const savedStyle = localStorage.getItem("homeStyle");
	if (savedStyle) {
		currentStyle.value = savedStyle; // 从 localStorage 中读取风格
	}
});

/** 当前选中的风格 */
const currentStyle = ref("ace");
// 处理风格确认
function handleStyleConfirm(style: string) {
	currentStyle.value = style; // 更新当前风格
	localStorage.setItem("homeStyle", style); // 将风格保存到 localStorage
	console.log("选中的风格:", style);
}

// 根据当前风格动态设置首页的 class
const homeStyleClass = computed(() => {
	return `home-style-${currentStyle.value}`;
});

// TODO 去往公告详情页
async function goNoticeDetail(type: string, id: string) {
	// 修改成已读
	console.log(id, typeof id);
	await updateNoticeStatusAPI({
		noticeId: id,
	});
	// TODO: 待迁移
	// getUnreadNoticeList();
	noticeId.value = id;
	dialogTitle.value = type === "1" ? "通知公告详情" : "系统消息详情";
	showDetail.value = true;
}
</script>

<template>
	<div class="layout-container" :class="homeStyleClass">
		<el-container class="sec-container">
			<el-aside :style="{ width: isCollapse ? '64px' : '220px' }" class="sidebar-wrapper">
				<!-- 侧边栏菜单 -->
				<div class="menu-wrap">
					<el-scrollbar :style="{ width: isCollapse ? '64px' : '220px' }" class="scrollbar-wrap" max-height="100vh">
						<div :style="{ width: isCollapse ? '64px' : '220px' }" class="collapse-trigger" @click="toggleCollapse">
							<el-icon :size="20">
								<component :is="isCollapse ? Expand : Fold" />
							</el-icon>
						</div>

						<el-menu
							default-active="/home"
							class="sidebar-menu"
							active-text-color="#409EFF"
							text-color="#585858"
							background-color="#F9F9F9"
							unique-opened
							router
							:collapse="isCollapse"
							@select="handleMenuSelect"
						>
							<el-menu-item index="/home">
								<el-icon>
									<icon-menu />
								</el-icon>
								<span>首页</span>
							</el-menu-item>

							<template v-for="item in menus" :key="item.id">
								<template v-if="isShowSamplePageMenus">
									<el-menu-item :index="item.href">
										<el-icon>
											<component :is="item.icon" />
										</el-icon>
										<span> {{ item.text }} </span>
									</el-menu-item>
								</template>

								<template v-else>
									<el-sub-menu :index="`${item.id}`">
										<template #title>
											<el-icon>
												<component :is="item.icon" />
											</el-icon>
											<span>{{ item.text }}</span>
										</template>

										<el-menu-item-group>
											<el-menu-item v-for="i in item.children" :key="i.id" :index="i.href">
												<el-icon>
													<component :is="i.icon" />
												</el-icon>
												<span> {{ i.text }} </span>
											</el-menu-item>
										</el-menu-item-group>
									</el-sub-menu>
								</template>
							</template>
						</el-menu>
					</el-scrollbar>
				</div>
			</el-aside>

			<el-container>
				<!-- 导航栏 -->
				<el-header>
					<div class="header-nav">
						<div class="left"><span style="font-size: 20px">WMS仓储管理系统</span></div>

						<div class="right">
							<!-- 通知组件 -->
							<ComponentsHeaderRightNotice />

							<!-- 消息组件 -->
							<ComponentsHeaderRightMessage />

							<!-- 用户组件 -->
							<ComponentsHeaderRightUser />
						</div>
					</div>
				</el-header>

				<el-main>
					<el-tabs
						v-model="activeTab"
						type="card"
						class="demo-tabs"
						@tab-remove="removeTab"
						@tab-change="handleTabChange"
					>
						<el-tab-pane label="首页" name="/home" :closable="false"></el-tab-pane>
						<el-tab-pane v-for="item in tabs" :key="item?.href" closable :label="item?.text" :name="item?.href">
							<template #label>
								<el-dropdown @command="(command) => handleCommand(command, item?.href as string)">
									<span :style="{ color: item?.href === activeTab ? '#409EFF' : '#64696D' }">
										{{ item?.text }}
									</span>
									<template #dropdown>
										<el-dropdown-menu>
											<el-dropdown-item command="refresh">刷新缓存</el-dropdown-item>
											<el-dropdown-item command="close">关闭</el-dropdown-item>
											<el-dropdown-item command="closeAll">全部关闭</el-dropdown-item>
											<el-dropdown-item command="closeElse">除此之外全部关闭</el-dropdown-item>
											<el-dropdown-item divided command="closeRight">当前也右侧关闭</el-dropdown-item>
											<el-dropdown-item command="closeLeft">当前页左侧关闭</el-dropdown-item>
										</el-dropdown-menu>
									</template>
								</el-dropdown>
							</template>
						</el-tab-pane>
					</el-tabs>
					<!-- 布局路由 -->
					<router-view />
				</el-main>
			</el-container>
		</el-container>
	</div>

	<!-- 修改密码弹框 -->
	<ChangePasswordDialog v-model="changePasswordDialogVisible" />

	<SystemMessageDialog v-model:visible="systemMessageDialogVisible" :messages="messages" />
	<HomeStyleDialog v-model:visible="homeStyleDialogVisible" @confirm="handleStyleConfirm" />
	<!-- 注销弹框 -->
	<LogoutDialog ref="logoutDialog" />
	<!-- 点击右上角按钮中的查看全部后显示的组件 -->
	<TotalDialog v-model:visible="dialogVisible" :status="status"></TotalDialog>
	<noticeDetail v-model:control="showDetail" :dialogTitle="dialogTitle" :noticeId="noticeId"></noticeDetail>
</template>

<style lang="scss" scoped>
.sec-container {
	height: 100vh;
}
.el-aside {
	background-color: #f9f9f9;
}
.sidebar-wrapper {
	transition: width 0.6s ease;
	background-color: #f9f9f9;
}
.sidebar-menu {
	border-right: none;
	background-color: inherit;
}
.collapse-trigger {
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: #fff;
	background-color: #2b2f3a;
	transition: width 0.6s ease;
}

.menu-wrap {
	height: 100vh;
	width: 220px;
	position: fixed;
	top: 0;
	left: 0;
}
.scrollbar-wrap {
	transition: width 0.6s ease;
}
.el-menu {
	border: 0;
}
.el-menu-item-group .el-menu-item {
	text-indent: 1.5em;
}
.el-main {
	padding: 20px;
}
.el-header {
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	padding: 0;
}
.header-nav {
	display: flex;
	padding: 20px;
	background-color: #6c777f;
	width: 100%;
	color: #f8f8f8;
	justify-content: space-between;
	line-height: 20px;
}
.header-nav .right {
	width: 200px;
	display: flex;
	align-items: center;
	justify-content: space-around;
}

/* 去除dropdown黑框 */
.el-tooltip__trigger:focus-visible {
	outline: unset;
}

/* 按钮小数字 TODO: 待迁移 */
.icon-container {
	position: relative;
	display: inline-block;
}

.icon-container .el-icon {
	width: 30px;
	height: 30px;
	color: white;
}

.badge {
	position: absolute;
	top: 0px;
	right: 0px;
	background-color: red;
	color: white;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 12px;
}

.move {
	cursor: pointer;
}

/* 右上角下拉菜单样式 */
.notice {
	width: 240px;
	display: flex;
	flex-wrap: wrap;

	.header {
		padding: 0px 0px;
		background-color: #f4deea;
		border-bottom: 1px solid #d3d0d0;
		width: 100%;
		height: 35px;
		line-height: 35px;
		display: flex;
		align-items: center;

		span {
			color: #c06090;
			font-size: 16px;
		}
	}

	.content {
		border-bottom: 1px solid #efefef;

		ul {
			list-style: none;
			display: flex;
			flex-wrap: wrap;
			padding-left: 12px;
			align-items: center;

			li {
				padding-right: 0;
				height: 25px;
				margin-top: 5px;
				width: 100%;
				display: flex;

				svg {
					width: 20px;
					height: 20px;
					color: white;
					background-color: #428bca;
					border: 3px solid #428bca;
					margin-right: 5px;
					cursor: pointer;

					&:hover {
						border-bottom: 1px solid #428bca;
					}
				}

				span {
					font-size: 12px;
					line-height: 20px;
					color: #428bca;
					cursor: pointer;

					&:hover {
						border-bottom: 1px solid #428bca;
					}
				}
			}
		}
	}

	.footer {
		padding: 0;
		cursor: pointer;
		width: 100%;
		text-align: center;
		height: 40px;
		color: #4f99c6;
		line-height: 40px;

		span:hover {
			border-bottom: 0.5px solid #4f99c6;
		}

		&:hover {
			background-color: #f4deea;
			width: 100%;
		}
	}
}

.el-dropdown-menu {
	padding: 0px 0px;
}

span {
	font-size: 14px;
}

/* 隐藏滚动条样式 */
::v-deep(.el-scrollbar__bar.is-horizontal) {
	top: 0;
	bottom: 0;
	width: 0;
	height: 0;
}
.home-style-ace {
	/* ACE平面风格样式 */
	background-color: rgba(255, 231, 81, 0.6);
	font-family: Arial, sans-serif;
	color: #333;
	/* 标题样式 */
	.header-nav {
		background-color: rgba(12, 181, 116); /* 设置导航栏背景颜色 */
		padding: 20px; /* 设置内边距 */
		color: #fff; /* 设置文字颜色为白色 */

		.left {
			font-size: 24px; /* 设置标题字体大小 */
			font-weight: bold; /* 设置标题字体加粗 */
		}
	}
}

.home-style-shortcut {
	/* ShortCut风格样式 */
	background-color: rgba(224, 236, 255);
	/* 标题样式 */
	.header-nav {
		background-color: rgba(168, 215, 233); /* 设置导航栏背景颜色 */
		padding: 20px; /* 设置内边距 */
		color: rgba(93, 102, 114); /* 设置文字颜色为白色 */

		.left {
			font-size: 24px; /* 设置标题字体大小 */
			font-weight: bold; /* 设置标题字体加粗 */
		}
	}
}
.home-style-classic {
	/* 经典风格样式 */
	background-color: #d0d0d0;
	font-family: "Times New Roman", serif;
	color: #333;

	/* 标题样式 */
	.header-nav {
		background-color: rgba(93, 102, 114); /* 设置导航栏背景颜色 */
		padding: 20px; /* 设置内边距 */

		.left {
			font-size: 24px; /* 设置标题字体大小 */
			font-weight: bold; /* 设置标题字体加粗 */
		}
	}
}

.home-style-hplus {
	/* H+平面风格样式 */
	background-color: rgba(255, 115, 162, 0.4);
	/* 标题样式 */
	.header-nav {
		background-color: rgba(163, 167, 254, 0.8); /* 设置导航栏背景颜色 */
		padding: 20px; /* 设置内边距 */
		color: rgba(93, 102, 114);
		.left {
			font-size: 24px; /* 设置标题字体大小 */
			font-weight: bold; /* 设置标题字体加粗 */
		}
	}
}
</style>
