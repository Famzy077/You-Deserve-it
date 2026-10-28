import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Alex_Brush } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "You Deserve Your Flowers — A Little Space For You",
  description: "A cinematic 3D appreciation experience. A flower continues to hold its beauty even when one season ends.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "You Deserve Your Flowers",
    description: "A personal appreciation experience for the heart and effort you gave.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${alexBrush.variable} h-full bg-[#170B16] text-[#FFF0E4] antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#170B16] text-[#FFF0E4] selection:bg-[#681C35] selection:text-[#FFF0E4]">
        {children}
      </body>
    </html>
  );
}
