import type { H3Event } from "nitro/h3";
import { createLegacyNoticeAdapter } from "./legacy-adapter";
import { createNoticeRepository, type NoticeRepository } from "./repository";
import { createNoticeService, type NoticeService } from "./service";

export interface NoticeRuntime {
	repository: NoticeRepository;
	service: NoticeService;
	legacyAdapter: ReturnType<typeof createLegacyNoticeAdapter>;
}

const fallbackRuntime = createNoticeRuntime(createNoticeRepository());

export function getNoticeRuntime(_event?: H3Event): NoticeRuntime {
	return fallbackRuntime;
}

function createNoticeRuntime(repository: NoticeRepository): NoticeRuntime {
	const service = createNoticeService(repository);
	return {
		repository,
		service,
		legacyAdapter: createLegacyNoticeAdapter(service),
	};
}
