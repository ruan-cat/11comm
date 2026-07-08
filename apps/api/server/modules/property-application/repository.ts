import type {
	ApplicationRecordDetail,
	ApplicationRecordDetailQuery,
	ApplyRoomDiscount,
	ApplyRoomDiscountListQuery,
	ApplyRoomDiscountListResult,
	ApplyRoomDiscountRecord,
	ApplyRoomDiscountRecordListResult,
	ApplyRoomDiscountRecordQuery,
	FeeDiscount,
	FeeDiscountQuery,
} from "./types";

export interface PropertyApplicationRepository {
	listFeeDiscounts(query: FeeDiscountQuery): Promise<FeeDiscount[]>;
	listApplicationRecordDetails(query: ApplicationRecordDetailQuery): Promise<ApplicationRecordDetail[]>;
	getApplicationById(id: string): Promise<ApplyRoomDiscount | undefined>;
	getApplicationList(query: ApplyRoomDiscountListQuery): Promise<ApplyRoomDiscountListResult>;
	getRecordList(query: ApplyRoomDiscountRecordQuery): Promise<ApplyRoomDiscountRecordListResult>;
}

const feeDiscounts: FeeDiscount[] = [
	{
		discountId: "DISCOUNT_001",
		discountName: "季度空置房优惠",
		discountType: "3003",
		discountAmount: 200,
		communityId: "COMM_001",
	},
	{
		discountId: "DISCOUNT_002",
		discountName: "半年空置房优惠",
		discountType: "3003",
		discountAmount: 500,
		communityId: "COMM_001",
	},
	{
		discountId: "DISCOUNT_003",
		discountName: "年度空置房优惠",
		discountType: "3003",
		discountAmount: 1200,
		communityId: "COMM_001",
	},
];

const applicationRecordDetails: ApplicationRecordDetail[] = [
	{
		ardrId: "ARDR_001",
		applicationId: "ARD_001",
		roomId: "ROOM_001",
		roomName: "1栋101A室",
		relTypeCd: "19000",
		url: "https://picsum.photos/400/300?random=record1",
		remark: "验房照片1",
		createTime: "2024-01-18 10:30:00",
	},
	{
		ardrId: "ARDR_002",
		applicationId: "ARD_001",
		roomId: "ROOM_001",
		roomName: "1栋101A室",
		relTypeCd: "21000",
		url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
		remark: "验房视频1",
		createTime: "2024-01-18 10:35:00",
	},
];

const recordCommunityIndex = new Map([
	["ARDR_001", "COMM_001"],
	["ARDR_002", "COMM_001"],
]);

const applyRoomDiscounts: ApplyRoomDiscount[] = [
	{
		ardId: "ARD_001",
		applyType: "1001",
		applyTypeName: "空置房优惠",
		roomId: "ROOM_001",
		roomName: "1栋101A室",
		communityId: "COMM_001",
		createUserName: "张三",
		createUserTel: "13800000001",
		createRemark: "业主申请空置房优惠",
		checkRemark: "现场验房通过",
		reviewRemark: "符合空置房条件",
		startTime: "2024-01-01 00:00:00",
		endTime: "2024-06-30 23:59:59",
		feeId: "FEE_001",
		state: "4",
		stateName: "审批通过",
		urls: ["https://picsum.photos/400/300?random=apply1"],
		createTime: "2024-01-10 09:00:00",
		updateTime: "2024-01-18 14:00:00",
	},
	{
		ardId: "ARD_002",
		applyType: "1001",
		applyTypeName: "空置房优惠",
		roomId: "ROOM_002",
		roomName: "2栋202B室",
		communityId: "COMM_001",
		createUserName: "李四",
		createUserTel: "13800000002",
		createRemark: "业主申请空置房优惠",
		checkRemark: "",
		reviewRemark: "",
		startTime: "2024-02-01 00:00:00",
		endTime: "2024-07-31 23:59:59",
		feeId: "FEE_002",
		state: "1",
		stateName: "待验房",
		urls: [],
		createTime: "2024-02-05 10:00:00",
		updateTime: "2024-02-05 10:00:00",
	},
	{
		ardId: "ARD_003",
		applyType: "1001",
		applyTypeName: "空置房优惠",
		roomId: "ROOM_003",
		roomName: "3栋303C室",
		communityId: "COMM_002",
		createUserName: "王五",
		createUserTel: "13800000003",
		createRemark: "业主申请空置房优惠",
		checkRemark: "",
		reviewRemark: "",
		startTime: "2024-03-01 00:00:00",
		endTime: "2024-08-31 23:59:59",
		feeId: "FEE_003",
		state: "0",
		stateName: "待提交",
		urls: [],
		createTime: "2024-03-08 11:00:00",
		updateTime: "2024-03-08 11:00:00",
	},
];

