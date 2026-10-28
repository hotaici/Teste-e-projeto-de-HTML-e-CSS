// app/layout.tsx
// O LAYOUT envolve todas as páginas. O que estiver aqui aparece em todas elas (ex.: o menu).
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import LinkMenu from "./link-menu";

export const metadata: Metadata = {
  title: "Minha Lista de Filmes",
  description: "Next.js + TypeScript + Drizzle + Neon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="menu">
          <Link href="/">🎬 Filmes</Link>
          <nav>
            <LinkMenu href="/">Início</LinkMenu>
            <LinkMenu href="/filmes">Filmes</LinkMenu>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}