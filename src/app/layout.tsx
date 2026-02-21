import type { Metadata } from "next";
import { Inter, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
});

const notoSerifJp = Noto_Serif_JP({
    variable: "--font-serif",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    title: {
        default: "日本藝術館 | Nippon Art Gallery",
        template: "%s | 日本藝術館",
    },
    description: "The intersection of contemporary art & traditional craft, featuring exclusive ukiyo-e and modern Japanese art collections.",
    openGraph: {
        title: "日本藝術館 | Nippon Art Gallery",
        description: "The intersection of contemporary art & traditional craft.",
        url: "https://japanese-gallery.com",
        siteName: "Nippon Art Gallery",
        locale: "zh_TW",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "日本藝術館 | Nippon Art Gallery",
        description: "The intersection of contemporary art & traditional craft.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-TW" className={`${inter.variable} ${notoSerifJp.variable}`}>
            <body className="antialiased bg-washi text-sumi">
                {children}
            </body>
        </html>
    );
}
