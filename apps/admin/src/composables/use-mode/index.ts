/**
 * 模式
 * @description
 * 用来描述业务动作
 * 例如：添加、编辑、查看等
 */
export type Mode = "add" | "edit" | "info";

/** 使用 mode 模式系列提供的一些列常用的响应式变量 */
export function useMode() {
	/** 模式 */
	const mode = ref<Mode>("add");

	const isAdd = computed(() => mode.value === "add");
	const isEdit = computed(() => mode.value === "edit");
	const isInfo = computed(() => mode.value === "info");

	/** 转换后的文本 模式文本 */
	const modeText = computed(() => {
		let resTitle = "";
		switch (mode.value) {
			case "add":
				resTitle = transformI18n($t("common.buttons.add"));
				break;
			case "edit":
				resTitle = transformI18n($t("common.buttons.edit"));
				break;
			case "info":
				resTitle = transformI18n($t("common.buttons.info"));
				break;
		}
		return resTitle;
	});

	/** 设置模式 */
	function setMode(newMode: Mode) {
		mode.value = newMode;
	}

	return {
		mode,
		isAdd,
		isEdit,
		isInfo,
		modeText,
		setMode,
	};
}
