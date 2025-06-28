import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { getCenterCommonMenu } from "./development-center";

describe("常用功能接口测试", () => {
	it("获取常用功能菜单", async () => {
		const { execute, data } = getCenterCommonMenu({
			onSuccess(data) {
				console.warn("获取常用功能菜单成功", printFormat(data));
			},
			onError(error) {},
		});

		// 主动的做接口请求 从回调函数内获取返回值 或者直接使用解构出来的响应式 data 对象
		await execute({
			data: {},
		});

		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
