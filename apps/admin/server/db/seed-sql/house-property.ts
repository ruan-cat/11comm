import {
	hpOwners,
	hpReserveVenues,
	hpSiteManagements,
	hpOwnersCommittees,
	hpHouses,
	hpOwnerMembers,
	hpOwnerAccounts,
	hpInvoiceTitles,
	hpInvoices,
	hpReserveVenueOrders,
	InsertHpOwner,
	InsertHpReserveVenue,
	InsertHpSiteManagement,
	InsertHpOwnersCommittee,
	InsertHpHouse,
	InsertHpOwnerMember,
	InsertHpOwnerAccount,
	InsertHpInvoiceTitle,
	InsertHpInvoice,
	InsertHpReserveVenueOrder,
} from "../schemas/house-property";
import { mockHouseData } from "../../api/property-manage/house-property-manage/house/mock-data";
import { mockOwnerInformationData as mockOwnerData } from "../../api/property-manage/house-property-manage/owner-information/mock-data";
import { mockReserveVenueData } from "../../api/property-manage/house-property-manage/reserve-venue/mock-data";
import { mockSiteManagementData } from "../../api/property-manage/house-property-manage/site-management/mock-data";
import { mockOwnersCommitteeData } from "../../api/property-manage/house-property-manage/owners-committee/mock-data";
import { mockOwnerMemberData } from "../../api/property-manage/house-property-manage/owner-member/mock-data";
import { mockOwnerAccountData } from "../../api/property-manage/house-property-manage/owner-account/mock-data";
import { mockInvoiceTitleData } from "../../api/property-manage/house-property-manage/invoice-title/mock-data";
import { mockInvoiceData } from "../../api/property-manage/house-property-manage/invoice/mock-data";
import { mockReserveVenueOrderData } from "../../api/property-manage/house-property-manage/reserve-venue-order/mock-data";

import {
	IdMapRegistry,
	SqlStatement,
	toFullSql,
	statusMap,
	auditStatusMap,
	generateUuid,
	toSqlTimestamp,
	toSqlDate,
} from "./index";
import { db } from "../index";

/**
 * 生成房产管理模块的 SQL
 */
