/**
 * 配置中心模块命令式弹框组件
 * 基于 addDialog 函数实现，支持新增和编辑两种模式
 */

import { ref, h } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { useMode, type Mode } from "@/composables/use-mode";
import { type ConfigCenterFormProps, defaultForm, type 配置中心表单_VO, type 配置类型, type 配置状态 } from "./form";
import { type 配置中心_列表数据 } from "../test-data";
import ConfigCenterForm from "./form.vue";

/** 表单组件实例 */
const configCenterFormInstance = ref<InstanceType<typeof ConfigCenterForm> | null>(null);

/** 模式控制 */
const { modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
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
function openDialog(params: { mode: Mode; row?: 配置中心_列表数据 }) {
	const { mode, row } = params;
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}配置`;

	/** 业务对象 */
	const 配置中心表单_VO: 配置中心表单_VO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? {
					...defaultForm,
					配置项名称: row?.配置项名称 || "",
					配置类型: (row?.配置类型 as 配置类型) || "系统配置",
					配置键名: row?.配置键名 || "",
					配置值: row?.配置值 || "",
					默认值: row?.默认值 || "",
					配置描述: row?.配置描述 || "",
					状态: (row?.状态 as 配置状态) || "启用",
					排序号: row?.排序号 || 0,
					备注: row?.备注 || "",
				}
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: ConfigCenterFormProps = {
		form: 配置中心表单_VO,
		defaultValues: 配置中心表单_VO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
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
					// console.log(options, index, button);
					const formComputed = configCenterFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					// 手动重置表单
					configCenterFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					// 提交表单时 校验
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