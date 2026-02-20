"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function upgradeToVip(formData: FormData) {
    const inviteCode = formData.get("inviteCode");

    // Mock invite code verification: "NAG_VIP_2026"
    if (inviteCode !== "NAG_VIP_2026") {
        throw new Error("邀請碼無效 Invite code is invalid.");
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Authentication required.");
    }

    // Update Collector level to VIP
    const { error } = await supabase
        .from("collectors")
        .update({ level: "VIP" })
        .eq("auth_user_id", user.id);

    if (error) {
        throw new Error("升級失敗，請聯絡畫廊服務人員。");
    }

    revalidatePath("/portal/dashboard");
    redirect("/portal/dashboard");
}