export function generateHousePropertySql(idMap: IdMapRegistry): SqlStatement[] {
	const statements: SqlStatement[] = [];
	const defaultCommunityId = idMap.get("cm_communities", "COMM001") || generateUuid("cm_communities", "COMM001");

	// ==========================================
	// 1. 生成 hp_owners (业主信息)
	// ==========================================
	console.log("正在生成 hp_owners SQL...");
	const ownerRecords: InsertHpOwner[] = mockOwnerData.map((item) => {
		// Check if we have an ID in mock data (e.g. `id`, `ownerId`).
		// If not, use name.
		const mockId = (item as any).id || (item as any).ownerId || item.name;
		const id = idMap.register("hp_owners", mockId);

		// Map gender
		let genderVal: "male" | "female" | null = null;
		if (item.gender === "男" || item.gender === "male") genderVal = "male";
		if (item.gender === "女" || item.gender === "female") genderVal = "female";

		return {
			id: id,
			communityId: defaultCommunityId,
			name: item.name,
			phone: item.phone,
			gender: genderVal,
			idCard: item.idCard,
			emergencyContact: item.emergencyContact,
			emergencyPhone: item.emergencyContactPhone,
			homeAddress: item.address, // Mapping address to homeAddress
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (ownerRecords.length > 0) {
		const query = db.insert(hpOwners).values(ownerRecords).toSQL();
		statements.push({
			table: "hp_owners",
			sql: toFullSql(query.sql, query.params),
			recordCount: ownerRecords.length,
		});
		console.log(`✅ 已生成 hp_owners SQL，共 ${ownerRecords.length} 条记录`);
	}

	// ==========================================
	// 2. 生成 hp_reserve_venues (预约场地)
	// ==========================================
	console.log("正在生成 hp_reserve_venues SQL...");
	const venueRecords: InsertHpReserveVenue[] = mockReserveVenueData.map((item) => {
		const id = idMap.register("hp_reserve_venues", item.name); // Using name as ID key
		return {
			id: id,
			communityId: defaultCommunityId,
			venueName: item.name,
			venueType: item.type,
			location: item.location,
			capacity: item.capacity ? Number(item.capacity) : null,
			openTime: item.openTime,
			closeTime: item.closeTime,
			chargeStandard: item.price ? String(item.price) : null, // Assuming price is convertible to string
			status: statusMap[item.status] || "enabled",
			description: item.description,
			mainImage: item.images ? item.images[0] : null, // Assuming images is array
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	});

	if (venueRecords.length > 0) {
		const query = db.insert(hpReserveVenues).values(venueRecords).toSQL();
		statements.push({
			table: "hp_reserve_venues",
			sql: toFullSql(query.sql, query.params),
			recordCount: venueRecords.length,
		});
		console.log(`✅ 已生成 hp_reserve_venues SQL，共 ${venueRecords.length} 条记录`);
	}

	// ==========================================
	// 3. 生成 hp_site_managements (场地管理 - associated with venues?)
	// ==========================================
	console.log("正在生成 hp_site_managements SQL...");
	const siteRecords: InsertHpSiteManagement[] = mockSiteManagementData.map((item) => {
		const id = idMap.register("hp_site_managements", item.siteName);
		const venueId = idMap.get("hp_reserve_venues", item.venueName);

		return {
			id: id,
			venueId: venueId, // Link to venue if possible
			siteName: item.siteName,
			siteCode: item.siteCode,
			status: statusMap[item.status] || "enabled",
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: new Date(),
		};
	});

	if (siteRecords.length > 0) {
		const query = db.insert(hpSiteManagements).values(siteRecords).toSQL();
		statements.push({
			table: "hp_site_managements",
			sql: toFullSql(query.sql, query.params),
			recordCount: siteRecords.length,
		});
		console.log(`✅ 已生成 hp_site_managements SQL，共 ${siteRecords.length} 条记录`);
	}

	// ==========================================
	// 4. 生成 hp_owners_committees (业委会)
	// ==========================================
	console.log("正在生成 hp_owners_committees SQL...");
	const committeeRecords: InsertHpOwnersCommittee[] = mockOwnersCommitteeData.map((item) => {
		const id = idMap.register("hp_owners_committees", item.name);
		return {
			id: id,
			communityId: defaultCommunityId,
			name: item.name,
			position: item.role, // role maps to position
			phone: item.phone,
			termStart: item.termStart ? String(item.termStart) : null,
			termEnd: item.termEnd ? String(item.termEnd) : null,
			status: statusMap[item.status] || "enabled",
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: new Date(),
		};
	});

	if (committeeRecords.length > 0) {
		const query = db.insert(hpOwnersCommittees).values(committeeRecords).toSQL();
		statements.push({
			table: "hp_owners_committees",
			sql: toFullSql(query.sql, query.params),
			recordCount: committeeRecords.length,
		});
		console.log(`✅ 已生成 hp_owners_committees SQL，共 ${committeeRecords.length} 条记录`);
	}

	// ==========================================
	// 5. 生成 hp_houses (房产信息)
	// ==========================================
	// Depends on owners
	console.log("正在生成 hp_houses SQL...");
	const houseRecords: InsertHpHouse[] = mockHouseData.map((item) => {
		const id = idMap.register("hp_houses", item.houseCode);
		// Link owner
		const ownerId = idMap.get("hp_owners", item.ownerName); // Assuming ownerName is the key used in Item 1 linking

		return {
			id: id,
			communityId: defaultCommunityId,
			buildingNo: item.building,
			unitNo: item.unit,
			floorNo: item.floor, // Mock has floor
			roomNo: item.room,
			houseCode: item.houseCode,
			area: item.area ? String(item.area) : null,
			ownerId: ownerId,
			houseType: item.houseType,
			usageType: item.usageType,
			occupancyStatus: item.status, // status maps to occupancyStatus (vacant, occupied, etc)
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: new Date(),
		};
	});

	if (houseRecords.length > 0) {
		const query = db.insert(hpHouses).values(houseRecords).toSQL();
		statements.push({
			table: "hp_houses",
			sql: toFullSql(query.sql, query.params),
			recordCount: houseRecords.length,
		});
		console.log(`✅ 已生成 hp_houses SQL，共 ${houseRecords.length} 条记录`);
	}

	// ==========================================
	// 6. 生成 hp_owner_members (家庭成员)
	// ==========================================
	console.log("正在生成 hp_owner_members SQL...");
	const memberRecords: InsertHpOwnerMember[] = mockOwnerMemberData.map((item) => {
		const id = idMap.register("hp_owner_members", item.name + item.phone); // Composite key
		const ownerId = idMap.get("hp_owners", item.ownerName);

		return {
			id: id,
			ownerId: ownerId,
			name: item.name,
			relation: item.relation,
			phone: item.phone,
			gender: item.gender === "男" ? "male" : "female",
			idCard: item.idCard,
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: new Date(),
		};
	});

	if (memberRecords.length > 0) {
		const query = db.insert(hpOwnerMembers).values(memberRecords).toSQL();
		statements.push({
			table: "hp_owner_members",
			sql: toFullSql(query.sql, query.params),
			recordCount: memberRecords.length,
		});
		console.log(`✅ 已生成 hp_owner_members SQL，共 ${memberRecords.length} 条记录`);
	}

	// ==========================================
	// 7. 生成 hp_owner_accounts (业主账户)
	// ==========================================
	console.log("正在生成 hp_owner_accounts SQL...");
	const accountRecords: InsertHpOwnerAccount[] = mockOwnerAccountData.map((item) => {
		const id = idMap.register("hp_owner_accounts", item.accountNo);
		// Link to owner? Mock data has accountName (owner name).
		const ownerId = idMap.get("hp_owners", item.accountName);

		return {
			id: id,
			ownerId: ownerId,
			accountNo: item.accountNo,
			accountType: item.accountType,
			balance: item.accountBalance ? String(item.accountBalance) : "0",
			status: "enabled", // Default
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: new Date(),
		};
	});

	if (accountRecords.length > 0) {
		const query = db.insert(hpOwnerAccounts).values(accountRecords).toSQL();
		statements.push({
			table: "hp_owner_accounts",
			sql: toFullSql(query.sql, query.params),
			recordCount: accountRecords.length,
		});
		console.log(`✅ 已生成 hp_owner_accounts SQL，共 ${accountRecords.length} 条记录`);
	}

	// ==========================================
	// 8. 生成 hp_invoice_titles (发票抬头)
	// ==========================================
	console.log("正在生成 hp_invoice_titles SQL...");
	const titleRecords: InsertHpInvoiceTitle[] = mockInvoiceTitleData.map((item) => {
		const id = idMap.register("hp_invoice_titles", item.code); // Using code as unique identifier
		const ownerId = idMap.get("hp_owners", item.ownerName);

		return {
			id: id,
			ownerId: ownerId,
			titleType: item.invoiceType, // personal/company
			titleName: item.invoiceTitle,
			taxId: item.taxpayerId,
			addressPhone: item.address + " " + item.phone,
			bankAccount: item.bankAccount,
			isDefault: false,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (titleRecords.length > 0) {
		const query = db.insert(hpInvoiceTitles).values(titleRecords).toSQL();
		statements.push({
			table: "hp_invoice_titles",
			sql: toFullSql(query.sql, query.params),
			recordCount: titleRecords.length,
		});
		console.log(`✅ 已生成 hp_invoice_titles SQL，共 ${titleRecords.length} 条记录`);
	}

	// ==========================================
	// 9. 生成 hp_invoices (发票记录)
	// ==========================================
	console.log("正在生成 hp_invoices SQL...");
	const invoiceRecords: InsertHpInvoice[] = mockInvoiceData.map((item) => {
		const id = idMap.register("hp_invoices", item.code);
		const ownerId = idMap.get("hp_owners", item.ownerName);

		return {
			id: id,
			ownerId: ownerId,
			invoiceType: item.invoiceType,
			invoiceTitleId: null, // Hard to link without exact matching
			amount: item.applicationAmount ? String(item.applicationAmount) : "0",
			status: auditStatusMap[item.auditStatus] || "pending",
			invoiceNumber: item.invoiceNumber,
			drawer: item.applicant,
			issueDate: item.applicationTime ? new Date(item.applicationTime) : null,
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (invoiceRecords.length > 0) {
		const query = db.insert(hpInvoices).values(invoiceRecords).toSQL();
		statements.push({
			table: "hp_invoices",
			sql: toFullSql(query.sql, query.params),
			recordCount: invoiceRecords.length,
		});
		console.log(`✅ 已生成 hp_invoices SQL，共 ${invoiceRecords.length} 条记录`);
	}

	// ==========================================
	// 10. 生成 hp_reserve_venue_orders (场馆预约订单)
	// ==========================================
	console.log("正在生成 hp_reserve_venue_orders SQL...");
	const orderRecords: InsertHpReserveVenueOrder[] = mockReserveVenueOrderData.map((item) => {
		const id = idMap.register("hp_reserve_venue_orders", item.orderNumber);
		const venueId = idMap.get("hp_reserve_venues", item.venue);
		// Link to owner/reserver. Mock has `reserver` (name).
		const ownerId = idMap.get("hp_owners", item.reserver);

		return {
			id: id,
			venueId: venueId,
			reserverId: ownerId, // Can be null if reserver not found in owners
			reserverName: item.reserver,
			reserverPhone: item.reservationPhone,
			reservationTime: item.reservationDate + " " + item.reservationTime,
			amount: item.receivableAmount ? String(item.receivableAmount) : "0",
			paymentStatus: item.status === "paid" ? "paid" : "unpaid", // Simplification
			paymentTime: null,
			status: statusMap[item.status] || "pending",
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: new Date(),
		};
	});

	if (orderRecords.length > 0) {
		const query = db.insert(hpReserveVenueOrders).values(orderRecords).toSQL();
		statements.push({
			table: "hp_reserve_venue_orders",
			sql: toFullSql(query.sql, query.params),
			recordCount: orderRecords.length,
		});
		console.log(`✅ 已生成 hp_reserve_venue_orders SQL，共 ${orderRecords.length} 条记录`);
	}

	return statements;
}
