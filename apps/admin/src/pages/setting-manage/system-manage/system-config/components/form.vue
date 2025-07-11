<script lang="ts" setup>
import { computed } from "vue";
import type { SystemConfigFormProps, SystemConfigForm } from "./form";

/** 定义组件Props */
const props = withDefaults(defineProps<SystemConfigFormProps>(), {});

/** 表单组件实例 要求对外直接导出本表单实例 */
const plusFormInstance = useTemplateRef("plusFormRef");
usePlusFormReset(plusFormInstance);

/** 动态计算的，只读的，当前表单对象 */
const formComputed = computed(() => props.form);

/** 表单配置 */
const plusFormColumns = computed(() => [
	{
		label: "标题名称",
		prop: "title",
		valueType: "input" as const,
	},
	{
		label: "副标题",
		prop: "subtitle",
		valueType: "input" as const,
	},
	{
		label: "简写标题",
		prop: "shortName",
		valueType: "input" as const,
	},
	{
		label: "公司名称",
		prop: "companyName",
		valueType: "input" as const,
	},
	{
		label: "logo地址",
		prop: "logoUrl",
		valueType: "input" as const,
	},
	{
		label: "静态url",
		prop: "staticUrl",
		valueType: "input" as const,
	},
	{
		label: "默认小区编号",
		prop: "defaultCommunityCode",
		valueType: "input" as const,
	},
	{
		label: "业主标题",
		prop: "ownerTitle",
		valueType: "input" as const,
	},
	{
		label: "物业手机标题",
		prop: "propertyMobileTitle",
		valueType: "input" as const,
	},
	{
		label: "qq地图key",
		prop: "qqMapKey",
		valueType: "input" as const,
	},
	{
		label: "商城地址",
		prop: "mallUrl",
		valueType: "input" as const,
	},
]);

/** 对外导出 */
defineExpose({
	plusFormInstance,
	formComputed,
});
</script>

<template>
	<PlusForm
		ref="plusFormRef"
		v-model="props.form as any"
		:columns="plusFormColumns"
		:default-values="props.defaultValues as any"
		label-width="120px"
		class="form-root"
	/>
</template>

<style lang="scss" scoped>
.form-root {
	height: 100%;
	width: 100%;
}
</style>
