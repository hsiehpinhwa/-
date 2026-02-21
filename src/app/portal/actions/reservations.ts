"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createReservationRecord } from "@/lib/services/reservationService";

export async function createReservation(formData: FormData) {
    const artworkId = formData.get("artworkId") as string;
    // date variable removed since it is currently not used in the database insertion

    // 若無選擇則代表 "General Gallery Visit"
    const parsedArtworkId = artworkId === "general" ? null : artworkId;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Authentication required.");
    }

    // 委託經過 TDD 測試的核心服務進行業務邏輯處理
    // parsedArtworkId 若為 null 則代表非單一藏品預約，目前 Service 依賴具體的 artworkId。
    // 在這裏我們加上預防：如果為 null，則帶入空字串或拋出不支援錯誤（根據原先設計）。
    if (!parsedArtworkId) {
        throw new Error("目前暫不支援一般綜合導覽的線上直接確認，請選擇藝術品。");
    }

    const result = await createReservationRecord(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supabase as any,
        user.id,
        parsedArtworkId
    );

    if (!result.success) {
        throw new Error(result.error || "預約失敗，請聯絡畫廊。");
    }

    revalidatePath("/portal/dashboard");
    redirect("/portal/dashboard");
}
