<script setup lang="ts">
import { computed, watch } from "vue";
import type { UploadFile } from "element-plus";
import { $t, transformI18n } from "@/plugins/i18n";
import { useResumableUpload } from "./use-resumable-upload";
import type {
	ResumableUploadAttachmentTypeOption,
	ResumableUploadBizType,
	ResumableUploadCompletedAsset,
} from "./types";

defineOptions({
	name: "ContractManageSharedUpload",
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

const upload = useResumableUpload({
	bizType: props.bizType,
	attachmentTypeOptions: props.attachmentTypeOptions,
});

const completedAssets = computed(() => upload.completedAssets.value);
const sharedUploadMessageKeys = {
	dropzoneTip: "property-manage_contract-manage.shared-upload.dropzoneTip",
	blockingAlert: "property-manage_contract-manage.shared-upload.blockingAlert",
	missingPartSuffix: "property-manage_contract-manage.shared-upload.missingPartSuffix",
	actions: {
		start: "property-manage_contract-manage.shared-upload.actions.start",
		pause: "property-manage_contract-manage.shared-upload.actions.pause",
		resume: "property-manage_contract-manage.shared-upload.actions.resume",
		remove: "property-manage_contract-manage.shared-upload.actions.remove",
	},
} as const;

watch(
	completedAssets,
	(value) => {
		emit("update:modelValue", value);
	},
	{ deep: true, immediate: true },
);

/**
 * 接收上传组件选中的文件。
 * @description
 * Element Plus 每次 change 只抛出单个 `UploadFile`，这里负责过滤空值并接入断点续传队列。
 */
async function handleChange(uploadFile: UploadFile) {
	if (!uploadFile.raw) {
		return;
	}

	await upload.addFiles([uploadFile.raw]);
}
</script>

<template>
	<div class="space-y-4 rounded-lg border border-dashed border-[var(--el-border-color)] p-4">
		<el-upload drag :auto-upload="false" :show-file-list="false" multiple @change="handleChange">
			<div class="py-4 text-sm text-[var(--el-text-color-regular)]">
				{{ transformI18n($t(sharedUploadMessageKeys.dropzoneTip)) }}
			</div>
		</el-upload>

		<el-alert
			v-if="upload.hasBlockingUpload.value"
			:title="transformI18n($t(sharedUploadMessageKeys.blockingAlert))"
			type="warning"
			:closable="false"
			show-icon
		/>

		<div v-if="upload.files.value.length" class="space-y-3">
			<div
				v-for="item in upload.files.value"
				:key="item.localId"
				class="rounded-md border border-[var(--el-border-color-lighter)] p-3"
			>
				<div class="flex items-center justify-between gap-3">
					<div class="min-w-0">
						<div class="truncate text-sm font-medium">{{ item.file.name }}</div>
						<div class="text-xs text-[var(--el-text-color-secondary)]">
							{{ item.status }} / {{ item.missingPartNumbers.length }}
							{{ transformI18n($t(sharedUploadMessageKeys.missingPartSuffix)) }}
						</div>
					</div>
					<div class="flex items-center gap-2">
						<el-button size="small" @click="upload.startUpload(item.localId)">
							{{ transformI18n($t(sharedUploadMessageKeys.actions.start)) }}
						</el-button>
						<el-button size="small" @click="upload.pauseUpload(item.localId)">
							{{ transformI18n($t(sharedUploadMessageKeys.actions.pause)) }}
						</el-button>
						<el-button size="small" @click="upload.resumeUpload(item.localId)">
							{{ transformI18n($t(sharedUploadMessageKeys.actions.resume)) }}
						</el-button>
						<el-button size="small" type="danger" plain @click="upload.removeUpload(item.localId)">
							{{ transformI18n($t(sharedUploadMessageKeys.actions.remove)) }}
						</el-button>
					</div>
				</div>
				<el-progress class="mt-3" :percentage="item.progress" :stroke-width="8" />
			</div>
		</div>
	</div>
</template>
