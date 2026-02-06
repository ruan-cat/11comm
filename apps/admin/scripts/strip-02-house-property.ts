import fs from "fs";
import path from "path";

const FILE_02 = path.join(process.cwd(), "drizzle/seed/02-house-property.sql");

function main() {
	if (!fs.existsSync(FILE_02)) {
		console.error("File not found:", FILE_02);
		process.exit(1);
	}

	let content = fs.readFileSync(FILE_02, "utf-8");

	// Keep only: hp_reserve_venues, hp_site_managements, hp_reserve_venue_orders
	// And the BEGIN/COMMIT logic implies we should keep wrapper or not?
	// Our runner splits statements.
	// We can just keep the INSERT statements for these tables.

	// Extract specific tables.
	const tables = ["hp_reserve_venues", "hp_site_managements", "hp_reserve_venue_orders"];
	let newContent = "-- 02-house-property (Venues & Sites Only)\n\n";

	// Logic to extract: find insert statements starting with these table names
	// Regex: /insert into "table_name" .*?;/s
	// We need to iterate tables.

	tables.forEach((table) => {
		const regex = new RegExp(`insert into "${table}" .*?;`, "s");
		const match = content.match(regex);
		if (match) {
			newContent += match[0] + "\n\n";
		} else {
			console.warn(`Table ${table} not found in 02!`);
		}
	});

	fs.writeFileSync(FILE_02, newContent);
	console.log("Stripped 02-house-property.sql");
}

main();
