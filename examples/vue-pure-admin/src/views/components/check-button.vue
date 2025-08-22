<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "@/utils/message";
import { getKeyList } from "@pureadmin/utils";

defineOptions({
	name: "CheckButton"
});

const spaceSize = ref(20);
const size = ref("default");
const dynamicSize = ref();
const checked = ref(true);

const radio = ref("wait");
const radioBox = ref("complete");
const radioCustom = ref("progress");

const checkboxGroup = ref(["apple", "tomato"]);
const checkboxGroupBox = ref(["cucumber", "onion", "blueberry"]);
const checkboxGroupCustom = ref(["tomato", "watermelon", "strawberry"]);

/** 单选（可控制间距的按钮样式） */
const checkTag = ref([
	{
		title: "等待中",
		checked: false
	},
	{
		title: "进行中",
		checked: true
	},
	{
		title: "已完成",
		checked: false
	}
]);
const curTagMap = ref({});
function onChecked(tag, index) {
	if (size.value === "disabled") return;
	curTagMap.value[index] = Object.assign({
		...tag,
		checked: !tag.checked
	});
	checkTag.value.map(item => (item.checked = false));
	checkTag.value[index].checked = curTagMap.value[index].checked;
	const { title, checked } = curTagMap.value[index];
	message(checked ? `已选中${title}` : `取消选中${title}`, {
		type: "success"
	});
}

/** 多选（可控制间距的按钮样式） */
const checkGroupTag = ref([
	{
		title: "苹果",
		checked: true
	},
	{
		title: "西红柿",
		checked: true
	},
	{
		title: "香蕉",
		checked: false
	}
]);
const curTagGroupMap = ref({});
function onGroupChecked(tag, index) {
	if (size.value === "disabled") return;
	curTagGroupMap.value[index] = Object.assign({
		...tag,
		checked: !tag.checked
	});
	checkGroupTag.value[index].checked = curTagGroupMap.value[index].checked;
}

function onSingleChecked() {
	if (size.value === "disabled") return;
	checked.value = !checked.value;
}

watch(size, val => (val === "disabled" ? (dynamicSize.value = "default") : (dynamicSize.value = size.value)));
</script>

