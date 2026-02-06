import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "drizzle/seed/05-contract.sql");

function main() {
	if (!fs.existsSync(FILE)) {
		console.error("File not found:", FILE);
		process.exit(1);
	}

	let content = fs.readFileSync(FILE, "utf-8");
	console.log("Read file, size:", content.length);

	// 1. Patch ct_changes
	content = content.replace(/insert into "ct_changes" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		console.log("Patching ct_changes");
		const newCols = `"id", "contract_id", "change_type", "change_reason", "change_content", "change_date", "approval_status", "approver", "approval_time", "remark", "created_at", "updated_at"`;
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			const parts = tupleContent.split(",").map((p) => p.trim());
			if (parts.length === 21) {
				// Keep 0-9, 19, 20
				return `(${parts.slice(0, 10).join(", ")}, ${parts.slice(19).join(", ")})`;
			}
			return tupleMatch;
		});
		return `insert into "ct_changes" (${newCols}) values ${newValString};`;
	});

	fs.writeFileSync(FILE, content);
	console.log("Fixed 05-contract.sql");
}

main();
