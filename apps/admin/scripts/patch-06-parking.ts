import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "drizzle/seed/06-parking.sql");
const OWNER_ID = "32f4cbc2-ada7-53eb-8169-34eb23681024";

function main() {
	if (!fs.existsSync(FILE)) {
		console.error("File not found:", FILE);
		process.exit(1);
	}

	let content = fs.readFileSync(FILE, "utf-8");
	console.log("Read file, size:", content.length);

	// 1. Remove pk_parking_structures insert
	// Regex: insert into "pk_parking_structures" .*?;
	content = content.replace(/insert into "pk_parking_structures" .*?;/s, "");
	console.log("Removed pk_parking_structures");

	// 2. Patch pk_owner_vehicles
	// Fix owner_id (index 1)
	content = content.replace(/insert into "pk_owner_vehicles" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		console.log("Patching pk_owner_vehicles");
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			const parts = tupleContent.split(",").map((p) => p.trim());
			// Fix owner_id at index 1
			if (parts[1] === "NULL") {
				parts[1] = `'${OWNER_ID}'`;
			}
			return `(${parts.join(", ")})`;
		});
		return `insert into "pk_owner_vehicles" (${cols}) values ${newValString};`;
	});

	fs.writeFileSync(FILE, content);
	console.log("Fixed 06-parking.sql");
}

main();
