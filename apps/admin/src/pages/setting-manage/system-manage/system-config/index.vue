<script lang="ts" setup>
definePage({
	meta: {
		title: "系统配置",
		icon: "f7:menu",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.systemConfig"),
	},
});

import { ref } from "vue";
import { addDialog } from "@/components/ReDialog";
import { transformI18n } from "@/plugins/i18n";
import { type SystemConfigForm, type SystemConfigFormProps, defaultForm } from "./components/form";
import SystemConfigFormComponent from "./components/form.vue";

const systemConfigFormInstance = ref<InstanceType<typeof SystemConfigFormComponent> | null>(null);

/** 系统配置数据 */
const systemConfig = ref({
	title: "HC小区管理系统",
	subtitle: "智慧物业系统",
	shortName: "HC",
	companyName: "java110团队",
	logoUrl: "/img/logo.png",
	staticUrl: "http://demo.homecommunity.cn",
	defaultCommunityCode: "20230522671001146",
	ownerTitle: "HC智慧家园",
	propertyMobileTitle: "HC掌上物业",
	qqMapKey: "123123",
	mallUrl: "http://mallapp.homecommunity.cn",
});

/** 系统基本信息配置 */
const basicColumns = [
	{
		label: "标题名称",
		value: systemConfig.value.title,
		minWidth: 120,
	},
	{
		label: "副标题",
		value: systemConfig.value.subtitle,
		minWidth: 120,
	},
	{
		label: "简写名称",
		value: systemConfig.value.shortName,
		minWidth: 120,
	},
	{
		label: "公司名称",
		value: systemConfig.value.companyName,
		minWidth: 120,
	},
];

/** 系统地址配置 */
const urlColumns = [
	{
		label: "logo地址",
		value: systemConfig.value.logoUrl,
		minWidth: 120,
		copy: true,
	},
	{
		label: "静态url",
		value: systemConfig.value.staticUrl,
		minWidth: 120,
		copy: true,
	},
	{
		label: "商城地址",
		value: systemConfig.value.mallUrl,
		minWidth: 120,
		copy: true,
	},
];

/** 业务配置 */
const businessColumns = [
	{
		label: "默认小区编号",
		value: systemConfig.value.defaultCommunityCode,
		minWidth: 120,
		copy: true,
	},
	{
		label: "业主标题",
		value: systemConfig.value.ownerTitle,
		minWidth: 120,
	},
	{
		label: "物业手机标题",
		value: systemConfig.value.propertyMobileTitle,
		minWidth: 120,
	},
	{
		label: "qq地图key",
		value: systemConfig.value.qqMapKey,
		minWidth: 120,
		copy: true,
	},
];

/** 模拟异步操作 */
const [isLoadingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 弹框模式控制 */
const { setMode } = useMode();

/** 打开修改弹框 */
function openEditDialog() {
	setMode("edit");

	/** 弹框标题 */
	const title = "修改系统配置";

	/** 表单组件需要的props */
	const formProps: SystemConfigFormProps = {
		form: cloneDeep(systemConfig.value),
		defaultValues: cloneDeep(systemConfig.value),
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(SystemConfigFormComponent, {
				ref: systemConfigFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = systemConfigFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = systemConfigFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					systemConfigFormInstance.value.plusFormInstance.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await systemConfigFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();

						/** 更新系统配置数据 */
						Object.assign(systemConfig.value, formProps.form);

						button.btn.loading = false;
						closeDialog(options, index);
					}
				},
			},
		],
	});
}
</script>

<template>
	<div class="system-config-container">
		<ElCard class="mb-4 box-card" shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-medium">系统基本信息</span>
					<ElButton type="warning" @click="openEditDialog">
						{{ transformI18n($t("common.buttons.edit")) }}
					</ElButton>
				</div>
			</template>
			<ElScrollbar>
				<PureDescriptions :border="true" :columns="basicColumns" :column="2" />
			</ElScrollbar>
		</ElCard>

		<ElCard class="mb-4 box-card" shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-medium">系统地址配置</span>
				</div>
			</template>
			<ElScrollbar>
				<PureDescriptions :border="true" :columns="urlColumns" :column="1" />
			</ElScrollbar>
		</ElCard>

		<ElCard class="mb-4 box-card" shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-medium">业务配置</span>
				</div>
			</template>
			<ElScrollbar>
				<PureDescriptions :border="true" :columns="businessColumns" :column="2" />
			</ElScrollbar>
		</ElCard>
	</div>
</template>

<style lang="scss" scoped>
.system-config-container {
	padding: 20px;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.box-card {
	margin-bottom: 16px;
}

:deep(.el-descriptions__body) {
	background: transparent;
}

:deep(.el-descriptions__table) {
	.el-descriptions__cell {
		padding: 12px 16px;
	}
}
</style>
