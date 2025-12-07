<script setup lang="ts">
import { unref } from "vue";
import { useRouter } from "vue-router";

defineOptions({
	name: "Redirect",
});

const { currentRoute, replace } = useRouter();

const { params, query } = unref(currentRoute);
const pathParam = (params as { path?: string | string[] })?.path ?? "";
const _path = Array.isArray(pathParam) ? pathParam.join("/") : pathParam;

replace({
	path: "/" + _path,
	query,
});
</script>

<template>
	<div />
</template>
