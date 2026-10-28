// app/filmes/page.tsx
// Endereço: /filmes
"use client";

import { useEffect, useState } from "react";
import { GENEROS } from "@/db/constantes";
import styles from "./filmes.module.css";

type Filme = {
  id: number;
  titulo: string;
  genero: string;
  status: "quero_ver" | "assistido";
  nota: number | null;
  criadoEm: string;
};

type Resumo = {
  total: number;
  assistidos: number;
  queroVer: number;
  mediaNotas: number;
};

const EMOJIS: Record<string, string> = {
  Ação: "💥",
  Comédia: "😂",
  Drama: "🎭",
  Terror: "👻",
  Animação: "✨",
  Outro: "🎬",
};

const CORES: Record<string, string> = {
  Ação: "#ef4444",
  Comédia: "#f59e0b",
  Drama: "#8b5cf6",
  Terror: "#475569",
  Animação: "#06b6d4",
  Outro: "#64748b",
};

const FILTROS_STATUS = [
  { valor: "", texto: "Todos" },
  { valor: "quero_ver", texto: "Quero ver" },
  { valor: "assistido", texto: "Assistidos" },
];

export default function PaginaFilmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [resumo, setResumo] = useState<Resumo>({ total: 0, assistidos: 0, queroVer: 0, mediaNotas: 0 });
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");
  const [erros, setErros] = useState<string[]>([]);

  // Formulário
  const [titulo, setTitulo] = useState("");
  const [genero, setGenero] = useState(GENEROS[0]);

  // Qual cartão está pedindo a nota e qual estrela está com o mouse em cima
  const [avaliandoId, setAvaliandoId] = useState<number | null>(null);
  const [hover, setHover] = useState(0);

  async function carregar() {
    const params = new URLSearchParams();
    if (filtroStatus) params.set("status", filtroStatus);
    if (filtroGenero) params.set("genero", filtroGenero);
    const resposta = await fetch(`/api/filmes?${params}`);
    const dados = await resposta.json();
    setFilmes(dados.filmes);
    setResumo(dados.resumo);
  }

  useEffect(() => {
    carregar();
  }, [filtroStatus, filtroGenero]);

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    setErros([]);

    const resposta = await fetch("/api/filmes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, genero }),
    });

    if (!resposta.ok) {
      const dados = await resposta.json();
      setErros(dados.erros ?? [dados.erro ?? "Erro ao salvar"]);
      return;
    }

    setTitulo("");
    carregar();
  }

  async function marcarAssistido(id: number, nota: number) {
    await fetch(`/api/filmes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "assistido", nota }),
    });
    setAvaliandoId(null);
    setHover(0);
    carregar();
  }

  async function apagar(id: number) {
    await fetch(`/api/filmes/${id}`, { method: "DELETE" });
    carregar();
  }

  return (
    <div className={styles.pagina}>
      <header className={styles.cabecalho}>
        <h1>🎬 Minha Lista de Filmes</h1>
        <p>O que eu quero ver e o que eu já vi.</p>
      </header>

      {/* ----- Resumo ----- */}
      <section className={styles.resumo}>
        <div className={styles.stat}>
          <span className={styles.statIcone}>🎞️</span>
          <div>
            <span className={styles.statNumero}>{resumo.total}</span>
            <span className={styles.statRotulo}>Total</span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcone}>✅</span>
          <div>
            <span className={styles.statNumero}>{resumo.assistidos}</span>
            <span className={styles.statRotulo}>Assistidos</span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcone}>🍿</span>
          <div>
            <span className={styles.statNumero}>{resumo.queroVer}</span>
            <span className={styles.statRotulo}>Quero ver</span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcone}>⭐</span>
          <div>
            <span className={styles.statNumero}>{resumo.mediaNotas.toFixed(1)}</span>
            <span className={styles.statRotulo}>Média das notas</span>
          </div>
        </div>
      </section>

      {/* ----- Formulário ----- */}
      <form onSubmit={adicionar} className={styles.formulario}>
        <input
          className={`${styles.campo} ${styles.campoTitulo}`}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título do filme ou série"
          maxLength={120}
        />
        <select className={styles.campo} value={genero} onChange={(e) => setGenero(e.target.value)}>
          {GENEROS.map((g) => (
            <option key={g} value={g}>
              {EMOJIS[g]} {g}
            </option>
          ))}
        </select>
        <button type="submit" className={styles.botaoPrincipal}>
          + Adicionar
        </button>
      </form>
      {erros.map((e) => (
        <p key={e} className={styles.erro}>{e}</p>
      ))}

      {/* ----- Filtros ----- */}
      <div className={styles.filtros}>
        {FILTROS_STATUS.map((f) => (
          <button
            key={f.valor}
            onClick={() => setFiltroStatus(f.valor)}
            className={`${styles.pill} ${filtroStatus === f.valor ? styles.pillAtiva : ""}`}
          >
            {f.texto}
          </button>
        ))}
        <select
          className={styles.campo}
          value={filtroGenero}
          onChange={(e) => setFiltroGenero(e.target.value)}
        >
          <option value="">Todos os gêneros</option>
          {GENEROS.map((g) => (
            <option key={g} value={g}>
              {EMOJIS[g]} {g}
            </option>
          ))}
        </select>
      </div>

      {/* ----- Grade de filmes ----- */}
      {filmes.length === 0 && <p className={styles.vazio}>Nenhum filme por aqui ainda 🍿</p>}

      <section className={styles.grade}>
        {filmes.map((f) => (
          <article
            key={f.id}
            className={styles.filme}
            style={{ "--cor": CORES[f.genero] ?? CORES.Outro } as React.CSSProperties}
          >
            <div className={styles.topo}>
              <span className={styles.genero}>
                {EMOJIS[f.genero] ?? "🎬"} {f.genero}
              </span>
              <span className={f.status === "assistido" ? styles.badgeOk : styles.badgeEspera}>
                {f.status === "assistido" ? "Assistido" : "Quero ver"}
              </span>
            </div>

            <h3 className={styles.titulo}>{f.titulo}</h3>

            <div className={styles.acoes}>
              {f.status === "assistido" ? (
                <span className={styles.nota}>
                  {"★".repeat(f.nota ?? 0)}
                  <span className={styles.apagada}>{"★".repeat(5 - (f.nota ?? 0))}</span>
                </span>
              ) : avaliandoId === f.id ? (
                <div>
                  <p className={styles.pergunta}>Que nota você dá?</p>
                  <div className={styles.estrelas} onMouseLeave={() => setHover(0)}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-label={`${n} estrelas`}
                        className={n <= hover ? styles.estrelaOn : styles.estrela}
                        onMouseEnter={() => setHover(n)}
                        onClick={() => marcarAssistido(f.id, n)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <button className={styles.link} onClick={() => setAvaliandoId(null)}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <button className={styles.botaoAssistir} onClick={() => setAvaliandoId(f.id)}>
                  Marquei como assistido
                </button>
              )}

              <button className={styles.apagar} onClick={() => apagar(f.id)}>
                🗑️ Apagar
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}