import type { Metadata } from "next";
import { headers } from 'next/headers'
import { GoogleTagManager } from '@next/third-parties/google'
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BioEnneagram Coach | Coaching Personal",
  description: "Descubre tu potencial con BioEnneagramCoach, usando Biodescodificación y Eneagrama",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const nonce = (await headers()).get('x-nonce')!

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      <GoogleTagManager gtmId="GTM-KGBLNSF" nonce={nonce} />
    </html>
  );
}
