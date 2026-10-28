// app/page.tsx
// Página inicial (endereço "/"). É um Server Component: roda no servidor, sem interatividade.
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Mini Projeto Fullstack</h1>
      <p style={{ marginBottom: 24 }}>Next.js + TypeScript + Drizzle + Neon</p>

      <Link href="/filmes" className="cartao" style={{ display: "block" }}>
        <h2>🎬 Minha Lista de Filmes</h2>
        <p>Organizar os filmes que quero ver e os que já vi, com nota.</p>
      </Link>
    </>
  );
}