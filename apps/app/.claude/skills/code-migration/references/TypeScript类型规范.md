# TypeScript 类型定义规范

## 1. 页面组件类型定义

### 1.1 业务实体类型

```typescript
// types/task.ts
export interface Task {
	id: string;
	title: string;
	description: string;
	status: "pending" | "processing" | "completed" | "cancelled";
	priority: "low" | "medium" | "high";
	assigneeId: string;
	assigneeName: string;
	createTime: string;
	updateTime: string;
	dueDate?: string;
	attachments?: Attachment[];
}

export interface Attachment {
	id: string;
	name: string;
	url: string;
	type: string;
	size: number;
}
```

### 1.2 请求参数类型

```typescript
// types/task.ts
export interface TaskListParams {
	page: number;
	pageSize: number;
	status?: string;
	keyword?: string;
	assigneeId?: string;
	startDate?: string;
	endDate?: string;
}

export interface CreateTaskReq {
	title: string;
	description: string;
	priority: Task["priority"];
	assigneeId: string;
	dueDate?: string;
}

export interface UpdateTaskReq {
	id: string;
	title?: string;
	description?: string;
	status?: Task["status"];
	priority?: Task["priority"];
}
```

### 1.3 响应数据类型

```typescript
// types/task.ts
export interface TaskListResponse {
	list: Task[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface TaskDetailResponse {
	task: Task;
	relatedTasks?: Task[];
	comments?: Comment[];
}
```

## 2. 组件 Props 和 Emits 类型

### 2.1 Props 类型定义

```typescript
<script setup lang="ts">
// 方式 1: interface 定义（推荐）
interface Props {
  task: Task
  editable?: boolean
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  showActions: true
})

// 方式 2: 泛型字面量类型
const props = withDefaults(defineProps<{
  task: Task
  editable?: boolean
  showActions?: boolean
}>(), {
  editable: false,
  showActions: true
})
</script>
```

### 2.2 Emits 类型定义

```typescript
<script setup lang="ts">
// 方式 1: interface 定义（推荐）
interface Emits {
  update: [task: Task]
  delete: [taskId: string]
  statusChange: [taskId: string, newStatus: Task['status']]
}

const emit = defineEmits<Emits>()

// 方式 2: 函数签名类型
const emit = defineEmits<{
  (e: 'update', task: Task): void
  (e: 'delete', taskId: string): void
  (e: 'statusChange', taskId: string, newStatus: Task['status']): void
}>()

// 使用
const handleStatusChange = (newStatus: Task['status']) => {
  emit('statusChange', props.task.id, newStatus)
}
</script>
```

### 2.3 完整组件类型示例

```typescript
<script setup lang="ts">
import type { Task } from '@/types/task'

/** Props 定义 */
interface Props {
  /** 任务对象 */
  task: Task
  /** 是否可编辑 */
  editable?: boolean
  /** 是否显示操作按钮 */
  showActions?: boolean
  /** 自定义样式类 */
  customClass?: string
}

/** Emits 定义 */
interface Emits {
  /** 更新任务 */
  update: [task: Task]
  /** 删除任务 */
  delete: [taskId: string]
  /** 状态变更 */
  statusChange: [taskId: string, newStatus: Task['status']]
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  showActions: true,
  customClass: ''
})

const emit = defineEmits<Emits>()

/** 处理状态变更 */
const handleStatusChange = (newStatus: Task['status']) => {
  emit('statusChange', props.task.id, newStatus)
}

/** 处理删除 */
const handleDelete = () => {
  emit('delete', props.task.id)
}
</script>
```

## 3. 响应式数据类型

### 3.1 ref 类型定义

```typescript
<script setup lang="ts">
import { ref } from 'vue'

// ✅ 推荐：显式类型注解
const count = ref<number>(0)
const name = ref<string>('')
const user = ref<User | null>(null)
const taskList = ref<Task[]>([])

// ✅ 类型推导（简单类型）
const count = ref(0)         // 推导为 Ref<number>
const name = ref('')         // 推导为 Ref<string>
const enabled = ref(true)    // 推导为 Ref<boolean>

// ❌ 避免：复杂类型不显式注解
const user = ref(null)       // 推导为 Ref<null>，后续赋值会报错
const taskList = ref([])     // 推导为 Ref<never[]>，后续赋值会报错

// ✅ 正确：复杂类型必须显式注解
const user = ref<User | null>(null)
const taskList = ref<Task[]>([])
</script>
```

### 3.2 reactive 类型定义

```typescript
<script setup lang="ts">
import { reactive } from 'vue'

// ✅ 推荐：interface 定义类型
interface FormData {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  assigneeId: string
}

const formData = reactive<FormData>({
  title: '',
  description: '',
  priority: 'medium',
  assigneeId: ''
})

// ✅ 类型推导（完整对象）
const formData = reactive({
  title: '',
  description: '',
  priority: 'medium' as 'low' | 'medium' | 'high'
})

// ❌ 避免：部分属性缺失
const formData = reactive<Partial<FormData>>({
  title: ''
})  // 其他属性变成可选，可能导致运行时错误
</script>
```

