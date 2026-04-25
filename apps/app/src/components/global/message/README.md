# GlobalMessage 全局弹窗组件

## 概述

GlobalMessage 是基于 `wot-design-uni` 的 `wd-message-box` 组件封装的全局弹窗组件，通过 Pinia 状态管理实现全局调用，用于显示提醒、确认、输入等交互场景。

## 组件特性

- 基于 `wd-message-box` 组件封装
- 支持提醒（alert）、确认（confirm）、输入（prompt）三种类型
- 支持成功/失败回调处理
- 自动页面路径检测，确保在正确页面显示
- 虚拟节点设计，不在 DOM 中创建额外层级
- 支持 Promise 链式调用

## 安装使用

### 1. 注册全局组件

在 `App.vue` 或根组件中注册：

```vue
<template>
	<div>
		<!-- 其他内容 -->
		<GlobalMessage />
	</div>
</template>
```

### 2. 在组件中使用

```typescript
import { useGlobalMessage } from "@/composables/useGlobalMessage";

const message = useGlobalMessage();
```

## API 文档

### 基础用法

```typescript
// 通用弹窗
message.show({
	title: "提示",
	message: "这是一条消息",
});

// 字符串参数
message.show("简单提示");
```

### 方法说明

#### show(option)

显示通用弹窗

```typescript
message.show({
	title: "标题",
	message: "内容",
	success: (res) => console.log("成功", res),
	fail: (res) => console.log("失败", res),
});
```

#### alert(option)

显示提醒弹窗（只有确认按钮）

```typescript
// 简单提醒
message.alert("操作完成");

// 详细配置
message.alert({
	title: "提醒",
	message: "请注意查看结果",
	success: (res) => {
		console.log("用户确认了");
	},
});
```

#### confirm(option)

显示确认弹窗（有确认和取消按钮）

```typescript
// 简单确认
message.confirm("确定要删除吗？");

// 详细配置
message.confirm({
	title: "确认删除",
	message: "删除后不可恢复，确定要删除吗？",
	success: (res) => {
		if (res.action === "confirm") {
			console.log("用户确认删除");
			// 执行删除操作
		}
	},
	fail: (res) => {
		console.log("用户取消删除");
	},
});
```

#### prompt(option)

显示输入弹窗（有输入框和确认取消按钮）

```typescript
// 简单输入
message.prompt("请输入您的姓名");

// 详细配置
message.prompt({
	title: "输入信息",
	msg: "请输入新的名称",
	inputValue: "默认值",
	inputPlaceholder: "请输入内容",
	success: (res) => {
		if (res.action === "confirm") {
			console.log("用户输入:", res.value);
		}
	},
	fail: (res) => {
		console.log("用户取消输入");
	},
});

// ✅ 带输入验证的正确写法
message.prompt({
	title: "暂停维修",
	msg: "请填写暂停原因",
	inputPlaceholder: "请输入暂停原因（必填）",
	inputValue: "",
	inputError: "暂停原因不能为空", // ✅ 错误信息通过 inputError 参数指定
	inputValidate: (value) => {
		// ⚠️ 重要：只能返回 boolean，不能返回字符串
		const strValue = String(value || "").trim();
		return strValue.length > 0; // ✅ 返回 boolean
	},
	success: (res) => {
		if (res.action === "confirm" && res.value) {
			console.log("用户输入:", String(res.value).trim());
		}
	},
});
```

##### ⚠️ prompt() 常见错误

**❌ 错误写法 1：`inputValidate` 返回字符串**

```typescript
message.prompt({
	inputValidate: (value) => {
		if (!value.trim()) {
			return "输入不能为空"; // ❌ 类型错误！只能返回 boolean
		}
		return true;
	},
});
```

**❌ 错误写法 2：误用 Promise 模式**

```typescript
// ❌ 错误：useGlobalMessage() 不返回 Promise
async function handleInput() {
	const value = await message.prompt({
		title: "输入信息",
	}); // ❌ 类型错误！返回 void，不是 Promise
}
```

**✅ 正确写法：使用回调模式**

