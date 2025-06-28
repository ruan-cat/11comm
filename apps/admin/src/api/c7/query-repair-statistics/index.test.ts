import { describe, it } from "vitest";
import { queryRepairStatistics } from "./index";

describe("queryRepairStatistics 接口测试", () => {
  it("基础调用", async () => {
    const { execute, data } = queryRepairStatistics({
      community_id: "1",
    });
    const response = await execute();
    console.warn("queryRepairStatistics 基础调用响应数据:", response);
  });

  it("带参数调用", async () => {
    const { execute, data } = queryRepairStatistics({
      community_id: "1",
      start_time: "2000-01-01",
      end_time: "2099-12-31",
    });
    const response = await execute();
    console.warn("queryRepairStatistics 带参数响应:", response);
  });
}); 