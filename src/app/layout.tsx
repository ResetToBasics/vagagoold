import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: "VagaGoold",
    template: "%s | VagaGoold",
  },
  description: "Portal de agendamentos",
  manifest: "/manifest.webmanifest",
  themeColor: "#201b21",
  appleWebApp: {
    capable: true,
    title: "VagaGoold",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body className="app-body">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