### 3.3 computed 类型定义

```typescript
<script setup lang="ts">
import { ref, computed } from 'vue'

const taskList = ref<Task[]>([])

// ✅ 类型推导
const completedTasks = computed(() =>
  taskList.value.filter(task => task.status === 'completed')
)  // 推导为 ComputedRef<Task[]>

// ✅ 显式类型注解
const taskCount = computed<number>(() => taskList.value.length)

// ✅ 复杂计算类型
interface TaskStatistics {
  total: number
  completed: number
  pending: number
}

const taskStats = computed<TaskStatistics>(() => ({
  total: taskList.value.length,
  completed: taskList.value.filter(t => t.status === 'completed').length,
  pending: taskList.value.filter(t => t.status === 'pending').length
}))
</script>
```

## 4. 函数类型定义

### 4.1 普通函数类型

```typescript
<script setup lang="ts">
/** 加载任务列表 */
async function loadTasks(params: TaskListParams): Promise<TaskListResponse> {
  const result = await getTaskList(params)
  return result
}

/** 更新任务状态 */
function updateTaskStatus(taskId: string, status: Task['status']): void {
  const task = taskList.value.find(t => t.id === taskId)
  if (task) {
    task.status = status
  }
}

/** 格式化日期 */
function formatDate(date: string | number | Date, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}
</script>
```

### 4.2 事件处理函数类型

```typescript
<script setup lang="ts">
import { useGlobalToast } from "@/hooks/useGlobalToast";

const toast = useGlobalToast();

/** 处理输入事件 */
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  formData.title = target.value
}

/** 处理 uni-app picker 事件 */
const handlePickerChange = (e: any) => {
  const index = e.detail.value
  formData.priority = priorityOptions[index].value
}

/** 处理提交 */
const handleSubmit = async () => {
  try {
    await submitTask(formData)
    toast.success('提交成功')
  } catch (error) {
    console.error('提交失败:', error)
  }
}
</script>
```

### 4.3 回调函数类型

```typescript
<script setup lang="ts">
/** 请求成功回调 */
type OnSuccess<T> = (data: T) => void

/** 请求失败回调 */
type OnError = (error: Error) => void

/** 带回调的请求函数 */
async function fetchData<T>(
  requestFn: () => Promise<T>,
  onSuccess?: OnSuccess<T>,
  onError?: OnError
): Promise<void> {
  try {
    const data = await requestFn()
    onSuccess?.(data)
  } catch (error) {
    onError?.(error as Error)
  }
}

// 使用
fetchData(
  () => getTaskList({ page: 1, row: 10 }),
  (data) => {
    console.log('成功:', data)
    taskList.value = data.list
  },
  (error) => {
    console.error('失败:', error)
  }
)
</script>
```

## 5. 工具类型使用

### 5.1 Partial / Required

```typescript
// Partial: 所有属性变为可选
function updateTask(id: string, updates: Partial<Task>): void {
	const task = taskList.value.find((t) => t.id === id);
	if (task) {
		Object.assign(task, updates);
	}
}

// Required: 所有属性变为必需
function validateTask(task: Required<Task>): boolean {
	return task.title.length > 0 && task.assigneeId.length > 0;
}
```

### 5.2 Pick / Omit

```typescript
// Pick: 选择部分属性
type TaskSummary = Pick<Task, "id" | "title" | "status">;

const summary: TaskSummary = {
	id: "1",
	title: "任务标题",
	status: "pending",
};

// Omit: 排除部分属性
type CreateTaskData = Omit<Task, "id" | "createTime" | "updateTime">;

const newTask: CreateTaskData = {
	title: "新任务",
	description: "描述",
	status: "pending",
	priority: "medium",
	assigneeId: "user1",
	assigneeName: "用户1",
};
```

### 5.3 Record / Extract / Exclude

```typescript
// Record: 创建对象类型
type TaskStatusMap = Record<Task["status"], string>;

const statusLabels: TaskStatusMap = {
	pending: "待处理",
	processing: "处理中",
	completed: "已完成",
	cancelled: "已取消",
};

// Extract: 提取特定类型
type CompletedStatus = Extract<Task["status"], "completed" | "cancelled">;
const status: CompletedStatus = "completed"; // 只能是 'completed' 或 'cancelled'

// Exclude: 排除特定类型
type ActiveStatus = Exclude<Task["status"], "completed" | "cancelled">;
const activeStatus: ActiveStatus = "pending"; // 不能是 'completed' 或 'cancelled'
```

### 5.4 ReturnType / Parameters

