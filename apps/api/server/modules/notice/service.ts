import type { NoticeRepository } from "./repository";
import type { NoticeListQuery } from "./types";

export interface NoticeService {
	listNotices(query: NoticeListQuery): ReturnType<NoticeRepository["listNotices"]>;
}

export function createNoticeService(repository: NoticeRepository): NoticeService {
	return {
		listNotices: (query) => repository.listNotices(query),
	};
}
