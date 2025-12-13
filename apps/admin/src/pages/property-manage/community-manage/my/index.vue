<script lang="ts" setup>
definePage({
	meta: {
		title: "我的小区",
		icon: "mdi:home-account",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.my"),
	},
});

import { ref, computed, onMounted, h } from "vue";
import { ElTag, ElMessage, ElMessageBox } from "element-plus";
import { transformI18n } from "@/plugins/i18n";
import { useMode, type Mode } from "@/composables/use-mode";
import { CommunityManageMyFormProps, defaultForm, type CommunityManageMyFormVO } from "./components/form";
import CommunityManageForm from "./components/form.vue";
import {
	我的小区_列表Data,
	mockTableData,
	我的小区_列表查询_VO,
	省份选项,
	小区状态选项
} from "@01s-11comm/type";

// 定义表格数据类型
interface MyCommunityTableRow {
	省份: string;
	市州: string;
	区县: string;
	小区名称: string;
	小区编码: string;
	状态: string;
}

/** 表单组件实例 */
const communityManageFormInstance = ref<InstanceType<typeof CommunityManageForm> | null>(null);

/** 模拟异步操作函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 表格数据 */
const tableData = ref<MyCommunityTableRow[]>([
	{
		省份: "广东省",
		市州: "深圳市",
		区县: "南山区",
		小区名称: "测试小区1",
		小区编码: "TEST001",
		状态: "启用",
	},
	{
		省份: "广东省",
		市州: "广州市",
		区县: "天河区",
		小区名称: "测试小区2",
		小区编码: "TEST002",
		状态: "禁用",
	},
]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "省份",
		prop: "省份",
		width: 100,
	},
	{
		label: "市州",
		prop: "市州",
		width: 100,
	},
	{
		label: "区县",
		prop: "区县",
		width: 100,
	},
	{
		label: "小区名称",
		prop: "小区名称",
		width: 160,
	},
	{
		label: "小区编码",
		prop: "小区编码",
		width: 120,
	},
	{
		label: "客服电话",
		prop: "客服电话",
		width: 130,
	},
	{
		label: "面积",
		prop: "面积",
		width: 100,
	},
	{
		label: "开始时间",
		prop: "开始时间",
		width: 120,
	},
	{
		label: "结束时间",
		prop: "结束时间",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 100,
		cellRenderer: ({ row }) => {
			const statusMap = {
				正常运营: { type: "success", text: "正常运营" },
				筹备中: { type: "warning", text: "筹备中" },
				维护中: { type: "info", text: "维护中" },
				已停用: { type: "danger", text: "已停用" },
			};
			const statusInfo = statusMap[row.状态] || { type: "info", text: row.状态 };
			return h(ElTag, { type: statusInfo.type }, () => statusInfo.text);
		},
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 0,
});

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	await loadTableData();
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	await loadTableData();
}

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "我的小区",
	columns: columns.value,
});

