import type { PlusFormInstance } from "plus-pro-components";
import type { Ref, TemplateRef } from "vue";

/**
 * 使用 `PlusForm` 的重置表单功能
 * @description
 * 在组件挂载时自动重置表单 确保每次打开弹框时 不会遗留上一次遗漏的内容
 */
export function usePlusFormReset(
	/**
	 * 组件实例
	 * @description
	 * 这里没办法绕过复杂的类型推断 故直接使用any标注类型
	 */
	plusFormInstance: any,
) {
	onMounted(() => {
		if (!plusFormInstance.value) return;

		/** elform 表单实例 */
		const formInstance = plusFormInstance.value.formInstance;
		// 重置表单
		formInstance.resetFields();
		// 清空校验
		formInstance.clearValidate();
		// 重设表单
		plusFormInstance.value.handleReset();
	});
}
