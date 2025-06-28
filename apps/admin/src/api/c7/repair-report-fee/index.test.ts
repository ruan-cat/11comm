import { describe, it } from "vitest";
import { queryAnalysisArrearsBasic } from "./index";

describe("queryAnalysisArrearsBasic 接口测试", () => {
  it("基础调用", async () => {
    const { execute, data } = queryAnalysisArrearsBasic({
      pageIndex: 1,
      pageSize: 10,
      communityId: "2024022643710121",
    });
    const response = await execute();
    console.warn("queryAnalysisArrearsBasic 基础调用响应数据:", response);
  });

  it("带参数调用", async () => {
    const { execute, data } = queryAnalysisArrearsBasic({
      pageIndex: 1,
      pageSize: 10,
      communityId: "2024022643710121",
      feeType: "8001",
      buildingNum: "1",
    });
    const response = await execute();
    console.warn("queryAnalysisArrearsBasic 带参数响应:", response);
  });
}); 