```typescript
function handleInput() {
	message.prompt({
		title: "输入信息",
		msg: "请输入内容",
		inputError: "输入不能为空", // ✅ 错误信息
		inputValidate: (value) => {
			// ✅ 只返回 boolean
			return String(value || "").trim().length > 0;
		},
		success: (res) => {
			// ✅ 使用 success 回调处理结果
			if (res.action === "confirm" && res.value) {
				console.log("用户输入:", res.value);
			}
		},
	});
}
```

#### close()

手动关闭弹窗

```typescript
message.close();
```

## 参数说明

### GlobalMessageOptions

|       参数        |   类型   | 默认值 |                                                  说明                                                  |
| :---------------: | :------: | :----: | :----------------------------------------------------------------------------------------------------: |
|       title       |  string  |   -    |                                                弹窗标题                                                |
|    msg/message    |  string  |   -    |                                                弹窗内容                                                |
|       type        |  string  |   -    |                               弹窗类型：'alert' \| 'confirm' \| 'prompt'                               |
| showCancelButton  | boolean  |   -    |                                      是否显示取消按钮（自动设置）                                      |
|    inputValue     |  string  |   -    |                                      输入框默认值（prompt 类型）                                       |
| inputPlaceholder  |  string  |   -    |                                      输入框占位符（prompt 类型）                                       |
|   inputValidate   | Function |   -    | 输入框验证函数（prompt 类型）<br/>**⚠️ 只能返回 `boolean`**<br/>`(value: string \| number) => boolean` |
|    inputError     |  string  |   -    | 输入框验证失败的错误提示（prompt 类型）<br/>**⚠️ 错误信息通过此参数指定，不能从 `inputValidate` 返回** |
|   inputPattern    |  RegExp  |   -    |                                     输入框正则验证（prompt 类型）                                      |
|     maxlength     |  number  |   -    |                                     输入框最大长度（prompt 类型）                                      |
|      success      | Function |   -    |                                              成功回调函数                                              |
|       fail        | Function |   -    |                                              失败回调函数                                              |
| confirmButtonText |  string  | '确定' |                                              确认按钮文本                                              |
| cancelButtonText  |  string  | '取消' |                                              取消按钮文本                                              |

### MessageResult

回调函数接收的参数对象：

| 参数   | 类型   | 说明                            |
| ------ | ------ | ------------------------------- |
| action | string | 用户操作：'confirm' \| 'cancel' |
| value  | string | 输入框的值（仅 prompt 类型）    |

### 方法参数

所有方法都支持两种参数类型：

1. **字符串参数**：直接传入标题文本
2. **选项对象**：传入完整的 GlobalMessageOptions 配置

## 使用示例

### 基础示例

```typescript
export default {
	setup() {
		const message = useGlobalMessage();

		const showAlert = () => {
			message.alert("这是一个提醒");
		};

		const showConfirm = () => {
			message.confirm({
				title: "确认操作",
				message: "确定要继续吗？",
				success: (res) => {
					if (res.action === "confirm") {
						console.log("用户确认");
					}
				},
			});
		};

		const showPrompt = () => {
			message.prompt({
				title: "输入信息",
				message: "请输入您的姓名",
				success: (res) => {
					if (res.action === "confirm") {
						console.log("用户输入:", res.value);
					}
				},
			});
		};

		return {
			showAlert,
			showConfirm,
			showPrompt,
		};
	},
};
```

### 删除确认示例

```typescript
function handleDelete(item) {
	message.confirm({
		title: "确认删除",
		message: `确定要删除"${item.name}"吗？删除后不可恢复。`,
		success: async (res) => {
			if (res.action === "confirm") {
				try {
					await deleteItem(item.id);
					toast.success("删除成功");
					// 刷新列表
					await fetchList();
				} catch (error) {
					toast.error(`删除失败：${error.message}`);
				}
			}
		},
	});
}
```

### 批量操作示例

```typescript
function handleBatchDelete(selectedItems) {
	message.confirm({
		title: "批量删除",
		message: `确定要删除选中的 ${selectedItems.length} 个项目吗？`,
		success: async (res) => {
			if (res.action === "confirm") {
				const loading = useGlobalLoading();

				try {
					loading.loading("删除中...");
					await batchDeleteItems(selectedItems.map((item) => item.id));
					toast.success("批量删除成功");
					await fetchList();
				} catch (error) {
					toast.error("批量删除失败");
				} finally {
					loading.close();
				}
			}
		},
	});
}
```

### 表单验证示例

