import { describe, it, expect, vi } from "vitest";
import { queryRoom, type RoomDTO } from "./index";
import { useRequest } from "@/composables/use-request";

vi.mock("@/composables/use-request", () => ({
  useRequest: vi.fn(),
}));

describe("queryRoom", () => {
  it("should return room list data", () => {
    const mockData: RoomDTO[] = [
      { roomId: "1", roomNum: "101" },
      { roomId: "2", roomNum: "102" },
    ];
    // mock useRequest 返回值
    (useRequest as any).mockImplementation(() => ({
      data: { value: mockData },
    }));

    const result = queryRoom();
    expect(result.data.value).toEqual(mockData);
    // 断言 useRequest 被正确调用
    expect(useRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/c7-repomanage/query-condition/room",
        httpParamWay: "query",
        config: expect.objectContaining({ method: "GET" }),
      })
    );
  });
}); 