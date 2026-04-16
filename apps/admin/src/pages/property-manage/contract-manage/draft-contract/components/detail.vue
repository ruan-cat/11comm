<script lang="ts" setup>
import { computed } from "vue";
import { transformI18n, $t } from "@/plugins/i18n";
import type { ContractDraftDetailVO } from "@01s-11comm/type";

const props = defineProps<{
	detail: ContractDraftDetailVO | null;
	loading?: boolean;
}>();

const attachmentList = computed(() => props.detail?.attachments ?? []);
const draftContractDetailMessageKeys = {
	empty: "property-manage_contract-manage.draft-contract.messages.emptyDetail",
} as const;
</script>

<template>
	<section class="space-y-4">
		<ElSkeleton v-if="loading" :rows="6" animated />

		<template v-else>
			<ElDescriptions v-if="detail" :column="2" border>
				<ElDescriptionsItem
					:label="transformI18n($t('property-manage_contract-manage.draft-contract.fields.contractName'))"
				>
					{{ detail.contractName }}
				</ElDescriptionsItem>
				<ElDescriptionsItem
					:label="transformI18n($t('property-manage_contract-manage.draft-contract.fields.contractNumber'))"
				>
					{{ detail.contractNumber }}
				</ElDescriptionsItem>
				<ElDescriptionsItem
					:label="transformI18n($t('property-manage_contract-manage.draft-contract.fields.contractType'))"
				>
					{{ detail.contractType }}
				</ElDescriptionsItem>
				<ElDescriptionsItem :label="transformI18n($t('property-manage_contract-manage.draft-contract.fields.handler'))">
					{{ detail.handler }}
				</ElDescriptionsItem>
				<ElDescriptionsItem
					:label="transformI18n($t('property-manage_contract-manage.draft-contract.fields.contractAmount'))"
				>
					{{ detail.contractAmount }}
				</ElDescriptionsItem>
				<ElDescriptionsItem :label="transformI18n($t('property-manage_contract-manage.draft-contract.fields.status'))">
					{{ detail.status }}
				</ElDescriptionsItem>
				<ElDescriptionsItem
					:label="transformI18n($t('property-manage_contract-manage.draft-contract.fields.startTime'))"
				>
					{{ detail.startTime }}
				</ElDescriptionsItem>
				<ElDescriptionsItem :label="transformI18n($t('property-manage_contract-manage.draft-contract.fields.endTime'))">
					{{ detail.endTime }}
				</ElDescriptionsItem>
				<ElDescriptionsItem
					:label="transformI18n($t('property-manage_contract-manage.draft-contract.fields.signingTime'))"
				>
					{{ detail.signingTime }}
				</ElDescriptionsItem>
				<ElDescriptionsItem
					:label="transformI18n($t('property-manage_contract-manage.draft-contract.fields.description'))"
					:span="2"
				>
					{{ detail.description }}
				</ElDescriptionsItem>
			</ElDescriptions>

			<ElEmpty v-else :description="transformI18n($t(draftContractDetailMessageKeys.empty))" />

			<div v-if="attachmentList.length" class="rounded-lg border border-[var(--el-border-color-light)] p-4">
				<div class="mb-3 text-sm font-medium text-[var(--el-text-color-primary)]">
					{{ transformI18n($t("property-manage_contract-manage.draft-contract.fields.attachments")) }}
				</div>
				<div class="space-y-2">
					<div
						v-for="item in attachmentList"
						:key="item.id"
						class="flex items-center justify-between gap-3 rounded-md bg-[var(--el-fill-color-light)] px-3 py-2"
					>
						<div class="min-w-0">
							<div class="truncate text-sm">{{ item.attachmentName }}</div>
							<div class="text-xs text-[var(--el-text-color-secondary)]">
								{{ item.attachmentType || "-" }} / {{ item.fileSize || 0 }} B
							</div>
						</div>
						<div class="text-xs text-[var(--el-text-color-secondary)]">
							{{ item.uploadStatus }}
						</div>
					</div>
				</div>
			</div>
		</template>
	</section>
</template>
