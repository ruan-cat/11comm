/**
 * @file 合同收费列表接口测试
 * @description 测试 /api/property-manage/expense-manage/contracte-charge/list 接口
 */

import { test, expect, describe, beforeAll } from "vitest";
import { fetchNitroApi, checkNitroServer, NITRO_BASE_URL } from "setup-neon";

describe("合同收费列表接口测试", () => {
	beforeAll(async () => {
		// 检查 Nitro 服务器是否运行
		const isRunning = await checkNitroServer();
		if (!isRunning) {
			console.warn(`⚠️  Nitro 服务器未运行，请先运行 'pnpm dev' 启动服务器`);
			console.warn(`📡 预期服务器地址: ${NITRO_BASE_URL}`);
		}
	});

	test("POST /api/property-manage/expense-manage/contracte-charge/list - 获取合同收费列表", async () => {
		// 调用接口
		const response = await fetchNitroApi("/api/property-manage/expense-manage/contracte-charge/list", {
			method: "POST",
			body: JSON.stringify({
				page: 1,
				pageSize: 10,
			}),
		});

		// 验证响应状态
		expect(response.ok).toBe(true);

		// 解析响应数据
		const result = await response.json();

		// 验证响应结构
		expect(result).toBeDefined();

		console.log("✅ 合同收费列表接口测试通过");
	});
});
