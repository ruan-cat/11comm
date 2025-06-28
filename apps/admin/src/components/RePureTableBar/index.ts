import pureTableBar from "./src/bar";
import { withInstall } from "@pureadmin/utils";

export type { PureTableBarProps } from "./src/bar";

/** 配合 `@pureadmin/table` 实现快速便捷的表格操作 https://github.com/pure-admin/pure-admin-table */
export const PureTableBar = withInstall(pureTableBar);
