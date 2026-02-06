import fs from "fs";
import path from "path";

const SRC_FILE = path.join(process.cwd(), "drizzle/seed/duplicates/02-setting.sql");
const DEST_FILE = path.join(process.cwd(), "drizzle/seed/01-setting.sql");

const ADMIN_ROLE_ID = "8c5739e5-2741-5349-b6c7-bb8eee180ddb";

function main() {
	console.log("CWD:", process.cwd());

	if (!fs.existsSync(SRC_FILE)) {
		console.error("Source file not found:", SRC_FILE);
		process.exit(1);
	}

	let content = fs.readFileSync(SRC_FILE, "utf-8");

	// Regexes must be lazy (.*?) to start at the first semicolon to avoid consuming subsequent statements.

	// 1. Patch sm_data_permissions
	content = content.replace(/insert into "sm_data_permissions" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		const newCols = `"id", "role_id", "permission_rule", "scope", "data_filter", "created_at", "updated_at"`;
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			const parts = tupleContent.split(",").map((p) => p.trim());
			if (parts[1] === "NULL") parts[1] = `'${ADMIN_ROLE_ID}'`;
			if (parts.length >= 13) {
				const len = parts.length;
				return `(${parts[0]}, ${parts[1]}, ${parts[2]}, ${parts[3]}, ${parts[4]}, ${parts[len - 2]}, ${parts[len - 1]})`;
			}
			return tupleMatch;
		});
		return `insert into "sm_data_permissions" (${newCols}) values ${newValString};`;
	});

	// 2. Patch sm_shifts
	content = content.replace(/insert into "sm_shifts" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		const newCols = `"id", "shift_name", "start_time", "end_time", "work_duration", "created_at", "updated_at"`;
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			const parts = tupleContent.split(",").map((p) => p.trim());
			if (parts.length >= 10) {
				const len = parts.length;
				return `(${parts[0]}, ${parts[1]}, ${parts[2]}, ${parts[3]}, ${parts[4]}, ${parts[len - 2]}, ${parts[len - 1]})`;
			}
			return tupleMatch;
		});
		return `insert into "sm_shifts" (${newCols}) values ${newValString};`;
	});

	// 3. Patch sm_scheduling_settings
	content = content.replace(/insert into "sm_scheduling_settings" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		const newCols = `"id", "scheduling_mode", "applicable_position", "rotation_cycle", "created_at", "updated_at"`;
		let newValString = vals.replace(/\(([^)]+)\)/g, (tupleMatch, tupleContent) => {
			const parts = tupleContent.split(",").map((p) => p.trim());
			// Should be 16 cols
			if (parts.length >= 16) {
				const len = parts.length;
				return `(${parts[0]}, ${parts[1]}, ${parts[2]}, ${parts[3]}, ${parts[len - 2]}, ${parts[len - 1]})`;
			}
			return tupleMatch;
		});
		return `insert into "sm_scheduling_settings" (${newCols}) values ${newValString};`;
	});

	// 4. Patch sm_system_configs
	// Hardcoded
	content = content.replace(
		/insert into "sm_system_configs".*values \('(.*?)', '(.*?)', '(.*?)', default, default, default, default, default, default, default, default, default, default, default, default, default, default, '(.*?)', '(.*?)'\);/,
		`insert into "sm_system_configs" ("id", "config_key", "config_value", "config_type", "config_description", "status", "created_at", "updated_at") values ('$1', '$2', '$3', default, default, default, '$4', '$5');`,
	);

	// 5. Patch sm_initialize_cells
	content = content.replace(/insert into "sm_initialize_cells" \((.*?)\) values (.*?);/s, (match, cols, vals) => {
		const newCols = `"id", "init_item", "init_status", "config_params", "created_at", "updated_at"`;
		// Replace 9 defaults with 2 defaults
		let newValString = vals.replace(
			/, default, default, default, default, default, default, default, default, default\)/g,
			`, default, default)`,
		);
		return `insert into "sm_initialize_cells" (${newCols}) values ${newValString};`;
	});

	fs.writeFileSync(DEST_FILE, content);
	console.log("Fixed 01-setting.sql");
}

main();
