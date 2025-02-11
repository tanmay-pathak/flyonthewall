import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const title = "Meeting Notes Assistant";
const description =
  "Upload your meeting transcript and get an AI-powered summary with action items, key points, and attendees";
const url = "https://flyonthewall.vercel.app/";
const ogimage = "https://flyonthewall.vercel.app/og-image.png";
const sitename = "Fly on the Wall";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          defer
          src="https://umami.zu.ca/script.js"
          data-website-id="2265700d-b500-4d04-a41b-c3e41677e72e"
        ></script>
      </head>
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-white text-gray-800`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
