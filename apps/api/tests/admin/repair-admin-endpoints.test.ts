import { describe, expect, test, vi } from "vitest";

import { getRepairRuntime } from "../../server/modules/repair/runtime";

import issuesListHandler from "../../server/routes/api/property-manage/repairs-manage/issues/list.post";
import repairsSettingListHandler from "../../server/routes/api/property-manage/repairs-manage/repairs-setting/list.post";
import repairsTodoListHandler from "../../server/routes/api/property-manage/repairs-manage/repairs-todo/list.post";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		readBody: vi.fn(),
	};
});

const { readBody } = await import("nitro/h3");
const mockedReadBody = vi.mocked(readBody);

describe("repair admin read-only adapters wave4a", () => {
	test("serves repairs todo list through the admin adapter", async () => {
		const response = await getRepairRuntime().adminAdapter.listRepairsTodo({ pageIndex: 1, pageSize: 10 });

		expect(response).toMatchObject({
			success: true,
			code: 200,
			data: { list: expect.any(Array), total: expect.any(Number), pageIndex: 1, pageSize: 10 },
		});
		expect(response.data.list[0]).toMatchObject({
			workOrderNumber: expect.any(String),
			repairType: expect.any(String),
			repairStatus: expect.any(String),
		});
	});

	test("serves repairs setting and issues read-only lists", async () => {
		const runtime = getRepairRuntime();
		const settings = await runtime.adminAdapter.listRepairsSettings({ pageIndex: 1, pageSize: 10 });
		const issues = await runtime.adminAdapter.listIssues({ pageIndex: 1, pageSize: 10 });

		expect(settings.data.list[0]).toMatchObject({ repairTypeName: expect.any(String) });
		expect(issues.data.list[0]).toMatchObject({ workOrderCode: expect.any(String) });
	});

	test("admin routes read request bodies and use the fallback runtime", async () => {
		mockedReadBody.mockResolvedValue({ pageIndex: 1, pageSize: 10 });

		const todo = await repairsTodoListHandler({ context: {} } as any);
		const settings = await repairsSettingListHandler({ context: {} } as any);
		const issues = await issuesListHandler({ context: {} } as any);

		expect(todo).toMatchObject({ success: true, code: 200, data: { list: expect.any(Array) } });
		expect(settings).toMatchObject({ success: true, code: 200, data: { list: expect.any(Array) } });
		expect(issues).toMatchObject({ success: true, code: 200, data: { list: expect.any(Array) } });
		expect(mockedReadBody).toHaveBeenCalledTimes(3);
	});
});
