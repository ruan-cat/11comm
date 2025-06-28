<script lang="ts" setup>
import { Message } from "@element-plus/icons-vue";

/**
 * 处理弹框逻辑
 * @description
 * 待优化
 */
function showDialog(i: any) {
	status.value = i;
	dialogVisible.value = true;
}
</script>

<template>
	<el-dropdown trigger="click">
		<div class="icon-container">
			<el-icon :size="20" class="move">
				<Message />
				<span class="badge">0</span>
			</el-icon>
		</div>

		<template #dropdown>
			<el-dropdown-menu>
				<div class="notice">
					<div class="header">
						<el-icon style="margin: 0 4px 0 4px; color: #b471a0" size="16"><Message /></el-icon>
						<span>0消息</span>
					</div>

					<div class="content">
						<ul>
							<li v-for="(item, index) in messageList" :key="item.noticeId" @click="goNoticeDetail('2', noticeId)">
								<svg
									t="1741877490824"
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="4218"
									width="16"
									height="16"
								>
									<path
										d="M815.2064 150.272H221.3376c-68.6592 0-124.3136 55.6544-124.3136 124.3136v395.9296c0 68.6592 55.6544 124.3136 124.3136 124.3136h194.816l68.7104 73.3696c20.0704 21.4016 54.1184 21.0944 73.7792-0.7168l65.4848-72.6528h191.1296c68.6592 0 124.3136-55.6544 124.3136-124.3136V274.5344c-0.0512-68.608-55.7056-124.2624-124.3648-124.2624zM287.5392 524.6976c-32.5632 0-58.9312-26.368-58.9312-58.9312 0-32.5632 26.368-58.9312 58.9312-58.9312s58.9312 26.368 58.9312 58.9312c0 32.512-26.4192 58.9312-58.9312 58.9312z m234.752 0c-32.5632 0-58.9312-26.368-58.9312-58.9312 0-32.5632 26.368-58.9312 58.9312-58.9312 32.5632 0 58.9312 26.368 58.9312 58.9312 0 32.512-26.368 58.9312-58.9312 58.9312z m234.8032 0c-32.5632 0-58.9312-26.368-58.9312-58.9312 0-32.5632 26.368-58.9312 58.9312-58.9312 32.5632 0 58.9312 26.368 58.9312 58.9312 0 32.512-26.368 58.9312-58.9312 58.9312z"
										fill="#ffffff"
										p-id="4219"
									></path>
								</svg>
								<span>{{ item.noticeTitle }}</span>
							</li>
						</ul>
					</div>

					<div class="footer" @click="showDialog(2)">
						<span>查看全部消息</span>
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
.index-root {
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
