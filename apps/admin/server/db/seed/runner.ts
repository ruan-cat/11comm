import { sql } from "drizzle-orm";
import consola from "consola";
import type { SeedDb, SeedModule } from "./helpers";

/**
 * 拓扑排序：根据模块 dependencies 计算安全的执行顺序
 */
function resolveOrder(modules: SeedModule[]): SeedModule[] {
	const byName = new Map(modules.map((m) => [m.name, m]));
	const inDegree = new Map(modules.map((m) => [m.name, 0]));
	const adjacency = new Map<string, string[]>();

	for (const m of modules) {
		adjacency.set(m.name, []);
	}

	for (const m of modules) {
		for (const dep of m.dependencies) {
			if (!byName.has(dep)) {
				throw new Error(`Module "${m.name}" depends on "${dep}" which is not registered`);
			}
			adjacency.get(dep)!.push(m.name);
			inDegree.set(m.name, (inDegree.get(m.name) ?? 0) + 1);
		}
	}

	const queue = modules.filter((m) => inDegree.get(m.name) === 0).map((m) => m.name);
	const result: SeedModule[] = [];

	while (queue.length > 0) {
		const name = queue.shift()!;
		result.push(byName.get(name)!);
		for (const next of adjacency.get(name) ?? []) {
			const deg = (inDegree.get(next) ?? 1) - 1;
			inDegree.set(next, deg);
			if (deg === 0) queue.push(next);
		}
	}

	if (result.length !== modules.length) {
		const missing = modules.filter((m) => !result.includes(m)).map((m) => m.name);
		throw new Error(`Circular dependency detected in seed modules: ${missing.join(", ")}`);
	}

	return result;
}

/**
 * TRUNCATE CASCADE 全部 public schema 下的表
 */
async function truncateAll(db: SeedDb): Promise<void> {
	consola.info("Truncating all tables...");

	await db.execute(sql`
    DO $$ DECLARE r RECORD;
    BEGIN
      FOR r IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      LOOP
        EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `);

	consola.success("All tables truncated");
}

/**
 * 执行全部 seed 模块（先 truncate 再按依赖序插入）
 */
export async function runSeed(db: SeedDb, modules: SeedModule[]): Promise<void> {
	const ordered = resolveOrder(modules);

	consola.info(`Resolved ${ordered.length} modules in dependency order:`);
	for (const m of ordered) {
		consola.info(`  - ${m.name}`);
	}

	await truncateAll(db);

	consola.start("Seeding data...");

	for (const mod of ordered) {
		const start = Date.now();
		consola.info(`Seeding [${mod.name}]...`);
		await mod.seed(db);
		consola.success(`[${mod.name}] done (${Date.now() - start}ms)`);
	}

	consola.success("All seed data inserted!");
}
