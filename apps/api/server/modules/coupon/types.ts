export interface CouponWriteOffOrder {
	uoId: string;
	couponQrcode: string;
	couponName: string;
	value: string;
	userName: string;
	tel: string;
	createTime: string;
	remark: string;
}

export interface CouponOrderQuery {
	couponQrcode?: string;
	page?: number;
	row?: number;
}

export interface IntegralSetting {
	settingId: string;
	settingName: string;
	onceMaxIntegral: number;
}

export interface IntegralWriteOffLog {
	logId: string;
	ownerName: string;
	ownerTel: string;
	integral: number;
	operatorName: string;
	createTime: string;
	remark?: string;
}

export interface IntegralLogQuery {
	ownerTel?: string;
	page?: number;
	row?: number;
}

export interface LegacyPaginationResponse<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}
