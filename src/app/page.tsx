import { ArtworkCard } from "@/components/gallery/ArtworkCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { Artwork } from "@/types/domain";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
    const supabase = await createClient();

    // 從資料庫抓取藝術品與關聯的價格表
    const { data: artworksData } = await supabase
        .from("artworks")
        .select(`
            id,
            accession_number,
            object_title,
            artist_maker,
            creation_date,
            medium_materials,
            dim_h, dim_w, dim_d,
            status,
            created_at,
            updated_at,
            artwork_prices ( price, is_vip_only )
        `)
        .order("created_at", { ascending: true }); // Mock seed data is ordered by creation implicitly

    // 格式化為前端元件需要的型別
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalArtworks = (artworksData || []).map((art: any) => ({
        id: art.id,
        accessionNumber: art.accession_number,
        objectTitle: art.object_title,
        artistMaker: art.artist_maker,
        creationDate: art.creation_date,
        mediumMaterials: art.medium_materials,
        dimensions: { h: art.dim_h, w: art.dim_w, d: art.dim_d },
        status: art.status,
        createdAt: new Date(art.created_at),
        updatedAt: new Date(art.updated_at),
        priceInfo: art.artwork_prices?.[0] ? {
            price: art.artwork_prices[0].price,
            isVipOnly: art.artwork_prices[0].is_vip_only
        } : undefined
    }));

    return (
        <main className="min-h-screen pt-12 pb-32 px-6 md:px-12 lg:px-24">
            {/* Header / Nav */}
            <header className="flex justify-between items-center mb-24">
                <div className="font-serif text-xl tracking-widest text-sumi">NAG.</div>
                <Link
                    href="/portal/dashboard"
                    className="text-xs uppercase tracking-widest text-sumi/70 hover:text-sumi transition-colors"
                >
                    會員中心 Portal
                </Link>
            </header>

            {/* Hero Section */}
            <section className="mb-32 max-w-4xl">
                <FadeIn direction="up">
                    <p className="font-sans text-stone uppercase tracking-[0.2em] mb-4 text-sm mix-blend-difference">
                        Current Exhibition
                    </p>
                    <h1 className="font-serif text-5xl md:text-7xl !leading-tight tracking-tight text-sumi mb-8">
                        The intersection of contemporary art & traditional craft.
                    </h1>
                    <p className="text-sumi/60 max-w-xl text-lg leading-relaxed">
                        致力於推廣頂級日本當代藝術，結合極簡美學與深層的文化底蘊。
                    </p>
                </FadeIn>
            </section>

            {/* Gallery Grid */}
            <section>
                <div className="flex items-end justify-between border-b border-stone pb-4 mb-12">
                    <h2 className="font-serif text-2xl text-sumi">Featured Artworks</h2>
                    <span className="text-sm text-stone tracking-widest uppercase">
                        Collection &mdash; 03
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {finalArtworks.map((artwork: any, idx: number) => (
                        <ArtworkCard
                            key={artwork.id}
                            artwork={artwork}
                            priority={idx === 0} // First image loads critically
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
