"use client";

import { BlurImage } from "@/components/ui/BlurImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { Artwork } from "@/types/domain";
import Link from "next/link";
import { motion } from "framer-motion";

interface ArtworkCardProps {
    artwork: Artwork & { priceInfo?: { price: number; isVipOnly: boolean } };
    priority?: boolean;
}

export function ArtworkCard({ artwork, priority = false }: ArtworkCardProps) {
    // Mock image for demonstration (Replace with actual Supabase static storage URLs in real app)
    const fallbackImg = `https://picsum.photos/seed/${artwork.id}/800/1200`;

    return (
        <FadeIn direction="up" delay={0.1} className="group cursor-pointer">
            <Link href={`/artwork/${artwork.id}`}>
                <div className="relative aspect-[3/4] w-full overflow-hidden mb-4 bg-stone/10">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full h-full"
                    >
                        <BlurImage
                            src={fallbackImg}
                            alt={artwork.objectTitle}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={priority}
                        />
                    </motion.div>
                    {artwork.status === "SOLD" && (
                        <div className="absolute top-4 right-4 bg-sumi/90 text-washi text-xs tracking-widest px-3 py-1 uppercase">
                            Sold
                        </div>
                    )}
                </div>

                {/* Info Area: Japandi typography spacing */}
                <div className="flex flex-col space-y-1">
                    <h3 className="font-serif text-lg text-sumi leading-tight">
                        {artwork.objectTitle}
                    </h3>
                    <p className="text-sm text-sumi/70 uppercase tracking-widest pl-1">
                        {artwork.artistMaker} &bull; {artwork.creationDate}
                    </p>

                    <div className="mt-2 pt-2 border-t border-stone/30 flex justify-between items-center text-sm font-medium">
                        <span className="text-sumi/60">{artwork.mediumMaterials}</span>
                        {artwork.priceInfo ? (
                            <span className="text-sumi tracking-wider">
                                ¥ {artwork.priceInfo.price.toLocaleString()}
                            </span>
                        ) : (
                            <span className="text-matcha-dark tracking-wider uppercase text-xs">
                                Price on Request
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </FadeIn>
    );
}