```typescript
function handleSubmit() {
	// 表单验证失败时的提醒
	if (!formData.name) {
		message.alert({
			title: "验证失败",
			message: "请输入姓名后再提交",
			success: () => {
				// 聚焦到输入框
				document.getElementById("name-input").focus();
			},
		});
		return;
	}

	// 提交前确认
	message.confirm({
		title: "确认提交",
		message: "确定要提交表单吗？",
		success: async (res) => {
			if (res.action === "confirm") {
				await submitForm(formData);
			}
		},
	});
}
```

### 修改名称示例

```typescript
function handleEditName(item) {
	message.prompt({
		title: "修改名称",
		message: "请输入新的名称",
		inputValue: item.name,
		inputPlaceholder: "请输入名称",
		success: async (res) => {
			if (res.action === "confirm") {
				const newName = res.value.trim();

				if (!newName) {
					toast.error("名称不能为空");
					return;
				}

				if (newName === item.name) {
					toast.info("名称未改变");
					return;
				}

				try {
					await updateItemName(item.id, newName);
					toast.success("修改成功");
					item.name = newName;
				} catch (error) {
					toast.error(`修改失败：${error.message}`);
				}
			}
		},
	});
}
```

### 退出登录示例

```typescript
function handleLogout() {
	message.confirm({
		title: "退出登录",
		message: "确定要退出当前账号吗？",
		confirmButtonText: "退出",
		cancelButtonText: "取消",
		success: async (res) => {
			if (res.action === "confirm") {
				try {
					await logout();
					// 清除本地数据
					clearUserData();
					// 跳转到登录页
					router.push("/login");
				} catch (error) {
					toast.error("退出失败");
				}
			}
		},
	});
}
```

### 复杂交互示例

```typescript
function handleComplexOperation() {
	// 第一步：确认是否继续
	message.confirm({
		title: "操作确认",
		message: "此操作需要多个步骤，确定要继续吗？",
		success: (res) => {
			if (res.action === "confirm") {
				// 第二步：输入验证码
				message.prompt({
					title: "安全验证",
					message: "请输入验证码",
					inputPlaceholder: "请输入6位验证码",
					success: async (res) => {
						if (res.action === "confirm") {
							const code = res.value;

							if (!/^\d{6}$/.test(code)) {
								message.alert({
									title: "验证失败",
									message: "请输入6位数字验证码",
									success: () => {
										// 重新输入
										handleComplexOperation();
									},
								});
								return;
							}

							// 第三步：最终确认
							message.confirm({
								title: "最终确认",
								message: "验证通过，确定要执行操作吗？",
								success: async (res) => {
									if (res.action === "confirm") {
										try {
											await executeComplexOperation(code);
											toast.success("操作成功");
										} catch (error) {
											toast.error(`操作失败：${error.message}`);
										}
									}
								},
							});
						}
					},
				});
			}
		},
	});
}
```

## 实现原理

### 状态管理

- 使用 Pinia 管理全局状态
- 状态包含：`messageOptions`（弹窗配置）、`currentPage`（当前页面路径）

### 页面检测机制

- 调用弹窗方法时记录当前页面路径
- 组件监听状态变化时验证页面路径
- 确保弹窗在正确的页面显示

### Promise 处理

- 使用 `wd-message-box` 的 Promise 接口
- 自动处理成功和失败回调
- 支持链式调用

### 组件配置

```typescript
export default {
	options: {
		virtualHost: true, // 虚拟节点
		addGlobalClass: true, // 支持全局样式
		styleIsolation: "shared", // 样式隔离共享
	},
};
```

## 最佳实践

1. **合理选择弹窗类型**

   ```typescript
   // ✅ 根据场景选择
   message.alert("操作完成"); // 仅通知
   message.confirm("确定删除？"); // 需要确认
   message.prompt("输入名称"); // 需要输入
   ```

2. **提供清晰的标题和内容**

   ```typescript
   // ✅ 清晰明确
   message.confirm({
   	title: "删除确认",
   	message: "确定要删除这个文件吗？删除后无法恢复。",
   });

   // ❌ 模糊不清
   message.confirm("确定吗？");
   ```

