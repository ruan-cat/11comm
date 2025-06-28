import { describe, it, expect, vi } from "vitest";
import { queryFloor, type FloorDTO } from "./index";
import { useRequest } from "@/composables/use-request";

vi.mock("@/composables/use-request", () => ({
  useRequest: vi.fn(),
}));

describe("queryFloor", () => {
  it("should return floor list data", () => {
    const mockData: FloorDTO[] = [
      { floorId: "1", floorNum: "A1" },
      { floorId: "2", floorNum: "A2" },
    ];
    // mock useRequest 返回值
    (useRequest as any).mockImplementation(() => ({
      data: { value: mockData },
    }));

    const result = queryFloor();
    expect(result.data.value).toEqual(mockData);
    // 断言 useRequest 被正确调用
    expect(useRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/c7-repomanage/query-condition/floor",
        httpParamWay: "query",
        config: expect.objectContaining({ method: "GET" }),
      })
    );
  });
}); 