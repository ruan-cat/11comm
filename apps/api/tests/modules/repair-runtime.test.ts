import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../../server/db", () => ({
	hasDatabaseUrl: vi.fn(),
	useDb: vi.fn(),
}));

const dbModule = await import("../../server/db");
const { getRepairRuntime } = await import("../../server/modules/repair/runtime");

const mockedHasDatabaseUrl = vi.mocked(dbModule.hasDatabaseUrl);
const mockedUseDb = vi.mocked(dbModule.useDb);

describe("repair runtime phase7 batch3", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("uses fallback runtime when database URL is absent", () => {
		mockedHasDatabaseUrl.mockReturnValue(false);
		const event = { context: {} } as never;

		const runtime = getRepairRuntime(event);

		expect(runtime).toBe(getRepairRuntime());
		expect(mockedUseDb).not.toHaveBeenCalled();
		expect((event as { context: Record<string, unknown> }).context.repairRuntime).toBeUndefined();
	});

	test("uses and caches DB runtime when database URL is present", async () => {
		const db = {} as never;
		mockedHasDatabaseUrl.mockReturnValue(true);
		mockedUseDb.mockReturnValue(db);
		const event = { context: {} } as never;

		const firstRuntime = getRepairRuntime(event);
		const secondRuntime = getRepairRuntime(event);
		const created = await firstRuntime.repository.createOwnerRepair({
			title: "Fallback write",
			context: "DB writes stay delegated in this slice",
		});

		expect(firstRuntime).toBe(secondRuntime);
		expect((event as { context: Record<string, unknown> }).context.repairRuntime).toBe(firstRuntime);
		expect(mockedUseDb).toHaveBeenCalledTimes(1);
		expect(created).toMatchObject({ repairId: expect.stringMatching(/^REPAIR_/), title: "Fallback write" });
	});
});
