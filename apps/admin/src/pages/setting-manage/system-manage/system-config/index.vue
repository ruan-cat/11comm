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

/** 表单实例引用 */
const systemConfigFormInstance = ref();

/** 默认值 */
const defaultValues = ref<SystemConfigForm>({ ...defaultForm });

/** 打开修改弹框 */
function openEditDialog() {
	setMode("edit");

	/** 设置表单数据 */
	const formData = ref<SystemConfigForm>({
		...systemConfig.value,
	});

	/** 更新默认值 */
	defaultValues.value = { ...systemConfig.value };

	addDialog({
		title: "修改",
		props: {
			form: formData.value,
			defaultValues: defaultValues.value,
		},
		width: "600px",
		draggable: true,
		fullscreen: deviceDetection(),
		fullscreenIcon: true,
		closeOnClickModal: false,
		contentRenderer: () =>
			h(SystemConfigFormComponent, {
				ref: systemConfigFormInstance,
				form: formData.value,
				defaultValues: defaultValues.value,
			}),
		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = systemConfigFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues: defaultValues.value, formComputed, index, options });
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
						Object.assign(systemConfig.value, formData.value);

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
				<PureDescriptions border :columns="basicColumns" :column="2" size="default" />
			</ElScrollbar>
		</ElCard>

		<ElCard class="mb-4 box-card" shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-medium">系统地址配置</span>
				</div>
			</template>
			<ElScrollbar>
				<PureDescriptions border :columns="urlColumns" :column="1" size="default" />
			</ElScrollbar>
		</ElCard>

		<ElCard class="mb-4 box-card" shadow="never">
			<template #header>
				<div class="card-header">
					<span class="font-medium">业务配置</span>
				</div>
			</template>
			<ElScrollbar>
				<PureDescriptions border :columns="businessColumns" :column="2" size="default" />
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
