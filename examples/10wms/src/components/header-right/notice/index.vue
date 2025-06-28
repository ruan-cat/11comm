<!-- 用户的消息待办组件 -->
<script lang="ts" setup>
import { Bell, WarnTriangleFilled } from "@element-plus/icons-vue";

import { ref } from "vue";

/** 未读公告数量 */
const unreadNoticeCount = ref(0);

// 未读公告标题列表
const unreadNoticeList = ref([]);

/** 获取未读公告标题列表 */
async function getUnreadNoticeList() {
	const res = await getUnreadNoticeListAPI();
	console.log(res);
	if (res.code === 10000) {
		unreadNoticeCount.value = res.data.length;
		if (res.data.length > 10) {
			// 最多显示10条未读公告
			unreadNoticeList.value = res.data.slice(0, 10);
		} else {
			unreadNoticeList.value = res.data;
		}
	} else if (res.code === 9999) {
		// 说明没有未读公告
	} else {
		ElMessage.error(res.message);
	}
}

// 传递的标题
const dialogTitle = ref("");
// 传递的noticeId
const noticeId = ref();
// 控制详情页
const showDetail = ref(false);

// TODO 去往公告详情页
async function goNoticeDetail(type: string, id: string) {
	// 修改成已读
	console.log(id, typeof id);
	await updateNoticeStatusAPI({
		noticeId: id,
	});
	getUnreadNoticeList();

	// TODO: 改成命令式弹框传递props值即可。
	noticeId.value = id;
	dialogTitle.value = type === "1" ? "通知公告详情" : "系统消息详情";
	showDetail.value = true;
}

/**
 * 处理弹框逻辑
 * @description
 * 待优化
 */
function showDialog(i: any) {
	status.value = i;
	dialogVisible.value = true;
}

onMounted(() => {
	getUnreadNoticeList();
});
</script>

<template>
	<el-dropdown trigger="click">
		<div class="icon-container">
			<el-icon :size="20" class="move">
				<Bell />
				<span class="badge">{{ unreadNoticeCount }}</span>
			</el-icon>
		</div>

		<template #dropdown>
			<el-dropdown-menu>
				<div class="notice">
					<div class="header">
						<el-icon style="margin: 0 4px 0 4px; color: #b471a0" size="16"><WarnTriangleFilled /></el-icon>
						<span>{{ unreadNoticeCount }}公告</span>
					</div>

					<div class="content">
						<ul>
							<li
								v-for="(item, index) in unreadNoticeList"
								@click="goNoticeDetail('1', item.noticeId)"
								:key="item.noticeId"
							>
								<svg
									t="1741875609474"
									class="icon"
									viewBox="0 0 1107 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="3048"
									width="12"
									height="12"
								>
									<path
										d="M563.323289 661.336738a330.663562 330.663562 0 1 0-330.531877-330.663562 331.190306 331.190306 0 0 0 330.531877 330.663562z"
										fill="#ffffff"
										p-id="3049"
									></path>
									<path
										d="M1106.528066 975.53955c-16.724123-134.319727-137.611877-293.001365-273.38015-373.066457a381.889419 381.889419 0 0 1-539.912627-0.65843C157.335331 679.246035 18.274908 834.635523 0.365611 975.53955a42.797952 42.797952 0 0 0 37.26714 48.065392h1031.628175A43.061324 43.061324 0 0 0 1106.528066 975.53955z"
										fill="#ffffff"
										p-id="3050"
									></path>
								</svg>
								<span>{{ item.noticeTitle }}</span>
							</li>
						</ul>
					</div>
					<div class="footer" @click="showDialog(1)">
						<span>查看全部</span>
						<svg
							t="1741346481645"
							class="icon"
							viewBox="0 0 1024 1024"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							p-id="1825"
							width="16"
							height="16"
						>
							<path
								d="M885.113 489.373L628.338 232.599c-12.496-12.497-32.758-12.497-45.254 0-12.497 12.497-12.497 32.758 0 45.255l203.3 203.3H158.025c-17.036 0-30.846 13.811-30.846 30.846 0 17.036 13.811 30.846 30.846 30.846h628.36L583.084 746.147c-12.497 12.496-12.497 32.758 0 45.255 6.248 6.248 14.438 9.372 22.627 9.372s16.379-3.124 22.627-9.372l256.775-256.775a31.999 31.999 0 0 0 0-45.254z"
								fill="#4f99c6"
								p-id="1826"
							></path>
						</svg>
					</div>
				</div>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<style lang="scss" scoped>
.notice-root {
}

// TODO: 冗余的样式 需要想办法复用
.icon-container {
	position: relative;
	display: inline-block;
	.el-icon {
		width: 30px;
		height: 30px;
		color: white;
	}
	.move {
		cursor: pointer;
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
}

// TODO: 冗余的样式 需要想办法复用
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
</style>
