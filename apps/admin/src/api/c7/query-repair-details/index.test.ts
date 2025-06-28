import { describe, it } from "vitest";
import { queryRepairDetails } from "./index";

describe("queryRepairDetails 接口测试", () => {
  it("基础调用", async () => {
    const { execute, data } = queryRepairDetails({
      pageIndex: 1,
      pageSize: 10,
      communityId: "2023052267100146",
    });
    const response = await execute();
    console.warn("queryRepairDetails 基础调用响应数据:", response);
  });

  it("带参数调用", async () => {
    const { execute, data } = queryRepairDetails({
      pageIndex: 1,
      pageSize: 10,
      communityId: "2023052267100146",
      start_time: "2020-05-21",
      end_time: "2025-05-21",
    });
    const response = await execute();
    console.warn("queryRepairDetails 带参数响应:", response);
  });
}); 