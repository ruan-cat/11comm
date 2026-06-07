import type {
	CouponOrderQuery,
	CouponWriteOffOrder,
	IntegralLogQuery,
	IntegralSetting,
	IntegralWriteOffLog,
} from "./types";

export interface CouponRepository {
	listCouponOrders(query: CouponOrderQuery): Promise<CouponWriteOffOrder[]>;
	listIntegralSettings(): Promise<IntegralSetting[]>;
	listIntegralLogs(query: IntegralLogQuery): Promise<IntegralWriteOffLog[]>;
}

const couponOrders: CouponWriteOffOrder[] = Array.from({ length: 42 }, (_, index) => {
	const sequence = index + 1;
	const couponSequence = 100000 + index;

	return {
		uoId: `UO_${`${sequence}`.padStart(5, "0")}`,
		couponQrcode: `CPN${couponSequence}`,
		couponName: index % 2 === 0 ? "停车抵扣券" : "保洁服务券",
		value: index % 2 === 0 ? "30元" : "1次",
		userName: `业主${`${sequence}`.padStart(2, "0")}`,
		tel: `1380000${`${sequence}`.padStart(4, "0")}`,
		createTime: `2026-06-${`${(index % 28) + 1}`.padStart(2, "0")} 09:00:00`,
		remark: index % 2 === 0 ? "停车缴费使用" : "家政服务预约",
	};
});

const integralSettings: IntegralSetting[] = [
	{
		settingId: "IS_001",
		settingName: "员工积分核销",
		onceMaxIntegral: 200,
	},
];

const integralLogs: IntegralWriteOffLog[] = Array.from({ length: 28 }, (_, index) => {
	const sequence = index + 1;

	return {
		logId: `IL_${`${sequence}`.padStart(5, "0")}`,
		ownerName: `积分业主${`${sequence}`.padStart(2, "0")}`,
		ownerTel: `1380000${`${sequence}`.padStart(4, "0")}`,
		integral: ((index % 5) + 1) * 10,
		operatorName: "系统管理员",
		createTime: `2026-06-${`${(index % 28) + 1}`.padStart(2, "0")} 10:00:00`,
		remark: "积分核销",
	};
});

export function createCouponRepository(): CouponRepository {
	return {
		async listCouponOrders(query) {
			let filtered = couponOrders;

			if (query.couponQrcode) {
				filtered = filtered.filter((item) => item.couponQrcode.includes(query.couponQrcode ?? ""));
			}

			return cloneValue(filtered);
		},

		async listIntegralSettings() {
			return cloneValue(integralSettings);
		},

		async listIntegralLogs(query) {
			let filtered = integralLogs;

			if (query.ownerTel) {
				filtered = filtered.filter((item) => item.ownerTel.includes(query.ownerTel ?? ""));
			}

			return cloneValue(filtered);
		},
	};
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
