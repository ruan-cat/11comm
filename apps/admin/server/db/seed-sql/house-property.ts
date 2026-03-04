import {
	hpOwners,
	hpOwnersCommittees,
	hpHouses,
	hpOwnerMembers,
	hpOwnerAccounts,
	hpInvoiceTitles,
	hpInvoices,
	hpReserveVenues,
	hpReserveVenueOrders,
	hpSiteManagements,
	type NewHpOwner as InsertHpOwner,
	type NewHpOwnersCommittee as InsertHpOwnersCommittee,
	type NewHpHouse as InsertHpHouse,
	type NewHpOwnerMember as InsertHpOwnerMember,
	type NewHpOwnerAccount as InsertHpOwnerAccount,
	type NewHpInvoiceTitle as InsertHpInvoiceTitle,
	type NewHpInvoice as InsertHpInvoice,
	type NewHpReserveVenue as InsertHpReserveVenue,
	type NewHpReserveVenueOrder as InsertHpReserveVenueOrder,
	type NewHpSiteManagement as InsertHpSiteManagement,
} from "@01s-11comm/type";
import { mockHouseData } from "../../api/property-manage/house-property-manage/house/mock-data";
import { mockOwnerInformationData as mockOwnerData } from "../../api/property-manage/house-property-manage/owner-information/mock-data";
import { mockOwnersCommitteeData } from "../../api/property-manage/house-property-manage/owners-committee/mock-data";
import { mockOwnerMemberData } from "../../api/property-manage/house-property-manage/owner-member/mock-data";
import { mockOwnerAccountData } from "../../api/property-manage/house-property-manage/owner-account/mock-data";
import { mockInvoiceTitleData } from "../../api/property-manage/house-property-manage/invoice-title/mock-data";
import { mockInvoiceData } from "../../api/property-manage/house-property-manage/invoice/mock-data";
import { mockSiteManagementData } from "../../api/property-manage/house-property-manage/site-management/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, generateUuid } from "./index";
import { getDb } from "../index";

/**
 * 生成房产管理模块的 SQL
 */
