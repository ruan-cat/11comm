/**
 * 配置中心模块命令式弹框组件
 * 基于 addDialog 函数实现，支持新增和编辑两种模式
 */

import { ref, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useMode, type Mode } from "@/composables/use-mode";
import { type ConfigCenterFormProps, defaultForm } from "./form";
import type { ConfigCenterFormVO } from "@01s-11comm/type";
import type { ConfigCenterListItem } from "@01s-11comm/type";
import ConfigCenterForm from "./form.vue";

/** 表单组件实例 Form component instance */
const configCenterFormInstance = ref<InstanceType<typeof ConfigCenterForm> | null>(null);

/** 模式控制 Mode control */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 Test async toggle */
const [isLoadingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 Simulate async operation */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/**
 * 打开弹框
 * @param params 包含模式和行数据的参数对象
 */
function openDialog(params: { mode: Mode; row?: ConfigCenterListItem }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 Dialog title */
	const title = `${modeText.value}配置`;

	/** 业务对象 Form data object */
	const formData: ConfigCenterFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? {
					...defaultForm,
					configName: row?.configName || "",
					configType: row?.configType || "系统配置",
					configKey: row?.configKey || "",
					configValue: row?.configValue || "",
					defaultValue: row?.defaultValue || "",
					configDescription: row?.configDescription || "",
					status: row?.status || "enabled",
					sortOrder: row?.sortOrder || 0,
					remark: row?.remark || "",
				}
			: structuredClone(defaultForm);

	/** 表单组件需要的props Form component props */
	const formProps: ConfigCenterFormProps = {
		form: formData,
		defaultValues: formData,
	};

	/** 根据不同模式下 变化的表单默认重置对象 Default values for form reset */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props: formProps,

		contentRenderer: () =>
			h(ConfigCenterForm, {
				ref: configCenterFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = configCenterFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = configCenterFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					configCenterFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const res = await configCenterFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
					}
				},
			},
		],
	});
}

export { openDialog };
