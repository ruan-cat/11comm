# Vue2 到 Vue3 写法详细对比

## 1. 基础组件结构对比

### 1.1 Vue2 组件结构

```vue
<template>
	<view class="task-list">
		<view class="search-bar">
			<input v-model="searchForm.keyword" placeholder="搜索任务" />
		</view>
		<view class="task-item" v-for="task in filteredTasks" :key="task.id">
			{{ task.title }}
		</view>
	</view>
</template>

<script>
import { GetTaskList } from "@/api/task/task.js";

export default {
	name: "TaskList",
	data() {
		return {
			searchForm: { keyword: "" },
			taskList: [],
		};
	},
	computed: {
		filteredTasks() {
			return this.taskList.filter((task) => task.title.includes(this.searchForm.keyword));
		},
	},
	mounted() {
		this.loadTasks();
	},
	methods: {
		async loadTasks() {
			const result = await GetTaskList(this, {});
			this.taskList = result.tasks;
		},
	},
};
</script>

<style scoped>
.task-list {
	padding: 20rpx;
}
.search-bar {
	margin-bottom: 20rpx;
}
</style>
```

### 1.2 Vue3 组件结构

```vue
<template>
	<view class="p-4">
		<view class="mb-4">
			<input v-model="searchForm.keyword" placeholder="搜索任务" class="w-full p-2 border rounded" />
		</view>
		<view v-for="task in filteredTasks" :key="task.id" class="p-4 mb-2 bg-white rounded shadow">
			{{ task.title }}
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getTaskList } from "@/api/task";

// 页面配置
definePage({
	style: {
		navigationBarTitleText: "任务列表",
	},
});

// 类型定义
interface SearchForm {
	keyword: string;
}

interface Task {
	id: string;
	title: string;
	status: string;
}

// 响应式数据
const searchForm = ref<SearchForm>({ keyword: "" });
const taskList = ref<Task[]>([]);
const loading = ref(false);

// 计算属性
const filteredTasks = computed(() => {
	return taskList.value.filter((task: Task) => task.title.includes(searchForm.value.keyword));
});

// 方法
async function loadTasks() {
	loading.value = true;
	try {
		const result = await getTaskList({ page: 1, row: 10 });
		taskList.value = result.tasks;
	} catch (error) {
		console.error("加载失败:", error);
	} finally {
		loading.value = false;
	}
}

// 生命周期
onMounted(() => {
	console.log("组件已挂载");
	loadTasks();
});
</script>
```

## 2. 组件通信对比

### 2.1 Vue2 父子组件通信

**父组件**:

```vue
<template>
	<TaskItem v-for="task in taskList" :key="task.id" :task="task" @update="handleTaskUpdate" />
</template>

<script>
export default {
	methods: {
		handleTaskUpdate(taskId, newStatus) {
			const task = this.taskList.find((t) => t.id === taskId);
			if (task) {
				task.status = newStatus;
			}
		},
	},
};
</script>
```

**子组件**:

```vue
<script>
export default {
	props: {
		task: {
			type: Object,
			required: true,
		},
	},
	methods: {
		updateStatus(newStatus) {
			this.$emit("update", this.task.id, newStatus);
		},
	},
};
</script>
```

### 2.2 Vue3 父子组件通信

**父组件**:

```vue
<template>
	<TaskItem v-for="task in taskList" :key="task.id" :task="task" @update="handleTaskUpdate" />
</template>

<script setup lang="ts">
interface Task {
	id: string;
	status: string;
}

const taskList = ref<Task[]>([]);

const handleTaskUpdate = (taskId: string, newStatus: string) => {
	const task = taskList.value.find((t) => t.id === taskId);
	if (task) {
		task.status = newStatus;
	}
};
</script>
```

**子组件**:

```vue
<script setup lang="ts">
interface Task {
	id: string;
	title: string;
	status: string;
}

interface Props {
	task: Task;
}

interface Emits {
	update: [taskId: string, newStatus: string];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const updateStatus = (newStatus: string) => {
	emit("update", props.task.id, newStatus);
};
</script>
```

## 3. 事件处理对比

### 3.1 Vue2 事件处理

```vue
<template>
	<view>
		<button @click="handleSubmit">提交</button>
		<input @input="handleInput" v-model="formData.title" />
		<picker @change="handlePickerChange" :value="selectedIndex">
			<view>{{ options[selectedIndex] }}</view>
		</picker>
	</view>
</template>

<script>
export default {
	data() {
		return {
			formData: {
				title: "",
				category: "",
			},
			options: ["选项1", "选项2", "选项3"],
			selectedIndex: 0,
		};
	},
	methods: {
		handleSubmit() {
			if (!this.formData.title) {
				uni.showToast({
					title: "请输入标题",
					icon: "none",
				});
				return;
			}
			this.submitForm();
		},
		handleInput(e) {
			this.formData.title = e.target.value;
		},
		handlePickerChange(e) {
			this.selectedIndex = e.target.value;
			this.formData.category = this.options[this.selectedIndex];
		},
		async submitForm() {
			// 提交逻辑
		},
	},
};
</script>
```

### 3.2 Vue3 事件处理

