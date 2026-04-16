<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type {
	ResumableUploadAttachmentTypeOption,
	ResumableUploadBizType,
	ResumableUploadCompletedAsset,
} from "../../shared-upload/types";
import ContractManageSharedUpload from "../../shared-upload/index.vue";

defineOptions({
	name: "ContractDraftUpload",
});

const props = withDefaults(
	defineProps<{
		bizType: ResumableUploadBizType;
		attachmentTypeOptions?: ResumableUploadAttachmentTypeOption[];
		modelValue?: ResumableUploadCompletedAsset[];
	}>(),
	{
		attachmentTypeOptions: () => [],
		modelValue: () => [],
	},
);

const emit = defineEmits<{
	"update:modelValue": [value: ResumableUploadCompletedAsset[]];
}>();

const uploadRef = ref<InstanceType<typeof ContractManageSharedUpload> | null>(null);
const hasBlockingUpload = ref(false);
const renderKey = ref(0);
let observer: MutationObserver | null = null;

const uploadProps = computed(() => ({
	bizType: props.bizType,
	attachmentTypeOptions: props.attachmentTypeOptions,
	modelValue: props.modelValue,
}));

/**
 * 同步阻塞上传状态。
 * @description
 * 共享上传组件内部用 `el-alert` 表达“存在未完成上传”，这里把该视觉状态映射回外层表单布尔值。
 */
function syncBlockingState() {
	const rootEl = uploadRef.value?.$el as HTMLElement | undefined;
	const nextValue = Boolean(rootEl?.querySelector(".el-alert"));
	if (hasBlockingUpload.value !== nextValue) {
		hasBlockingUpload.value = nextValue;
	}
}

/**
 * 绑定上传区域 DOM 观察器。
 * @description
 * 上传列表和提示条会在共享组件内部动态变化，页面层通过 `MutationObserver` 监听后同步阻塞状态。
 */
function bindObserver() {
	observer?.disconnect();

	const rootEl = uploadRef.value?.$el as HTMLElement | undefined;
	if (!rootEl) {
		return;
	}

	observer = new MutationObserver(() => {
		syncBlockingState();
	});

	observer.observe(rootEl, {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true,
	});
}

/**
 * 重置上传包装组件。
 * @description
 * 通过变更 `key` 强制重建共享上传组件实例，并在重建后重新挂载观察器与状态同步逻辑。
 */
function reset() {
	renderKey.value += 1;
	hasBlockingUpload.value = false;
	void nextTick(() => {
		bindObserver();
		syncBlockingState();
	});
}

watch(
	() => props.modelValue,
	async () => {
		await nextTick();
		syncBlockingState();
	},
	{ deep: true },
);

onMounted(async () => {
	await nextTick();
	syncBlockingState();
	bindObserver();
});

onBeforeUnmount(() => {
	observer?.disconnect();
	observer = null;
});

defineExpose({
	hasBlockingUpload,
	reset,
	getHasBlockingUpload: () => hasBlockingUpload.value,
});
</script>

<template>
	<ContractManageSharedUpload
		:key="renderKey"
		ref="uploadRef"
		v-bind="uploadProps"
		@update:modelValue="emit('update:modelValue', $event)"
	/>
</template>
