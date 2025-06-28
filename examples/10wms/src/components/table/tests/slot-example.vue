<script lang="ts" setup>
import type { TestBuziDataForTable } from "./data";
import ComponentsTable from "components/table/index.vue";
import { ElTag } from "element-plus";
import { ref } from "vue";
import { testBuziDataForTable } from "./data";

const componentsTableProps = ref<SimpleDataTableProps<TestBuziDataForTable>>({
	isIndex: true,
	data: testBuziDataForTable,
	columns: [
		{ prop: "name", label: "姓名", width: 70 },
		{ prop: "age", label: "年龄" },
	],
});
</script>

<template>
	<section>
		<ComponentsTable :="componentsTableProps">
			<template #bodyCell="{ prop, row }">
				<template v-if="prop === 'name'">
					<ElTag type="danger">
						{{ row[prop] }}
					</ElTag>
				</template>

				<template v-if="prop === 'age'">
					<ElTag type="success">
						{{ row[prop] }}
					</ElTag>
				</template>
			</template>
		</ComponentsTable>
	</section>
</template>
