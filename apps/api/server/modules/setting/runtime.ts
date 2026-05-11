import type { H3Event } from "nitro/h3";
import { hasDatabaseUrl, useDb } from "../../db";
import { createAdminSettingAdapter } from "./admin-adapter";
import { createSettingRepository, type SettingRepository } from "./repository";
import { createSettingService, type SettingService } from "./service";

export interface SettingRuntime {
	repository: SettingRepository;
	service: SettingService;
	adminAdapter: ReturnType<typeof createAdminSettingAdapter>;
}

const fallbackRuntime = createSettingRuntime(createSettingRepository());

export function getSettingRuntime(event?: H3Event): SettingRuntime {
	if (!event || !hasDatabaseUrl(event)) {
		return fallbackRuntime;
	}

	const context = ((event as any).context ??= {});
	if (context.settingRuntime) {
		return context.settingRuntime as SettingRuntime;
	}

	const runtime = createSettingRuntime(createSettingRepository({ db: useDb(event) }));
	context.settingRuntime = runtime;
	return runtime;
}

function createSettingRuntime(repository: SettingRepository): SettingRuntime {
	const service = createSettingService(repository);
	return {
		repository,
		service,
		adminAdapter: createAdminSettingAdapter(service),
	};
}
