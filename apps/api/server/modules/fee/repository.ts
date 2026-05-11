import { randomUUID } from "node:crypto";
import { and, desc, eq, gte, like, lte, sql } from "drizzle-orm";
import {
	exExpenseItems,
	exHouseCharges,
	exOverdueReminders,
	exPayments,
	exExpenseSummaryTables,
	exMeterReadingTypes,
	exRefundReviews,
	exReprintVouchers,
	exVehicleCharges,
	exMeterReadings,
	exPaymentReviews,
	type ExHouseCharge,
	insertExExpenseItemSchema,
	rptExpenseSummaries,
	rptDataStatistics,
	rptDepositReports,
	rptFeeReminders,
	rptNoChargeHouses,
	rptOutstandingFees,
	rptPatrolReports,
	rptPaymentDetails,
	updateExExpenseItemSchema,
	type ExExpenseItem,
	type NewExExpenseItem,
	type PaymentDetailsFormListItem,
	type UpdateExExpenseItem,
} from "@01s-11comm/type";
import type { DbType } from "../../db";
import type {
	AdminExpenseItemSettingListItem,
	AdminHouseChargeListItem,
	DataReportItem,
	ExpenseItemSettingDeletePolicy,
	ExpenseItemSettingMutationInput,
	ExpenseItemSettingQuery,
	FeeConfigItem,
	FeeDetailItem,
	FeeItem,
	FeeSummaryReportItem,
	OweFeeCallableItem,
	OweFeeItem,
	PayFeeDetailReportItem,
	AdminExpenseSummaryTableListItem,
	AdminMeterReadingTypeListItem,
	VehicleChargeListItem,
	WaterAndElectricityMeterReadingListItem,
	AdminRefundReviewListItem,
	ReminderForOverduePaymentListItem,
	ReminderForOverduePaymentsQuery,
	ReprintVoucherListItem,
	ReprintVouchersQuery,
	RoomFeeReportItem,
	OverduePaymentInformationListItem,
	ListOverduePaymentInformationParams,
	PaymentReviewListItem,
	ListVehicleChargesParams,
	ListWaterAndElectricityMeterReadingsParams,
	ListPaymentReviewsParams,
	ArrearsDetailsListItem,
	ListArrearsDetailsListParams,
	DataStatisticsListItem,
	ListDataStatisticsParams,
	DepositReportListItem,
	ListDepositReportParams,
	FeeReminderListItem,
	ListFeeReminderParams,
	NoChargeHouseListItem,
	ListNoChargeHouseParams,
	OutstandingFeesAnalysisListItem,
	ListOutstandingFeesAnalysisParams,
	PatrolReportListItem,
	ListPatrolReportParams,
} from "./types";
import { formatDateTime } from "../../utils/format-date";

