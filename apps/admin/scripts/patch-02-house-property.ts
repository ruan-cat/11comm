import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const TARGET_FILE = path.join(process.cwd(), "drizzle/seed/02-house-property.sql");

function main() {
	if (!fs.existsSync(TARGET_FILE)) {
		console.error("File not found:", TARGET_FILE);
		process.exit(1);
	}

	let content = fs.readFileSync(TARGET_FILE, "utf-8");

	// 1. Patch hp_reserve_venues
	const FIXED_VENUE_ID = "3d83b95e-f4e3-5c86-b42f-e4035e0622a8";
	let isFirstVenue = true;
	content = content.replace(/insert into "hp_reserve_venues" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			if (tupleContent.includes("'enabled'")) {
				let id = isFirstVenue ? FIXED_VENUE_ID : randomUUID();
				isFirstVenue = false;
				const dateMatch = tupleContent.match(/, '([^']+)', '([^']+)'$/);
				const d1 = dateMatch ? dateMatch[1] : new Date().toISOString();
				const d2 = dateMatch ? dateMatch[2] : new Date().toISOString();
				return `('${id}', 'Standard Venue', 'General', '10', '09:00-22:00', 'Free', 'enabled', '', '${d1}', '${d2}')`;
			}
			return tupleMatch;
		});
		return `insert into "hp_reserve_venues" (${cols}) values ${newValString};`;
	});

	// 2. Patch hp_site_managements
	content = content.replace(/insert into "hp_site_managements" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			const dateMatch = tupleContent.match(/, '([^']+)', '([^']+)'$/);
			const d1 = dateMatch ? dateMatch[1] : new Date().toISOString();
			const d2 = dateMatch ? dateMatch[2] : new Date().toISOString();
			const id = randomUUID();
			return `('${id}', 'Site Name', 'Location A', 'Manager Bob', 'None', '', '${d1}', '${d2}')`;
		});
		return `insert into "hp_site_managements" (${cols}) values ${newValString};`;
	});

	// 2.1 Patch hp_owners_committees
	// Cols: id, committee_name, established_date, term, chairman, contact_phone, member_list, position, tenure, remark, created_at, updated_at
	// Val: 'uuid', default, default, default, default, default, default, default, default, 'remark', date, date
	// Needs regex to capture the remark and dates, and replace the middle defaults.
	// Pattern: 'uuid', default, default, default, default, default, default, default, default, 'remark'
	content = content.replace(/insert into "hp_owners_committees" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			// We want to replace the sequence of 8 defaults with mock data.
			// Mock: 'Committee A', '2024-01-01', 'Term 1', 'Chairman', '13888888888', '{}', 'Member', 'Tenure'
			// Regex: ', default, default, default, default, default, default, default, default, '
			// Replace with: ', 'Committee A', now(), '3 Years', 'Chairman John', '13800000000', '{}', 'Member', '2024-2027', '

			let p = tupleContent.replace(
				/, default, default, default, default, default, default, default, default, /,
				", 'Committee Name', '2024-01-01', '3 Years', 'Chairman Name', '13800138000', '{}', 'Member', '2024-2027', ",
			);

			// Also fix ID (first item) to be unique
			p = p.replace(/^'[^']+'/, `'${randomUUID()}'`);

			return "(" + p + ")";
		});
		return `insert into "hp_owners_committees" (${cols}) values ${newValString};`;
	});

	// 3. Patch hp_reserve_venue_orders
	content = content.replace(/insert into "hp_reserve_venue_orders" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			return "(" + tupleContent.replace(/, NULL,/, `, '${FIXED_VENUE_ID}',`) + ")";
		});
		return `insert into "hp_reserve_venue_orders" (${cols}) values ${newValString};`;
	});

	fs.writeFileSync(TARGET_FILE, content);
	console.log("Fixed 02-house-property.sql");
}

main();
