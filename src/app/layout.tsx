import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "../app/styles/globals.css";

export const metadata: Metadata = {
  title: "Portfolio Max",
  description: "Portfolio site of Max Stokla",
  icons: {
    icon: '/Fish.png',
    apple: '/Fish.png',
  }
};

const roboto = Roboto_Mono({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  );
}
