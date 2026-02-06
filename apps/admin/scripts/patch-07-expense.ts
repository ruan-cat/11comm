import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "drizzle/seed/07-expense.sql");

function main() {
	if (!fs.existsSync(FILE)) {
		console.error("File not found:", FILE);
		process.exit(1);
	}

	let content = fs.readFileSync(FILE, "utf-8");
	console.log("Read file, size:", content.length);

	// 1. Patch ex_expense_items
	content = content.replace(/insert into "ex_expense_items" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		console.log("Patching ex_expense_items");
		const newCols = `"id", "expense_type", "item_name", "expense_code", "payment_type", "unit_price", "fixed_fee", "formula", "billing_cycle", "account_deduction", "mobile_payment", "rounding_mode", "decimal_places", "status", "remark", "created_at", "updated_at"`;
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			const parts = tupleContent.split(",").map((p) => p.trim());
			if (parts.length === 20) {
				// Keep 0-14, 18, 19
				return `(${parts.slice(0, 15).join(", ")}, ${parts.slice(18).join(", ")})`;
			}
			return tupleMatch;
		});
		return `insert into "ex_expense_items" (${newCols}) values ${newValString};`;
	});

	// 2. Patch ex_meter_reading_types
	content = content.replace(/insert into "ex_meter_reading_types" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		console.log("Patching ex_meter_reading_types");
		const newCols = `"id", "type_name", "type_code", "unit_price", "billing_method", "status", "remark", "created_at", "updated_at"`;
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			const parts = tupleContent.split(",").map((p) => p.trim());
			if (parts.length === 10) {
				// Keep 0-6, 8, 9. Remove 7 (description)
				return `(${parts.slice(0, 7).join(", ")}, ${parts.slice(8).join(", ")})`;
			}
			return tupleMatch;
		});
		return `insert into "ex_meter_reading_types" (${newCols}) values ${newValString};`;
	});

	fs.writeFileSync(FILE, content);
	console.log("Fixed 07-expense.sql");
}

main();
