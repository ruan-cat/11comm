import "vxe-table/lib/style.css";
import "vxe-pc-ui/lib/style.css";
// import "xe-utils";
// import XEUtils from "xe-utils";
import type { App } from "vue";
// import { i18n } from "@/plugins/i18n";
// import zh from "vxe-table/lib/locale/lang/zh-CN";
// import en from "vxe-table/lib/locale/lang/en-US";

import {
	// 全局对象
	VXETable,
	// 表格功能 - 在 4.7+ 版本中，只保留与表格相关的组件
	// Filter,
	// Edit,
	// Menu,
	// Export,
	// Keyboard,
	// Validator,
	// Custom, // 已移除
	// 可选组件 - 在 4.7+ 版本中，大部分UI组件已移除
	// Icon, // 已移除
	Column,
	Grid,
	// Pager, // 已移除
	// Select, // 已移除
	Colgroup,
	Toolbar,
	// Form,
	// FormItem,
	// FormGather,
	// Checkbox,
	// CheckboxGroup,
	// Radio,
	// RadioGroup,
	// RadioButton,
	// Switch,
	// Input,
	// Optgroup,
	// Option,
	// Textarea,
	// Button,
	// Modal,
	// List,
	// Pulldown,
	// 表格
	Table,
} from "vxe-table";

// 从 vxe-pc-ui 导入被移除的组件
import {
	// 被移除的组件，现在从 vxe-pc-ui 导入
	Icon as VxeIcon,
	Pager as VxePager,
	Select as VxeSelect,
	Tooltip as VxeTooltip,
	Form as VxeForm,
	FormItem as VxeFormItem,
	Checkbox as VxeCheckbox,
	CheckboxGroup as VxeCheckboxGroup,
	Radio as VxeRadio,
	RadioGroup as VxeRadioGroup,
	RadioButton as VxeRadioButton,
	Switch as VxeSwitch,
	Input as VxeInput,
	Optgroup as VxeOptgroup,
	Option as VxeOption,
	Textarea as VxeTextarea,
	Button as VxeButton,
	Modal as VxeModal,
	List as VxeList,
	Pulldown as VxePulldown,
} from "vxe-pc-ui";

// 全局默认参数
VXETable.setConfig({
	// i18n: (key, args) => {
	//   return unref(i18n.global.locale) === "zh"
	//     ? XEUtils.toFormatString(XEUtils.get(zh, key), args)
	//     : XEUtils.toFormatString(XEUtils.get(en, key), args);
	// },
	// translate(key) {
	//   const NAMESPACED = ["el.", "buttons."];
	//   if (key && NAMESPACED.findIndex(v => key.includes(v)) !== -1) {
	//     return i18n.global.t.call(i18n.global.locale, key);
	//   }
	//   return key;
	// }
});

export function useVxeTable(app: App) {
	// 注册 vxe-pc-ui 组件（被移除的组件）
	app
		.use(VxeIcon)
		.use(VxePager)
		.use(VxeSelect)
		.use(VxeTooltip)
		.use(VxeForm)
		.use(VxeFormItem)
		.use(VxeCheckbox)
		.use(VxeCheckboxGroup)
		.use(VxeRadio)
		.use(VxeRadioGroup)
		.use(VxeRadioButton)
		.use(VxeSwitch)
		.use(VxeInput)
		.use(VxeOptgroup)
		.use(VxeOption)
		.use(VxeTextarea)
		.use(VxeButton)
		.use(VxeModal)
		.use(VxeList)
		.use(VxePulldown);

	// 注册表格相关组件
	app
		// 表格功能
		// .use(Filter)
		// .use(Edit)
		// .use(Menu)
		// .use(Export)
		// .use(Keyboard)
		// .use(Validator)
		// .use(Custom) // 已移除
		// 表格组件 - 只保留与表格相关的组件
		.use(Column)
		.use(Grid)
		// .use(Pager) // 已移除
		// .use(Select) // 已移除
		.use(Colgroup)
		.use(Toolbar)
		// .use(Form)
		// .use(FormItem)
		// .use(FormGather)
		// .use(Checkbox)
		// .use(CheckboxGroup)
		// .use(Radio)
		// .use(RadioGroup)
		// .use(RadioButton)
		// .use(Switch)
		// .use(Input)
		// .use(Optgroup)
		// .use(Option)
		// .use(Textarea)
		// .use(Button)
		// .use(Modal)
		// .use(List)
		// .use(Pulldown)
		// 安装表格
		.use(Table);
}
