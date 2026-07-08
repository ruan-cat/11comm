import type {
	RenovationApplication,
	RenovationListResult,
	RenovationQueryParams,
	RenovationRecord,
	RenovationRecordMedia,
	RenovationRecordQueryParams,
} from "./types";

export interface RenovationRepository {
	queryRenovations(params: RenovationQueryParams): Promise<RenovationListResult<RenovationApplication>>;
	queryRecords(params: RenovationRecordQueryParams): Promise<RenovationListResult<RenovationRecord>>;
	getRecordMedia(recordId: string): Promise<RenovationRecordMedia[]>;
}

const RENOVATION_STATE_NAMES: Record<number, string> = {
	1000: "待审核",
	2000: "审核不通过",
	3000: "施工中",
	4000: "待验收",
	5000: "验收通过",
	6000: "验收不通过",
};

const renovationApplications: RenovationApplication[] = [
	{
		rId: "REN_0001",
		communityId: "COMM_001",
		roomId: "ROOM_0001",
		roomName: "1栋101A室",
		userId: "U_0001",
		personName: "张三",
		personTel: "13800000001",
		startTime: "2024-01-01 08:00:00",
		endTime: "2024-03-01 18:00:00",
		renovationCompany: "筑家装修公司1",
		personMain: "张工",
		personMainTel: "13900000001",
		isPostpone: "N",
		remark: "房屋装修申请",
		state: 1000,
		stateName: RENOVATION_STATE_NAMES[1000],
		isViolation: "N",
	},
	{
		rId: "REN_0002",
		communityId: "COMM_001",
		roomId: "ROOM_0002",
		roomName: "1栋102B室",
		userId: "U_0002",
		personName: "李四",
		personTel: "13800000002",
		startTime: "2024-01-05 08:00:00",
		endTime: "2024-03-05 18:00:00",
		renovationCompany: "筑家装修公司2",
		personMain: "李工",
		personMainTel: "13900000002",
		isPostpone: "N",
		remark: "房屋装修申请",
		state: 3000,
		stateName: RENOVATION_STATE_NAMES[3000],
		isViolation: "N",
	},
	{
		rId: "REN_0003",
		communityId: "COMM_001",
		roomId: "ROOM_0003",
		roomName: "2栋201A室",
		userId: "U_0003",
		personName: "王五",
		personTel: "13800000003",
		startTime: "2024-01-10 08:00:00",
		endTime: "2024-03-10 18:00:00",
		renovationCompany: "筑家装修公司3",
		personMain: "王工",
		personMainTel: "13900000003",
		isPostpone: "Y",
		postponeTime: "2024-03-15 18:00:00",
		remark: "房屋装修申请",
		state: 4000,
		stateName: RENOVATION_STATE_NAMES[4000],
		isViolation: "Y",
	},
	{
		rId: "REN_0004",
		communityId: "COMM_001",
		roomId: "ROOM_0004",
		roomName: "2栋202B室",
		userId: "U_0004",
		personName: "赵六",
		personTel: "13800000004",
		startTime: "2024-01-15 08:00:00",
		endTime: "2024-03-15 18:00:00",
		renovationCompany: "筑家装修公司4",
		personMain: "赵工",
		personMainTel: "13900000004",
		isPostpone: "N",
		remark: "房屋装修申请",
		state: 5000,
		stateName: RENOVATION_STATE_NAMES[5000],
		isViolation: "N",
	},
	{
		rId: "REN_0005",
		communityId: "COMM_002",
		roomId: "ROOM_0005",
		roomName: "3栋301A室",
		userId: "U_0005",
		personName: "孙七",
		personTel: "13800000005",
		startTime: "2024-01-20 08:00:00",
		endTime: "2024-03-20 18:00:00",
		renovationCompany: "筑家装修公司5",
		personMain: "孙工",
		personMainTel: "13900000005",
		isPostpone: "N",
		remark: "房屋装修申请",
		state: 6000,
		stateName: RENOVATION_STATE_NAMES[6000],
		isViolation: "N",
	},
	{
		rId: "REN_0006",
		communityId: "COMM_001",
		roomId: "ROOM_0006",
		roomName: "1栋103C室",
		userId: "U_0006",
		personName: "周八",
		personTel: "13800000006",
		startTime: "2024-02-01 08:00:00",
		endTime: "2024-04-01 18:00:00",
		renovationCompany: "筑家装修公司1",
		personMain: "周工",
		personMainTel: "13900000006",
		isPostpone: "N",
		remark: "房屋装修申请",
		state: 2000,
		stateName: RENOVATION_STATE_NAMES[2000],
		isViolation: "N",
	},
];

