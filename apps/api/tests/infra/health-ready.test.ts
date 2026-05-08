import { test, describe } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

import healthHandler from "../../server/routes/__nitro/health.get";
import readyHandler from "../../server/routes/__nitro/ready.get";

describe("api health and ready endpoints", () => {
	const snapshot = {
		comm_admin_11__DATABASE_URL: process.env.comm_admin_11__DATABASE_URL,
		DATABASE_URL: process.env.DATABASE_URL,
		NITRO_DATABASE_URL: process.env.NITRO_DATABASE_URL,
		RUN_PHASE7_DB_READINESS_CHECK: process.env.RUN_PHASE7_DB_READINESS_CHECK,
	};

	beforeEach(() => {
		delete process.env.comm_admin_11__DATABASE_URL;
		delete process.env.DATABASE_URL;
		delete process.env.NITRO_DATABASE_URL;
		delete process.env.RUN_PHASE7_DB_READINESS_CHECK;
	});

	afterEach(() => {
		restoreEnv("comm_admin_11__DATABASE_URL", snapshot.comm_admin_11__DATABASE_URL);
		restoreEnv("DATABASE_URL", snapshot.DATABASE_URL);
		restoreEnv("NITRO_DATABASE_URL", snapshot.NITRO_DATABASE_URL);
		restoreEnv("RUN_PHASE7_DB_READINESS_CHECK", snapshot.RUN_PHASE7_DB_READINESS_CHECK);
	});

	test("health stays available without database configuration", async () => {
		const response = await healthHandler({ context: {}, res: { headers: new Headers() } } as any);

		expect(response).toMatchObject({
			success: true,
			service: "@01s-11comm/api",
			status: "ok",
			checks: {
				database: {
					configured: false,
				},
			},
		});
	});

	test("ready fails clearly when database configuration is missing", async () => {
		const event = { context: {}, res: { headers: new Headers() } } as any;
		const response = await readyHandler(event);

		expect(event.res.status).toBe(503);
		expect(response).toMatchObject({
			success: false,
			ready: false,
			code: "DATABASE_CONFIG_MISSING",
			checks: {
				database: {
					configured: false,
					connected: false,
				},
			},
		});
	});

	test("ready reports configured database without probing it by default", async () => {
		process.env.NITRO_DATABASE_URL = "postgresql://configured";
		const execute = vi.fn().mockRejectedValue(new Error("ready must not probe database by default"));
		const event = {
			context: {
				db: {
					execute,
				},
			},
			res: { headers: new Headers() },
		} as any;

		const response = await readyHandler(event);

		expect(execute).not.toHaveBeenCalled();
		expect(event.res.status).toBe(200);
		expect(response).toMatchObject({
			success: true,
			ready: true,
			code: "READY_CONFIGURED",
			checks: {
				database: {
					configured: true,
					connected: null,
				},
			},
		});
	});

	test("ready distinguishes configured database even when no db instance is attached", async () => {
		process.env.NITRO_DATABASE_URL = "postgresql://configured";
		const event = { context: {}, res: { headers: new Headers() } } as any;

		const response = await readyHandler(event);

		expect(event.res.status).toBe(200);
		expect(response).toMatchObject({
			success: true,
			ready: true,
			code: "READY_CONFIGURED",
			checks: {
				database: {
					configured: true,
					connected: null,
				},
			},
		});
	});

	test("ready probes database connection, required tables, and migrations when phase7 DB readiness gate is enabled", async () => {
		process.env.NITRO_DATABASE_URL = "postgresql://configured";
		process.env.RUN_PHASE7_DB_READINESS_CHECK = "1";
		const execute = vi
			.fn()
			.mockResolvedValueOnce({ rows: [{ ok: 1 }] })
			.mockResolvedValueOnce({
				rows: [
					{ table_name: "cm_communities" },
					{ table_name: "ex_expense_items" },
					{ table_name: "ex_house_charges" },
					{ table_name: "hp_houses" },
					{ table_name: "rpt_expense_summaries" },
					{ table_name: "rpt_payment_details" },
				],
			})
			.mockResolvedValueOnce({ rows: [{ table_schema: "drizzle", table_name: "__drizzle_migrations" }] })
			.mockResolvedValueOnce({ rows: [{ applied_count: "2" }] });
		const event = {
			context: {
				db: {
					execute,
				},
			},
			res: { headers: new Headers() },
		} as any;

		const response = await readyHandler(event);

		expect(execute).toHaveBeenCalledTimes(4);
		expect(event.res.status).toBe(200);
		expect(response).toMatchObject({
			success: true,
			ready: true,
			code: "DB_READY",
			checks: {
				database: {
					configured: true,
					connected: true,
					schema: {
						requiredTablesPresent: true,
						missingTables: [],
					},
					migrations: {
						tablePresent: true,
						appliedCount: 2,
						expectedAppliedCount: 2,
						upToDate: true,
					},
				},
			},
		});
	});

	test("ready fails when phase7 DB readiness probe cannot find all required tables", async () => {
		process.env.NITRO_DATABASE_URL = "postgresql://configured";
		process.env.RUN_PHASE7_DB_READINESS_CHECK = "1";
		const execute = vi
			.fn()
			.mockResolvedValueOnce({ rows: [{ ok: 1 }] })
			.mockResolvedValueOnce({
				rows: [
					{ table_name: "cm_communities" },
					{ table_name: "ex_expense_items" },
					{ table_name: "hp_houses" },
					{ table_name: "rpt_expense_summaries" },
					{ table_name: "rpt_payment_details" },
				],
			})
			.mockResolvedValueOnce({ rows: [{ table_schema: "drizzle", table_name: "__drizzle_migrations" }] })
			.mockResolvedValueOnce({ rows: [{ applied_count: "2" }] });
		const event = {
			context: {
				db: {
					execute,
				},
			},
			res: { headers: new Headers() },
		} as any;

		const response = await readyHandler(event);

		expect(event.res.status).toBe(503);
		expect(response).toMatchObject({
			success: false,
			ready: false,
			code: "DATABASE_SCHEMA_MISSING",
			checks: {
				database: {
					configured: true,
					connected: true,
					schema: {
						requiredTablesPresent: false,
						missingTables: ["ex_house_charges"],
					},
				},
			},
		});
	});
});

function restoreEnv(name: string, value: string | undefined): void {
	if (value === undefined) {
		delete process.env[name];
		return;
	}
	process.env[name] = value;
}
