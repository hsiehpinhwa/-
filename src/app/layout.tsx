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
    title: "日本藝術館 | Nippon Art Gallery",
    description: "The intersection of contemporary art & traditional craft.",
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
