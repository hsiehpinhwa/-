// 此為滿足 TDD 單元測試建立的核心商業邏輯
// 它與前端解藕，只負責依賴傳入的 Supabase Client 執行純粹的資料庫操作與規則判定
// 這裡為了讓後端 Supabase Schema 與 Jest Proxy Mock 能彈性混用，忽略型別檢查
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createReservationRecord(supabaseClient: any, authUserId: string, artworkId: string) {
    // 1. 取得收藏家身分與等級
    const { data: profile } = await supabaseClient
        .from("collectors")
        .select("*")
        .eq("auth_user_id", authUserId)
        .single();

    if (!profile) return { success: false, error: "無效的藏家資料" };

    // 2. 取得藝術品狀態與設定
    const { data: artwork } = await supabaseClient
        .from("artworks")
        .select("*")
        .eq("id", artworkId)
        .single();

    if (!artwork || artwork.status !== "AVAILABLE") {
        return { success: false, error: "藝術品目前無法預約" };
    }

    // 核心邏輯：一般會員不可預約 VIP 專屬品
    if (artwork.is_vip_only && profile.level !== "VIP") {
        return { success: false, error: "此為 VIP 專屬藏品" };
    }

    // 3. 建立預約紀錄
    const resStatus = profile.level === "VIP" ? "CONFIRMED" : "PENDING";

    // 若為 VIP，觸發 48 小時鎖定規則
    if (profile.level === "VIP") {
        const reservedUntil = new Date();
        reservedUntil.setHours(reservedUntil.getHours() + 48);

        await supabaseClient
            .from("artworks")
            .update({
                status: "RESERVED",
                reserved_until: reservedUntil.toISOString()
            })
            .eq("id", artworkId);
    }

    const { error: insertError } = await supabaseClient
        .from("reservations")
        .insert({
            collector_id: profile.id,
            artwork_id: artworkId,
            status: resStatus
        });

    if (insertError) {
        return { success: false, error: "建立預約失敗" };
    }

    return { success: true };
}
