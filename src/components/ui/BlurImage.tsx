"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * BlurImage 封裝了 Next.js Image，預設提供：
 * 1. 未載入前會有脈衝光 (animate-pulse) 與灰階模糊效果
 * 2. 載入完成後優雅淡入 (Fade-in)
 * 3. 預設 quality = 90 以符合畫廊的影像質感需求
 */
export function BlurImage({
    src,
    alt,
    className,
    quality = 90,
    ...props
}: ImageProps) {
    const [isLoading, setLoading] = useState(true);

    return (
        <div className={cn("overflow-hidden relative bg-stone/20", className)}>
            <Image
                src={src}
                alt={alt}
                quality={quality}
                className={cn(
                    "duration-700 ease-in-out object-cover",
                    isLoading
                        ? "grayscale blur-xl scale-110"
                        : "grayscale-0 blur-0 scale-100"
                )}
                onLoad={() => setLoading(false)}
                {...props}
            />
        </div>
    );
}