3. **正确处理回调**

   ```typescript
   // ✅ 完整的回调处理
   message.confirm({
   	title: "确认操作",
   	message: "确定要继续吗？",
   	success: (res) => {
   		if (res.action === "confirm") {
   			// 处理确认
   		}
   	},
   	fail: (res) => {
   		if (res.action === "cancel") {
   			// 处理取消
   		}
   	},
   });
   ```

4. **输入验证（⚠️ 重要）**

   ```typescript
   // ✅ 正确：使用 inputValidate + inputError
   message.prompt({
   	title: "输入信息",
   	msg: "请输入内容",
   	inputError: "输入不能为空", // ✅ 错误信息
   	inputValidate: (value) => {
   		// ⚠️ 只能返回 boolean
   		return String(value || "").trim().length > 0;
   	},
   	success: (res) => {
   		if (res.action === "confirm") {
   			// 验证已通过，直接使用
   			console.log("用户输入:", res.value);
   		}
   	},
   });

   // ❌ 错误：inputValidate 返回字符串
   message.prompt({
   	inputValidate: (value) => {
   		if (!value.trim()) {
   			return "输入不能为空"; // ❌ 类型错误！
   		}
   		return true;
   	},
   });

   // ❌ 错误：在回调中验证（应该用 inputValidate）
   message.prompt({
   	success: (res) => {
   		if (res.action === "confirm") {
   			const value = res.value.trim();
   			if (!value) {
   				toast.error("输入不能为空"); // ❌ 太晚了！
   			}
   		}
   	},
   });
   ```

5. **错误处理**
   ```typescript
   // ✅ 完整的错误处理
   message.confirm({
   	title: "确认操作",
   	success: async (res) => {
   		if (res.action === "confirm") {
   			try {
   				await doSomething();
   				toast.success("操作成功");
   			} catch (error) {
   				toast.error(`操作失败：${error.message}`);
   			}
   		}
   	},
   });
   ```

## 使用场景

1. **确认操作**：删除、修改、提交等重要操作
2. **信息提醒**：操作完成、错误提示、注意事项
3. **数据输入**：快速输入、修改名称、设置参数
4. **流程控制**：多步骤操作、条件判断
5. **安全验证**：密码确认、验证码输入

## 注意事项

1. **回调函数处理**：确保正确处理 success 和 fail 回调
2. **输入验证**：prompt 类型要验证用户输入
3. **页面路径检测**：弹窗会自动在对应页面显示
4. **单例模式**：同时只能显示一个弹窗
5. **按钮样式**：默认按钮为非圆角样式
6. **异步操作**：在回调中执行异步操作要进行错误处理

## 与其他组件结合使用

```typescript
// 与 GlobalLoading 和 GlobalToast 结合使用
function handleCompleteOperation() {
	message.confirm({
		title: "确认操作",
		msg: "确定要执行这个操作吗？",
		success: async (res) => {
			if (res.action === "confirm") {
				const loading = useGlobalLoading();
				const toast = useGlobalToast();

				try {
					loading.loading("处理中...");
					await performOperation();
					toast.success("操作成功");
				} catch (error) {
					toast.error("操作失败");
				} finally {
					loading.close();
				}
			}
		},
	});
}
```

## ⚠️ 常见类型错误和解决方案

### 错误 1: `inputValidate` 返回类型错误

**错误代码**:

```typescript
message.prompt({
	inputValidate: (value: string) => {
		if (!value || !value.trim()) {
			return "暂停原因不能为空"; // ❌ Type Error
		}
		return true;
	},
});
```

**TypeScript 错误信息**:

```plain
error TS2322: Type '(value: string) => true | "暂停原因不能为空"' is not assignable to type 'InputValidate'.
  Type 'string | boolean' is not assignable to type 'boolean'.
    Type 'string' is not assignable to type 'boolean'.
```

**根本原因**:

- wot-design-uni 的 `InputValidate` 类型定义为 `(value: string | number) => boolean`
- **只能返回 `boolean`，不能返回字符串**
- 错误信息必须通过 `inputError` 参数指定

**✅ 正确解决方案**:

```typescript
message.prompt({
	inputError: "暂停原因不能为空", // ✅ 错误信息通过此参数指定
	inputValidate: (value) => {
		// ✅ 只返回 boolean
		const strValue = String(value || "").trim();
		return strValue.length > 0;
	},
	success: (res) => {
		if (res.action === "confirm" && res.value) {
			console.log("用户输入:", String(res.value).trim());
		}
	},
});
```