/** 加载表格数据 */
async function loadTableData() {
	try {
		/** TODO: 替换为真实的API调用 */
		/** 当前使用模拟数据和本地搜索过滤 */
		let filteredData = mockTableData;

		/** 根据搜索条件过滤数据 */
		if (plusSearchModel.value.省份) {
			filteredData = filteredData.filter((item) => item.省份.includes(plusSearchModel.value.省份!));
		}
		if (plusSearchModel.value.市州) {
			filteredData = filteredData.filter((item) => item.市州.includes(plusSearchModel.value.市州!));
		}
		if (plusSearchModel.value.区县) {
			filteredData = filteredData.filter((item) => item.区县.includes(plusSearchModel.value.区县!));
		}
		if (plusSearchModel.value.小区名称) {
			filteredData = filteredData.filter((item) => item.小区名称.includes(plusSearchModel.value.小区名称!));
		}
		if (plusSearchModel.value.小区编码) {
			filteredData = filteredData.filter((item) => item.小区编码.includes(plusSearchModel.value.小区编码!));
		}
		if (plusSearchModel.value.状态) {
			filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.状态);
		}

		/** 更新总数 */
		pagination.value.total = filteredData.length;

		/** 分页处理 */
		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		tableData.value = filteredData.slice(startIndex, endIndex);

		/** 更新表格配置 */
		pureTableProps.value.data = tableData.value;
	} catch (error) {
		console.error("加载数据失败:", error);
		/** TODO: 显示错误提示 */
	}
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 我的小区_列表查询_VO = {
	省份: "",
	市州: "",
	区县: "",
	小区名称: "",
	小区编码: "",
	状态: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 省份 */
	{
		label: "省份",
		prop: "省份",
		valueType: "select",
		options: 省份选项,
	},

	/** 市州 */
	{
		label: "市州",
		prop: "市州",
		valueType: "input",
	},

	/** 区县 */
	{
		label: "区县",
		prop: "区县",
		valueType: "input",
	},

	/** 小区名称 */
	{
		label: "小区名称",
		prop: "小区名称",
		valueType: "input",
	},

	/** 小区编码 */
	{
		label: "小区编码",
		prop: "小区编码",
		valueType: "input",
	},

	/** 状态 */
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 小区状态选项,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

/** 重置搜索条件并重新加载数据 */
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 执行搜索 */
async function handleSearch() {
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 打开弹框参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 我的小区_列表Data;
}

const { modeText, setMode, isAdd, isEdit, isInfo } = useMode();

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}小区`;

	/** 业务对象 */
	const CommunityManageMyFormVO: CommunityManageMyFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					province: row?.省份 || "福建省",
					city: row?.市州 || "",
					district: row?.区县 || "",
					name: row?.小区名称 || "",
					code: row?.小区编码 || "",
					servicePhone: row?.客服电话 || "",
					area: row?.面积 || "",
					startTime: row?.开始时间 || "",
					endTime: row?.结束时间 || "",
					status: (row?.状态 as CommunityManageMyFormVO["status"]) || "正常运营",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: CommunityManageMyFormProps = {
		form: CommunityManageMyFormVO,
		defaultValues: CommunityManageMyFormVO,
		mode,
	};

	/** 根据不同模式下变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(CommunityManageForm, {
				ref: communityManageFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = communityManageFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = communityManageFormInstance.value?.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			...(isInfo.value
				? []
				: [
						{
							label: transformI18n($t("common.buttons.reset")),
							type: "warning",
							btnClick: ({ dialog: { options, index }, button }) => {
								communityManageFormInstance.value?.plusFormInstance?.handleReset();
							},
						} as any,

						{
							label: transformI18n($t("common.buttons.submit")),
							type: "success",
							btnClick: async ({ dialog: { options, index }, button }) => {
								const res = await communityManageFormInstance.value?.plusFormInstance?.handleSubmit();
								if (res) {
									button.btn.loading = true;
									await testAsync();
									button.btn.loading = false;
									closeDialog(options, index);
								}
							},
						} as any,
				  ] as any),
		],
	});
}

/** 处理操作 */
function handleEdit(row: 我的小区_列表Data) {
	openDialog({ mode: "edit", row });
}

/** 处理查看操作 */
function handleView(row: 我的小区_列表Data) {
	openDialog({ mode: "info", row });
}

/** 处理删除操作 */
function handleDelete(row: 我的小区_列表Data) {
	ElMessageBox.confirm("确认删除该小区信息吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		try {
			await testAsync();
			ElMessage.success("删除成功");
			/** 刷新列表 */
			loadTableData();
		} catch (error) {
			ElMessage.error("删除失败");
		}
	});
}

onMounted(async () => {
	await loadTableData();
});
</script>

<template>
	<section class="index-root">
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info" @click="handleView(row)">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
						<ElButton type="warning" @click="handleEdit(row)">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="danger" @click="handleDelete(row)">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
