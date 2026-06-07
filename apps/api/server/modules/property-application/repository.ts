import type { ApplicationRecordDetail, ApplicationRecordDetailQuery, FeeDiscount, FeeDiscountQuery } from "./types";

export interface PropertyApplicationRepository {
	listFeeDiscounts(query: FeeDiscountQuery): Promise<FeeDiscount[]>;
	listApplicationRecordDetails(query: ApplicationRecordDetailQuery): Promise<ApplicationRecordDetail[]>;
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
	};
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
