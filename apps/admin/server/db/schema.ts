/**
 * @file Drizzle ORM Schema 统一导出入口
 * @description 导出所有模块的表定义和枚举类型
 */

// 导出公共模块（辅助函数、枚举类型）
export * from "./schemas/common";

// 导出社区管理模块 (cm_)
export * from "./schemas/community";

// 导出房产管理模块 (hp_)
export * from "./schemas/house-property";

// 导出合同管理模块 (ct_)
export * from "./schemas/contract";

// 导出费用管理模块 (ex_)
export * from "./schemas/expense";

// 导出停车管理模块 (pk_)
export * from "./schemas/parking";

// 导出巡检管理模块 (pt_)
export * from "./schemas/patrol";

// 导出报修管理模块 (rp_)
export * from "./schemas/repairs";

// 导出报表管理模块 (rpt_)
export * from "./schemas/report";

// 导出设置管理模块 (sm_)
export * from "./schemas/setting";

// 导出运营团队模块 (op_)
export * from "./schemas/operation";

// 导出开发团队模块 (dt_)
export * from "./schemas/dev";
