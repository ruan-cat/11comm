import { h, ref, computed } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useMode, type Mode } from "@/composables/use-mode";
import { type ConfigCenterFormProps, defaultForm } from "./form";
import type { ConfigCenterFormVO, ConfigCenterListItem } from "@01s-11comm/type";
import ConfigCenterForm from "./form.vue";

const configCenterFormInstance = ref<InstanceType<typeof ConfigCenterForm> | null>(null);
const { setMode, isAdd, isEdit } = useMode();
const [isLoadingT, setIsLoadingT] = useToggle(false);

async function testAsync() {
	setIsLoadingT(true);
	consola.log("simulate async submit", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("simulate async submit", isLoadingT.value);
}

function openDialog(params: { mode: Mode; row?: ConfigCenterListItem }) {
	const { mode, row } = params;
	setMode(mode);

	const formData: ConfigCenterFormVO = isAdd.value
		? structuredClone(defaultForm)
		: isEdit.value
			? {
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
				}
			: structuredClone(defaultForm);

	const formProps: ConfigCenterFormProps = {
		form: formData,
		defaultValues: formData,
	};

	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("devTeam.configManage.center.dialogs.addTitle"))
				: transformI18n($t("devTeam.configManage.center.dialogs.editTitle")),
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
					const res = await configCenterFormInstance.value?.plusFormInstance?.handleSubmit();
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
