import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP, Cormorant_Garamond } from "next/font/google";

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-noto-serif",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ERABU — 分かるから、選べる",
  description: "候補者の思想・政策・財源を具体的に知った上で投票できる選挙情報プラットフォーム",
  openGraph: {
    title: "ERABU — 分かるから、選べる",
    description: "候補者の思想・政策・財源を具体的に知った上で投票できる選挙情報プラットフォーム",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${notoSans.variable} ${notoSerif.variable} ${cormorant.variable}`}
    >
      <body style={{ margin: 0, padding: 0, background: "#f5f4f0" }}>
        {children}
      </body>
    </html>
  );
}