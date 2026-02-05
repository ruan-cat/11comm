import { dtDictionaries } from "../schemas/dev";

import { mockDictionaryTypeData } from "../../api/dev-team/config-manage/type/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, statusMap, generateUuid } from "./index";
import { db } from "../index";

/**
 * 生成开发配置模块的 SQL
 */
export function generateDevSql(idMap: IdMapRegistry): SqlStatement[] {
	const statements: SqlStatement[] = [];

	// ==========================================
	// 1. 生成 dt_dictionaries (字典类型)
	// ==========================================
	console.log("正在生成 dt_dictionaries SQL...");
	const dictionaryRecords = mockDictionaryTypeData.map((item) => {
		const id = idMap.register("dt_dictionaries", item.dictionaryNumber);
		return {
			id,
			dictionaryCode: item.dictionaryNumber,
			dictionaryName: item.dictionaryName,
			dictionaryType: item.dictionaryType,
			status: statusMap[item.status] || "enabled",
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (dictionaryRecords.length > 0) {
		const query = db.insert(dtDictionaries).values(dictionaryRecords).toSQL();
		statements.push({
			table: "dt_dictionaries",
			sql: toFullSql(query.sql, query.params),
			recordCount: dictionaryRecords.length,
		});
	}

	// Note: Skipping config types and menu groups for now
	// as they require more complex data mapping

	return statements;
}
