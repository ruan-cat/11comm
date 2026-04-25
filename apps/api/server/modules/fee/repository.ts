import { and, desc, eq, like, sql } from "drizzle-orm";
import {
	exHouseCharges,
	exPayments,
	rptExpenseSummaries,
	rptPaymentDetails,
	type PaymentDetailsFormListItem,
} from "@01s-11comm/type";
import type { DbType } from "../../db";
import type {
	AdminHouseChargeListItem,
	DataReportItem,
	FeeConfigItem,
	FeeDetailItem,
	FeeItem,
	FeeSummaryReportItem,
	OweFeeCallableItem,
	OweFeeItem,
	PayFeeDetailReportItem,
	RoomFeeReportItem,
} from "./types";
import { formatDateTime } from "../../utils/format-date";

export interface FeeRepository {
	listHouseCharges: (params: ListHouseChargesParams) => Promise<{ list: AdminHouseChargeListItem[]; total: number }>;
	listFeeDetails: (params: FeeDetailQuery) => Promise<{ list: FeeDetailItem[] }>;
	listOweFees: (
		params: OweFeeQuery,
	) => Promise<{ data: OweFeeItem[]; totalAmount: number; total: number; page: number; row: number }>;
	createNativeQrcodePayment: (
		params: NativePaymentInput,
	) => Promise<{ code: number; data: { codeUrl: string }; msg: string }>;
	listOweFeeCallables: (params: OweFeeCallableQuery) => Promise<{ list: OweFeeCallableItem[] }>;
	writeOweFeeCallable: (params: WriteOweFeeCallableInput) => Promise<{ code: number; msg: string }>;
	saveRoomCreateFee: (
		params: Record<string, unknown>,
	) => Promise<{ errorRoom: number; msg: string; success: boolean; successRoom: number; totalRoom: number }>;
	listFeeConfigs: (params: FeeConfigQuery) => Promise<FeeConfigItem[]>;
	getFeeSummaryReport: (params: ReportQuery) => Promise<{ list: FeeSummaryReportItem[] }>;
	getPayFeeDetailReport: (params: PayFeeDetailQuery) => Promise<{ list: PayFeeDetailReportItem[]; total: number }>;
	getRoomFeeReport: (params: RoomFeeReportQuery) => Promise<{ list: RoomFeeReportItem[]; total: number }>;
	getDataReport: (params: DataReportQuery) => Promise<{ list: DataReportItem[] }>;
	listLegacyFees: (params: LegacyFeeQuery) => Promise<{ list: FeeItem[]; total: number; page: number; row: number }>;
}

export interface ListHouseChargesParams {
	pageIndex: number;
	pageSize: number;
	expenseItem?: string;
	billingPeriod?: string;
	status?: string;
}

export interface LegacyFeeQuery {
	page: number;
	row: number;
	communityId?: string;
	roomId?: string;
	roomName?: string;
	feeType?: string;
	state?: string;
	ownerName?: string;
	feeId?: string;
	payerObjId?: string;
}

export interface FeeDetailQuery {
	page: number;
	row: number;
	communityId?: string;
	feeId?: string;
}

export interface OweFeeQuery {
	page: number;
	row: number;
	communityId?: string;
	roomId?: string;
	ownerId?: string;
}

export interface NativePaymentInput {
	business?: string;
	communityId: string;
	feeIds?: string[];
	roomId: string;
}

export interface OweFeeCallableQuery {
	communityId?: string;
	page: number;
	payerObjId?: string;
	row: number;
}

export interface WriteOweFeeCallableInput {
	communityId?: string;
	feeIds?: string[];
	remark?: string;
	roomId?: string;
}

export interface FeeConfigQuery {
	communityId?: string;
	feeTypeCd?: string;
	isDefault?: string;
	page: number;
	row: number;
	valid?: number;
}

export interface ReportQuery {
	communityId?: string;
	feeTypeCd?: string;
	floorId?: string;
	page: number;
	row: number;
}

export interface PayFeeDetailQuery extends ReportQuery {
	roomId?: string;
	name?: string;
	status?: string;
}

export interface RoomFeeReportQuery extends ReportQuery {
	roomId?: string;
}

export interface DataReportQuery {
	communityId?: string;
	reportCode?: string;
}

