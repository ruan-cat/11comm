import type { ItemReleaseRepository } from "./repository";
import type {
	ItemReleaseCommentQuery,
	ItemReleaseDetailQuery,
	ItemReleaseResourceQuery,
	ItemReleaseTaskPaginationQuery,
} from "./types";

export interface ItemReleaseService {
	getItemRelease(query: ItemReleaseDetailQuery): ReturnType<ItemReleaseRepository["getItemRelease"]>;
	getItemReleaseRes(query: ItemReleaseResourceQuery): ReturnType<ItemReleaseRepository["getItemReleaseRes"]>;
	queryOaWorkflowUser(query: ItemReleaseCommentQuery): ReturnType<ItemReleaseRepository["queryOaWorkflowUser"]>;
	queryUndoItemRelease(
		query: ItemReleaseTaskPaginationQuery,
	): ReturnType<ItemReleaseRepository["queryUndoItemRelease"]>;
	queryFinishItemRelease(
		query: ItemReleaseTaskPaginationQuery,
	): ReturnType<ItemReleaseRepository["queryFinishItemRelease"]>;
}

export function createItemReleaseService(repository: ItemReleaseRepository): ItemReleaseService {
	return {
		getItemRelease: (query) => repository.getItemRelease(query),
		getItemReleaseRes: (query) => repository.getItemReleaseRes(query),
		queryOaWorkflowUser: (query) => repository.queryOaWorkflowUser(query),
		queryUndoItemRelease: (query) => repository.queryUndoItemRelease(query),
		queryFinishItemRelease: (query) => repository.queryFinishItemRelease(query),
	};
}
