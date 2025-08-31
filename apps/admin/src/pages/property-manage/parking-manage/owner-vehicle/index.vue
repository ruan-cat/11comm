<script lang="ts" setup>
definePage({
	meta: {
		title: "业主车辆",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.parkingManage.ownerVehicle"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { type OwnerVehicleFormProps, defaultForm } from "./components/editForm";
import OwnerVehicleForm from "./components/editForm.vue";
const OwnerVehicleFormInstance = ref<InstanceType<typeof OwnerVehicleForm> | null>(null);

//配置请求和回调
const {
	execute: queryOwnerVehicleExecute,
	data: queryOwnerVehicleData,
	isLoading: queryOwnerVehicleIsLoading,
} = getCarList({
	onSuccess(data) {
		//成功回调写数据
		tableData.value = data.data.rows;
		// console.log(tableData.value);
	},
	onError(error) {},
});

/** 获取业主车辆列表 */
async function doQueryOwnerVehicleExecute() {
	await queryOwnerVehicleExecute({
		params: {
			//给后端的参数：后端请求很多参数
			pageIndex: pagination.value.currentPage,
			pageSize: pagination.value.pageSize,
			carNum: plusSearchModel.value.carNum, //车牌号
			communityId: plusSearchModel.value.communityId, //社区id
			leaseType: plusSearchModel.value.leaseType, //车牌类型
			link: plusSearchModel.value.link, //联系方式
			memberCarNum: plusSearchModel.value.memberCarNum, //成员车牌号
			name: plusSearchModel.value.name, //业主名称
			// num: pagination.value.num, //车位编号
			// valid: pagination.value.valid, //车位状态
		},
	});
}

// 试图实现行根据状态是否到期显示不同颜色
/** @see https://pure-admin.github.io/vue-pure-admin/#/table/index?username=sso */
// const tableRowClassName = ({ 状态 }: 业主车辆_列表数据) => {
// 	if (状态 === "到期") {
// 		return "pure-warning-row";
// 	} else return "";
// };

const buttons = [
	{ text: "全部车辆" },
	{ text: "月租车" }, //leaseType=H
	{ text: "出售车" }, //leaseType=S
	{ text: "内部车" }, //leaseType=I
	{ text: "免费车" }, //leaseType=NM
	// { text: "预约车" },//leaseType=?
	{ text: "到期车辆" }, //valid=3
] as const;

const activeIndex = ref(0); // 默认第一个激活

function handleButtonClick(index: number) {
	activeIndex.value = index;
}

/** 表格数据 */
//使用真实的数据，默认为一个空数组，等待后端赋值
//类型全局导入，直接根据PageDTO<?>更换即可
const tableData = ref<GetCarListViewModel[]>([]);

/** 表格列配置 */
//使用真实的业务字段 需要有效期，再看原型！！！
const columns = ref<TableColumnList>([
	{
		label: "车牌号",
		prop: "carNum",
		width: 120,
		fixed: true,
	},
	{
		label: "成员车辆",
		prop: "memberCarNum",
		width: 120,
	},
	{
		label: "房屋号",
		prop: "unitId",
		width: 120,
	},
	{
		label: "车牌类型",
		prop: "leaseType",
		width: 120,
	},
	{
		label: "车辆类型",
		prop: "carType",
		width: 120,
	},
	{
		label: "颜色",
		prop: "carColor",
		width: 120,
	},
	{
		label: "业主",
		prop: "name",
		width: 120,
	},
	{
		label: "车位",
		prop: "areaNum",
		width: 120,
	},
	{
		label: "有效期",
		prop: "有效期",
		width: 120,
	},
	{
		label: "状态",
		prop: "state",
		width: 120,
	},
	{
		label: "备注",
		prop: "remark",
		width: 120,
	},
	{
		// label: transformI18n($t("common.table.operation")),
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		minWidth: 320,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 1000,
});

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	// 做异步接口请求
	await doQueryOwnerVehicleExecute();
}
/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	// 做异步接口请求
	await doQueryOwnerVehicleExecute();
}

/** 表格组件 配置 */
//增加loading，修改成computed动态变化
const pureTableProps = computed<PureTableProps>(() => {
	return {
		...defaultPureTableProps,
		data: tableData.value,
		columns: columns.value,
		loading: queryOwnerVehicleIsLoading.value,
		pagination: pagination.value,
	};
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "业主车辆",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 业主车辆_列表查询_VO = {
	车牌号: "",
	车位编号: "",
	车位状态: "",
	业主名称: "",
	联系方式: "",
	成员车牌号: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
//使用真实的业务字段
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 车牌号
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.plateNumber")),
		prop: "carNum",
		valueType: "input",
	},

	// 车位编号
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.parkingSpaceNumber")),
		prop: "num",
		valueType: "input",
	},

	// 车位状态
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.parkingSpaceStatus")),
		prop: "valid",
		valueType: "select",
		options: [
			{
				label: "正常",
				value: "1",
			},
			{
				label: "到期",
				value: "3",
			},
			{
				label: "无车位",
				value: "2",
			},
		],
	},

	// 业主名称
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.ownerName")),
		prop: "name",
		valueType: "input",
	},

	// 联系方式
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.phone")),
		prop: "link",
		valueType: "input",
	},
	// 成员车牌号
	{
		label: transformI18n($t("property-manage_parking-manage.owner-vehicle.memberPlateNumber")),
		prop: "memberCarNum",
		valueType: "input",
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

async function handleReSearch() {
	console.log("重新搜索");
}
async function handleSearch() {
	console.log("搜索");
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: 业主车辆_列表数据;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}业主车辆`;

	/** 表单组件需要的props */
	const formProps: OwnerVehicleFormProps = {
		form: cloneDeep(defaultForm),
		defaultValues: cloneDeep(defaultForm),
	};
	// 模拟情况：从外部获得值
	const testEditProps: OwnerVehicleFormProps = {
		form: {
			...defaultForm,
			车牌号: "沪A88888",
			汽车品牌: "小米SU7",
			车类型: "家用小汽车",
			颜色: "白色",
			车牌类型: "内部车",
			起租时间: "2025-06-01",
			结租时间: "2025-06-03",
			备注: "测试",
		},
		// @ts-ignore
		defaultValues: cloneDeep(row),
	};

	/** 弹框组件所需的变量 */
	const props = isAdd.value //不要照抄，根据业务情况具体分析
		? formProps
		: {
				form: isEdit.value ? testEditProps.form : cloneDeep(row),
				defaultValues: cloneDeep(row),
			};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(OwnerVehicleForm, {
				ref: OwnerVehicleFormInstance,
				...formProps, //不生效：避免类型报错
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = OwnerVehicleFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// console.log(options, index, button);
					const formComputed = OwnerVehicleFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					OwnerVehicleFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
					const res = await OwnerVehicleFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true; //加载
						await testAsync(); //异步函数
						button.btn.loading = false; //不加载
						closeDialog(options, index);
					}
				},
			},
		],
	});
}

//onMounted生命周期主动做接口请求
onMounted(async () => {
	await doQueryOwnerVehicleExecute();
});
</script>

<template>
	<section class="index-root">
		<el-aside width="120px">
			<el-button
				v-for="(button, idx) in buttons"
				:key="button.text"
				class="leaseType"
				:class="{ active: activeIndex === idx }"
				type="default"
				@click="handleButtonClick(idx)"
			>
				{{ button.text }}
			</el-button>
		</el-aside>
		<el-main>
			<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

			<!-- {{ plusSearchModel }} -->

			<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
				<template #buttons>
					<ElButton type="primary">
						{{ transformI18n($t("common.buttons.add")) }}
					</ElButton>
					<ElButton type="primary">
						{{ transformI18n($t("property-manage_parking-manage.owner-vehicle.carImport")) }}
					</ElButton>
					<ElButton type="primary">
						{{ transformI18n($t("property-manage_parking-manage.owner-vehicle.output")) }}
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
							<!-- 根据状态续租或释放 -->
							<ElButton v-if="row.状态 === '正常'" type="info">
								{{ transformI18n($t("property-manage_parking-manage.owner-vehicle.release")) }}
							</ElButton>
							<ElButton v-else-if="row.状态 === '到期'" type="info">
								{{ transformI18n($t("property-manage_parking-manage.owner-vehicle.renewLease")) }}
							</ElButton>
							<ElButton v-else="row.状态 == '无车位'" type="info"> ? </ElButton>
							<ElButton type="info">
								{{ transformI18n($t("property-manage_parking-manage.owner-vehicle.buyMonthlyCard")) }}
							</ElButton>
							<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
								{{ transformI18n($t("common.buttons.edit")) }}
							</ElButton>
							<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
						</template>
					</PureTable>
				</template>
			</PureTableBar>
		</el-main>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
	display: flex;
	height: calc(
		100vh - 29px - 82px - 24px - 24px
	); //直接减尾部高度和头部高度（获取元素高度分别是29px和82px，以及内边距24px）
	padding: 0;
}
.leaseType {
	margin: 0;
	width: 100%;
	height: 60px;
	border-radius: 0;
	background: #fff;
	color: var(--el-text-color-regular);
	border: none;
	transition:
		background 0.2s,
		color 0.2s,
		border-color 0.2s;

	// 暗黑模式下未激活
	.dark & {
		background: var(--el-menu-bg-color, #141414);
		color: var(--el-text-color-regular);
		border: 1px solid var(--el-border-color-light, #333);
	}

	// 普通模式下也加边框
	border: 1px solid #e4e7ed;

	// 悬浮态
	&:hover {
		border-color: var(--el-color-primary);
		background: var(--el-color-primary-light-9, #f0f6ff);
		color: var(--el-color-primary);
	}

	// 激活状态
	&.active {
		background: var(--el-color-primary);
		color: #fff;
		border-color: var(--el-color-primary);
	}
}
</style>