```typescript
// ReturnType: 获取函数返回值类型
async function getTaskDetail(taskId: string) {
	return await fetchTaskDetail(taskId);
}

type TaskDetailResult = ReturnType<typeof getTaskDetail>;
// 等价于 Promise<TaskDetailResponse>

type SyncResult = ReturnType<() => Task>;
// 等价于 Task

// Parameters: 获取函数参数类型
type TaskDetailParams = Parameters<typeof getTaskDetail>;
// 等价于 [taskId: string]
```

## 6. 类型断言和类型守卫

### 6.1 类型断言

```typescript
<script setup lang="ts">
// as 断言
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  console.log(target.value)
}

// 非空断言
const user = getUserInfo()
console.log(user!.name)  // 断言 user 不为 null/undefined

// 双重断言（谨慎使用）
const data = response as unknown as Task
</script>
```

### 6.2 类型守卫

```typescript
<script setup lang="ts">
// typeof 类型守卫
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()
  } else {
    return value.toFixed(2)
  }
}

// 自定义类型守卫
function isTask(obj: any): obj is Task {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string'
}

function handleData(data: unknown) {
  if (isTask(data)) {
    console.log(data.title)  // TypeScript 知道 data 是 Task 类型
  }
}
</script>
```

## 7. 泛型使用

### 7.1 泛型函数

```typescript
/** 泛型数组过滤函数 */
function filterArray<T>(array: T[], predicate: (item: T) => boolean): T[] {
	return array.filter(predicate);
}

// 使用
const completedTasks = filterArray(taskList.value, (task) => task.status === "completed");

/** 泛型请求包装 */
async function request<T>(url: string, options?: RequestOptions): Promise<T> {
	const response = await fetch(url, options);
	return response.json() as Promise<T>;
}

// 使用
const tasks = await request<Task[]>("/api/tasks");
```

### 7.2 泛型接口

```typescript
/** 泛型响应接口 */
interface ApiResponse<T> {
	success: boolean;
	code: string;
	message: string;
	data: T;
	timestamp: number;
}

/** 泛型分页响应 */
interface PaginationResponse<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

// 使用
const taskResponse: ApiResponse<PaginationResponse<Task>> = await getTaskList();
const userResponse: ApiResponse<User> = await getUserInfo();
```

### 7.3 泛型约束

```typescript
/** 约束泛型必须有 id 属性 */
interface HasId {
	id: string;
}

function findById<T extends HasId>(items: T[], id: string): T | undefined {
	return items.find((item) => item.id === id);
}

// 使用
const task = findById(taskList.value, "task-1"); // ✅ Task 有 id 属性
const user = findById(userList.value, "user-1"); // ✅ User 有 id 属性
```

## 8. 类型定义最佳实践

### 8.1 避免使用 any

```typescript
// ❌ 避免
function processData(data: any) {
	return data.value;
}

// ✅ 使用 unknown
function processData(data: unknown) {
	if (typeof data === "object" && data !== null && "value" in data) {
		return (data as { value: string }).value;
	}
	return null;
}

// ✅ 使用泛型
function processData<T>(data: T): T {
	return data;
}
```

### 8.2 合理使用类型别名

```typescript
// ✅ 推荐：复杂类型使用 type 别名
type TaskStatus = "pending" | "processing" | "completed" | "cancelled";
type TaskPriority = "low" | "medium" | "high";
type TaskCallback = (task: Task) => void;

// ✅ 推荐：对象类型使用 interface
interface Task {
	id: string;
	title: string;
	status: TaskStatus;
	priority: TaskPriority;
}
```

### 8.3 类型导入导出

```typescript
// types/task.ts
export interface Task {
  id: string
  title: string
}

export type TaskStatus = 'pending' | 'completed'

// 组件中使用
<script setup lang="ts">
import type { Task, TaskStatus } from '@/types/task'
// 或
import { type Task, type TaskStatus } from '@/types/task'
</script>
```

## 9. 类型检查清单

- [ ] **基础类型**
  - [ ] 所有 `ref` 复杂类型显式注解
  - [ ] 所有 `reactive` 对象类型定义
  - [ ] 所有 `computed` 复杂返回值类型注解

- [ ] **组件类型**
  - [ ] Props 完整类型定义
  - [ ] Emits 完整类型定义
  - [ ] 模板引用 (ref) 正确类型

- [ ] **函数类型**
  - [ ] 所有函数参数类型注解
  - [ ] 所有函数返回值类型注解
  - [ ] 异步函数返回 Promise 类型

- [ ] **类型安全**
  - [ ] 避免使用 `any` 类型
  - [ ] 合理使用类型断言
  - [ ] 提供必要的类型守卫

- [ ] **代码质量**
  - [ ] 运行 `pnpm type-check` 无错误
  - [ ] 编辑器无类型错误提示
  - [ ] 类型定义与业务逻辑匹配
