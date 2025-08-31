import { describe, it } from "vitest";
import { printFormat } from "@ruan-cat/utils";
import { getPersonnelScheduleList } from "./index";

describe("j4/排班表管理", () => {
	it("使用 getPersonnelScheduleList 接口 - 获取人员排班列表", async () => {
		const { execute, data } = getPersonnelScheduleList({
			onSuccess(data) {
				console.warn("getPersonnelScheduleList onSuccess", printFormat(data));
			},
			onError(error) {
				console.error("getPersonnelScheduleList onError", error);
			},
		});
		await execute({
			params: {
				month: 6,
				name: "李四",
				pageIndex: 1,
				pageSize: 10,
				shiftName: "早班",
				year: 2025,
			},
		});
		console.warn("查看简单的 data.value ", printFormat(data.value));
	});
});
