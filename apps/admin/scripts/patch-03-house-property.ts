import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "drizzle/seed/03-house-property.sql");
const OWNER_ID = "32f4cbc2-ada7-53eb-8169-34eb23681024";

function main() {
	if (!fs.existsSync(FILE)) {
		console.error("File not found:", FILE);
		process.exit(1);
	}

	let content = fs.readFileSync(FILE, "utf-8");
	console.log("Read file, size:", content.length);

	// 1. Patch hp_owners
	content = content.replace(/insert into "hp_owners" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		console.log("Patching hp_owners");
		const newCols = `"id", "name", "id_card", "phone", "gender", "email", "address", "emergency_contact", "remark", "created_at", "updated_at", "deleted_at"`;
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			const parts = tupleContent.split(",").map((p) => p.trim());
			if (parts.length === 14) {
				return `(${parts.slice(0, 9).join(", ")}, ${parts.slice(11).join(", ")})`;
			}
			return tupleMatch;
		});
		return `insert into "hp_owners" (${newCols}) values ${newValString};`;
	});

	// 2. Patch hp_houses
	content = content.replace(/insert into "hp_houses" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		console.log("Patching hp_houses");
		const newCols = `"id", "community_id", "building_no", "unit_no", "floor", "room_no", "house_number", "building_area", "usable_area", "house_type", "status", "remark", "created_at", "updated_at"`;
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			const parts = tupleContent.split(",").map((p) => p.trim());
			if (parts.length === 16) {
				return `(${parts.slice(0, 12).join(", ")}, ${parts.slice(14).join(", ")})`;
			}
			return tupleMatch;
		});
		return `insert into "hp_houses" (${newCols}) values ${newValString};`;
	});

	// 3. Patch hp_owner_members
	content = content.replace(/insert into "hp_owner_members" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		console.log("Patching hp_owner_members");
		const newCols = `"id", "owner_id", "name", "gender", "member_type", "id_card", "phone", "home_address", "face_photo_url", "access_key", "remark", "created_at", "updated_at"`;
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			const parts = tupleContent.split(",").map((p) => p.trim());
			if (parts[1] === "NULL") {
				parts[1] = `'${OWNER_ID}'`;
			}
			if (parts.length === 14) {
				return `(${parts.slice(0, 11).join(", ")}, ${parts.slice(12).join(", ")})`;
			}
			return `(${parts.join(", ")})`;
		});
		return `insert into "hp_owner_members" (${newCols}) values ${newValString};`;
	});

	// 4. Patch hp_owners_committees
	content = content.replace(/insert into "hp_owners_committees" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		console.log("Patching hp_owners_committees");
		const newCols = `"id", "committee_name", "established_date", "term", "chairman", "contact_phone", "member_list", "position", "tenure", "remark", "created_at", "updated_at"`;
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			const parts = tupleContent.split(",").map((p) => p.trim());
			if (parts.length === 18) {
				return `(${parts.slice(0, 10).join(", ")}, ${parts.slice(16).join(", ")})`;
			}
			return tupleMatch;
		});
		return `insert into "hp_owners_committees" (${newCols}) values ${newValString};`;
	});

	// 5. Patch hp_owner_accounts
	content = content.replace(/insert into "hp_owner_accounts" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		console.log("Patching hp_owner_accounts");
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			return "(" + tupleContent.replace(/, NULL,/, `, '${OWNER_ID}',`) + ")";
		});
		return `insert into "hp_owner_accounts" (${cols}) values ${newValString};`;
	});

	// 6. Patch hp_invoice_titles
	content = content.replace(/insert into "hp_invoice_titles" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		console.log("Patching hp_invoice_titles");
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			return "(" + tupleContent.replace(/, NULL,/, `, '${OWNER_ID}',`) + ")";
		});
		return `insert into "hp_invoice_titles" (${cols}) values ${newValString};`;
	});

	// 7. Patch hp_invoices
	content = content.replace(/insert into "hp_invoices" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		console.log("Patching hp_invoices");
		const newCols = `"id", "invoice_no", "invoice_type", "amount", "invoice_date", "payment_id", "remark", "created_at", "updated_at"`;
		// Remove 6..12 (7 cols)
		// Indices: 0..5 kept. 6..12 removed. 13..15 kept.
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			const parts = tupleContent.split(",").map((p) => p.trim());
			if (parts.length === 16) {
				return `(${parts.slice(0, 6).join(", ")}, ${parts.slice(13).join(", ")})`;
			}
			// Be careful about timestamps containing colons if not quoted?
			// But here they are quoted or default.
			// '2024-...'
			return tupleMatch;
		});
		return `insert into "hp_invoices" (${newCols}) values ${newValString};`;
	});

	fs.writeFileSync(FILE, content);
	console.log("Fixed 03-house-property.sql");
}

main();
