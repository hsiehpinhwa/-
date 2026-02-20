import { createClient } from "@/lib/supabase/server";
import { upgradeToVip } from "../actions/vip";
import { FadeIn } from "@/components/ui/FadeIn";
import Link from "next/link";

export default async function VipUpgradePage() {
    return (
        <main className="min-h-screen pt-32 pb-32 px-6 md:px-12 lg:px-24">
            <FadeIn direction="up">
                <Link href="/portal/dashboard" className="text-xs uppercase tracking-widest text-sumi/60 hover:text-sumi mb-12 block">
                    &larr; 返回 Dashboard
                </Link>

                <div className="max-w-xl">
                    <h1 className="font-serif text-4xl mb-6 text-sumi">
                        VIP 藏家升級
                    </h1>
                    <p className="text-sumi/70 leading-relaxed mb-12">
                        升級成為 NAG 專屬 VIP 藏家，解鎖隱藏報價、線上私人展示廳以及優先線下鑑賞預約特權。<br /><br />
                        請輸入由畫廊顧問提供的專屬邀請碼 (提示測試碼：NAG_VIP_2026)。
                    </p>

                    <form action={upgradeToVip} className="space-y-6 bg-sumi/5 border border-stone/20 p-8">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-sumi/60 mb-2">
                                專屬邀請碼 Invitation Code
                            </label>
                            <input
                                type="text"
                                name="inviteCode"
                                required
                                className="w-full bg-transparent border-b border-stone/50 py-3 text-lg focus:outline-none focus:border-sumi transition-colors"
                                placeholder="Enter code here..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-sumi text-washi py-4 hover:bg-sumi/90 transition-colors"
                        >
                            確認升級 Upgrade
                        </button>
                    </form>
                </div>
            </FadeIn>
        </main>
    );
}
