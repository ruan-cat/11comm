import { describe, expect, test, vi } from "vitest";

import { getPatrolRuntime } from "../../server/modules/patrol/runtime";

import patrolDetailListHandler from "../../server/routes/api/property-manage/patrol-manage/detail/list.post";
import patrolTaskListHandler from "../../server/routes/api/property-manage/patrol-manage/task/list.post";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		readBody: vi.fn(),
	};
});

const { readBody } = await import("nitro/h3");
const mockedReadBody = vi.mocked(readBody);

describe("patrol admin task detail adapters", () => {
	test("serves task and detail lists with JsonVO PageDTO shape through fallback runtime", async () => {
		const runtime = getPatrolRuntime();

		const tasks = await runtime.adminAdapter.listPatrolTasks({ pageIndex: 1, pageSize: 10 });
		const details = await runtime.adminAdapter.listPatrolDetails({ pageIndex: 1, pageSize: 10 });

		expect(tasks).toMatchObject({
			success: true,
			code: 200,
			data: { list: expect.any(Array), total: expect.any(Number), pageIndex: 1, pageSize: 10 },
		});
		expect(details).toMatchObject({
			success: true,
			code: 200,
			data: { list: expect.any(Array), total: expect.any(Number), pageIndex: 1, pageSize: 10 },
		});
	});

	test("task and detail routes read request bodies and use the fallback runtime", async () => {
		mockedReadBody.mockResolvedValue({ pageIndex: 1, pageSize: 10 });

		const task = await patrolTaskListHandler({ context: {} } as any);
		const detail = await patrolDetailListHandler({ context: {} } as any);

		expect(task).toMatchObject({ success: true, code: 200, data: { list: expect.any(Array) } });
		expect(detail).toMatchObject({ success: true, code: 200, data: { list: expect.any(Array) } });
		expect(mockedReadBody).toHaveBeenCalledTimes(2);
	});
});
