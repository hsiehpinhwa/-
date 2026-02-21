import { createReservationRecord } from "@/lib/services/reservationService";

// 分別 mock 每一個 endpoint 讓他們能夠獨立被 assert
const mockUpdateEq = jest.fn();
const mockUpdate = jest.fn().mockReturnValue({ eq: mockUpdateEq });

const mockInsert = jest.fn();
const mockSingle = jest.fn();
const mockEq = jest.fn().mockReturnValue({
    single: mockSingle
});
const mockSelect = jest.fn().mockReturnValue({
    eq: mockEq
});

const mockFrom = jest.fn().mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate
});

const mockSupabase = {
    from: mockFrom
};

describe("VIP 限量品鑑賞預約與鎖定邏輯", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("[Scenario 1] VIP 成功預約限量品鑑賞，鎖定 48 小時", async () => {
        mockSingle
            .mockResolvedValueOnce({
                data: { id: "collector-uuid", level: "VIP" },
                error: null
            }) // collector query
            .mockResolvedValueOnce({
                data: { id: "artwork-uuid", status: "AVAILABLE", is_vip_only: true },
                error: null
            }); // artwork query

        mockInsert.mockResolvedValueOnce({
            data: { id: "new-reservation-id" },
            error: null
        }); // reservation query

        mockUpdateEq.mockResolvedValueOnce({ error: null }); // artwork lock update

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await createReservationRecord(mockSupabase as any, "user-uuid-123", "artwork-uuid");

        expect(mockInsert).toHaveBeenCalledWith(
            expect.objectContaining({
                collector_id: "collector-uuid",
                artwork_id: "artwork-uuid",
                status: "CONFIRMED"
            })
        );

        const expectedLockTime = new Date();
        expectedLockTime.setHours(expectedLockTime.getHours() + 48);

        expect(mockUpdate).toHaveBeenCalledWith(
            expect.objectContaining({
                status: "RESERVED"
            })
        );

        expect(mockUpdateEq).toHaveBeenCalledWith("id", "artwork-uuid");

        const updateCallArgs = mockUpdate.mock.calls[0][0];
        expect(updateCallArgs.status).toBe("RESERVED");
        expect(Math.abs(new Date(updateCallArgs.reserved_until).getTime() - expectedLockTime.getTime())).toBeLessThan(1000);

        expect(result.success).toBe(true);
    });

    test("[Scenario 2] 一般會員嘗試預約 VIP 專屬限量品被拒絕", async () => {
        mockSingle
            .mockResolvedValueOnce({
                data: { id: "collector-taro", level: "GENERAL" },
                error: null
            }) // collector query
            .mockResolvedValueOnce({
                data: { id: "artwork-uuid", status: "AVAILABLE", is_vip_only: true },
                error: null
            }); // artwork query

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await createReservationRecord(mockSupabase as any, "user-uuid-Taro", "artwork-uuid");

        expect(result.success).toBe(false);
        expect(result.error).toBe("此為 VIP 專屬藏品");

        expect(mockInsert).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
    });
});
