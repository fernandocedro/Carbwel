import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carwel Auto Peças",
  description: "E-commerce de autopeças",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
