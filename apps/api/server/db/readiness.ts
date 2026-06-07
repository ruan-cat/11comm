import { sql } from "drizzle-orm";
import type { DbType } from "./index";

export const phase7RequiredDatabaseTables = [
	"cm_communities",
	"ex_expense_items",
	"ex_house_charges",
	"hp_houses",
	"rpt_expense_summaries",
	"rpt_payment_details",
	"ct_upload_sessions",
	"ct_upload_session_parts",
] as const;

export const expectedDrizzleMigrationCount = 2;

export interface DatabaseReadinessProbeResult {
	connected: boolean;
	schema: {
		requiredTables: string[];
		requiredTablesPresent: boolean;
		missingTables: string[];
	};
	migrations: {
		tablePresent: boolean;
		appliedCount: number | null;
		expectedAppliedCount: number;
		upToDate: boolean;
	};
}

export async function probeDatabaseReadiness(db: DbType): Promise<DatabaseReadinessProbeResult> {
	await db.execute(sql`select 1 as ok`);
	const requiredTableNameList = sql.join(
		phase7RequiredDatabaseTables.map((tableName) => sql`${tableName}`),
		sql`, `,
	);

	const tableRows = await db.execute<{ table_name: string }>(sql`
		select table_name
		from information_schema.tables
		where table_schema = 'public'
			and table_name in (${requiredTableNameList})
		order by table_name
	`);
	const existingTables = new Set(readRows<{ table_name: string }>(tableRows).map((row) => row.table_name));
	const missingTables = phase7RequiredDatabaseTables.filter((tableName) => !existingTables.has(tableName));

	const migrationTableRows = await db.execute<{ table_schema: string; table_name: string }>(sql`
		select table_schema, table_name
		from information_schema.tables
		where table_schema in ('drizzle', 'public')
			and table_name = '__drizzle_migrations'
		order by case when table_schema = 'drizzle' then 0 else 1 end
		limit 1
	`);
	const migrationTable = readRows<{ table_schema: string; table_name: string }>(migrationTableRows)[0];
	let appliedCount: number | null = null;
	if (migrationTable) {
		const migrationCountRows = await db.execute<{ applied_count: number | string }>(
			sql.raw(`select count(*) as applied_count from "${migrationTable.table_schema}"."__drizzle_migrations"`),
		);
		appliedCount = Number(readRows<{ applied_count: number | string }>(migrationCountRows)[0]?.applied_count ?? 0);
	}

	return {
		connected: true,
		schema: {
			requiredTables: [...phase7RequiredDatabaseTables],
			requiredTablesPresent: missingTables.length === 0,
			missingTables,
		},
		migrations: {
			tablePresent: Boolean(migrationTable),
			appliedCount,
			expectedAppliedCount: expectedDrizzleMigrationCount,
			upToDate: appliedCount !== null && appliedCount >= expectedDrizzleMigrationCount,
		},
	};
}

function readRows<T>(result: unknown): T[] {
	if (Array.isArray(result)) {
		return result as T[];
	}

	const rows = (result as { rows?: T[] } | undefined)?.rows;
	return Array.isArray(rows) ? rows : [];
}