export async function generateHousePropertySql(idMap: IdMapRegistry): Promise<SqlStatement[]> {
	const db = await getDb();
	const statements: SqlStatement[] = [];
	const defaultCommunityId = idMap.get("cm_communities", "COMM001") || generateUuid("cm_communities", "COMM001");

	// ==========================================
	// 1. 生成 hp_owners (业主信息)
	// ==========================================
	console.log("正在生成 hp_owners SQL...");
	const ownerNameToUuidMap = new Map<string, string>(); // Local map for Name -> UUID lookup

	const ownerRecords: any[] = mockOwnerData.map((item) => {
		// Check if we have an ID in mock data (e.g. `id`, `ownerId`).
		// If not, use name.
		const mockId = (item as any).id || (item as any).ownerId || item.name;
		const id = idMap.register("hp_owners", mockId);

		// Store mapping for name lookup
		if (item.name) {
			ownerNameToUuidMap.set(item.name, id);
		}

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
			address: item.address, // Mapping address to address
			remark: item.remark,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (ownerRecords.length > 0) {
		const query = db
			.insert(hpOwners as any)
			.values(ownerRecords)
			.toSQL();
		statements.push({
			table: "hp_owners",
			sql: toFullSql(query.sql, query.params),
			recordCount: ownerRecords.length,
		});
		console.log(`✅ 已生成 hp_owners SQL，共 ${ownerRecords.length} 条记录`);
	}

	// ==========================================
	// 2. 生成 hp_site_managements (场地管理)
	// ==========================================
	console.log("正在生成 hp_site_managements SQL...");
	const siteManagementRecords: any[] = mockSiteManagementData.map((item) => {
		const id = idMap.register("hp_site_managements", item.idNumber || item.id);
		return {
			id: id,
			siteName: item.name,
			location: item.name,
			manager: item.administrator,
			maintenanceRecord: item.remark,
			remark: item.remark,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: new Date(),
		};
	});

	if (siteManagementRecords.length > 0) {
		const query = db
			.insert(hpSiteManagements as any)
			.values(siteManagementRecords)
			.toSQL();
		statements.push({
			table: "hp_site_managements",
			sql: toFullSql(query.sql, query.params),
			recordCount: siteManagementRecords.length,
		});
		console.log(`✅ 已生成 hp_site_managements SQL，共 ${siteManagementRecords.length} 条记录`);
	}

	// ==========================================
	// 3. 生成 hp_reserve_venues (预约场地)
	// ==========================================
	console.log("正在生成 hp_reserve_venues SQL...");
	// 根据场地管理数据生成场地数据
	const venueRecords: any[] = mockSiteManagementData
		.filter((item) => item.status === "enabled" || item.status === "可预约")
		.slice(0, 10)
		.map((item, index) => {
			const id = idMap.register("hp_reserve_venues", `VENUE-${index + 1}`);
			return {
				id: id,
				venueName: item.name,
				venueType: item.name.includes("会议室")
					? "会议室"
					: item.name.includes("健身")
						? "健身房"
						: item.name.includes("泳")
							? "游泳池"
							: item.name.includes("羽毛")
								? "羽毛球场"
								: item.name.includes("网球")
									? "网球场"
									: item.name.includes("篮球")
										? "篮球场"
										: "其他",
				capacity: item.remark?.includes("容纳") ? parseInt(item.remark.match(/\d+/)?.[0] || "10") : 10,
				openTime: `${item.openingTime || "08:00"}-${item.closingTime || "22:00"}`,
				chargeStandard: item.hourlyFee ? `${item.hourlyFee}元/小时` : "免费",
				status: "enabled",
				remark: item.remark,
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: new Date(),
			};
		});

	if (venueRecords.length > 0) {
		const query = db
			.insert(hpReserveVenues as any)
			.values(venueRecords)
			.toSQL();
		statements.push({
			table: "hp_reserve_venues",
			sql: toFullSql(query.sql, query.params),
			recordCount: venueRecords.length,
		});
		console.log(`✅ 已生成 hp_reserve_venues SQL，共 ${venueRecords.length} 条记录`);
	}

	// ==========================================
	// 4. 生成 hp_owners_committees (业委会)
	// ==========================================
	console.log("正在生成 hp_owners_committees SQL...");
	const committeeRecords: any[] = mockOwnersCommitteeData.map((item) => {
		// Use fullName as the identifier, with fallback to name alias
		const committeeName = item.name || item.fullName;
		const id = idMap.register("hp_owners_committees", committeeName);
		// Use position from mock data, with fallback to role alias
		const positionVal = item.role || item.position;
		return {
			id: id,
			communityId: defaultCommunityId,
			committeeName: committeeName,
			position: positionVal,
			contactPhone: item.phone,
			tenure:
				item.tenure ||
				(item.termStart ? String(item.termStart) : "") + "-" + (item.termEnd ? String(item.termEnd) : ""),
			remark: item.remark,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: new Date(),
		};
	});

	if (committeeRecords.length > 0) {
		const query = db
			.insert(hpOwnersCommittees as any)
			.values(committeeRecords)
			.toSQL();
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
	const houseRecords: any[] = mockHouseData.map((item) => {
		const id = idMap.register("hp_houses", item.houseCode);
		// Link owner - use ownerName alias or owner field
		const ownerKey = item.ownerName || item.owner;

		// Use ownerNameToUuidMap for lookup by name
		let ownerId = ownerKey ? ownerNameToUuidMap.get(ownerKey) : null;

		// Fallback: try raw key in idMap (unlikely if registered by ID)
		if (!ownerId && ownerKey) {
			ownerId = idMap.get("hp_owners", ownerKey);
		}

		// Use area alias or houseArea field
		const areaValue = item.area || item.houseArea;

		return {
			id: id,
			communityId: defaultCommunityId,
			buildingNo: item.building,
			unitNo: item.unit,
			floor: item.floor,
			roomNo: item.room,
			houseNumber: item.houseCode,
			houseCode: item.houseCode,
			area: areaValue ? String(areaValue) : null,
			ownerId: ownerId,
			houseType: item.houseType,
			status: "enabled",
			remark: item.remark,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: new Date(),
		};
	});

	if (houseRecords.length > 0) {
		const query = db
			.insert(hpHouses as any)
			.values(houseRecords)
			.toSQL();
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
	// ==========================================
	// 6. 生成 hp_owner_members (家庭成员)
	// ==========================================
	console.log("正在生成 hp_owner_members SQL...");

	// Helper: Map HouseCode -> OwnerName from mockHouseData to link members to owners via address
	const houseToOwnerMap = new Map<string, string>();
	mockHouseData.forEach((h) => {
		const code = h.houseCode;
		// @ts-ignore - mock data types might be loose
		const owner = h.ownerName || h.owner;
		if (code && owner) {
			houseToOwnerMap.set(code, owner);
		}
	});

	const memberRecords: any[] = mockOwnerMemberData
		.map((item) => {
			// Use phone alias or contact field
			const phoneValue = item.phone || item.contact;
			const id = idMap.register("hp_owner_members", item.name + phoneValue);

			// Derive Owner ID
			// 1. Try explicit ownerName field (if exists)
			// 2. Try looking up owner via homeAddress (House Code)
			// 3. If member is "户主", assume they themselves are the owner
			let ownerName = (item as any).ownerName;

			if (!ownerName && item.homeAddress) {
				ownerName = houseToOwnerMap.get(item.homeAddress);
			}

			if (!ownerName && item.remark === "户主") {
				ownerName = item.name;
			}

			// Fallback for mock data consistency
			if (!ownerName) {
				// console.warn(`⚠️ Member ${item.name} has no linked owner, using default '张三'`);
				ownerName = "张三";
			}

			// Resolve UUID using Name Map
			const ownerId = ownerNameToUuidMap.get(ownerName) || idMap.get("hp_owners", ownerName);

			if (!ownerId) {
				// Skip if owner not found to satisfy NOT NULL constraint
				return null;
			}

			// Use relation alias or type field
			const memberType = item.relation || item.type;

			return {
				id: id,
				ownerId: ownerId,
				name: item.name,
				memberType: memberType,
				phone: phoneValue,
				gender: item.gender === "男" ? "male" : "female",
				idCard: item.idCard,
				remark: item.remark,
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: new Date(),
			};
		})
		.filter(Boolean) as any[];

	if (memberRecords.length > 0) {
		const query = db
			.insert(hpOwnerMembers as any)
			.values(memberRecords)
			.toSQL();
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
	const accountRecords: any[] = mockOwnerAccountData
		.map((item) => {
			const id = idMap.register("hp_owner_accounts", item.accountNo);
			// Link to owner? Mock data has accountName (owner name).
			const ownerName = item.accountName;
			const ownerId = ownerNameToUuidMap.get(ownerName) || idMap.get("hp_owners", ownerName);

			if (!ownerId) return null;

			return {
				id: id,
				ownerId: ownerId,
				accountNo: item.accountNo,
				accountType: item.accountType,
				balance: item.accountBalance ? String(item.accountBalance) : "0",
				status: "enabled", // Default
				remark: item.remark,
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: new Date(),
			};
		})
		.filter(Boolean) as any[];

	if (accountRecords.length > 0) {
		const query = db
			.insert(hpOwnerAccounts as any)
			.values(accountRecords)
			.toSQL();
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
	const titleRecords: any[] = mockInvoiceTitleData
		.map((item) => {
			const id = idMap.register("hp_invoice_titles", item.code); // Using code as unique identifier
			const ownerName = item.ownerName;
			const ownerId = ownerNameToUuidMap.get(ownerName) || idMap.get("hp_owners", ownerName);

			if (!ownerId) return null;

			return {
				id: id,
				ownerId: ownerId,
				titleType: item.invoiceType, // personal/company
				titleName: item.invoiceTitle,
				taxId: item.taxpayerId,
				addressPhone: item.address + " " + item.phone,
				bankAccount: item.bankAccount,
				isDefault: false,
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
			};
		})
		.filter(Boolean) as any[];

	if (titleRecords.length > 0) {
		const query = db
			.insert(hpInvoiceTitles as any)
			.values(titleRecords)
			.toSQL();
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
	const invoiceRecords: any[] = mockInvoiceData
		.map((item) => {
			const id = idMap.register("hp_invoices", item.code);
			const ownerName = item.ownerName;
			const ownerId = ownerNameToUuidMap.get(ownerName) || idMap.get("hp_owners", ownerName);

			if (!ownerId) return null;

			return {
				id: id,
				ownerId: ownerId,
				invoiceType: item.invoiceType,

				// invoiceTitleId: null, // Schema missing invoiceTitleId
				amount: item.applicationAmount ? String(item.applicationAmount) : "0",
				// status: auditStatusMap[item.auditStatus] || "pending", // Schema missing status
				invoiceNo: item.invoiceNumber,
				// drawer: item.applicant, // Schema missing drawer
				invoiceDate: item.applicationTime ? new Date(item.applicationTime) : null,
				remark: item.remark,
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
			};
		})
		.filter(Boolean) as any[];

	if (invoiceRecords.length > 0) {
		const query = db
			.insert(hpInvoices as any)
			.values(invoiceRecords)
			.toSQL();
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

	const venueOrderRecords: any[] = [];

	// 为每个场地生成 2-4 个预约订单
	mockSiteManagementData
		.filter((item) => item.status === "enabled" || item.status === "可预约")
		.slice(0, 10)
		.forEach((siteData, venueIndex) => {
			const venueId = idMap.get("hp_reserve_venues", `VENUE-${venueIndex + 1}`);
			if (!venueId) return;

			const orderCount = (venueIndex % 3) + 2; // 2-4个订单

			for (let i = 0; i < orderCount; i++) {
				const orderId = idMap.register("hp_reserve_venue_orders", `${siteData.name}-order-${i + 1}`);

				// 随机选择一个业主作为预约人
				const ownerIndex = (venueIndex + i) % mockOwnerData.length;
				const owner = mockOwnerData[ownerIndex];

				// 生成预约时间（未来7天内）
				const reservationDate = new Date();
				reservationDate.setDate(reservationDate.getDate() + (i % 7) + 1);
				reservationDate.setHours(9 + (i % 12), 0, 0, 0);

				// 生成开始和结束时间
				const startTime = new Date(reservationDate);
				const endTime = new Date(reservationDate);
				endTime.setHours(startTime.getHours() + 2); // 默认预约2小时

				// 预约状态
				const statuses = ["pending", "confirmed", "completed", "cancelled"];
				const status = statuses[i % statuses.length];

				venueOrderRecords.push({
					id: orderId,
					venueId: venueId,
					booker: owner.name,
					contactPhone: owner.phone || `138${String(ownerIndex).padStart(8, "0")}`,
					timeSlot: `${startTime.getHours()}:00-${endTime.getHours()}:00`,
					status: status,
					remark:
						status === "cancelled"
							? "临时有事取消"
							: status === "completed"
								? "已完成使用"
								: status === "confirmed"
									? "已确认预约"
									: "待确认",
					reservationTime: reservationDate,
					startTime: startTime,
					endTime: endTime,
					numberOfUsers: (i % 10) + 1, // 1-10人
					createTime: new Date(),
					updateTime: new Date(),
				});
			}
		});

	if (venueOrderRecords.length > 0) {
		const query = db
			.insert(hpReserveVenueOrders as any)
			.values(venueOrderRecords)
			.toSQL();
		statements.push({
			table: "hp_reserve_venue_orders",
			sql: toFullSql(query.sql, query.params),
			recordCount: venueOrderRecords.length,
		});
		console.log(`✅ 已生成 hp_reserve_venue_orders SQL，共 ${venueOrderRecords.length} 条记录`);
	}

	return statements;
}
