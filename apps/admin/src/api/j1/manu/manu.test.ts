import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { addGroupCatalog } from "./manu";

describe("j1/菜单管理/菜单目录", () => {
	it("使用 body 接口 - 添加对应菜单组", async () => {
		const { execute, data } = addGroupCatalog({
			onSuccess(data) {
				console.warn("addGroupCatalog onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("addGroupCatalog onError", error);
			},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {
				caId: "102022022695140000",
				gid: "802021031653410000",
				storeType: "800900000000",
			},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
