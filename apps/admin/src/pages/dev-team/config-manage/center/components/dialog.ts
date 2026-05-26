import { h, ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { $t, transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useMode, type Mode } from "@/composables/use-mode";
import { type ConfigCenterFormProps, defaultForm } from "./form";
import { createConfigCenter, updateConfigCenter } from "@/api/dev-team/config-manage/center";
import type { ConfigCenterFormVO, ConfigCenterListItem } from "@01s-11comm/type";
import ConfigCenterForm from "./form.vue";

const configCenterFormInstance = ref<InstanceType<typeof ConfigCenterForm> | null>(null);
const { setMode, isAdd, isEdit, isInfo } = useMode();

interface OpenConfigCenterDialogParams {
	mode: Mode;
	/** 详情、编辑、复制入口传入的行数据；新增入口可不传。 */
	row?: ConfigCenterListItem;
	/** 新增/编辑成功后由页面传入刷新列表，dialog 不直接持有列表查询上下文。 */
	onSubmitted?: () => void | Promise<void>;
}

/** 将详情/列表行转换成配置中心表单字段，避免把 id、时间等只读字段带入提交表单。 */
function buildFormData(row?: ConfigCenterListItem): ConfigCenterFormVO {
	return {
		...defaultForm,
		configName: row?.configName || "",
		configType: row?.configType || defaultForm.configType,
		configKey: row?.configKey || "",
		configValue: row?.configValue || "",
		defaultValue: row?.defaultValue || "",
		configDescription: row?.configDescription || "",
		status: row?.status || defaultForm.status,
		sortOrder: row?.sortOrder || 0,
		remark: row?.remark || "",
	};
}

/** 标题通过函数延迟求值，保证弹窗打开后切换语言时仍能读取当前 i18n 文案。 */
function getDialogTitle() {
	if (isAdd.value) {
		return transformI18n($t("devTeam.configManage.center.dialogs.addTitle"));
	}

	if (isEdit.value) {
		return transformI18n($t("devTeam.configManage.center.dialogs.editTitle"));
	}

	return `${transformI18n($t("common.buttons.info"))}${transformI18n($t("devTeam.configManage.center.pageTitle"))}`;
}

function openDialog(params: OpenConfigCenterDialogParams) {
	const { mode, row } = params;
	setMode(mode);

	/** 复制新增允许从 row 预填，但最终 create payload 不携带原记录 id。 */
	const formData: ConfigCenterFormVO = isAdd.value
		? row
			? buildFormData(row)
			: cloneDeep(defaultForm)
		: isEdit.value || isInfo.value
			? buildFormData(row)
			: cloneDeep(defaultForm);

	const formProps: ConfigCenterFormProps = {
		form: formData,
		defaultValues: formData,
		mode,
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () => getDialogTitle(),
		/** info 模式只读展示详情，隐藏 footer 后不提供重置和提交入口。 */
		hideFooter: isInfo.value,
		props: formProps,
		contentRenderer: () =>
			h(ConfigCenterForm, {
				ref: configCenterFormInstance,
				...formProps,
			}),
		async doBeforeClose({ options, index }) {
			const formComputed = configCenterFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},
		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index } }) => {
					const formComputed = configCenterFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},
			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: () => {
					configCenterFormInstance.value?.plusFormInstance?.handleReset();
				},
			},
			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 只读详情弹窗即使误触发提交回调，也不能调用新增/更新接口。 */
					if (isInfo.value) {
						return;
					}

					const res = await configCenterFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						if (button.btn) {
							button.btn.loading = true;
						}
						try {
							const formComputed = configCenterFormInstance.value?.formComputed;
							if (!formComputed) {
								return;
							}

							/** formComputed 可能是 computed ref，也可能是组件暴露的普通对象，提交前统一解包。 */
							const payload =
								typeof formComputed === "object" && "value" in formComputed ? formComputed.value : formComputed;

							/** 新增直接提交表单字段；编辑额外拼接当前行 id，避免表单污染主键。 */
							if (isAdd.value) {
								await createConfigCenter(payload as ConfigCenterFormVO);
							} else if (row?.id) {
								await updateConfigCenter({ ...(payload as ConfigCenterFormVO), id: row.id });
							}

							closeDialog(options, index);
							await params.onSubmitted?.();
						} finally {
							if (button.btn) {
								button.btn.loading = false;
							}
						}
					}
				},
			},
		],
	});
}

export { openDialog };