const renovationRecords: RenovationRecord[] = [
	{
		recordId: "RR_0001",
		rId: "REN_0001",
		communityId: "COMM_001",
		roomId: "ROOM_0001",
		roomName: "1栋101A室",
		state: 1000,
		stateName: RENOVATION_STATE_NAMES[1000],
		staffName: "物业人员A",
		remark: "提交装修申请，待审核",
		createTime: "2024-01-01 09:00:00",
		isTrue: "false",
	},
	{
		recordId: "RR_0002",
		rId: "REN_0002",
		communityId: "COMM_001",
		roomId: "ROOM_0002",
		roomName: "1栋102B室",
		state: 3000,
		stateName: RENOVATION_STATE_NAMES[3000],
		staffName: "物业人员B",
		remark: "审核通过，开始施工",
		createTime: "2024-01-05 10:00:00",
		isTrue: "false",
	},
	{
		recordId: "RR_0003",
		rId: "REN_0003",
		communityId: "COMM_001",
		roomId: "ROOM_0003",
		roomName: "2栋201A室",
		state: 4000,
		stateName: RENOVATION_STATE_NAMES[4000],
		staffName: "物业人员A",
		remark: "施工完成，申请验收",
		createTime: "2024-01-10 11:00:00",
		isTrue: "true",
	},
	{
		recordId: "RR_0004",
		rId: "REN_0003",
		communityId: "COMM_001",
		roomId: "ROOM_0003",
		roomName: "2栋201A室",
		state: 5000,
		stateName: RENOVATION_STATE_NAMES[5000],
		staffName: "物业人员C",
		remark: "验收通过",
		createTime: "2024-01-11 14:00:00",
		isTrue: "true",
	},
	{
		recordId: "RR_0005",
		rId: "REN_0005",
		communityId: "COMM_002",
		roomId: "ROOM_0005",
		roomName: "3栋301A室",
		state: 6000,
		stateName: RENOVATION_STATE_NAMES[6000],
		staffName: "物业人员D",
		remark: "验收不通过，需整改",
		createTime: "2024-01-20 16:00:00",
		isTrue: "false",
	},
	{
		recordId: "RR_0006",
		rId: "REN_0006",
		communityId: "COMM_001",
		roomId: "ROOM_0006",
		roomName: "1栋103C室",
		state: 2000,
		stateName: RENOVATION_STATE_NAMES[2000],
		staffName: "物业人员A",
		remark: "审核不通过",
		createTime: "2024-02-01 09:30:00",
		isTrue: "false",
	},
];

const renovationRecordMedia: RenovationRecordMedia[] = [
	{
		detailId: "RM_IMG_0001",
		recordId: "RR_0001",
		relTypeCd: 19000,
		url: "https://picsum.photos/seed/renovation-1/400/300",
		remark: "现场图片",
	},
	{
		detailId: "RM_IMG_0002",
		recordId: "RR_0002",
		relTypeCd: 19000,
		url: "https://picsum.photos/seed/renovation-2/400/300",
		remark: "现场图片",
	},
	{
		detailId: "RM_VIDEO_0003",
		recordId: "RR_0003",
		relTypeCd: 21000,
		url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
		remark: "现场视频",
	},
];

export function createRenovationRepository(): RenovationRepository {
	return {
		async queryRenovations(params) {
			let filtered = [...renovationApplications];

			if (params.communityId) {
				filtered = filtered.filter((item) => item.communityId === params.communityId);
			}

			if (params.roomName) {
				const roomName = params.roomName;
				filtered = filtered.filter((item) => item.roomName.includes(roomName));
			}

			if (params.state !== undefined && params.state !== "") {
				const state = params.state;
				filtered = filtered.filter((item) => String(item.state) === state);
			}

			const page = normalizePage(params.page);
			const row = normalizeRow(params.row);
			const start = (page - 1) * row;
			const list = filtered.slice(start, start + row);

			return {
				list: cloneValue(list),
				total: filtered.length,
				page,
				pageSize: row,
				hasMore: start + row < filtered.length,
			};
		},

		async queryRecords(params) {
			let filtered = renovationRecords.filter((item) => item.rId === params.rId);

			if (params.communityId) {
				filtered = filtered.filter((item) => item.communityId === params.communityId);
			}

			if (params.roomName) {
				const roomName = params.roomName;
				filtered = filtered.filter((item) => item.roomName.includes(roomName));
			}

			if (params.roomId) {
				const roomId = params.roomId;
				filtered = filtered.filter((item) => item.roomId === roomId);
			}

			const page = normalizePage(params.page);
			const row = normalizeRow(params.row);
			const start = (page - 1) * row;
			const list = filtered.slice(start, start + row);

			return {
				list: cloneValue(list),
				total: filtered.length,
				page,
				pageSize: row,
				hasMore: start + row < filtered.length,
			};
		},

		async getRecordMedia(recordId) {
			return cloneValue(renovationRecordMedia.filter((item) => item.recordId === recordId));
		},
	};
}

export const renovationRepository = createRenovationRepository();

function normalizePage(value: number): number {
	const page = Number(value);
	return Number.isFinite(page) && page > 0 ? page : 1;
}

function normalizeRow(value: number): number {
	const row = Number(value);
	return Number.isFinite(row) && row > 0 ? row : 10;
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