<template>
	<el-card shadow="never">
		<template #header>
			<div class="card-header">
				<el-space wrap :size="40">
					<span style="font-size: 16px; font-weight: 800"> 可选按钮 </span>
					<el-radio-group v-model="size">
						<el-radio value="large">大尺寸</el-radio>
						<el-radio value="default">默认尺寸</el-radio>
						<el-radio value="small">小尺寸</el-radio>
						<el-radio value="disabled">禁用</el-radio>
					</el-radio-group>
				</el-space>
			</div>
			<el-link
				class="mt-2"
				href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/check-button.vue"
				target="_blank"
			>
				代码位置 src/views/components/check-button.vue
			</el-link>
		</template>
		<div class="mb-2">单选（紧凑风格的按钮样式）</div>
		<el-radio-group v-model="radio" :size="dynamicSize" :disabled="size === 'disabled'">
			<el-radio-button value="wait">等待中</el-radio-button>
			<el-radio-button value="progress">进行中</el-radio-button>
			<el-radio-button value="complete">已完成</el-radio-button>
		</el-radio-group>
		<el-divider />

		<div class="mb-2">单选（带有边框）</div>
		<el-radio-group v-model="radioBox" :size="dynamicSize" :disabled="size === 'disabled'">
			<el-radio value="wait" border>等待中</el-radio>
			<el-radio value="progress" border>进行中</el-radio>
			<el-radio value="complete" border>已完成</el-radio>
		</el-radio-group>
		<el-divider />

		<div class="mb-2">单选（自定义内容）</div>
		<el-radio-group v-model="radioCustom" :size="dynamicSize" :disabled="size === 'disabled'">
			<el-radio-button value="wait">
				<span class="flex">
					<IconifyIconOnline icon="ri:progress-8-fill" class="mr-1" />
					等待中
				</span>
			</el-radio-button>
			<el-radio-button value="progress">
				<span class="flex">
					<IconifyIconOnline icon="ri:progress-6-line" class="mr-1" />
					进行中
				</span>
			</el-radio-button>
			<el-radio-button value="complete">
				<span class="flex">
					<IconifyIconOnline icon="ri:progress-8-line" class="mr-1" />
					已完成
				</span>
			</el-radio-button>
		</el-radio-group>
		<el-divider />

		<div class="mb-2">多选（紧凑风格的按钮样式）</div>
		<el-checkbox-group v-model="checkboxGroup" :size="dynamicSize" :disabled="size === 'disabled'">
			<el-checkbox-button value="apple">苹果</el-checkbox-button>
			<el-checkbox-button value="tomato">西红柿</el-checkbox-button>
			<el-checkbox-button value="banana">香蕉</el-checkbox-button>
		</el-checkbox-group>
		<el-divider />

		<div class="mb-2">多选（带有边框）</div>
		<el-checkbox-group v-model="checkboxGroupBox" :size="dynamicSize" :disabled="size === 'disabled'">
			<el-checkbox value="cucumber" border>黄瓜</el-checkbox>
			<el-checkbox value="onion" border>洋葱</el-checkbox>
			<el-checkbox value="blueberry" border>蓝莓</el-checkbox>
		</el-checkbox-group>
		<el-divider />

		<div class="mb-2">多选（来点不一样的体验）</div>
		<el-checkbox-group
			v-model="checkboxGroupCustom"
			class="pure-checkbox"
			:size="dynamicSize"
			:disabled="size === 'disabled'"
		>
			<el-checkbox-button value="tomato">
				<span class="flex">
					<IconifyIconOnline icon="streamline-emojis:tomato" class="mr-1" />
					番茄
				</span>
			</el-checkbox-button>
			<el-checkbox-button value="watermelon">
				<span class="flex">
					<IconifyIconOnline icon="streamline-emojis:watermelon-1" class="mr-1" />
					西瓜
				</span>
			</el-checkbox-button>
			<el-checkbox-button value="strawberry">
				<span class="flex">
					<IconifyIconOnline icon="streamline-emojis:strawberry-1" class="mr-1" />
					草莓
				</span>
			</el-checkbox-button>
		</el-checkbox-group>
		<el-divider />

		<div>可控制间距的按钮样式</div>
		<el-slider v-model="spaceSize" class="mb-2 w-[300px]!" :show-tooltip="false" :disabled="size === 'disabled'" />
		<div class="mb-2">单选</div>
		<el-space wrap :size="spaceSize">
			<el-check-tag
				v-for="(tag, index) in checkTag"
				:key="index"
				:class="['select-none', size === 'disabled' && 'tag-disabled', tag.checked && 'is-active']"
				:checked="tag.checked"
				@change="onChecked(tag, index)"
			>
				{{ tag.title }}
			</el-check-tag>
		</el-space>
		<div class="mb-2 mt-4">
			多选
			{{
				getKeyList(
					checkGroupTag.filter(tag => tag.checked),
					"title"
				)
			}}
		</div>
		<el-space wrap :size="spaceSize">
			<el-check-tag
				v-for="(tag, index) in checkGroupTag"
				:key="index"
				:class="['select-none', size === 'disabled' && 'tag-disabled', tag.checked && 'is-active']"
				:checked="tag.checked"
				@change="onGroupChecked(tag, index)"
			>
				{{ tag.title }}
			</el-check-tag>
		</el-space>
		<el-divider />

		<div class="mb-2">单个可选按钮</div>
		<el-check-tag
			:class="['select-none', size === 'disabled' && 'tag-disabled', checked && 'is-active']"
			:checked="checked"
			@change="onSingleChecked"
		>
			一个人也要努力 😊
		</el-check-tag>
	</el-card>
</template>

<style lang="scss" scoped>
:deep(.el-divider--horizontal) {
	margin: 17px 0;
}

:deep(.pure-checkbox) {
	.el-checkbox-button {
		/* 选中时的自定义样式 */
		&.is-checked {
			.el-checkbox-button__inner {
				color: var(--el-color-primary);
				background-color: var(--el-color-primary-light-8);
				border-color: transparent;
				border-left-color: #fff;
			}
		}

		/* 禁用时的自定义样式 */
		&.is-disabled {
			.el-checkbox-button__inner {
				color: var(--el-disabled-text-color);
				background-color: var(--el-button-disabled-bg-color, var(--el-fill-color-blank));
				border-color: var(--el-button-disabled-border-color, var(--el-border-color-light));
			}
		}
	}
}

/** 可控制间距的按钮禁用样式 */
.tag-disabled {
	color: var(--el-disabled-text-color);
	cursor: not-allowed;
	background-color: var(--el-color-info-light-9);

	&:hover {
		background-color: var(--el-color-info-light-9);
	}

	&.is-active {
		background-color: var(--el-color-primary-light-9);
	}
}
</style>