---

### 错误 2: 误用 Promise 模式

**错误代码**:

```typescript
async function handleStopRepair(item: RepairOrder) {
	try {
		const value = await message.prompt({
			// ❌ Type Error
			title: "暂停维修",
			msg: "请填写暂停原因",
		});

		await stopRepair({
			remark: value.trim(), // ❌ Property 'trim' does not exist on type 'void'
		});
	} catch (error) {
		console.error(error);
	}
}
```

**TypeScript 错误信息**:

```plain
error TS2339: Property 'trim' does not exist on type 'void'.
```

**根本原因**:

- 项目的 `useGlobalMessage()` **不返回 Promise**，返回 `void`
- wot-design-uni 的原生 API 支持 Promise，但项目封装使用回调模式
- 必须使用 `success` 回调处理结果

**✅ 正确解决方案**:

```typescript
function handleStopRepair(item: RepairOrder) {
	message.prompt({
		title: "暂停维修",
		msg: "请填写暂停原因",
		inputPlaceholder: "请输入暂停原因（必填）",
		inputValue: "",
		inputError: "暂停原因不能为空",
		inputValidate: (value) => {
			const strValue = String(value || "").trim();
			return strValue.length > 0;
		},
		success: (res) => {
			// ✅ 使用 success 回调
			if (res.action === "confirm" && res.value) {
				stopRepair({
					repairId: item.repairId!,
					communityId: item.communityId,
					remark: String(res.value).trim(),
				}).catch((error) => {
					console.error("暂停维修失败:", error);
				});
			}
		},
	});
}
```

---

### 错误 3: 参数名称使用错误

**错误代码**:

```typescript
message.prompt({
	title: "输入信息",
	message: "请输入内容", // ❌ 应该用 msg
	success: (res) => {
		console.log(res.value);
	},
});
```

**问题**:

- 项目中应使用 `msg` 而不是 `message` 作为弹窗内容参数
- 虽然类型定义中两者都支持，但推荐统一使用 `msg`

**✅ 正确写法**:

```typescript
message.prompt({
	title: "输入信息",
	msg: "请输入内容", // ✅ 使用 msg
	success: (res) => {
		console.log(res.value);
	},
});
```

---

### 错误 4: 类型转换缺失

**潜在问题代码**:

```typescript
message.prompt({
	success: (res) => {
		if (res.action === "confirm" && res.value) {
			// res.value 类型为 string | number | undefined
			const remark = res.value.trim(); // ❌ 可能出错
		}
	},
});
```

**问题**:

- `res.value` 的类型是 `string | number | undefined`
- 直接调用 `.trim()` 可能在 `number` 类型时报错

**✅ 安全写法**:

```typescript
message.prompt({
	success: (res) => {
		if (res.action === "confirm" && res.value) {
			// ✅ 显式转换为字符串
			const remark = String(res.value).trim();
			console.log("用户输入:", remark);
		}
	},
});
```

---

## 类型错误快速排查清单

当遇到 `message.prompt()` 相关的类型错误时，按以下顺序检查：

1. **`inputValidate` 是否只返回 `boolean`？**
   - ✅ 正确：`return value.trim().length > 0`
   - ❌ 错误：`return "输入不能为空"`

2. **错误信息是否通过 `inputError` 参数指定？**
   - ✅ 正确：`inputError: "输入不能为空"`
   - ❌ 错误：从 `inputValidate` 返回字符串

3. **是否使用了 `await message.prompt()`？**
   - ✅ 正确：使用 `success` 回调
   - ❌ 错误：`const value = await message.prompt(...)`

4. **`res.value` 是否进行了类型转换？**
   - ✅ 正确：`String(res.value).trim()`
   - ❌ 风险：直接 `res.value.trim()`

5. **参数名是否正确？**
   - ✅ 正确：`msg: "弹窗内容"`
   - ⚠️ 可用但不推荐：`message: "弹窗内容"`

---

## 参考链接

- [wot-design-uni MessageBox 文档](https://wot-ui.cn/components/message-box.html)
- [InputValidate 类型定义](https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/message-box.md)
- [useGlobalMessage 实现](../../../hooks/useGlobalMessage.ts)
