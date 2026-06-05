import { describe, expect, test } from "vitest";
import { createDetailTagTitle, isDetailRouteParameter, normalizeDetailRouteParameter } from "../detail-parameter";

describe("detail-parameter", () => {
	test("将详情页参数归一化为字符串参数", () => {
		const normalized = normalizeDetailRouteParameter({
			id: 666,
			name: "小明",
			age: 18,
		});

		expect(normalized).toEqual({
			id: "666",
			name: "小明",
			age: "18",
		});
	});

	test("识别缺少 id 的详情页参数", () => {
		expect(isDetailRouteParameter({ text: "missing-id" })).toBe(false);
	});

	test("根据详情页参数生成标签标题", () => {
		expect(createDetailTagTitle({ id: "888" })).toEqual({
			zh: "No.888 - 详情信息",
			en: "No.888 - DetailInfo",
		});
	});
});
