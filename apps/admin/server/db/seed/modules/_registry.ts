import type { SeedModule } from "../helpers";

import devSeed from "./dev.seed";
import communitySeed from "./community.seed";
import settingSeed from "./setting.seed";
import housePropertySeed from "./house-property.seed";
import operationSeed from "./operation.seed";
import contractSeed from "./contract.seed";
import parkingSeed from "./parking.seed";
import expenseSeed from "./expense.seed";
import patrolSeed from "./patrol.seed";
import repairsSeed from "./repairs.seed";
import reportSeed from "./report.seed";

export const registry: SeedModule[] = [
	devSeed,
	communitySeed,
	settingSeed,
	housePropertySeed,
	operationSeed,
	contractSeed,
	parkingSeed,
	expenseSeed,
	patrolSeed,
	repairsSeed,
	reportSeed,
];
