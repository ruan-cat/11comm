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
import { useMyListQuery } from "@/api/property-manage/community-manage/my";
import { provinceOptions } from "./components/form";
import { type MyCommunityListItem, type MyCommunityQueryParams, myStatusOptions } from "@01s-11comm/type";

/** 表单组件实例 */
const communityManageFormInstance = ref<InstanceType<typeof CommunityManageForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<MyCommunityQueryParams> = {
	province: "",
	city: "",
	district: "",
	communityName: "",
	communityCode: "",
	status: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useMyListQuery(plusSearchDefaultValues);

/** 模拟异步操作函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "省份",
		prop: "province",
		width: 100,
	},
	{
		label: "市州",
		prop: "city",
		width: 100,
	},
	{
		label: "区县",
		prop: "district",
		width: 100,
	},
	{
		label: "小区名称",
		prop: "communityName",
		width: 160,
	},
	{
		label: "小区编码",
		prop: "communityCode",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "createTime",
		width: 160,
	},
	{
		label: "更新时间",
		prop: "updateTime",
		width: 160,
	},
	{
		label: "状态",
		prop: "status",
		width: 100,
		cellRenderer: ({ row }) => {
			const statusMap = {
				正常运营: { type: "success", text: "正常运营" },
				筹备中: { type: "warning", text: "筹备中" },
				维护中: { type: "info", text: "维护中" },
				已停用: { type: "danger", text: "已停用" },
			};
			const statusInfo = statusMap[row.status] || { type: "info", text: row.status };
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

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "我的小区",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	/** 省份 */
	{
		label: "省份",
		prop: "province",
		valueType: "select",
		options: provinceOptions,
	},

	/** 市州 */
	{
		label: "市州",
		prop: "city",
		valueType: "input",
	},

	/** 区县 */
	{
		label: "区县",
		prop: "district",
		valueType: "input",
	},

	/** 小区名称 */
	{
		label: "小区名称",
		prop: "communityName",
		valueType: "input",
	},

	/** 小区编码 */
	{
		label: "小区编码",
		prop: "communityCode",
		valueType: "input",
	},

	/** 状态 */
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: myStatusOptions,
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
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

/** 打开弹框参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: MyCommunityListItem;
}

const { modeText, setMode, isAdd, isEdit, isInfo } = useMode();

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}小区`;

	/** 业务对象 */
	const CommunityManageMyFormVO: CommunityManageMyFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? structuredClone({
					...defaultForm,
					province: (row?.province as CommunityManageMyFormVO["province"]) || "福建省",
					city: row?.city || "",
					district: row?.district || "",
					name: row?.communityName || "",
					code: row?.communityCode || "",
					servicePhone: "", // MyCommunityListItem doesn't have phone? Check API
					area: "", // MyCommunityListItem doesn't have area?
					startTime: "", // MyCommunityListItem doesn't have startTime?
					endTime: "", // MyCommunityListItem doesn't have endTime?
					status: (row?.status as CommunityManageMyFormVO["status"]) || "正常运营",
				})
			: structuredClone(defaultForm);

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
				: ([
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
									await doFetch();
								}
							},
						} as any,
					] as any)),
		],
	});
}

/** 处理操作 */
function handleEdit(row: MyCommunityListItem) {
	openDialog({ mode: "edit", row });
}

/** 处理查看操作 */
function handleView(row: MyCommunityListItem) {
	openDialog({ mode: "info", row });
}

/** 处理删除操作 */
function handleDelete(row: MyCommunityListItem) {
	ElMessageBox.confirm("确认删除该小区信息吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		try {
			await testAsync();
			ElMessage.success("删除成功");
			/** 刷新列表 */
			await doFetch();
		} catch (error) {
			ElMessage.error("删除失败");
		}
	});
}

onMounted(async () => {
	// TanStack Query will auto-fetch on mount
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

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
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
