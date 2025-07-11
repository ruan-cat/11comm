<script setup lang="ts">
import { getConfig } from "@/config";
import { posix } from "path-browserify";
import { menuType } from "@/layout/types";
import { ReText } from "@/components/ReText";
import { useNav } from "@/layout/hooks/useNav";
import { transformI18n } from "@/plugins/i18n";
import SidebarLinkItem from "./SidebarLinkItem.vue";
import SidebarExtraIcon from "./SidebarExtraIcon.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { type PropType, type CSSProperties, ref, toRaw, computed, useAttrs } from "vue";

import ArrowUp from "~icons/ep/arrow-up-bold";
import EpArrowDown from "~icons/ep/arrow-down-bold";
import ArrowLeft from "~icons/ep/arrow-left-bold";
import ArrowRight from "~icons/ep/arrow-right-bold";

/**
 * FIXME: 这里被迫改成手动导入 因为有部分同事反馈称 无法运行项目 无法找到这个全局导入的函数
 */
import { watchImmediate } from "@vueuse/core";

const attrs = useAttrs();
const { layout, isCollapse, tooltipEffect, getDivStyle } = useNav();

const props = defineProps({
	item: {
		type: Object as PropType<menuType>,
	},
	isNest: {
		type: Boolean,
		default: false,
	},
	basePath: {
		type: String,
		default: "",
	},
});

const getNoDropdownStyle = computed((): CSSProperties => {
	return {
		width: "100%",
		display: "flex",
		alignItems: "center",
	};
});

const getSubMenuIconStyle = computed((): CSSProperties => {
	return {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		margin: layout.value === "horizontal" ? "0 5px 0 0" : isCollapse.value ? "0 auto" : "0 5px 0 0",
	};
});

const textClass = computed(() => {
	const item = props.item;
	const baseClass = "w-full! text-inherit!";
	if (
		layout.value !== "horizontal" &&
		isCollapse.value &&
		!toRaw(item.meta.icon) &&
		((layout.value === "vertical" && item.parentId === null) || (layout.value === "mix" && item.pathList.length === 2))
	) {
		return `${baseClass} min-w-[54px]! text-center! px-3!`;
	}
	return baseClass;
});

const expandCloseIcon = computed(() => {
	if (!getConfig()?.MenuArrowIconNoTransition) return "";
	return {
		"expand-close-icon": useRenderIcon(EpArrowDown),
		"expand-open-icon": useRenderIcon(ArrowUp),
		"collapse-close-icon": useRenderIcon(ArrowRight),
		"collapse-open-icon": useRenderIcon(ArrowLeft),
	};
});

const onlyOneChild: menuType = ref(null);

function hasOneShowingChild(children: menuType[] = [], parent: menuType) {
	const showingChildren = children.filter((item: any) => {
		onlyOneChild.value = item;
		return true;
	});

	if (showingChildren[0]?.meta?.showParent) {
		return false;
	}

	if (showingChildren.length === 1) {
		return true;
	}

	if (showingChildren.length === 0) {
		onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
		return true;
	}
	return false;
}

function resolvePath(routePath) {
	const httpReg = /^http(s?):\/\//;
	if (httpReg.test(routePath) || httpReg.test(props.basePath)) {
		return routePath || props.basePath;
	} else {
		return posix.resolve(props.basePath, routePath);
	}
}

watchImmediate(
	() => props.item,
	(newItem) => {
		if (isUndefined(newItem?.meta?.icon)) {
			console.warn(` 警告！ 当前的item没有配置图标： `, newItem);
		}
	},
);
</script>

<template>
	<SidebarLinkItem
		v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)"
		:to="item"
	>
		<el-menu-item
			:index="resolvePath(onlyOneChild.path)"
			:class="{ 'submenu-title-noDropdown': !isNest }"
			:style="getNoDropdownStyle"
			v-bind="attrs"
		>
			<div v-if="toRaw(item.meta.icon)" class="sub-menu-icon" :style="getSubMenuIconStyle">
				<component :is="useRenderIcon(toRaw(onlyOneChild.meta.icon) || (item.meta && toRaw(item.meta.icon)))" />
			</div>
			<el-text
				v-if="
					(!item?.meta.icon && isCollapse && layout === 'vertical' && item?.pathList?.length === 1) ||
					(!onlyOneChild.meta.icon && isCollapse && layout === 'mix' && item?.pathList?.length === 2)
				"
				truncated
				class="w-full! px-3! min-w-[54px]! text-center! text-inherit!"
			>
				{{ transformI18n(onlyOneChild.meta.title) }}
			</el-text>

			<template #title>
				<div :style="getDivStyle">
					<ReText
						:tippyProps="{
							offset: [0, -10],
							theme: tooltipEffect,
						}"
						class="w-full! text-inherit!"
					>
						{{ transformI18n(onlyOneChild.meta.title) }}
					</ReText>
					<SidebarExtraIcon :extraIcon="onlyOneChild.meta.extraIcon" />
				</div>
			</template>
		</el-menu-item>
	</SidebarLinkItem>
	<el-sub-menu v-else ref="subMenu" teleported :index="resolvePath(item.path)" v-bind="expandCloseIcon">
		<template #title>
			<div v-if="toRaw(item.meta.icon)" :style="getSubMenuIconStyle" class="sub-menu-icon">
				<component :is="useRenderIcon(item.meta && toRaw(item.meta.icon))" />
			</div>
			<ReText
				v-if="
					layout === 'mix' && toRaw(item.meta.icon)
						? !isCollapse || item?.pathList?.length !== 2
						: !(layout === 'vertical' && isCollapse && toRaw(item.meta.icon) && item.parentId === null)
				"
				:tippyProps="{
					offset: [0, -10],
					theme: tooltipEffect,
				}"
				:class="textClass"
			>
				{{ transformI18n(item.meta.title) }}
			</ReText>
			<SidebarExtraIcon v-if="!isCollapse" :extraIcon="item.meta.extraIcon" />
		</template>

		<sidebar-item
			v-for="child in item.children"
			:key="child.path"
			:is-nest="true"
			:item="child"
			:base-path="resolvePath(child.path)"
			class="nest-menu"
		/>
	</el-sub-menu>
</template>
