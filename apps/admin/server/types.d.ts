import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

declare module "h3" {
	interface H3Event {
		context: {
			db?: NeonHttpDatabase<any>;
		};
	}
}
