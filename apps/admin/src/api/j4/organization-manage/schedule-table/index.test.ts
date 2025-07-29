import { describe, it } from "vitest";
import { printFormat } from "@/utils/print";
import { getPersonnelScheduleList } from "./index";

describe("j4/排班表管理", () => {
	it("使用 getPersonnelScheduleList 接口 - 获取人员排班列表", () => {
		const { execute, data } = getPersonnelScheduleList({
			onError: (error) => console.warn("getPersonnelScheduleList 接口请求失败:", error),
		});

		execute({
			params: {
				month: 6,
				name: "李四",
				pageIndex: 1,
				pageSize: 10,
				shiftName: "早班",
				year: 2025,
			},
		});

		console.warn("getPersonnelScheduleList 接口响应数据:", printFormat(data));
	});
});