export function createFeeRepository(options: { db?: DbType } = {}): FeeRepository {
	return options.db ? createDbFeeRepository(options.db) : createInMemoryFeeRepository();
}

export function createInMemoryFeeRepository(seed?: Partial<InMemoryFeeSeed>): FeeRepository {
	return new InMemoryFeeRepository(seed);
}

export function createDbFeeRepository(db: DbType): FeeRepository {
	const fallback = createInMemoryFeeRepository();

	return {
		...fallback,
		async listHouseCharges(params) {
			const conditions = [];
			if (params.expenseItem) {
				conditions.push(like(exHouseCharges.expenseItem, `%${params.expenseItem}%`));
			}
			if (params.billingPeriod) {
				conditions.push(like(exHouseCharges.billingPeriod, `%${params.billingPeriod}%`));
			}
			if (params.status) {
				conditions.push(eq(exHouseCharges.status, params.status as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(exHouseCharges)
				.where(where);
			const rows = await db
				.select()
				.from(exHouseCharges)
				.where(where)
				.orderBy(desc(exHouseCharges.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					houseId: item.houseId,
					expenseItem: item.expenseItem || "",
					receivableAmount: item.receivableAmount || "",
					receivedAmount: item.receivedAmount || "",
					billingPeriod: item.billingPeriod || "",
					status: item.status || "unpaid",
					billDate: item.billDate || "",
					dueDate: item.dueDate || "",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
		async getPayFeeDetailReport(params) {
			const countResult = await db.select({ total: sql<number>`count(*)` }).from(rptPaymentDetails);
			const rows = await db
				.select()
				.from(rptPaymentDetails)
				.orderBy(desc(rptPaymentDetails.createTime))
				.limit(params.row)
				.offset((params.page - 1) * params.row);
			const list = rows.map((item) => ({
				feeId: item.id,
				feeName: item.expenseItem || "",
				roomId: item.houseNumber || "",
				roomName: item.houseNumber || "",
				ownerName: item.ownerName || "",
				receivedAmount: Number(item.paymentAmount || 0),
				payTime: formatDateTime(item.paymentTime),
				payMethod: item.paymentMethod || "",
				stateName: item.paymentAmount ? "已缴费" : "未缴费",
			}));

			return { list, total: Number(countResult[0]?.total || 0) };
		},
		async getDataReport() {
			const rows = await db.select().from(rptExpenseSummaries).limit(5);
			return {
				list: rows.map((row) => ({
					name: row.expenseItem || row.expenseType || "费用统计",
					value: Number(row.receivedTotal || row.receivableTotal || 0),
					unit: "元",
				})),
			};
		},
		async createNativeQrcodePayment(params) {
			void exPayments;
			return fallback.createNativeQrcodePayment(params);
		},
	};
}

interface InMemoryFeeSeed {
	fees: FeeItem[];
	feeDetails: FeeDetailItem[];
	feeConfigs: FeeConfigItem[];
	callables: OweFeeCallableItem[];
}

class InMemoryFeeRepository implements FeeRepository {
	private readonly fees: FeeItem[];
	private readonly feeDetails: FeeDetailItem[];
	private readonly feeConfigs: FeeConfigItem[];
	private readonly callables: OweFeeCallableItem[];

	constructor(seed?: Partial<InMemoryFeeSeed>) {
		this.fees = structuredClone(seed?.fees ?? defaultFees);
		this.feeDetails = structuredClone(seed?.feeDetails ?? defaultFeeDetails);
		this.feeConfigs = structuredClone(seed?.feeConfigs ?? defaultFeeConfigs);
		this.callables = structuredClone(seed?.callables ?? defaultCallables);
	}

	async listHouseCharges(params: ListHouseChargesParams) {
		let data = this.fees.map(toAdminHouseCharge);
		if (params.expenseItem) {
			data = data.filter((item) => item.expenseItem.includes(params.expenseItem || ""));
		}
		if (params.billingPeriod) {
			data = data.filter((item) => item.billingPeriod.includes(params.billingPeriod || ""));
		}
		if (params.status) {
			data = data.filter((item) => item.status === params.status);
		}

		return {
			...paginate(data, params.pageIndex, params.pageSize),
		};
	}

	async listLegacyFees(params: LegacyFeeQuery) {
		let data = [...this.fees];
		if (params.communityId) {
			data = data.filter((item) => item.communityId === params.communityId);
		}
		const roomId = params.roomId || params.payerObjId;
		if (roomId) {
			data = data.filter((item) => item.roomId === roomId);
		}
		if (params.feeId) {
			data = data.filter((item) => item.feeId === params.feeId);
		}
		if (params.ownerName) {
			data = data.filter((item) => item.ownerName.includes(params.ownerName || ""));
		}
		if (params.state) {
			data = data.filter((item) => item.state === params.state);
		}

		return paginate(data, params.page, params.row);
	}

	async listFeeDetails(params: FeeDetailQuery) {
		let data = [...this.feeDetails];
		if (params.communityId) {
			data = data.filter((item) => item.communityId === params.communityId);
		}
		if (params.feeId) {
			data = data.filter((item) => item.feeId === params.feeId);
		}

		return {
			list: paginate(data, params.page, params.row).list,
		};
	}

	async listOweFees(params: OweFeeQuery) {
		let data = this.fees.filter((item) => item.oweAmount > 0).map(toOweFee);
		if (params.communityId) {
			data = data.filter((item) => item.communityId === params.communityId);
		}
		if (params.roomId) {
			data = data.filter((item) => item.roomId === params.roomId);
		}
		const page = paginate(data, params.page, params.row);

		return {
			data: page.list,
			totalAmount: data.reduce((sum, item) => sum + item.totalAmount, 0),
			total: data.length,
			page: params.page,
			row: params.row,
		};
	}

	async createNativeQrcodePayment(params: NativePaymentInput) {
		const feeIds = params.feeIds?.filter(Boolean).join(",") || "FEE_001";
		return {
			code: 0,
			msg: "生成二维码成功",
			data: {
				codeUrl: `mock-payment://pay?roomId=${params.roomId}&communityId=${params.communityId}&feeIds=${feeIds}&business=${params.business || "oweFee"}`,
			},
		};
	}

	async listOweFeeCallables(params: OweFeeCallableQuery) {
		let data = [...this.callables];
		if (params.payerObjId) {
			const fee = this.fees.find((item) => item.roomId === params.payerObjId);
			data = data.filter((item) => !fee || item.feeId === fee.feeId);
		}
		return { list: paginate(data, params.page, params.row).list };
	}

	async writeOweFeeCallable(params: WriteOweFeeCallableInput) {
		this.callables.unshift({
			feeId: params.feeIds?.[0] || "FEE_001",
			feeName: "物业管理费",
			ownerName: "张三",
			staffName: "当前员工",
			amountdOwed: 240,
			callableWayName: "人工登记",
			startTime: "2026-04-01",
			endTime: "2026-04-30",
			remark: params.remark || "已登记催缴",
			createTime: "2026-04-24 10:00:00",
		});
		return { code: 0, msg: "登记成功" };
	}

	async saveRoomCreateFee(params: Record<string, unknown>) {
		const amount = Number(params.amount || 100);
		const newFee: FeeItem = {
			...defaultFees[0],
			feeId: `FEE_${String(this.fees.length + 1).padStart(3, "0")}`,
			feeName: this.feeConfigs.find((item) => item.configId === params.configId)?.feeName || "新增费用",
			roomId: String(params.locationObjId || "ROOM_001"),
			roomName: String(params.locationObjId || "ROOM_001"),
			receivedAmount: amount,
			paidAmount: 0,
			oweAmount: amount,
			state: "UNPAID",
			stateName: "未缴费",
		};
		this.fees.unshift(newFee);
		return { success: true, totalRoom: 1, successRoom: 1, errorRoom: 0, msg: "创建收费成功" };
	}

	async listFeeConfigs(params: FeeConfigQuery) {
		let data = [...this.feeConfigs];
		if (params.feeTypeCd) {
			data = data.filter((item) => item.feeTypeCd === params.feeTypeCd);
		}
		if (params.isDefault) {
			data = data.filter((item) => item.isDefault === params.isDefault);
		}
		if (params.valid !== undefined) {
			data = data.filter((item) => item.valid === params.valid);
		}
		return paginate(data, params.page, params.row).list;
	}

	async getFeeSummaryReport() {
		const feeRoomCount = new Set(this.fees.map((item) => item.roomId)).size;
		const oweFees = this.fees.filter((item) => item.oweAmount > 0);
		return {
			list: [
				{
					feeRoomCount,
					oweRoomCount: new Set(oweFees.map((item) => item.roomId)).size,
					curOweFee: oweFees.reduce((sum, item) => sum + item.oweAmount, 0),
					hisOweFee: 320,
					receivedFee: this.fees.reduce((sum, item) => sum + item.paidAmount, 0),
					curReceivableFee: this.fees.reduce((sum, item) => sum + item.receivedAmount, 0),
					hisReceivedFee: 960,
					roomCount: feeRoomCount,
				},
			],
		};
	}

	async getPayFeeDetailReport(params: PayFeeDetailQuery) {
		let data = this.feeDetails.map((item) => ({
			feeId: item.feeId,
			feeName: item.feeName,
			roomId: item.roomId,
			roomName: item.roomName,
			ownerName: item.ownerName,
			receivedAmount: item.receivedAmount,
			payTime: item.payTime,
			payMethod: item.payMethod,
			stateName: item.payState === "PAID" ? "已缴费" : "未缴费",
		}));
		if (params.roomId) {
			data = data.filter((item) => item.roomId === params.roomId);
		}
		if (params.name) {
			data = data.filter((item) => item.feeName.includes(params.name || ""));
		}
		const result = paginate(data, params.page, params.row);
		return { list: result.list, total: result.total };
	}

	async getRoomFeeReport(params: RoomFeeReportQuery) {
		let data = this.fees.map((item) => ({
			roomId: item.roomId,
			roomName: item.roomName,
			ownerName: item.ownerName,
			feeName: item.feeName,
			receivableFee: item.receivedAmount,
			receivedFee: item.paidAmount,
			oweFee: item.oweAmount,
			stateName: item.stateName,
		}));
		if (params.roomId) {
			data = data.filter((item) => item.roomId === params.roomId);
		}
		const result = paginate(data, params.page, params.row);
		return { list: result.list, total: result.total };
	}

	async getDataReport() {
		return {
			list: [
				{ name: "本月应收", value: this.fees.reduce((sum, item) => sum + item.receivedAmount, 0), unit: "元" },
				{ name: "本月实收", value: this.fees.reduce((sum, item) => sum + item.paidAmount, 0), unit: "元" },
				{ name: "欠费房屋", value: this.fees.filter((item) => item.oweAmount > 0).length, unit: "户" },
			],
		};
	}
}

function paginate<T>(data: T[], page: number, row: number) {
	const start = (page - 1) * row;
	const end = start + row;
	return {
		list: data.slice(start, end),
		total: data.length,
		page,
		row,
	};
}

function toOweFee(fee: FeeItem): OweFeeItem {
	return {
		oweFeeId: `OWE_${fee.feeId}`,
		feeId: fee.feeId,
		feeName: fee.feeName,
		roomId: fee.roomId,
		roomName: fee.roomName,
		communityId: fee.communityId,
		ownerName: fee.ownerName,
		ownerTel: fee.ownerTel,
		oweAmount: fee.oweAmount,
		startTime: fee.startTime,
		endTime: fee.endTime,
		oweDays: fee.state === "OVERDUE" ? 15 : 3,
		lateFee: fee.state === "OVERDUE" ? 12 : 0,
		totalAmount: fee.oweAmount + (fee.state === "OVERDUE" ? 12 : 0),
		state: fee.state,
		createTime: fee.createTime,
	};
}

function toAdminHouseCharge(fee: FeeItem): AdminHouseChargeListItem {
	return {
		id: fee.feeId,
		houseId: fee.roomId,
		expenseItem: fee.feeName,
		receivableAmount: String(fee.receivedAmount),
		receivedAmount: String(fee.paidAmount),
		billingPeriod: `${fee.startTime} 至 ${fee.endTime}`,
		status:
			fee.state === "PAID"
				? "paid"
				: fee.state === "PARTIAL_PAID"
					? "partial"
					: fee.state === "OVERDUE"
						? "overdue"
						: "unpaid",
		billDate: fee.startTime,
		dueDate: fee.deadlineTime || fee.endTime,
		remark: fee.feeFlagName,
		createTime: fee.createTime,
		updateTime: fee.updateTime,
	};
}

export function toPaymentDetailsFormItem(item: PayFeeDetailReportItem): PaymentDetailsFormListItem {
	return {
		id: item.feeId,
		name: item.feeName,
		status: item.stateName,
		createTime: item.payTime,
		updateTime: item.payTime,
		remark: `${item.roomName} ${item.payMethod}`.trim(),
	};
}

const defaultFees: FeeItem[] = [
	{
		feeId: "FEE_001",
		feeName: "物业管理费",
		feeType: "PROPERTY",
		feeTypeCdName: "物业费",
		roomId: "ROOM_001",
		roomName: "1栋101室",
		communityId: "COMM_001",
		ownerName: "张三",
		ownerTel: "13800138001",
		receivedAmount: 360,
		paidAmount: 120,
		oweAmount: 240,
		startTime: "2026-04-01",
		endTime: "2026-04-30",
		deadlineTime: "2026-04-30",
		feeFlagName: "周期性费用",
		state: "PARTIAL_PAID",
		stateName: "部分缴费",
		createTime: "2026-04-01 09:00:00",
		updateTime: "2026-04-10 10:30:00",
	},
	{
		feeId: "FEE_002",
		feeName: "公共服务费",
		feeType: "SERVICE",
		feeTypeCdName: "服务费",
		roomId: "ROOM_002",
		roomName: "2栋202室",
		communityId: "COMM_001",
		ownerName: "李四",
		ownerTel: "13800138002",
		receivedAmount: 280,
		paidAmount: 280,
		oweAmount: 0,
		startTime: "2026-04-01",
		endTime: "2026-04-30",
		deadlineTime: "2026-04-30",
		feeFlagName: "周期性费用",
		state: "PAID",
		stateName: "已缴费",
		createTime: "2026-04-01 09:10:00",
		updateTime: "2026-04-12 15:20:00",
	},
	{
		feeId: "FEE_003",
		feeName: "水费",
		feeType: "WATER",
		feeTypeCdName: "水费",
		roomId: "ROOM_003",
		roomName: "3栋303室",
		communityId: "COMM_001",
		ownerName: "王五",
		ownerTel: "13800138003",
		receivedAmount: 96,
		paidAmount: 0,
		oweAmount: 96,
		startTime: "2026-03-01",
		endTime: "2026-03-31",
		deadlineTime: "2026-04-10",
		feeFlagName: "一次性费用",
		state: "OVERDUE",
		stateName: "已逾期",
		createTime: "2026-03-31 08:30:00",
		updateTime: "2026-04-11 08:30:00",
	},
];

const defaultFeeDetails: FeeDetailItem[] = [
	{
		detailId: "FEE_DETAIL_001",
		feeId: "FEE_001",
		feeName: "物业管理费",
		roomId: "ROOM_001",
		roomName: "1栋101A室",
		communityId: "COMM_001",
		ownerName: "张三",
		receivedAmount: 300,
		payTime: "2026-04-15 10:30:00",
		payMethod: "微信支付",
		payState: "PAID",
		createTime: "2026-04-15 10:30:00",
	},
	{
		detailId: "FEE_DETAIL_002",
		feeId: "FEE_001",
		feeName: "垃圾处理费",
		roomId: "ROOM_001",
		roomName: "1栋101A室",
		communityId: "COMM_001",
		ownerName: "张三",
		receivedAmount: 50,
		payTime: "2026-04-15 10:31:00",
		payMethod: "微信支付",
		payState: "PAID",
		createTime: "2026-04-15 10:31:00",
	},
];

const defaultFeeConfigs: FeeConfigItem[] = [
	{
		configId: "CONFIG_001",
		feeName: "物业管理费标准",
		feeTypeCd: "888800010001",
		feeFlag: "1003006",
		computingFormula: "4004",
		isDefault: "F",
		valid: 1,
	},
];

const defaultCallables: OweFeeCallableItem[] = [
	{
		feeId: "FEE_001",
		feeName: "物业管理费",
		ownerName: "张三",
		staffName: "客服张霞",
		amountdOwed: 240,
		callableWayName: "电话催缴",
		startTime: "2026-04-01",
		endTime: "2026-04-30",
		remark: "已电话提醒业主尽快缴费",
		createTime: "2026-04-15 10:00:00",
	},
];
