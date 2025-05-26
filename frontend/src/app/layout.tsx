import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/shared/styles/globals.css";
import Providers from "@/shared/utils/providers/providers";
const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Gravitino GPT",
  description: "Gravitino GPT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-dark.svg" sizes="any" />
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