```vue
<template>
	<view>
		<button @click="handleSubmit">提交</button>
		<input @input="handleInput" v-model="formData.title" />
		<picker @change="handlePickerChange" :value="selectedIndex">
			<view>{{ options[selectedIndex] }}</view>
		</picker>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useGlobalToast } from "@/hooks/useGlobalToast";

const toast = useGlobalToast();

interface FormData {
	title: string;
	category: string;
}

const formData = reactive<FormData>({
	title: "",
	category: "",
});

const options = ["选项1", "选项2", "选项3"];
const selectedIndex = ref(0);

const handleSubmit = () => {
	if (!formData.title) {
		toast.error("请输入标题");
		return;
	}
	submitForm();
};

const handleInput = (e: Event) => {
	const target = e.target as HTMLInputElement;
	formData.title = target.value;
};

const handlePickerChange = (e: any) => {
	selectedIndex.value = e.detail.value;
	formData.category = options[selectedIndex.value];
};

const submitForm = async () => {
	try {
		console.log("提交数据:", formData);
	} catch (error) {
		console.error("提交失败:", error);
	}
};
</script>
```

## 4. 页面配置对比

### 4.1 Vue2 pages.json 配置

```json
{
	"pages": [
		{
			"path": "pages/task/list",
			"style": {
				"navigationBarTitleText": "任务列表",
				"enablePullDownRefresh": true,
				"onReachBottomDistance": 50
			}
		}
	]
}
```

### 4.2 Vue3 约定式路由 + definePage

```vue
<!-- src/pages/task/list.vue -->
<script setup lang="ts">
// 页面配置（必须添加，否则页面标题显示为 "unibest"）
definePage({
	style: {
		navigationBarTitleText: "任务列表",
		enablePullDownRefresh: true,
		onReachBottomDistance: 50,
	},
});
</script>
```

## 5. 页面事件处理对比

### 5.1 Vue2 页面事件

```javascript
export default {
	// 下拉刷新
	onPullDownRefresh() {
		this.refreshData().then(() => {
			uni.stopPullDownRefresh();
		});
	},
	// 上拉加载
	onReachBottom() {
		if (!this.loading && this.hasMore) {
			this.loadMore();
		}
	},
	// 页面显示
	onShow() {
		this.refreshData();
	},
	methods: {
		async refreshData() {
			this.loading = true;
			try {
				const result = await GetTaskList(this, { page: 1 });
				this.taskList = result.tasks;
			} finally {
				this.loading = false;
			}
		},
		async loadMore() {
			this.loading = true;
			try {
				const result = await GetTaskList(this, { page: this.currentPage + 1 });
				this.taskList.push(...result.tasks);
				this.currentPage++;
			} finally {
				this.loading = false;
			}
		},
	},
};
```

### 5.2 Vue3 页面事件

```vue
<script setup lang="ts">
import { ref } from "vue";
import { onPullDownRefresh, onReachBottom, onShow } from "@dcloudio/uni-app";
import { getTaskList } from "@/api/task";

const currentPage = ref(1);
const hasMore = ref(true);
const taskList = ref<Task[]>([]);
const loading = ref(false);
const loadingMore = ref(false);

/** 刷新数据 */
async function refreshData() {
	loading.value = true;
	try {
		const result = await getTaskList({ page: 1 });
		taskList.value = result.tasks;
		currentPage.value = 1;
		hasMore.value = true;
	} catch (error) {
		console.error("刷新失败:", error);
	} finally {
		loading.value = false;
	}
}

/** 加载更多 */
async function loadMoreData() {
	if (loadingMore.value || !hasMore.value) return;

	loadingMore.value = true;
	try {
		const result = await getTaskList({ page: currentPage.value + 1 });
		if (result?.tasks?.length) {
			taskList.value.push(...result.tasks);
			currentPage.value++;
		} else {
			hasMore.value = false;
		}
	} catch (error) {
		console.error("加载更多失败:", error);
	} finally {
		loadingMore.value = false;
	}
}

/** 下拉刷新 */
onPullDownRefresh(async () => {
	try {
		await refreshData();
	} finally {
		uni.stopPullDownRefresh();
	}
});

/** 上拉加载 */
onReachBottom(() => {
	loadMoreData();
});

/** 页面显示 */
onShow(() => {
	refreshData();
});
</script>
```

## 6. 关键差异总结

| 特性        | Vue2 Options API         | Vue3 Composition API                       |
| :---------- | :----------------------- | :----------------------------------------- |
| 语法结构    | `export default { ... }` | `<script setup lang="ts">`                 |
| 响应式数据  | `data() { return {} }`   | `ref()` / `reactive()`                     |
| 访问数据    | `this.xxx`               | `xxx.value` (ref) / `xxx` (reactive)       |
| 计算属性    | `computed: { xxx() {} }` | `computed(() => ...)`                      |
| 方法定义    | `methods: { xxx() {} }`  | `function xxx() {}` 或 `const xxx = ()`    |
| 生命周期    | `mounted() {}`           | `onMounted(() => {})`                      |
| Props 定义  | `props: { ... }`         | `defineProps<Props>()`                     |
| Emits 定义  | `emits: ['update']`      | `defineEmits<Emits>()`                     |
| 类型系统    | JavaScript (无类型)      | TypeScript (完整类型)                      |
| this 上下文 | 必须使用 `this`          | 无 `this`，直接访问变量                    |
| 代码复用    | Mixins                   | Composables (组合式函数)                   |
| 页面配置    | `pages.json` 集中配置    | `definePage()` 组件内配置                  |
| 导入 API    | 无需导入                 | 需要显式导入 (`import { ref } from 'vue'`) |
