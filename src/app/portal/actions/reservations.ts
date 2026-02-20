"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createReservation(formData: FormData) {
    const artworkId = formData.get("artworkId") as string;
    const date = formData.get("date") as string; // Optional: can store in DB later

    // 若無選擇則代表 "General Gallery Visit"
    const parsedArtworkId = artworkId === "general" ? null : artworkId;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Authentication required.");
    }

    const { data: profile } = await supabase
        .from("collectors")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

    if (!profile) {
        throw new Error("Collector profile not found.");
    }

    const { error } = await supabase
        .from("reservations")
        .insert({
            collector_id: profile.id,
            artwork_id: parsedArtworkId,
            status: "PENDING"
        });

    if (error) {
        throw new Error("預約失敗，請聯絡畫廊。");
    }

    revalidatePath("/portal/dashboard");
    redirect("/portal/dashboard");
}
