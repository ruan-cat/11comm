<script lang="ts" setup>
import type { TestBuziDataForTable } from "./data";
import ComponentsTable from "components/table/index.vue";
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
		<ComponentsTable :="componentsTableProps"></ComponentsTable>
	</section>
</template>