const applyRoomDiscountRecords: ApplyRoomDiscountRecord[] = [
	{
		ardrId: "ARDR_001",
		applicationId: "ARD_001",
		roomId: "ROOM_001",
		roomName: "1栋101A室",
		state: "4",
		stateName: "审批通过",
		remark: "验房完成，提交审核",
		createUserName: "物业人员A",
		createTime: "2024-01-18 10:30:00",
		communityId: "COMM_001",
	},
	{
		ardrId: "ARDR_002",
		applicationId: "ARD_001",
		roomId: "ROOM_001",
		roomName: "1栋101A室",
		state: "4",
		stateName: "审批通过",
		remark: "审核通过，确认优惠",
		createUserName: "物业人员B",
		createTime: "2024-01-18 14:00:00",
		communityId: "COMM_001",
	},
	{
		ardrId: "ARDR_003",
		applicationId: "ARD_002",
		roomId: "ROOM_002",
		roomName: "2栋202B室",
		state: "1",
		stateName: "待验房",
		remark: "预约验房",
		createUserName: "物业人员A",
		createTime: "2024-02-06 09:00:00",
		communityId: "COMM_001",
	},
];

export function createPropertyApplicationRepository(): PropertyApplicationRepository {
	return {
		async listFeeDiscounts(query) {
			return cloneValue(
				feeDiscounts.filter(
					(item) => item.discountType === query.discountType && item.communityId === query.communityId,
				),
			);
		},

		async listApplicationRecordDetails(query) {
			let filtered = [...applicationRecordDetails];

			if (query.ardrId) {
				filtered = filtered.filter((item) => item.ardrId === query.ardrId);
			}

			if (query.communityId) {
				filtered = filtered.filter((item) => recordCommunityIndex.get(item.ardrId) === query.communityId);
			}

			return cloneValue(filtered);
		},

		async getApplicationById(id) {
			const item = applyRoomDiscounts.find((item) => item.ardId === id);
			return item ? cloneValue(item) : undefined;
		},

		async getApplicationList(query) {
			let filtered = [...applyRoomDiscounts];

			if (query.communityId) {
				filtered = filtered.filter((item) => item.communityId === query.communityId);
			}

			const roomName = query.roomName;
			if (roomName) {
				filtered = filtered.filter((item) => item.roomName.includes(roomName));
			}

			const state = query.state;
			if (state) {
				filtered = filtered.filter((item) => item.state === state);
			}

			const page = normalizePage(query.page);
			const row = normalizeRow(query.row);
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

		async getRecordList(query) {
			let filtered = [...applyRoomDiscountRecords];

			if (query.communityId) {
				filtered = filtered.filter((item) => item.communityId === query.communityId);
			}

			if (query.applicationId) {
				filtered = filtered.filter((item) => item.applicationId === query.applicationId);
			}

			if (query.roomId) {
				filtered = filtered.filter((item) => item.roomId === query.roomId);
			}

			const recordRoomName = query.roomName;
			if (recordRoomName) {
				filtered = filtered.filter((item) => item.roomName.includes(recordRoomName));
			}

			const page = normalizePage(query.page);
			const row = normalizeRow(query.row);
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
	};
}

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
