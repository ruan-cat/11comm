import { faker } from "@faker-js/faker/locale/zh_CN";

/** 巡检项目列表数据 */
export interface 巡检项目_列表数据 {
	编号: string;
	巡检项目: string;
	创建时间: string;
	备注: string;
}

/** 巡检项目表单数据 */
export interface 巡检项目表单_VO {
	编号: string;
	巡检项目: string;
	创建时间: string;
	备注: string;
}

/** 巡检项目列表查询 VO */
export interface 巡检项目_列表查询_VO {
	项目编号?: string;
	巡检项目?: string;
}

/** 生成单条巡检项目数据 */
function generatePatrolItem(): 巡检项目_列表数据 {
	return {
		编号: `ITM${faker.string.alphanumeric({ length: 6, casing: "upper" })}`,
		巡检项目: faker.helpers.arrayElement([
			"消防设施检查",
			"电梯安全检查",
			"绿化环境检查",
			"停车场检查",
			"公共照明检查",
			"安防设备检查",
			"供水系统检查",
			"排水系统检查",
			"公共区域清洁",
			"垃圾处理检查",
		]),
		创建时间: faker.date.past({ years: 2 }).toISOString().split("T")[0],
		备注: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }) || "",
	};
}

/** 表格数据 */
export const tableData: 巡检项目_列表数据[] = Array(35)
	.fill(null)
	.map(() => generatePatrolItem());