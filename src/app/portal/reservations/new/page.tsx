import { createClient } from "@/lib/supabase/server";
import { createReservation } from "../../actions/reservations";
import { FadeIn } from "@/components/ui/FadeIn";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewReservationPage() {
    const supabase = await createClient();

    // Validate auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Fetch available artworks
    const { data: artworks } = await supabase
        .from("artworks")
        .select("id, object_title, status")
        .in("status", ["AVAILABLE", "RESERVED"]); // Can reserve even if reserved just to be on waiting list, or purely available

    return (
        <main className="min-h-screen pt-32 pb-32 px-6 md:px-12 lg:px-24">
            <FadeIn direction="up">
                <Link href="/portal/dashboard" className="text-xs uppercase tracking-widest text-sumi/60 hover:text-sumi mb-12 block">
                    &larr; 返回 Dashboard
                </Link>

                <div className="max-w-xl">
                    <h1 className="font-serif text-4xl mb-6 text-sumi">
                        私人鑑賞預約
                    </h1>
                    <p className="text-sumi/70 leading-relaxed mb-12">
                        歡迎您安排專屬時段來訪 NAG 畫廊。請選擇您感興趣的藝術品，我們的藝術顧問將會為您準備。
                    </p>

                    <form action={createReservation} className="space-y-8 bg-sumi/5 border border-stone/20 p-8">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-sumi/60 mb-4">
                                預約標的 Artwork of Interest
                            </label>
                            <select
                                name="artworkId"
                                className="w-full bg-transparent border-b border-stone/50 py-3 text-lg focus:outline-none focus:border-sumi transition-colors"
                            >
                                <option value="general">綜合導覽 General Gallery Visit</option>
                                {artworks?.map(art => (
                                    <option key={art.id} value={art.id}>
                                        {art.object_title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-sumi/60 mb-4">
                                日期與時段 Preferred Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                required
                                className="w-full bg-transparent border-b border-stone/50 py-3 text-lg focus:outline-none focus:border-sumi transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-sumi text-washi py-4 hover:bg-sumi/90 transition-colors"
                        >
                            提出預約 Request Reservation
                        </button>
                    </form>
                </div>
            </FadeIn>
        </main>
    );
}