export interface FeeRepository {
	listHouseCharges: (params: ListHouseChargesParams) => Promise<{ list: AdminHouseChargeListItem[]; total: number }>;
	getHouseChargeDetail: (id: string) => Promise<AdminHouseChargeListItem | null>;
	listExpenseItemSettings: (
		params: ExpenseItemSettingQuery,
	) => Promise<{ list: AdminExpenseItemSettingListItem[]; total: number }>;
	getExpenseItemSettingDetail: (id: string) => Promise<AdminExpenseItemSettingListItem | null>;
	createExpenseItemSetting: (input: ExpenseItemSettingMutationInput) => Promise<AdminExpenseItemSettingListItem>;
	updateExpenseItemSetting: (
		input: ExpenseItemSettingMutationInput & { id: string },
	) => Promise<AdminExpenseItemSettingListItem>;
	deleteExpenseItemSetting: (id: string) => Promise<ExpenseItemSettingDeletePolicy>;
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
	listExpenseSummaryTables: (
		params: ListExpenseSummaryTablesParams,
	) => Promise<{ list: AdminExpenseSummaryTableListItem[]; total: number }>;
	listRefundReviews: (params: ListRefundReviewsParams) => Promise<{ list: AdminRefundReviewListItem[]; total: number }>;
	listMeterReadingTypes: (
		params: ListMeterReadingTypesParams,
	) => Promise<{ list: AdminMeterReadingTypeListItem[]; total: number }>;
	listReminderForOverduePayments: (
		params: ReminderForOverduePaymentsQuery,
	) => Promise<{ list: ReminderForOverduePaymentListItem[]; total: number }>;
	listReprintVouchers: (params: ReprintVouchersQuery) => Promise<{ list: ReprintVoucherListItem[]; total: number }>;
	listVehicleCharges: (params: ListVehicleChargesParams) => Promise<{ list: VehicleChargeListItem[]; total: number }>;
	listWaterAndElectricityMeterReadings: (
		params: ListWaterAndElectricityMeterReadingsParams,
	) => Promise<{ list: WaterAndElectricityMeterReadingListItem[]; total: number }>;
	listOverduePaymentInformation: (
		params: ListOverduePaymentInformationParams,
	) => Promise<{ list: OverduePaymentInformationListItem[]; total: number }>;
	listPaymentReviews: (params: ListPaymentReviewsParams) => Promise<{ list: PaymentReviewListItem[]; total: number }>;
	listArrearsDetailsList: (
		params: ListArrearsDetailsListParams,
	) => Promise<{ list: ArrearsDetailsListItem[]; total: number }>;
	listDataStatistics: (params: ListDataStatisticsParams) => Promise<{ list: DataStatisticsListItem[]; total: number }>;
	listDepositReport: (params: ListDepositReportParams) => Promise<{ list: DepositReportListItem[]; total: number }>;
	listFeeReminder: (params: ListFeeReminderParams) => Promise<{ list: FeeReminderListItem[]; total: number }>;
	listNoChargeHouse: (params: ListNoChargeHouseParams) => Promise<{ list: NoChargeHouseListItem[]; total: number }>;
	listOutstandingFeesAnalysis: (
		params: ListOutstandingFeesAnalysisParams,
	) => Promise<{ list: OutstandingFeesAnalysisListItem[]; total: number }>;
	listPatrolReport: (params: ListPatrolReportParams) => Promise<{ list: PatrolReportListItem[]; total: number }>;
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

export interface ListExpenseSummaryTablesParams {
	pageIndex: number;
	pageSize: number;
	time?: string;
	expenseItemId?: string;
	expenseItemName?: string;
	status?: string;
}

export interface ListRefundReviewsParams {
	pageIndex: number;
	pageSize: number;
	applicant?: string;
	status?: string;
	sortBy?: "createTime" | "updateTime";
	sortOrder?: "asc" | "desc";
}

export interface ListMeterReadingTypesParams {
	pageIndex: number;
	pageSize: number;
	typeName?: string;
	typeCode?: string;
	status?: string;
	sortBy?: "createTime" | "updateTime";
	sortOrder?: "asc" | "desc";
}

export function createFeeRepository(options: { db?: DbType } = {}): FeeRepository {
	return options.db ? createDbFeeRepository(options.db) : createInMemoryFeeRepository();
}

export function createInMemoryFeeRepository(seed?: Partial<InMemoryFeeSeed>): FeeRepository {
	return new InMemoryFeeRepository(seed);
}

export function createDbFeeRepository(db: DbType): FeeRepository {
	const fallback = createInMemoryFeeRepository();

	return Object.assign(fallback, {
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
					name: item.expenseItem || "",
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
		async getHouseChargeDetail(id) {
			const rows = await db.select().from(exHouseCharges).where(eq(exHouseCharges.id, id)).limit(1);
			const item = rows[0];

			return item
				? {
						id: item.id,
						name: item.expenseItem || "",
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
					}
				: null;
		},
		async listOweFees(params) {
			const conditions = [];
			const roomId = params.roomId || params.ownerId;
			if (roomId && isUuid(roomId)) {
				conditions.push(eq(exHouseCharges.houseId, roomId));
			}
			// ex_house_charges has no owner/community columns; legacy communityId/owner defaults stay empty.
			// Non-UUID communityId values such as COMM_001 are intentionally not pushed into UUID columns.
			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const rows = await db.select().from(exHouseCharges).where(where).orderBy(desc(exHouseCharges.createTime));
			const data = rows.map(toOweFeeFromHouseCharge).filter((item) => item.oweAmount > 0);
			const page = paginate(data, params.page, params.row);

			return {
				data: page.list,
				totalAmount: data.reduce((sum, item) => sum + item.totalAmount, 0),
				total: data.length,
				page: params.page,
				row: params.row,
			};
		},
		async listExpenseItemSettings(params) {
			const conditions = [];
			if (params.code) {
				conditions.push(like(exExpenseItems.expenseCode, `%${params.code}%`));
			}
			if (params.expenseItem) {
				conditions.push(like(exExpenseItems.itemName, `%${params.expenseItem}%`));
			}
			if (params.expenseIdentifier) {
				conditions.push(like(exExpenseItems.expenseCode, `%${params.expenseIdentifier}%`));
			}
			if (params.paymentType) {
				conditions.push(eq(exExpenseItems.paymentType, params.paymentType));
			}
			if (params.accountDeduction) {
				conditions.push(eq(exExpenseItems.accountDeduction, toBooleanFlag(params.accountDeduction, false)));
			}
			if (params.status) {
				conditions.push(eq(exExpenseItems.status, params.status as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(exExpenseItems)
				.where(where);
			const rows = await db
				.select()
				.from(exExpenseItems)
				.where(where)
				.orderBy(desc(exExpenseItems.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map(toAdminExpenseItemSetting),
			};
		},
		async getExpenseItemSettingDetail(id) {
			const rows = await db.select().from(exExpenseItems).where(eq(exExpenseItems.id, id)).limit(1);
			return rows[0] ? toAdminExpenseItemSetting(rows[0]) : null;
		},
		async createExpenseItemSetting(input) {
			const parsed = toNewExpenseItem(input);
			const rows = await db.insert(exExpenseItems).values(parsed).returning();
			return toAdminExpenseItemSetting(rows[0]);
		},
		async updateExpenseItemSetting(input) {
			const parsed = toUpdateExpenseItem(input);
			const { id, ...changes } = parsed;
			const rows = await db.update(exExpenseItems).set(changes).where(eq(exExpenseItems.id, id)).returning();
			if (!rows[0]) {
				throw new Error(`Expense item setting not found: ${id}`);
			}

			return toAdminExpenseItemSetting(rows[0]);
		},
		async deleteExpenseItemSetting(id) {
			return createExpenseItemDeletePolicy(id);
		},
		async listFeeConfigs(params) {
			const conditions = [];
			if (params.feeTypeCd) {
				conditions.push(eq(exExpenseItems.expenseType, params.feeTypeCd));
			}
			if (params.valid !== undefined) {
				conditions.push(eq(exExpenseItems.status, params.valid === 0 ? "disabled" : "enabled"));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const rows = await db
				.select()
				.from(exExpenseItems)
				.where(where)
				.orderBy(desc(exExpenseItems.createTime))
				.limit(params.row)
				.offset((params.page - 1) * params.row);

			return rows.map(toFeeConfigItem);
		},
		async getFeeSummaryReport(params) {
			const conditions = [];
			if (params.communityId && isUuid(params.communityId)) {
				conditions.push(eq(rptExpenseSummaries.communityId, params.communityId));
			}
			if (params.feeTypeCd) {
				conditions.push(eq(rptExpenseSummaries.expenseType, params.feeTypeCd));
			}
			if (params.floorId) {
				conditions.push(eq(rptExpenseSummaries.building, params.floorId));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const rows = await db.select().from(rptExpenseSummaries).where(where);
			const roomKeys = new Set<string>();
			const oweRoomKeys = new Set<string>();
			let curReceivableFee = 0;
			let receivedFee = 0;
			let curOweFee = 0;

			for (const row of rows) {
				const roomKey = String(row.building || row.id || roomKeys.size);
				const outstandingTotal = toNumber(row.outstandingTotal);

				roomKeys.add(roomKey);
				if (outstandingTotal > 0) {
					oweRoomKeys.add(roomKey);
				}
				curReceivableFee += toNumber(row.receivableTotal);
				receivedFee += toNumber(row.receivedTotal);
				curOweFee += outstandingTotal;
			}

			return {
				list: [
					{
						feeRoomCount: roomKeys.size || rows.length,
						oweRoomCount: oweRoomKeys.size,
						curOweFee,
						// rpt_expense_summaries stores current totals only; historical buckets stay conservative.
						hisOweFee: 0,
						receivedFee,
						curReceivableFee,
						hisReceivedFee: 0,
						roomCount: roomKeys.size || rows.length,
					},
				],
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
				collector: item.collector || "",
				transactionNo: item.transactionNo || "",
			}));

			return { list, total: Number(countResult[0]?.total || 0) };
		},
		async getRoomFeeReport(params) {
			const conditions = [];
			// exHouseCharges has no communityId column; Non-UUID communityId values such as COMM_001
			// are intentionally not pushed into UUID columns (same strategy as listOweFees).
			if (params.roomId && isUuid(params.roomId)) {
				conditions.push(eq(exHouseCharges.houseId, params.roomId));
			}
			if (params.feeTypeCd) {
				conditions.push(like(exHouseCharges.expenseItem, `%${params.feeTypeCd}%`));
			}
			// floorId cannot be pushed to exHouseCharges (no floor column); kept as compat gap.

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
				.limit(params.row)
				.offset((params.page - 1) * params.row);

			return {
				list: rows.map((item) => ({
					roomId: item.houseId,
					roomName: item.houseId,
					ownerName: "",
					feeName: item.expenseItem || "",
					receivableFee: toNumber(item.receivableAmount),
					receivedFee: toNumber(item.receivedAmount),
					oweFee: Math.max(toNumber(item.receivableAmount) - toNumber(item.receivedAmount), 0),
					stateName: toRoomFeeStateName(item.status),
				})),
				total: Number(countResult[0]?.total || 0),
			};
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
		async listExpenseSummaryTables(params) {
			const conditions = [];
			if (params.time) {
				conditions.push(like(exExpenseSummaryTables.time, "%" + params.time + "%"));
			}
			if (params.expenseItemName) {
				conditions.push(like(exExpenseSummaryTables.expenseItemName, "%" + params.expenseItemName + "%"));
			}
			if (params.expenseItemId) {
				conditions.push(eq(exExpenseSummaryTables.expenseItemId, params.expenseItemId));
			}
			if (params.status) {
				conditions.push(eq(exExpenseSummaryTables.status, params.status as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(exExpenseSummaryTables)
				.where(where);
			const rows = await db
				.select()
				.from(exExpenseSummaryTables)
				.where(where)
				.orderBy(desc(exExpenseSummaryTables.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map(function (item) {
					return {
						id: item.id,
						time: item.time || "",
						expenseItemId: item.expenseItemId || "",
						expenseItemName: item.expenseItemName || "",
						receivableAmount: item.receivableAmount || "",
						actualAmount: item.actualAmount || "",
						status: item.status || "enabled",
						remark: item.remark || "",
						createTime: formatDateTime(item.createTime),
						updateTime: formatDateTime(item.updateTime),
					};
				}),
			};
		},
		async listRefundReviews(params) {
			const conditions = [];
			if (params.applicant) {
				conditions.push(like(exRefundReviews.applicant, "%" + params.applicant + "%"));
			}
			if (params.status) {
				conditions.push(eq(exRefundReviews.status, params.status as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(exRefundReviews)
				.where(where);
			const sortBy = params.sortBy || "createTime";
			const sortOrder = params.sortOrder || "desc";
			const sortFields = {
				createTime: exRefundReviews.createTime,
				updateTime: exRefundReviews.updateTime,
			};
			const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : sortFields[sortBy];
			const rows = await db
				.select()
				.from(exRefundReviews)
				.where(where)
				.orderBy(orderBy)
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map(function (item) {
					return {
						id: item.id,
						chargeId: item.chargeId,
						chargeType: item.chargeType || "",
						refundReason: item.refundReason || "",
						refundAmount: item.refundAmount || "",
						applyTime: formatDateTime(item.applyTime),
						applicant: item.applicant || "",
						status: item.status || "pending",
						reviewer: item.reviewer || "",
						reviewTime: formatDateTime(item.reviewTime),
						reviewOpinion: item.reviewOpinion || "",
						remark: item.remark || "",
						createTime: formatDateTime(item.createTime),
						updateTime: formatDateTime(item.updateTime),
					};
				}),
			};
		},
		async listMeterReadingTypes(params) {
			const conditions = [];
			if (params.typeName) {
				conditions.push(like(exMeterReadingTypes.typeName, "%" + params.typeName + "%"));
			}
			if (params.typeCode) {
				conditions.push(like(exMeterReadingTypes.typeCode, "%" + params.typeCode + "%"));
			}
			if (params.status) {
				conditions.push(eq(exMeterReadingTypes.status, params.status as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(exMeterReadingTypes)
				.where(where);
			const sortBy = params.sortBy || "createTime";
			const sortOrder = params.sortOrder || "desc";
			const sortFields = {
				createTime: exMeterReadingTypes.createTime,
				updateTime: exMeterReadingTypes.updateTime,
			};
			const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : sortFields[sortBy];
			const rows = await db
				.select()
				.from(exMeterReadingTypes)
				.where(where)
				.orderBy(orderBy)
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map(function (item) {
					return {
						id: item.id,
						typeName: item.typeName || "",
						typeCode: item.typeCode || "",
						unitPrice: item.unitPrice || "",
						billingMethod: item.billingMethod || "",
						status: item.status || "enabled",
						remark: item.remark || "",
						createTime: formatDateTime(item.createTime),
						updateTime: formatDateTime(item.updateTime),
					};
				}),
			};
		},
		async createNativeQrcodePayment(params) {
			void exPayments;
			return fallback.createNativeQrcodePayment(params);
		},
		async listReminderForOverduePayments(params) {
			const conditions = [];
			if (params.name) {
				conditions.push(like(exOverdueReminders.reminderName, `%${params.name}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql`count(*)` })
				.from(exOverdueReminders)
				.where(where);
			const rows = await db
				.select()
				.from(exOverdueReminders)
				.where(where)
				.orderBy(desc(exOverdueReminders.createTime))
				.limit(params.pageSize)
				.offset((params.page - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					name: item.reminderName || "",
					status: "enabled",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
		async listReprintVouchers(params) {
			const conditions = [];
			if (params.name) {
				conditions.push(like(exReprintVouchers.operator, `%${params.name}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql`count(*)` })
				.from(exReprintVouchers)
				.where(where);
			const rows = await db
				.select()
				.from(exReprintVouchers)
				.where(where)
				.orderBy(desc(exReprintVouchers.createTime))
				.limit(params.pageSize)
				.offset((params.page - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					name: item.operator || "",
					status: "enabled",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
		async listVehicleCharges(params) {
			const conditions = [];
			if (params.ownerName) {
				conditions.push(like(exVehicleCharges.ownerName, "%" + params.ownerName + "%"));
			}
			if (params.status) {
				conditions.push(eq(exVehicleCharges.status, params.status as any));
			}
			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql`count(*)` })
				.from(exVehicleCharges)
				.where(where);
			const sortBy = params.sortBy || "createTime";
			const sortOrder = params.sortOrder || "desc";
			const sortFields = {
				createTime: exVehicleCharges.createTime,
				updateTime: exVehicleCharges.updateTime,
			};
			const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : sortFields[sortBy];
			const rows = await db
				.select()
				.from(exVehicleCharges)
				.where(where)
				.orderBy(orderBy)
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);
			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map(function (item) {
					return {
						id: item.id,
						name: item.ownerName || "",
						status: item.status || "unpaid",
						remark: item.remark || "",
						createTime: formatDateTime(item.createTime),
						updateTime: formatDateTime(item.updateTime),
					};
				}),
			};
		},
		async listWaterAndElectricityMeterReadings(params) {
			const conditions = [];
			if (params.meterId) {
				conditions.push(like(exMeterReadings.meterNo, "%" + params.meterId + "%"));
			}
			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql`count(*)` })
				.from(exMeterReadings)
				.where(where);
			const sortBy = params.sortBy || "createTime";
			const sortOrder = params.sortOrder || "desc";
			const sortFields = {
				createTime: exMeterReadings.createTime,
				updateTime: exMeterReadings.updateTime,
			};
			const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : sortFields[sortBy];
			const rows = await db
				.select()
				.from(exMeterReadings)
				.where(where)
				.orderBy(orderBy)
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);
			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map(function (item) {
					return {
						meterId: item.meterNo,
						meterType: params.meterType || "",
						objectName: item.houseId || "",
						lastReading: item.previousReading || "",
						currentReading: item.currentReading || "",
						lastReadingTime: item.readingDate ? formatDateTime(item.readingDate) : "",
						currentReadingTime: item.readingDate ? formatDateTime(item.readingDate) : "",
						createTime: formatDateTime(item.createTime),
						updateTime: formatDateTime(item.updateTime),
					};
				}),
			};
		},
		async listOverduePaymentInformation(params) {
			const conditions = [];
			if (params.chargeObject) {
				conditions.push(like(exOverdueReminders.chargeType, `%${params.chargeObject}%`));
			}
			if (params.ownerName) {
				conditions.push(like(exOverdueReminders.reminderName, `%${params.ownerName}%`));
			}
			if (params.phoneNumber) {
				conditions.push(like(exOverdueReminders.contactPhone, `%${params.phoneNumber}%`));
			}
			if (params.startTime) {
				conditions.push(gte(exOverdueReminders.reminderTime, params.startTime as any));
			}
			if (params.endTime) {
				conditions.push(lte(exOverdueReminders.reminderTime, params.endTime as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(exOverdueReminders)
				.where(where);

			const sortBy = params.sortBy || "createTime";
			const sortOrder = params.sortOrder || "desc";
			const sortFields = {
				createTime: exOverdueReminders.createTime,
				updateTime: exOverdueReminders.updateTime,
			};
			const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : sortFields[sortBy];

			const rows = await db
				.select()
				.from(exOverdueReminders)
				.where(where)
				.orderBy(orderBy)
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					chargeObject: item.chargeType || "",
					ownerName: item.reminderName || "",
					phoneNumber: item.contactPhone || "",
					startTime: item.reminderTime ? formatDateTime(item.reminderTime).split(" ")[0] : "",
					endTime: item.reminderTime ? formatDateTime(item.reminderTime).split(" ")[0] : "",
					totalAmount: item.reminderResult || "",
					status: "unpaid",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
		async listPaymentReviews(params) {
			const conditions = [];
			if (params.reviewer) {
				conditions.push(like(exPaymentReviews.reviewer, `%${params.reviewer}%`));
			}
			if (params.reviewResult) {
				conditions.push(eq(exPaymentReviews.reviewResult, params.reviewResult as any));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(exPaymentReviews)
				.where(where);

			const sortBy = params.sortBy || "createTime";
			const sortOrder = params.sortOrder || "desc";
			const sortFields = {
				createTime: exPaymentReviews.createTime,
				updateTime: exPaymentReviews.updateTime,
			};
			const orderBy = sortOrder === "desc" ? desc(sortFields[sortBy]) : sortFields[sortBy];

			const rows = await db
				.select()
				.from(exPaymentReviews)
				.where(where)
				.orderBy(orderBy)
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					paymentId: item.paymentId,
					reviewer: item.reviewer || "",
					reviewOpinion: item.reviewOpinion || "",
					reviewResult: item.reviewResult || "pending",
					reviewTime: formatDateTime(item.reviewTime),
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
		async listArrearsDetailsList(params) {
			const conditions = [];
			if (params.name) {
				conditions.push(like(rptExpenseSummaries.building, `%${params.name}%`));
			}
			if (params.status) {
				conditions.push(sql`CAST(${rptExpenseSummaries.outstandingTotal} AS numeric) > 0`);
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(rptExpenseSummaries)
				.where(where);
			const rows = await db
				.select()
				.from(rptExpenseSummaries)
				.where(where)
				.orderBy(desc(rptExpenseSummaries.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					building: item.building || "",
					expenseItem: item.expenseItem || "",
					outstandingTotal: item.outstandingTotal || "",
					periodStart: item.periodStart || "",
					periodEnd: item.periodEnd || "",
					owner: "",
					ownerPhone: "",
					area: "",
					arrearsDuration: "",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
		async listDataStatistics(params) {
			const conditions = [];
			if (params.name) {
				conditions.push(like(rptDataStatistics.statisticIndicator, `%${params.name}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(rptDataStatistics)
				.where(where);
			const rows = await db
				.select()
				.from(rptDataStatistics)
				.where(where)
				.orderBy(desc(rptDataStatistics.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					name: item.statisticIndicator || "",
					status: item.comparisonBaseline ? "已设置基准" : "未设置基准",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
		async listDepositReport(params) {
			const conditions = [];
			if (params.name) {
				conditions.push(like(rptDepositReports.depositType, `%${params.name}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(rptDepositReports)
				.where(where);
			const rows = await db
				.select()
				.from(rptDepositReports)
				.where(where)
				.orderBy(desc(rptDepositReports.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					name: item.depositType || "",
					status: item.collectedTotal ? "正常" : "无数据",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
		async listFeeReminder(params: ListFeeReminderParams) {
			const conditions = [];
			if (params.name) {
				conditions.push(like(rptFeeReminders.ownerInfo, `%${params.name}%`));
			}
			if (params.status) {
				conditions.push(eq(rptFeeReminders.isDelivered, params.status === "已送达"));
			}
			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(rptFeeReminders)
				.where(where);
			const rows = await db
				.select()
				.from(rptFeeReminders)
				.where(where)
				.orderBy(desc(rptFeeReminders.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);
			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					name: item.ownerInfo || "",
					status: item.isDelivered ? "已送达" : "未送达",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
		async listNoChargeHouse(params: ListNoChargeHouseParams) {
			const conditions = [];
			if (params.name) {
				conditions.push(like(rptNoChargeHouses.houseNumber, `%${params.name}%`));
			}
			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(rptNoChargeHouses)
				.where(where);
			const rows = await db
				.select()
				.from(rptNoChargeHouses)
				.where(where)
				.orderBy(desc(rptNoChargeHouses.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);
			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					houseNumberContractName: item.houseNumber || "",
					ownerName: item.ownerInfo || "",
					community: "",
					building: "",
					unit: "",
					ownerPhone: "",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
		async listOutstandingFeesAnalysis(params: ListOutstandingFeesAnalysisParams) {
			const conditions = [];
			if (params.name) {
				conditions.push(like(rptOutstandingFees.expenseItem, `%${params.name}%`));
			}
			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(rptOutstandingFees)
				.where(where);
			const rows = await db
				.select()
				.from(rptOutstandingFees)
				.where(where)
				.orderBy(desc(rptOutstandingFees.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);
			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					feeItem: item.expenseItem || "",
					totalUncollectedAmount: item.outstandingAmount || "0",
					latestReceivableMonth: item.agingBucket || "",
					statisticsTime: formatDateTime(item.createTime),
					unit: "",
					houseNumberContractName: "",
					ownerName: "",
					ownerPhone: "",
					currentUncollectedAmount: "",
					historicalUncollectedAmount: "",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
		async listPatrolReport(params: ListPatrolReportParams) {
			const conditions = [];
			if (params.name) {
				conditions.push(like(rptPatrolReports.dimension, `%${params.name}%`));
			}
			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(rptPatrolReports)
				.where(where);
			const rows = await db
				.select()
				.from(rptPatrolReports)
				.where(where)
				.orderBy(desc(rptPatrolReports.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);
			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((item) => ({
					id: item.id,
					patrolName: item.dimension || "",
					patrolLevel: item.dimension || "",
					patrolType: item.period || "",
					status: (item.completedTasks ?? 0) > 0 ? "已完成" : "未完成",
					abnormalCount: item.abnormalTasks || 0,
					community: "",
					responsiblePerson: "",
					remark: item.remark || "",
					createTime: formatDateTime(item.createTime),
					updateTime: formatDateTime(item.updateTime),
				})),
			};
		},
	} satisfies Partial<FeeRepository>);
}

interface InMemoryFeeSeed {
	expenseSummaryTables: AdminExpenseSummaryTableListItem[];
	refundReviews: AdminRefundReviewListItem[];
	meterReadingTypes: AdminMeterReadingTypeListItem[];
	fees: FeeItem[];
	feeDetails: FeeDetailItem[];
	feeConfigs: FeeConfigItem[];
	callables: OweFeeCallableItem[];
	expenseItemSettings: AdminExpenseItemSettingListItem[];
}

class InMemoryFeeRepository implements FeeRepository {
	private readonly expenseSummaryTables: AdminExpenseSummaryTableListItem[];
	private readonly refundReviews: AdminRefundReviewListItem[];
	private readonly meterReadingTypes: AdminMeterReadingTypeListItem[];
	private readonly fees: FeeItem[];
	private readonly feeDetails: FeeDetailItem[];
	private readonly feeConfigs: FeeConfigItem[];
	private readonly callables: OweFeeCallableItem[];
	private readonly expenseItemSettings: AdminExpenseItemSettingListItem[];

	constructor(seed?: Partial<InMemoryFeeSeed>) {
		this.fees = structuredClone(seed?.fees ?? defaultFees);
		this.feeDetails = structuredClone(seed?.feeDetails ?? defaultFeeDetails);
		this.feeConfigs = structuredClone(seed?.feeConfigs ?? defaultFeeConfigs);
		this.callables = structuredClone(seed?.callables ?? defaultCallables);
		this.expenseSummaryTables = structuredClone(seed?.expenseSummaryTables ?? defaultExpenseSummaryTables);
		this.refundReviews = structuredClone(seed?.refundReviews ?? defaultRefundReviews);
		this.meterReadingTypes = structuredClone(seed?.meterReadingTypes ?? defaultMeterReadingTypes);
		this.expenseItemSettings = structuredClone(seed?.expenseItemSettings ?? defaultExpenseItemSettings);
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

	async getHouseChargeDetail(id: string) {
		const item = this.fees.map(toAdminHouseCharge).find((charge) => charge.id === id);
		return item ?? null;
	}

	async listExpenseItemSettings(params: ExpenseItemSettingQuery) {
		let data = [...this.expenseItemSettings];
		if (params.code) {
			data = data.filter((item) => item.code.includes(params.code || ""));
		}
		if (params.expenseItem) {
			data = data.filter((item) => item.expenseItem.includes(params.expenseItem || ""));
		}
		if (params.expenseIdentifier) {
			data = data.filter((item) => item.expenseIdentifier.includes(params.expenseIdentifier || ""));
		}
		if (params.paymentType) {
			data = data.filter((item) => item.paymentType === params.paymentType);
		}
		if (params.accountDeduction) {
			data = data.filter((item) => item.accountDeduction === params.accountDeduction);
		}
		if (params.status) {
			data = data.filter((item) => item.status === params.status);
		}

		return paginate(data, params.pageIndex, params.pageSize);
	}

	async getExpenseItemSettingDetail(id: string) {
		return this.expenseItemSettings.find((item) => item.id === id) ?? null;
	}

	async createExpenseItemSetting(input: ExpenseItemSettingMutationInput) {
		const parsed = toNewExpenseItem(input);
		const now = formatDateTime(new Date());
		const item = toAdminExpenseItemSetting({
			...parsed,
			id: randomUUID(),
			createTime: now,
			updateTime: now,
		});
		this.expenseItemSettings.unshift(item);

		return item;
	}

	async updateExpenseItemSetting(input: ExpenseItemSettingMutationInput & { id: string }) {
		const parsed = toUpdateExpenseItem(input);
		const index = this.expenseItemSettings.findIndex((item) => item.id === parsed.id);
		if (index === -1) {
			throw new Error(`Expense item setting not found: ${parsed.id}`);
		}

		const current = this.expenseItemSettings[index];
		const now = formatDateTime(new Date());
		const updated = toAdminExpenseItemSetting({
			id: current.id,
			expenseType: parsed.expenseType ?? current.feeType,
			itemName: parsed.itemName ?? current.expenseItem,
			expenseCode: parsed.expenseCode ?? current.code,
			paymentType: parsed.paymentType ?? current.paymentType,
			unitPrice: parsed.unitPrice ?? current.billingUnitPrice,
			fixedFee: parsed.fixedFee ?? current.fixedFee,
			formula: parsed.formula ?? current.formula,
			billingCycle: parsed.billingCycle ?? current.paymentCycle,
			accountDeduction:
				parsed.accountDeduction === undefined
					? toBooleanFlag(current.accountDeduction, false)
					: parsed.accountDeduction,
			mobilePayment:
				parsed.mobilePayment === undefined ? toBooleanFlag(current.mobilePayment, true) : parsed.mobilePayment,
			roundingMode: parsed.roundingMode ?? current.roundingMode,
			decimalPlaces: parsed.decimalPlaces ?? current.decimalPlaces,
			status: parsed.status ?? current.status,
			remark: parsed.remark ?? current.remark,
			createTime: current.createTime,
			updateTime: now,
		});
		this.expenseItemSettings[index] = updated;

		return updated;
	}

	async deleteExpenseItemSetting(id: string) {
		return createExpenseItemDeletePolicy(id);
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
	async listReminderForOverduePayments(params: ReminderForOverduePaymentsQuery) {
		const data: ReminderForOverduePaymentListItem[] = [];
		return paginate(data, params.page, params.pageSize);
	}

	async listReprintVouchers(params: ReprintVouchersQuery) {
		const data: ReprintVoucherListItem[] = [];
		return paginate(data, params.page, params.pageSize);
	}

	async listVehicleCharges(params: ListVehicleChargesParams) {
		const data: VehicleChargeListItem[] = [];
		return paginate(data, params.pageIndex, params.pageSize);
	}

	async listWaterAndElectricityMeterReadings(params: ListWaterAndElectricityMeterReadingsParams) {
		const data: WaterAndElectricityMeterReadingListItem[] = [];
		return paginate(data, params.pageIndex, params.pageSize);
	}
	async listExpenseSummaryTables(params: ListExpenseSummaryTablesParams) {
		let data = [...this.expenseSummaryTables];
		if (params.time) {
			data = data.filter((item) => item.time.includes(params.time || ""));
		}
		if (params.expenseItemName) {
			data = data.filter((item) => item.expenseItemName.includes(params.expenseItemName || ""));
		}
		if (params.expenseItemId) {
			data = data.filter((item) => item.expenseItemId === params.expenseItemId);
		}
		if (params.status) {
			data = data.filter((item) => item.status === params.status);
		}
		return paginate(data, params.pageIndex, params.pageSize);
	}

	async listRefundReviews(params: ListRefundReviewsParams) {
		let data = [...this.refundReviews];
		if (params.applicant) {
			data = data.filter((item) => item.applicant.includes(params.applicant || ""));
		}
		if (params.status) {
			data = data.filter((item) => item.status === params.status);
		}
		return paginate(data, params.pageIndex, params.pageSize);
	}

	async listMeterReadingTypes(params: ListMeterReadingTypesParams) {
		let data = [...this.meterReadingTypes];
		if (params.typeName) {
			data = data.filter((item) => item.typeName.includes(params.typeName || ""));
		}
		if (params.typeCode) {
			data = data.filter((item) => item.typeCode.includes(params.typeCode || ""));
		}
		if (params.status) {
			data = data.filter((item) => item.status === params.status);
		}
		return paginate(data, params.pageIndex, params.pageSize);
	}

	async listOverduePaymentInformation(params: ListOverduePaymentInformationParams) {
		const data: OverduePaymentInformationListItem[] = [];
		return paginate(data, params.pageIndex, params.pageSize);
	}

	async listPaymentReviews(params: ListPaymentReviewsParams) {
		const data: PaymentReviewListItem[] = [];
		return paginate(data, params.pageIndex, params.pageSize);
	}

	async listArrearsDetailsList(params: ListArrearsDetailsListParams) {
		const data: ArrearsDetailsListItem[] = [];
		return paginate(data, params.pageIndex, params.pageSize);
	}

	async listDataStatistics(params: ListDataStatisticsParams) {
		const data: DataStatisticsListItem[] = [];
		return paginate(data, params.pageIndex, params.pageSize);
	}

	async listDepositReport(params: ListDepositReportParams) {
		const data: DepositReportListItem[] = [];
		return paginate(data, params.pageIndex, params.pageSize);
	}

	async listFeeReminder(params: ListFeeReminderParams) {
		const data: FeeReminderListItem[] = [];
		return paginate(data, params.pageIndex, params.pageSize);
	}

	async listNoChargeHouse(params: ListNoChargeHouseParams) {
		const data: NoChargeHouseListItem[] = [];
		return paginate(data, params.pageIndex, params.pageSize);
	}

	async listOutstandingFeesAnalysis(params: ListOutstandingFeesAnalysisParams) {
		const data: OutstandingFeesAnalysisListItem[] = [];
		return paginate(data, params.pageIndex, params.pageSize);
	}

	async listPatrolReport(params: ListPatrolReportParams) {
		const data: PatrolReportListItem[] = [];
		return paginate(data, params.pageIndex, params.pageSize);
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

interface ExpenseItemSettingRecord {
	id: string;
	expenseType: string;
	itemName: string;
	expenseCode?: string | null;
	paymentType?: string | null;
	unitPrice?: string | number | null;
	fixedFee?: string | number | null;
	formula?: string | null;
	billingCycle?: string | null;
	accountDeduction?: boolean | string | null;
	mobilePayment?: boolean | string | null;
	roundingMode?: string | null;
	decimalPlaces?: string | number | null;
	status?: string | null;
	remark?: string | null;
	createTime?: Date | string | number | null;
	updateTime?: Date | string | number | null;
}

function toNewExpenseItem(input: ExpenseItemSettingMutationInput): NewExExpenseItem {
	const draft = {
		expenseType: String(input.feeType ?? ""),
		itemName: String(input.expenseItem ?? ""),
		expenseCode: blankToNull(input.code ?? input.expenseIdentifier),
		paymentType: blankToNull(input.paymentType),
		unitPrice: toDecimalString(input.billingUnitPrice, "0"),
		fixedFee: toDecimalString(input.fixedFee, "0"),
		formula: blankToNull(input.formula),
		billingCycle: blankToNull(input.paymentCycle),
		accountDeduction: toBooleanFlag(input.accountDeduction, false),
		mobilePayment: toBooleanFlag(input.mobilePayment, true),
		roundingMode: toRoundingMode(input.roundingMode),
		decimalPlaces: toDecimalPlaces(input.decimalPlaces, 2),
		status: toStatus(input.status),
		remark: blankToNull(input.remark),
	};

	return insertExExpenseItemSchema.parse(draft) as NewExExpenseItem;
}

function toUpdateExpenseItem(input: ExpenseItemSettingMutationInput & { id: string }): UpdateExExpenseItem {
	const draft: Record<string, unknown> = { id: input.id };
	assignIfPresent(draft, "expenseType", input.feeType);
	assignIfPresent(draft, "itemName", input.expenseItem);
	assignIfPresent(draft, "expenseCode", input.code ?? input.expenseIdentifier, blankToNull);
	assignIfPresent(draft, "paymentType", input.paymentType, blankToNull);
	assignIfPresent(draft, "unitPrice", input.billingUnitPrice, (value) => toDecimalString(value, "0"));
	assignIfPresent(draft, "fixedFee", input.fixedFee, (value) => toDecimalString(value, "0"));
	assignIfPresent(draft, "formula", input.formula, blankToNull);
	assignIfPresent(draft, "billingCycle", input.paymentCycle, blankToNull);
	assignIfPresent(draft, "accountDeduction", input.accountDeduction, (value) => toBooleanFlag(value, false));
	assignIfPresent(draft, "mobilePayment", input.mobilePayment, (value) => toBooleanFlag(value, true));
	assignIfPresent(draft, "roundingMode", input.roundingMode, toRoundingMode);
	assignIfPresent(draft, "decimalPlaces", input.decimalPlaces, (value) => toDecimalPlaces(value, 2));
	assignIfPresent(draft, "status", input.status, toStatus);
	assignIfPresent(draft, "remark", input.remark, blankToNull);

	return updateExExpenseItemSchema.parse(draft) as UpdateExExpenseItem;
}

function assignIfPresent(
	draft: Record<string, unknown>,
	key: string,
	value: unknown,
	mapper: (value: unknown) => unknown = (item) => item,
): void {
	if (value !== undefined) {
		draft[key] = mapper(value);
	}
}

function toAdminExpenseItemSetting(item: ExExpenseItem | ExpenseItemSettingRecord): AdminExpenseItemSettingListItem {
	const code = toStringOrEmpty(item.expenseCode);

	return {
		id: item.id,
		code,
		feeType: item.expenseType || "",
		expenseItem: item.itemName || "",
		expenseIdentifier: code,
		paymentType: toStringOrEmpty(item.paymentType),
		paymentCycle: toStringOrEmpty(item.billingCycle),
		formula: toStringOrEmpty(item.formula),
		billingUnitPrice: toStringOrEmpty(item.unitPrice),
		fixedFee: toStringOrEmpty(item.fixedFee),
		accountDeduction: toEnabledFlag(item.accountDeduction, "disabled"),
		mobilePayment: toEnabledFlag(item.mobilePayment, "enabled"),
		roundingMode: toRoundingMode(item.roundingMode),
		decimalPlaces: toDecimalPlaces(item.decimalPlaces, 2),
		status: toStatus(item.status),
		createTime: formatDateTime(item.createTime),
		updateTime: formatDateTime(item.updateTime),
		remark: item.remark ?? "",
	};
}

function createExpenseItemDeletePolicy(id: string): ExpenseItemSettingDeletePolicy {
	return {
		id,
		success: false,
		allowed: false,
		deleted: false,
		status: "unsupported",
		reason: "delete unsupported: ex_expense_items has no deletedAt column and physical delete is blocked by policy",
	};
}

function toFeeConfigItem(item: ExExpenseItem | ExpenseItemSettingRecord): FeeConfigItem {
	return {
		configId: item.id,
		feeName: item.itemName || "",
		feeTypeCd: item.expenseType || "",
		computingFormula: toStringOrEmpty(item.formula),
		feeFlag: toStringOrEmpty(item.paymentType),
		isDefault: "F",
		valid: item.status === "disabled" ? 0 : 1,
	};
}

function toStringOrEmpty(value: unknown): string {
	if (value === undefined || value === null) {
		return "";
	}
	return String(value);
}

function toNumber(value: unknown): number {
	const result = Number(value);
	return Number.isFinite(result) ? result : 0;
}

function isUuid(value: string): boolean {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function blankToNull(value: unknown): string | null {
	if (value === undefined || value === null) {
		return null;
	}
	const result = String(value).trim();
	return result === "" ? null : result;
}

function toDecimalString(value: unknown, fallback: string): string {
	if (value === undefined || value === null || String(value).trim() === "") {
		return fallback;
	}
	return String(value);
}

function toBooleanFlag(value: unknown, fallback: boolean): boolean {
	if (value === undefined || value === null || value === "") {
		return fallback;
	}
	if (typeof value === "boolean") {
		return value;
	}

	const normalized = String(value).trim().toLowerCase();
	if (["1", "true", "yes", "enabled", "enable", "on"].includes(normalized)) {
		return true;
	}
	if (["0", "false", "no", "disabled", "disable", "off"].includes(normalized)) {
		return false;
	}

	return fallback;
}

function toEnabledFlag(value: unknown, fallback: "enabled" | "disabled"): string {
	return toBooleanFlag(value, fallback === "enabled") ? "enabled" : "disabled";
}

function toRoundingMode(value: unknown): "round" | "ceil" | "floor" {
	return value === "ceil" || value === "floor" || value === "round" ? value : "round";
}

function toDecimalPlaces(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isInteger(result) && result >= 0 ? result : fallback;
}

function toStatus(value: unknown): "enabled" | "disabled" {
	return value === "disabled" ? "disabled" : "enabled";
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

function toOweFeeFromHouseCharge(item: ExHouseCharge): OweFeeItem {
	const oweAmount = Math.max(toNumber(item.receivableAmount) - toNumber(item.receivedAmount), 0);
	const billDate = toStringOrEmpty(item.billDate);
	const dueDate = toStringOrEmpty(item.dueDate);
	const billingPeriod = toStringOrEmpty(item.billingPeriod);

	return {
		oweFeeId: item.id,
		feeId: item.id,
		feeName: item.expenseItem || "",
		roomId: item.houseId,
		roomName: item.houseId,
		communityId: "",
		ownerName: "",
		ownerTel: "",
		oweAmount,
		startTime: billDate || billingPeriod,
		endTime: dueDate || billingPeriod,
		oweDays: 0,
		lateFee: 0,
		totalAmount: oweAmount,
		state: toLegacyOweState(item.status),
		createTime: formatDateTime(item.createTime),
	};
}

function toLegacyOweState(status: unknown): string {
	switch (status) {
		case "paid":
			return "PAID";
		case "partial":
			return "PARTIAL_PAID";
		case "overdue":
			return "OVERDUE";
		default:
			return "UNPAID";
	}
}

function toRoomFeeStateName(status: unknown): string {
	switch (status) {
		case "paid":
			return "已缴费";
		case "partial":
			return "部分缴纳";
		case "overdue":
			return "已逾期";
		default:
			return "未缴费";
	}
}

function toAdminHouseCharge(fee: FeeItem): AdminHouseChargeListItem {
	return {
		id: fee.feeId,
		name: fee.feeName,
		houseId: fee.roomId,
		expenseItem: fee.feeName,
		receivableAmount: String(fee.receivedAmount),
		receivedAmount: String(fee.paidAmount),
		billingPeriod: `${fee.startTime} 鑷?${fee.endTime}`,
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
	const amount = String(item.receivedAmount);
	const orderNumber = item.transactionNo || item.feeId;

	return {
		id: item.feeId,
		name: item.feeName,
		status: item.stateName,
		orderNumber,
		community: "COMM_001",
		roomNumberOwner: [item.roomName, item.ownerName].filter(Boolean).join(" / "),
		feeType: item.feeName,
		feeItem: item.feeName,
		feeStatus: item.stateName,
		paymentMethod: item.payMethod,
		paymentTime: item.payTime,
		cashier: item.collector || "apps/api",
		payableAmount: amount,
		receivableAmount: amount,
		actualAmount: amount,
		accountDeduction: "0",
		discountAmount: "0",
		giftAmount: "0",
		lateFee: "0",
		area: "",
		parkingSpace: "",
		description: item.roomName,
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
		roomName: "1栋01室",
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
		stateName: "部分缴纳",
		createTime: "2026-04-01 09:00:00",
		updateTime: "2026-04-10 10:30:00",
	},
	{
		feeId: "FEE_002",
		feeName: "公共服务费",
		feeType: "SERVICE",
		feeTypeCdName: "服务费",
		roomId: "ROOM_002",
		roomName: "2栋02室",
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
		roomName: "3栋03室",
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
		roomName: "1栋01A室",
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
		roomName: "1栋01A室",
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
		staffName: "客服张露",
		amountdOwed: 240,
		callableWayName: "电话催缴",
		startTime: "2026-04-01",
		endTime: "2026-04-30",
		remark: "已电话提醒业主尽快缴费",
		createTime: "2026-04-15 10:00:00",
	},
];

const defaultExpenseSummaryTables: AdminExpenseSummaryTableListItem[] = [];

const defaultRefundReviews: AdminRefundReviewListItem[] = [];

const defaultMeterReadingTypes: AdminMeterReadingTypeListItem[] = [];

const defaultExpenseItemSettings: AdminExpenseItemSettingListItem[] = [
	{
		id: "00000000-0000-4000-8000-000000000001",
		code: "FEE_PROPERTY",
		feeType: "PROPERTY",
		expenseItem: "Property fee",
		expenseIdentifier: "FEE_PROPERTY",
		paymentType: "monthly",
		paymentCycle: "1",
		formula: "fixedFee",
		billingUnitPrice: "0",
		fixedFee: "128",
		accountDeduction: "enabled",
		mobilePayment: "enabled",
		roundingMode: "round",
		decimalPlaces: 2,
		status: "enabled",
		createTime: "2026-04-26 10:00:00",
		updateTime: "2026-04-26 10:00:00",
		remark: "phase5a default",
	},
];
