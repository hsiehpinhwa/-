import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FadeIn } from "@/components/ui/FadeIn";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 取得 Collector Profile
    const { data: profile } = await supabase
        .from("collectors")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

    // 取得預約紀錄
    const { data: reservations } = await supabase
        .from("reservations")
        .select("*, artworks(object_title)")
        .eq("collector_id", profile?.id)
        .order("created_at", { ascending: false });

    return (
        <main className="min-h-screen pt-32 pb-32 px-6 md:px-12 lg:px-24">
            <FadeIn direction="up">
                <div className="flex flex-col md:flex-row justify-between items-start mb-12 border-b border-stone/20 pb-8">
                    <div>
                        <h1 className="font-serif text-4xl mb-2 text-sumi">
                            歡迎回來，{profile?.name || user.email}
                        </h1>
                        <p className="text-stone-500 uppercase tracking-widest text-sm">
                            Member Status: {profile?.level || "GENERAL"}
                        </p>
                    </div>

                    {profile?.level === "GENERAL" && (
                        <Link
                            href="/portal/vip-upgrade"
                            className="mt-6 md:mt-0 px-6 py-2 border border-sumi text-sm hover:bg-sumi hover:text-washi transition-colors"
                        >
                            升級 VIP 藏家
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Reservations Section */}
                    <section className="lg:col-span-2 bg-sumi/5 border border-stone/20 p-8">
                        <div className="flex justify-between items-center mb-8 border-b border-stone/20 pb-4">
                            <h2 className="font-serif text-2xl">私人鑑賞預約</h2>
                            <Link href="/portal/reservations/new" className="text-sm underline underline-offset-4 hover:text-sumi/70">
                                安排新鑑賞
                            </Link>
                        </div>

                        {reservations && reservations.length > 0 ? (
                            <ul className="space-y-4">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {reservations.map((res: any) => (
                                    <li key={res.id} className="flex justify-between items-center py-4 border-b border-stone/10 last:border-0 hover:bg-black/5 px-2 transition-colors">
                                        <div>
                                            <p className="font-serif">{res.artworks?.object_title || "專場鑑賞"}</p>
                                            <p className="text-xs text-sumi/60 mt-1 uppercase tracking-widest">
                                                {new Date(res.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 uppercase tracking-widest ${res.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                                            res.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                'bg-stone-200 text-stone-600'
                                            }`}>
                                            {res.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="py-12 text-center text-sumi/60">
                                <p>您目前尚未有任何鑑賞預約。</p>
                            </div>
                        )}
                    </section>

                    {/* VIP Area */}
                    <section className="lg:col-span-1">
                        {profile?.level === "VIP" ? (
                            <div className="p-8 border border-green-900/20 bg-[#f4f7f4]">
                                <h3 className="font-serif text-xl mb-4 text-[#2a382a]">VIP 專屬藏品推薦</h3>
                                <p className="text-sm text-[#2a382a]/70 mb-6 leading-relaxed">
                                    我們正在為您準備本季最新的私人藏品。敬請期待。
                                </p>
                            </div>
                        ) : (
                            <div className="p-8 border border-stone/20 bg-stone/5">
                                <h3 className="font-serif text-xl mb-4">解鎖更多體驗</h3>
                                <p className="text-sm text-sumi/70 mb-6 leading-relaxed">
                                    升級 VIP 藏家將可查看專屬報價、特殊藝術品以及優先的預約特權。
                                </p>
                            </div>
                        )}
                    </section>
                </div>

                <form action="/auth/signout" method="post" className="mt-24">
                    <button className="text-xs uppercase tracking-widest text-sumi/50 hover:text-sumi transition-colors">
                        登出 Logout
                    </button>
                </form>
            </FadeIn>
        </main>
    );
}
