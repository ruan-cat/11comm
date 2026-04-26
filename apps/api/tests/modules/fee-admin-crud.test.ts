import { describe, test } from "vitest";
import { expect } from "vitest";

import { createAdminFeeAdapter } from "../../server/modules/fee/admin-adapter";
import { createInMemoryFeeRepository } from "../../server/modules/fee/repository";
import { createFeeService } from "../../server/modules/fee/service";

describe("fee admin CRUD phase5a contract", () => {
	test("same repository provides house-charge list and detail read models", async () => {
		const repository = createInMemoryFeeRepository() as any;

		const list = await repository.listHouseCharges({ pageIndex: 1, pageSize: 10 });
		expect(list.list.length).toBeGreaterThan(0);

		const detail = await repository.getHouseChargeDetail(list.list[0].id);

		expect(detail).toMatchObject({
			id: list.list[0].id,
			name: expect.any(String),
			houseId: expect.any(String),
			expenseItem: expect.any(String),
			receivableAmount: expect.any(String),
			receivedAmount: expect.any(String),
			billingPeriod: expect.any(String),
			status: expect.any(String),
		});
	});

	test("same service creates and updates expense item settings without writing blocked fields", async () => {
		const service = createFeeService(createInMemoryFeeRepository()) as any;

		const created = await service.createExpenseItemSetting({
			code: "FEE_PHASE5A",
			feeType: "PROPERTY",
			expenseItem: "Property fee phase5a",
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
			unit: "blocked-unit",
			prepaymentPeriod: "blocked-period",
		});

		expect(created).toMatchObject({
			id: expect.any(String),
			code: "FEE_PHASE5A",
			feeType: "PROPERTY",
			expenseItem: "Property fee phase5a",
			fixedFee: "128",
			status: "enabled",
		});
		expect(created).not.toHaveProperty("unit");
		expect(created).not.toHaveProperty("prepaymentPeriod");

		const updated = await service.updateExpenseItemSetting({
			id: created.id,
			code: "FEE_PHASE5A",
			feeType: "PROPERTY",
			expenseItem: "Property fee phase5a updated",
			paymentType: "monthly",
			paymentCycle: "1",
			formula: "fixedFee",
			billingUnitPrice: "0",
			fixedFee: "168",
			accountDeduction: "disabled",
			mobilePayment: "disabled",
			roundingMode: "round",
			decimalPlaces: 2,
			status: "disabled",
			unit: "blocked-unit-updated",
			prepaymentPeriod: "blocked-period-updated",
		});

		expect(updated).toMatchObject({
			id: created.id,
			expenseItem: "Property fee phase5a updated",
			fixedFee: "168",
			accountDeduction: "disabled",
			mobilePayment: "disabled",
			status: "disabled",
		});
		expect(updated).not.toHaveProperty("unit");
		expect(updated).not.toHaveProperty("prepaymentPeriod");
	});

	test("house-charge write methods stay hidden until field ownership gate passes", () => {
		const repository = createInMemoryFeeRepository() as unknown as Record<string, unknown>;
		const service = createFeeService(createInMemoryFeeRepository()) as unknown as Record<string, unknown>;
		const adminAdapter = createAdminFeeAdapter(createFeeService(createInMemoryFeeRepository())) as Record<
			string,
			unknown
		>;

		expect(repository.createHouseCharge).toBeUndefined();
		expect(repository.updateHouseCharge).toBeUndefined();
		expect(repository.deleteHouseCharge).toBeUndefined();
		expect(service.createHouseCharge).toBeUndefined();
		expect(service.updateHouseCharge).toBeUndefined();
		expect(service.deleteHouseCharge).toBeUndefined();
		expect(adminAdapter.createHouseCharge).toBeUndefined();
		expect(adminAdapter.updateHouseCharge).toBeUndefined();
		expect(adminAdapter.deleteHouseCharge).toBeUndefined();
	});

	test("delete behavior is an explicit policy instead of implied soft delete", async () => {
		const service = createFeeService(createInMemoryFeeRepository()) as any;

		expect(service.deleteHouseCharge).toBeUndefined();

		const result = await service.deleteExpenseItemSetting("EXPENSE_ITEM_PHASE5A");

		expect(isExplicitDeleteRejection(result)).toBe(true);
	});
});

function isExplicitDeleteRejection(value: unknown): boolean {
	if (!value || typeof value !== "object") {
		return false;
	}

	const record = value as Record<string, unknown>;
	const text = JSON.stringify(value).toLowerCase();
	const hasRejectedFlag =
		record.success === false ||
		record.ok === false ||
		record.allowed === false ||
		record.deleted === false ||
		record.status === "blocked" ||
		record.status === "rejected" ||
		record.status === "unsupported";
	const explainsDeletePolicy =
		text.includes("delete") ||
		text.includes("deletedat") ||
		text.includes("soft") ||
		text.includes("physical") ||
		text.includes("policy") ||
		text.includes("blocked") ||
		text.includes("unsupported");

	return hasRejectedFlag && explainsDeletePolicy;
}
