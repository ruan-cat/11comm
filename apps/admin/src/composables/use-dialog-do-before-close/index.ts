import { isEqual } from "lodash-es";
import { ElMessageBox } from "element-plus";
import type { Action } from "element-plus";

/** 弹框关闭回调 全部需要的字段 */
export interface DoBeforeCloseParams {
	/** 从表单组件获得的 动态计算的 只读表单对象 */
	formComputed: any;

	/** 表单对象重置时的默认值 */
	defaultValues: any;

	/** 选项 */
	options: DialogOptions;
	/** 索引 */
	index: number;
}

/** 表单是否填写过了？是否存在修改？*/
export function hasChangeForm(
	formComputed: DoBeforeCloseParams["formComputed"],
	defaultValues: DoBeforeCloseParams["defaultValues"],
) {
	return !isEqual(formComputed, defaultValues);
}

/** 在关闭弹框前 对表单变量做diff校验 并提示用户 */
export async function useDoBeforeClose(params: DoBeforeCloseParams) {
	const { defaultValues, formComputed, options, index } = params;

	const isChange = hasChangeForm(defaultValues, formComputed);

	if (isChange) {
		await ElMessageBox.confirm(transformI18n($t("common.cancel.content")), transformI18n($t("common.cancel.title")), {
			distinguishCancelAndClose: true,
			confirmButtonText: transformI18n($t("common.cancel.confirm")),
			cancelButtonText: transformI18n($t("common.cancel.cancel")),
			draggable: true,
			type: "warning",
		})
			.then(() => {
				closeDialog(options, index);
			})
			.catch((action: Action) => {
				if (action === "confirm") {
					closeDialog(options, index);
				}
			});
	} else {
		closeDialog(options, index);
	}
}
