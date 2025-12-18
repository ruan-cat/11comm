<script lang="ts" setup>
definePage({
	meta: {
		title: "系统配置",
		icon: "mdi:application-cog",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.systemConfig"),
	},
});

import { ref, computed, h, watch } from "vue";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { transformI18n } from "@/plugins/i18n";
import { type SystemConfigFormProps, defaultForm, type SystemConfigFormVO } from "./components/form";
import SystemConfigFormComponent from "./components/form.vue";
import { useMode } from "@/composables/use-mode";

import { cloneDeep } from "@pureadmin/utils";
import { useToggle } from "@vueuse/core";
import { sleep } from "@antfu/utils";
import { useSystemConfigListQuery } from "@/api/setting-manage/system-manage/system-config";
import type { SystemConfig } from "@01s-11comm/type";

const systemConfigFormInstance = ref<InstanceType<typeof SystemConfigFormComponent> | null>(null);

// 使用系统配置列表查询 Hook
const { tableData, isFetching } = useSystemConfigListQuery();

/** 系统配置数据 */
const systemConfig = computed<SystemConfig>(() => {
	if (tableData.value && tableData.value.length > 0) {
		return tableData.value[0];
	}
	// 返回默认空值或初始值
	return {
		title: "",
		subtitle: "",
		shortName: "",
		companyName: "",
		logoUrl: "",
		staticUrl: "",
		defaultCommunityCode: "",
		ownerTitle: "",
		propertyMobileTitle: "",
		qqMapKey: "",
		mallUrl: "",
	};
});

/** 系统基本信息配置 */
const basicColumns = computed(() => [
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
]);

/** 系统地址配置 */
const urlColumns = computed(() => [
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
]);

/** 业务配置 */
const businessColumns = computed(() => [
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
]);

/** 模拟异步操作 */
const [isFetchingT, setIsLoadingT] = useToggle(false);
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 弹框模式控制 */
const { setMode } = useMode();

const defaultAddDialogParams = {
	width: "50%",
	draggable: true,
	fullscreenIcon: true,
	closeOnClickModal: false,
	contentRenderer: () => h("div"),
};

/** 打开修改弹框 */
function openEditDialog() {
	setMode("edit");

	/** 弹框标题 */
	const title = "修改系统配置";

	/** 业务对象 */
	// 将 SystemConfig 转换为 SystemConfigFormVO
	const formVO: SystemConfigFormVO = cloneDeep(systemConfig.value);

	/** 表单组件需要的props */
	const formProps: SystemConfigFormProps = {
		form: formVO,
		defaultValues: cloneDeep(formVO),
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
			const formComputed = systemConfigFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = systemConfigFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					systemConfigFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					if (systemConfigFormInstance.value?.plusFormInstance) {
						const res = await systemConfigFormInstance.value.plusFormInstance.handleSubmit();
						if (res) {
							button.btn.loading = true;
							await testAsync();

							// TODO: 调用API更新配置
							// 目前只模拟更新本地数据
							// Object.assign(systemConfig.value, formProps.form); // systemConfig is computed, cannot assign.
							// should update tableData or doFetch.
							// For now mock data won't persist anyway.

							button.btn.loading = false;
							closeDialog(options, index);
						}
					}
				},
			},
		],
	});
}
</script>

<template>
	<div class="system-config-container" v-loading="isFetching">
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
