import { describe, it, expect, vi } from "vitest";
import { queryUnit, type UnitDTO } from "./index";
import { useRequest } from "@/composables/use-request";

vi.mock("@/composables/use-request", () => ({
  useRequest: vi.fn(),
}));

describe("queryUnit", () => {
  it("should return unit list data", () => {
    const mockData: UnitDTO[] = [
      { unitId: "1", unitNum: "U1" },
      { unitId: "2", unitNum: "U2" },
    ];
    // mock useRequest 返回值
    (useRequest as any).mockImplementation(() => ({
      data: { value: mockData },
    }));

    const result = queryUnit();
    expect(result.data.value).toEqual(mockData);
    // 断言 useRequest 被正确调用
    expect(useRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/c7-repomanage/query-condition/unit",
        httpParamWay: "query",
        config: expect.objectContaining({ method: "GET" }),
      })
    );
  });
}); 