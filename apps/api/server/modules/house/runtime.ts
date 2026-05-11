import type { H3Event } from "nitro/h3";
import { hasDatabaseUrl, useDb } from "../../db";
import { createHouseRepository, type HouseRepository } from "./repository";
import { createHouseService, type HouseService } from "./service";
import { createAdminHouseAdapter } from "./admin-adapter";

export interface HouseRuntime {
	repository: HouseRepository;
	service: HouseService;
	adminAdapter: ReturnType<typeof createAdminHouseAdapter>;
}

const fallbackRuntime = createHouseRuntime(createHouseRepository());

export function getHouseRuntime(event?: H3Event): HouseRuntime {
	if (!event || !hasDatabaseUrl(event)) {
		return fallbackRuntime;
	}

	const context = ((event as any).context ??= {});
	if (context.houseRuntime) {
		return context.houseRuntime as HouseRuntime;
	}

	const runtime = createHouseRuntime(createHouseRepository({ db: useDb(event) }));
	context.houseRuntime = runtime;
	return runtime;
}

function createHouseRuntime(repository: HouseRepository): HouseRuntime {
	const service = createHouseService(repository);
	return {
		repository,
		service,
		adminAdapter: createAdminHouseAdapter(service),
	};
}
