<script lang="ts" setup>
import TableTitle from "@/components/table-title/TableTitle.vue";
import { defineModel, onMounted, ref } from "vue";

definePage({
	meta: {
		menuType: "page",
		text: "消息中心",
		icon: "IconSetting",
	},
});

// 使用 defineModel实现双向绑定
const myModel = defineModel("myModel");

// 页码
const pageIndex = ref(1);
// 页面大小
const pageSize = ref(10);
// total
const total = ref(0);

// 分页配置
const paginationProps = ref({
	asyncFunc: () => {}, // TODO: 替换成实际的API函数
	total,
});

// 消息列表
const messageList = ref([]);
// 选中的表格数据
const multipleSelectRows2 = ref([]);

// 发送到子组件的数据
const titleData = ref({
	unfold: true,
	rightButton: true,
	contentList: [
		{
			name: "用户账号",
			type: "AddSininput",
			content: ["", ""],
		},
		{
			name: "用户名称",
			type: "AddSininput",
			content: ["", ""],
		},
	],
});

// 表格内数据
const data = [
	{
		username: "admin",
		status: "激活",
		realname: "管理员",
	},
	{
		username: "admin",
		status: "激活",
		realname: "管理员",
	},
	{
		username: "admin",
		status: "激活",
		realname: "管理员",
	},
];

// 表格配置
const tableProps = ref({
	isIndex: true,
	isMultipleSelect: true,
	data,
	columns: [
		{ prop: "username", label: "用户账号", width: "70px" },
		{ prop: "realname", label: "用户名称", width: "70px" },
		{ prop: "status", label: "状态", width: "70px" },
	],
});

onMounted(() => {});

function getMessageList() {
	// TODO 获取消息列表
	messageList.value = data;
}

// 处理子组件按钮事件
function userChildClick(icon) {
	if (icon.name === "右侧查询") {
		handleSearch();
	}
	if (icon.name === "右侧重置") {
		handleReset();
	}
}

// 右侧查询
function handleSearch() {
	// const templateName = titleData.value.contentList[0].content;
	// const type = titleData.value.contentList[1].content;
	// TODO 获取消息列表
}
// 右侧重置
function handleReset() {
	titleData.value.contentList[0].content = ["", ""];
	titleData.value.contentList[1].content = ["", ""];
}

// 处理可见性变化
function handleDialogChange(value) {
	console.log("点击关闭", value);
	myModel.value = value;
}

// 最里面对话框的确定按钮
function btnInConfirm() {
	myModel.value = false;
}
</script>

<template>
	<el-dialog :model-value="myModel" @update:model-value="handleDialogChange" draggable>
		<p>添加已有客户</p>
		<TableTitle v-model="titleData" class="title" @user-click="userChildClick" />
		<ComponentsTable v-bind="tableProps" @selection-change="multipleSelectRows2 = $event"> </ComponentsTable>
		<ComponentsPagination :="paginationProps" v-model:pageIndex="pageIndex" v-model:pageSize="pageSize" />

		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="btnInConfirm">确定</el-button>
				<el-button @click="myModel = false">关闭</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
p {
	width: 100%;
	border-bottom: 1px solid #efefef;
}

.title {
	width: 100%;
	padding-bottom: 10px;
	border-bottom: 1px solid #efefef;
}
</style>
