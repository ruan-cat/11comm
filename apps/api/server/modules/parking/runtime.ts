import type { H3Event } from "nitro/h3";
import { hasDatabaseUrl, useDb } from "../../db";
import { createAdminParkingAdapter } from "./admin-adapter";
import { createLegacyParkingAdapter } from "./legacy-adapter";
import { createParkingRepository, type ParkingRepository } from "./repository";
import { createParkingService, type ParkingService } from "./service";

export interface ParkingRuntime {
	repository: ParkingRepository;
	service: ParkingService;
	adminAdapter: ReturnType<typeof createAdminParkingAdapter>;
	legacyAdapter: ReturnType<typeof createLegacyParkingAdapter>;
}

const fallbackRuntime = createParkingRuntime(createParkingRepository());

export function getParkingRuntime(event?: H3Event): ParkingRuntime {
	if (!event || !hasDatabaseUrl(event)) {
		return fallbackRuntime;
	}

	const context = ((event as any).context ??= {});
	if (context.parkingRuntime) {
		return context.parkingRuntime as ParkingRuntime;
	}

	const runtime = createParkingRuntime(createParkingRepository({ db: useDb(event) }));
	context.parkingRuntime = runtime;
	return runtime;
}

function createParkingRuntime(repository: ParkingRepository): ParkingRuntime {
	const service = createParkingService(repository);
	return {
		repository,
		service,
		adminAdapter: createAdminParkingAdapter(service),
		legacyAdapter: createLegacyParkingAdapter(service),
	};
}
