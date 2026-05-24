export interface NoticeItem {
	noticeId: string;
	title: string;
	context: string;
	startTime: string;
	timeStr: string;
	noticeTypeCd: string;
	communityId: string;
}

export interface NoticeListQuery {
	page: number;
	row: number;
	communityId?: string;
	noticeTypeCd?: string;
	noticeId?: string;
	titleLike?: string;
}

export interface NoticeListResult {
	notices: NoticeItem[];
	total: number;
	page: number;
	row: number;
}
